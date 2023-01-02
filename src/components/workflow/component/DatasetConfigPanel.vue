<script setup>
import { reactive, computed } from 'vue';
import { useWorkflowStore } from '@/stores/workflow.js';
import eventBus from '../eventbus';
const props = defineProps(['node']);
const workflowStore = useWorkflowStore();
const { createDataset, createField } = workflowStore;
const componentState = reactive({
  dataset: '',
  selectedDataset: '',
  field: ''
});
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
const datasetList = computed(() => workflowStore.nodeConfigMap[props.node.id]?.availableDatasets || []);

const saveConfig = () => {
  eventBus.emit(`event_${props.node.id}`, { type: 'update' });
};
</script>
<template>
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
</template>
