<template>
  <div class="left_sidebar">
    <ul class="left_sidebar_menu list-unstyled font-size-9 font-weight-700 text-center">
      <li><a href="#" class="text-decoration-none text-white dataset_management"> Dataset Management</a></li>
      <li><a href="#" class="text-decoration-none text-white workflow_management active">Workflow Management</a></li>
      <li><a href="#" class="text-decoration-none text-white account_management">Account Management</a></li>
    </ul>
  </div>
</template>
<style scoped lang="scss">
.left_sidebar {
  width: 70px;
  //position: fixed;
  left: 0;
  //top: 50px;
  background: $brand-color-primary;
  height: 100%;
  z-index: 99;
  overflow: hidden;
}
.left_sidebar_menu {
  li {
    font-size: inherit;
    a {
      font-size: inherit;
      display: block;
      padding-top: 60px;
      padding-bottom: 16px;
      line-height: 10px;
      &.dataset_management {
        background: url('@/assets/images/dataset-icon.svg');
        background-repeat: no-repeat;
        background-position: center 16px;
        border-bottom: 1px solid #264789;
        &:hover {
          background: $secondary-color url('@/assets/images/dataset-icon.svg');
          background-repeat: no-repeat;
          background-position: center 16px;
        }
        &.active {
          background: $secondary-color url('@/assets/images/dataset-icon.svg');
          background-repeat: no-repeat;
          background-position: center 16px;
        }
      }
      &.workflow_management {
        background: url('@/assets/images/workflow-icon.svg');
        background-repeat: no-repeat;
        background-position: center 16px;
        border-top: 1px solid #6b8fd9;
        border-bottom: 1px solid #264789;
        &:hover {
          background: $secondary-color url('@/assets/images/workflow-icon.svg');
          background-repeat: no-repeat;
          background-position: center 16px;
        }
        &.active {
          background: $secondary-color url('@/assets/images/workflow-icon.svg');
          background-repeat: no-repeat;
          background-position: center 16px;
        }
      }
      &.account_management {
        background: url('@/assets/images/usermanagement-icon.svg');
        background-repeat: no-repeat;
        background-position: center 16px;
        border-top: 1px solid #6b8fd9;
        &:hover {
          background: $secondary-color url('@/assets/images/usermanagement-icon.svg');
          background-repeat: no-repeat;
          background-position: center 16px;
        }
        &.active {
          background: $secondary-color url('@/assets/images/usermanagement-icon.svg');
          background-repeat: no-repeat;
          background-position: center 16px;
        }
      }
    }
  }
}
</style>
