<script setup>
import { ref } from 'vue';
const drawer = ref(true);
const onDragStart = (event, nodeType) => {
  if (event.dataTransfer) {
    event.dataTransfer.setData('application/vueflow', nodeType);
    event.dataTransfer.effectAllowed = 'move';
  }
};
</script>
<template>
  <div class="row sidebar-content">
    <div class="left-secondary-sidebar" v-if="drawer">
      <div class="left-secondary-sidebar-wrapper">
        <!--search-components-->
        <div>
          <QInput dense outlined class="q-py-lg q-px-sm" label="Search">
            <template #prepend>
              <QIcon size="xs" name="bi-search" />
            </template>
          </QInput>
        </div>
        <!--search-components-->
        <QExpansionItem header-class="bg-gray" default-opened label="Datasource">
          <div>
            <QList class="list-unstyled menu-items-wrapper">
              <QItem class="menu-items cursor-pointer">
                <QItemLabel :draggable="true" @dragstart="onDragStart($event, 'dataset')">
                  <span><img src="@/assets/images/dataset-icon-small.svg" class="menu-items-icon" /></span>
                  <h6>Datasets</h6>
                </QItemLabel>
              </QItem>
            </QList>
          </div>
        </QExpansionItem>
        <QExpansionItem header-class="bg-gray" default-opened label="Blocks">
          <div class="accordion-body q-px-sm q-py-none">
            <QList class="list-unstyled text-center menu-items-wrapper">
              <QItem class="menu-items cursor-pointer">
                <QItemLabel>
                  <span><QIcon name="bi-table" /> </span>
                  <h6 class="text-small">Data Editor</h6>
                </QItemLabel>
              </QItem>
              <QItem class="menu-items cursor-pointer">
                <QItemLabel>
                  <span><img src="@/assets/images/results-icon.svg" class="menu-items-icon" /></span>
                  <h6 class="text-small">Results Block</h6>
                </QItemLabel>
              </QItem>
            </QList>
            <hr class="q-my-sm" />
            <QList class="list-unstyled text-center menu-items-wrapper">
              <QItem class="menu-items cursor-pointer">
                <QItemLabel>
                  <span><img src="@/assets/images/formula-icon.png" class="menu-items-icon" /></span>
                  <h6 class="text-small">Formula Block</h6>
                </QItemLabel>
              </QItem>
              <QItem class="menu-items cursor-pointer">
                <QItemLabel>
                  <span><QIcon name="bi-code-slash" /> </span>
                  <h6 class="text-small">Python</h6>
                </QItemLabel>
              </QItem>
              <QItem class="menu-items cursor-pointer">
                <QItemLabel>
                  <span><QIcon name="bi-calculator" /> </span>
                  <h6 class="text-small">Calculation Block</h6>
                </QItemLabel>
              </QItem>
            </QList>
          </div>
        </QExpansionItem>
        <QExpansionItem header-class="bg-gray" default-opened label="Data Operations">
          <div>
            <QList class="list-unstyled menu-items-wrapper">
              <QItem class="menu-items cursor-pointer">
                <QItemLabel>
                  <span><QIcon name="bi-link" /> </span>
                  <h6 class="text-small">Join</h6>
                </QItemLabel>
              </QItem>
              <QItem class="menu-items cursor-pointer">
                <QItemLabel>
                  <span><QIcon name="bi-funnel" /> </span>
                  <h6 class="text-small">Filter</h6>
                </QItemLabel>
              </QItem>
              <QItem class="menu-items cursor-pointer">
                <QItemLabel>
                  <span><img src="@/assets/images/lookup-icon.svg" class="menu-items-icon" /></span>
                  <h6 class="text-small">Lookup</h6>
                </QItemLabel>
              </QItem>
              <QItem class="menu-items cursor-pointer">
                <QItemLabel>
                  <span><QIcon name="bi-layout-sidebar" /></span>
                  <h6 class="text-small">Group Editor</h6>
                </QItemLabel>
              </QItem>
            </QList>
          </div>
        </QExpansionItem>
      </div>
    </div>
    <div class="collapsible-bar cursor-pointer">
      <QIcon
        class="left-secondary-sidebar-collapsible-icon font-size-22"
        name="bi-caret-left-fill"
        @click="drawer = !drawer"
      />
    </div>
  </div>
</template>
<style lang="scss" scoped>
:deep(.bg-gray) {
  background-color: $gray-200;
}
// .sidebar-content {
//   overflow: hidden;
// }
.left-secondary-sidebar {
  width: 220px;
  background: $white;
  //position: fixed;
  //top: 50px;
  //left: 70px;
  height: 100%;
  box-shadow: 4px 0px 12px $gray-200;
  overflow: auto;
  z-index: 50;

  .menu-items-wrapper {
    display: flex;
    flex-flow: row wrap;
    text-align: center;
    width: 100%;
    .menu-items {
      min-width: 50%;
      margin: 16px 0px 8px;
      padding: 0px;
      justify-content: center;
      h6 {
        font-weight: 500;
        font-size: $font-size-small;
        margin-top: 4px;
        margin-bottom: 0px;
        font-size: $font-size-small;
      }
      span {
        display: block;
        width: 40px;
        height: 40px;
        background: $gray-200;
        border-radius: 50%;
        text-align: center;
        line-height: 40px;
        margin: 0 auto;
        .menu-items-icon {
          max-height: 20px;
        }
        &:hover {
          background: $gray-300;
        }
      }
    }
  }
  // &.secondary-sidebar-collapsed {
  //   width: 0px;
  //   overflow: hidden;
  // }
}
.collapsible-bar {
  //position: fixed;
  //left: 289px;
  //top: 50px;
  height: 100%;
  border-left: 1px solid $gray-300;
  border-right: 1px solid $gray-300;
  width: 12px;
  background: $white;
  .left-secondary-sidebar-collapsible-icon {
    position: relative;
    top: 40%;
    //right: 4px;
    transform: translateY(-50%);
    width: 12px;
    color: $gray-700;
  }
  &:hover {
    background: darken($white, 2.5%);
  }
  // &.secondary-sidebar-collapsed {
  //   left: 70px;
  // }
}
</style>
