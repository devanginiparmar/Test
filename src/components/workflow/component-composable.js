//import { useNode, useVueFlow } from '@vue-flow/core';
import { useWorkflowStore } from '@/stores/workflow.js';
//import eventBus from './eventbus';
//import { onBeforeUnmount, computed } from 'vue';
import { computed } from 'vue';

export function useComponent(nodeId) {
  //const { connectedEdges } = useNode();
  // handle deleted edge scenario pending
  const workflowStore = useWorkflowStore();

  // clean up left
  // onBeforeUnmount(() => {
  //   connectedEdges.value.forEach((edge) => {
  //     if (edge.targetNode.id === nodeId) {
  //       eventBus.off(`event_${edge.sourceNode.id}`);
  //     }
  //   });
  // });

  const nodeOperations = workflowStore.nodeConfigMap[nodeId].operations;
  // review ds later
  const generatedFields = computed(() => {
    return nodeOperations.reduce((acc, operation, idx) => {
      const output = operation.output;
      if (acc[output.datasetId]?.[output.field] === undefined) {
        if (!acc[output.datasetId]) {
          acc[output.datasetId] = {};
        }
        acc[output.datasetId][output.field] = idx;
        return acc;
      }
    }, {});
  });
  const isNotCycle = (edge) => {
    const isBackEdge = (edge) => {
      return (
        workflowStore.nodeConfigMap[edge.source].connections.has(edge.target) ||
        [...workflowStore.nodeConfigMap[edge.source].connections].some((parent) =>
          isBackEdge({ source: parent, target: edge.target })
        )
      );
    };
    return !isBackEdge(edge);
  };
  return { generatedFields, isNotCycle };
}
