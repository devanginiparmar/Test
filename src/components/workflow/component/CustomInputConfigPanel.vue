<script setup>
import { useWorkflowStore } from '@/stores/workflow.js';
import { reactive, computed } from 'vue';
import eventBus from '../eventbus';
const props = defineProps(['node']);
const workflowStore = useWorkflowStore();
const componentState = reactive({
  dataset: '',
  selectedDataset: null
});
const { createDataset, createField } = workflowStore;
const addDataset = () => {
  createDataset(componentState.dataset, props.node.id);
  componentState.dataset = '';
};
const addField = () => {
  if (componentState.selectedDataset) {
    createField(componentState.field, props.node.id, componentState.selectedDataset.datasetId);
    componentState.field = '';
  }
};
const saveConfig = () => {
  eventBus.emit(`event_${props.node.id}`, { type: 'update' });
};
const nodeConfig = workflowStore.nodeConfigMap[props.node.id];
const datasetList = computed(() => workflowStore.nodeConfigMap[props.node.id]?.availableDatasets || []);
const addOperation = () => {
  workflowStore.addOperation(props.node.id, {
    type: 'Calculation',
    operation: '+',
    input: [
      {
        datasetId: '',
        field: '',
        generatedNodeId: ''
      },
      {
        datasetId: '',
        field: '',
        generatedNodeId: ''
      }
    ],
    output: {
      field: '',
      datasetId: ''
    }
  });
};
</script>
<template>
  <div>
    <div>
      <div :key="dataset.name" v-for="dataset in nodeConfig.availableDatasets">
        <div>Name: {{ dataset.name }}</div>
        <div>Fields: {{ JSON.stringify(dataset.fields) }}</div>
      </div>
    </div>

    <div>
      <div>
        <div>
          <QInput v-model="componentState.dataset" label="Dataset name" />
        </div>
        <QBtn @click="addDataset" label="Add" />
      </div>
      <QSelect v-model="componentState.selectedDataset" :options="datasetList" label="Select dataset" />
      <div v-if="componentState.selectedDataset">
        <ol>
          <li v-for="field in componentState.selectedDataset.fields" :key="field">
            {{ field.name }} <QCheckbox v-model="field.isOutput" />
          </li>
        </ol>
        <div>
          <QInput v-model="componentState.field" label="Field name" />
        </div>
        <QBtn @click="addField" label="Add" />
      </div>
      <QBtn @click="saveConfig" label="Save" />
    </div>
    <QBtn @click="addOperation" label="Add operation" />
  </div>
</template>
