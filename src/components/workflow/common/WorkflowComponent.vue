<script setup>
import DatasetComponent from '../component/DatasetComponent.vue';
import CustomInputComponent from '../component/CustomInputComponent.vue';
const props = defineProps({
  id: String,
  type: String,
  selected: Boolean
});
const componentMap = {
  dataset: DatasetComponent,
  custominput: CustomInputComponent
};
</script>
<template>
  <div>
    <component :is="componentMap[props.type]" v-bind="props" />
  </div>
</template>
