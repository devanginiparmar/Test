<!-- eslint-disable vue/multi-word-component-names -->
<script setup>
import { VueFlow, useVueFlow, Position, Panel, PanelPosition, getConnectedEdges } from '@vue-flow/core';
import { markRaw, nextTick, watch, reactive } from 'vue';
import Sidebar from './common/SideBar.vue';
import { Controls } from '@vue-flow/controls';
import { Background, BackgroundVariant } from '@vue-flow/background';
import { NodeToolbar } from '@vue-flow/node-toolbar';
import ConfigPanel from './common/ConfigPanel.vue';
import FieldConfigPanel from './common/FieldConfigPanel.vue';
import ContextMenu from './common/ContextMenu.vue';
import WorkflowComponent from './common/WorkflowComponent.vue';
import { useWorkflowStore } from '@/stores/workflow.js';
import { v4 as uuid } from 'uuid';
import eventBus from './eventbus';
import { cloneDeep } from 'lodash';
const nodeTypes = {
  dataset: markRaw(WorkflowComponent),
  custominput: markRaw(WorkflowComponent)
};

const {
  findNode,
  findEdge,
  onConnect,
  addEdges,
  addNodes,
  project,
  vueFlowRef,
  removeNodes,
  edges,
  onNodesChange,
  onEdgesChange
} = useVueFlow({
  nodes: [],
  nodeTypes,
  zoomOnScroll: false,
  deleteKeyCode: null,
  selectionKeyCode: null,
  multiSelectionKeyCode: null,
  id: 'zval-flow'
});
const workflowStore = useWorkflowStore();

/* Drag and drop */
const onDragOver = (event) => {
  event.preventDefault();

  if (event.dataTransfer) {
    event.dataTransfer.dropEffect = 'move';
  }
};
const onDrop = (event) => {
  const type = event.dataTransfer?.getData('application/vueflow');

  const { left, top } = vueFlowRef.value.getBoundingClientRect();

  const position = project({
    x: event.clientX - left,
    y: event.clientY - top
  });

  const newNode = {
    id: uuid(),
    type,
    position,
    label: `${type} node`
  };

  addNodes([newNode]);
  workflowStore.initConfig(newNode.id);

  // align node position after drop, so it's centered to the mouse
  nextTick(() => {
    const node = findNode(newNode.id);
    const stop = watch(
      () => node.dimensions,
      (dimensions) => {
        if (dimensions.width > 0 && dimensions.height > 0) {
          node.position = {
            x: node.position.x - node.dimensions.width / 2,
            y: node.position.y - node.dimensions.height / 2
          };
          workflowStore.logToUndoStack({
            type: 'nodeAdded',
            node: cloneDeep(node)
          });
          stop();
        }
      },
      { deep: true, flush: 'post' }
    );
  });
};
/* Drag and drop ends */

/* vue flow hooks */
// Initialise event bus
const callbackTracker = {};
const eventSubscriber = (sourceId, targetId) => {
  const callback = (event) => {
    if (event.type === 'update') {
      workflowStore.copySourceConfig(sourceId, targetId);
    } else if (event.type === 'remove') {
      workflowStore.removeSourceConfig(sourceId, targetId);
    }
    eventBus.emit(`event_${targetId}`, { type: 'update' });
    workflowStore.validateNodeConfig(targetId);
  };
  if (!callbackTracker[sourceId]) {
    callbackTracker[sourceId] = {};
  }
  callbackTracker[sourceId][targetId] = callback;
  eventBus.on(`event_${sourceId}`, callback);
};
edges.value.forEach((edge) => {
  eventSubscriber(edge.sourceNode.id, edge.targetNode.id);
});
// Dont put any stack entry inside onNodesChange/onEdgesChange as it will pollute call stack
onNodesChange((changes) => {
  changes.forEach((change) => {
    if (change.type === 'position' && !change.dragging) {
      const node = findNode(change.id);
      const oldPosition = change.from;
      const newPosition = node.position;
      workflowStore.logToUndoStack({
        type: 'nodeMoved',
        nodeId: change.id,
        oldPosition: cloneDeep(oldPosition),
        newPosition: cloneDeep(newPosition)
      });
    }
    if (change.type === 'remove') {
      workflowStore.removeConfig(change.id);
    }
  });
});
onEdgesChange((changes) => {
  changes.forEach((change) => {
    if (change.type === 'add') {
      const edge = change.item;
      eventSubscriber(edge.sourceNode.id, edge.targetNode.id);
      workflowStore.copySourceConfig(edge.sourceNode.id, edge.targetNode.id);
      workflowStore.nodeConfigMap[edge.targetNode.id].connections.add(edge.sourceNode.id);
    }
    if (change.type === 'remove') {
      const edge = findEdge(change.id);
      const sourceId = edge.sourceNode.id;
      const targetId = edge.targetNode.id;
      if (callbackTracker[sourceId]?.[targetId]) {
        // when component is removed and then its edge is removed
        eventBus.off(`edge_${sourceId}`, callbackTracker[sourceId][targetId]);
        delete callbackTracker[sourceId][targetId];
      }
      workflowStore.nodeConfigMap[edge.targetNode.id].connections.delete(edge.sourceNode.id);
    }
    //console.log(eventBus);
  });
});
onConnect((params) => {
  // edgeRemoved remaining
  addEdges([params]);
  const edge = edges.value.find((edge) => edge.sourceNode.id === params.source && edge.targetNode.id === params.target);
  workflowStore.logToUndoStack({
    type: 'edgeAdded',
    edge: cloneDeep(edge)
  });
});
/* vue flow hooks end */

