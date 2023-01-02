<script setup>
import { useWorkflowStore } from '@/stores/workflow.js';
import eventBus from '../eventbus';
const props = defineProps(['node', 'type']);
const emit = defineEmits(['close']);
const workflowStore = useWorkflowStore();
const property = props.type === 'input' ? 'isInput' : 'isOutput';

const nodeConfig = workflowStore.nodeConfigMap[props.node.id];
const toggleConfig = (datasetIdx, fieldIdx) => {
  const field = nodeConfig['availableDatasets'][datasetIdx]['fields'][fieldIdx];
  field[property] = !field[property];
  // turned off input
  if (!field[property] && property === 'isInput') {
    // go through config and update error
    // if output is turned on, turn it off
    if (field.isOutput) {
      field.isOutput = false;
    }
  }
};
// emit event
const onClose = () => {
  eventBus.emit(`event_${props.node.id}`, { type: 'update' });
  emit('close');
};
</script>
<template>
  <div>
    <h6>Configure {{ props.type }}</h6>
    <ul :key="dataset.datasetId" v-for="(dataset, datasetIdx) in nodeConfig.availableDatasets">
      <li>
        <div>{{ dataset.name }}</div>
        <ul :key="field.name + field.generatedNodeId" v-for="(field, fieldIdx) in dataset.fields">
          <li>
            <span>
              {{ field.name }}
            </span>
            <QCheckbox :model-value="field[property]" @update:model-value="toggleConfig(datasetIdx, fieldIdx)" />
          </li>
        </ul>
      </li>
    </ul>
    <QBtn label="close" @click="onClose" />
  </div>
</template>
