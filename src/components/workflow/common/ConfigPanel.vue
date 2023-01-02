<script setup>
//import { onMounted } from 'vue';
import CustomInputConfigPanel from '../component/CustomInputConfigPanel.vue';
import DatasetConfigPanel from '../component/DatasetConfigPanel.vue';
const props = defineProps(['node']);
const component = {
  dataset: DatasetConfigPanel,
  custominput: CustomInputConfigPanel
};
</script>
<!-- <template>
  <div class="row">
    <div class="col-6">
      <component :is="component[props.node.type]" :node="props.node" />
    </div>
    <div class="col-6">
      <QBtn label="Close" @click="$emit('close')" />
    </div>
  </div>
</template> -->
<template>
  <div class="configurtion-panel"></div>
</template>
<style scoped lang="scss">
.configurtion-panel {
  background: $white;
  border-top: 1px solid $gray-200;
  height: 460px;
  position: absolute;
  bottom: 0px;
  width: 100%;
  display: flex;
  box-shadow: -10px 0px 20px $gray-100;
  .configuration-panel-controls {
    position: absolute;
    right: 0px;
    top: 8px;
    padding-right: 12px;
  }
  .configuration-controls-icon {
    cursor: pointer;
    opacity: 0.6;
    font-weight: normal;
    &:hover {
      opacity: 1;
      &::before {
        font-weight: 700 !important;
      }
    }
  }
  &.secondary-sidebar-collapsed {
    width: calc(100% - 82px);
  }
  &.minimized {
    height: 37px;
  }
}
</style>