/* context menu display */
const contextMenu = reactive({
  show: false,
  node: null
});
const openContextMenu = (event) => {
  event.event.preventDefault();
  contextMenu.node = event.node;
  contextMenu.show = true;
};
const closeContextMenu = () => {
  contextMenu.node = null;
  contextMenu.show = false;
};
/* context menu display ends */

// Node delete action
const deleteComponent = () => {
  const node = contextMenu.node;
  eventBus.emit(`event_${node.id}`, { type: 'remove' });
  eventBus.off(`event_${node.id}`);
  delete callbackTracker[node.id];
  const connectedEdges = getConnectedEdges([node], edges.value);
  connectedEdges.forEach((edge) => {
    workflowStore.logToUndoStack({
      type: 'edgeRemoved',
      edge: cloneDeep(edge)
    });
  });
  workflowStore.logToUndoStack({
    type: 'nodeRemoved',
    node: cloneDeep(node),
    nodeConfig: cloneDeep(workflowStore.nodeConfigMap[node.id])
  });
  removeNodes([node]);
};

/* config panel display */
const configPanel = reactive({
  show: false,
  type: '',
  node: null
});
const openConfigPanel = (event) => {
  configPanel.node = contextMenu.node;
  configPanel.type = event;
  configPanel.show = true;
};
const closeConfigPanel = () => {
  configPanel.node = null;
  configPanel.type = '';
  configPanel.show = false;
};
/* config panel display ends */
</script>
<template>
  <div class="dndflow" @drop="onDrop">
    <Sidebar />
    <div class="flow-container">
      <VueFlow @dragover="onDragOver" :node-types="nodeTypes" @node-context-menu="openContextMenu">
        <!-- <Controls /> -->
        <!-- <Panel :position="PanelPosition.TopRight" class="controls">
          <QBtn padding="xs" icon="fa-solid fa-rotate-left" @click="workflowStore.executeUndoRedoAction('undo')" />
          <QBtn padding="xs" icon="fa-solid fa-rotate-right" @click="workflowStore.executeUndoRedoAction('redo')" />
        </Panel> -->
        <Background :variant="BackgroundVariant.Lines" />
        <NodeToolbar
          v-if="contextMenu.show"
          :node-id="contextMenu.node.id"
          :is-visible="contextMenu.show"
          :position="Position.Right"
        >
          <ContextMenu
            @close-context-menu="closeContextMenu"
            @open-config-panel="openConfigPanel"
            @delete-component="deleteComponent"
          />
        </NodeToolbar>
      </VueFlow>
      <div v-if="configPanel.show">
        <ConfigPanel v-if="configPanel.type === 'operation'" :node="configPanel.node" @close="closeConfigPanel" />
        <FieldConfigPanel v-else :node="configPanel.node" :type="configPanel.type" @close="closeConfigPanel" />
      </div>
    </div>
  </div>
</template>
<style scoped>
.dndflow {
  flex-direction: column;
  display: flex;
  height: 92vh;
}
.dndflow .flow-container {
  flex-grow: 1;
  /* height: auto; */
  /* position: relative;
  left: 300px;
  max-width: 76vw; */
}
@media screen and (min-width: 640px) {
  .dndflow {
    flex-direction: row;
  }
}
/* @media screen and (max-width: 639px) {
  .dndflow .nodes {
    display: flex;
    flex-direction: row;
    gap: 5px;
  }
} */

/** Remove this css later */

.controls {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 8px;
}
.controls button {
  padding: 4px;
  border-radius: 5px;
  font-weight: 600;
  -webkit-box-shadow: 0px 5px 10px 0px rgba(0, 0, 0, 0.3);
  box-shadow: 0 5px 10px #0000004d;
  cursor: pointer;
  display: flex;
  justify-content: center;
  align-items: center;
}
.controls button:hover {
  transform: scale(102%);
  transition: 0.25s all ease;
}
</style>
