<!-- eslint-disable vue/multi-word-component-names -->
<template>
  <header class="q-px-sm">
    <div class="zevaluate-logo">
      <div>
        <img src="/src/assets/images/zvaluate_logo.png" class="img-fluid logo" />
        <QIcon class="general-dropdown-arrow" name="bi-chevron-down" size="xs" />
        <QMenu>
          <QList class="dropdown" style="min-width: 200px">
            <QItemLabel class="dropdown-header" header>File</QItemLabel>
            <QItem>
              <QItemSection avatar><QIcon size="xs" name="bi-file-earmark" /></QItemSection>
              <QItemSection><QItemLabel>New Project</QItemLabel></QItemSection>
            </QItem>
            <QItem>
              <QItemSection avatar><QIcon size="xs" name="bi-folder2-open" /></QItemSection>
              <QItemSection><QItemLabel>Open Project</QItemLabel></QItemSection>
            </QItem>
            <QItem>
              <QItemSection avatar><QIcon size="xs" name="bi-save" /></QItemSection>
              <QItemSection><QItemLabel>Save Point</QItemLabel></QItemSection>
            </QItem>
            <QItem>
              <QItemSection avatar><QIcon size="xs" name="bi-grid-1x2" /></QItemSection>
              <QItemSection><QItemLabel>Open Template</QItemLabel></QItemSection>
            </QItem>
            <QItem>
              <QItemSection avatar><QIcon size="xs" name="bi-cart2" /></QItemSection>
              <QItemSection><QItemLabel>Marketplace</QItemLabel></QItemSection>
            </QItem>
          </QList>
        </QMenu>
      </div>
    </div>
  </header>
</template>
<style scoped lang="scss">
header {
  height: 50px;
  border-bottom: 1px solid $gray-200;
  box-shadow: 0px 4px 12px $gray-200;
  display: flex;
  align-items: center;
  background: $white;
  position: fixed;
  top: 0;
  width: 100%;
  left: 0;
  z-index: 100;
}
.logo {
  max-height: 40px;
}
.zevaluate-logo {
  width: 294px;
  border-right: 1px solid $gray-200;
  padding: 5px 0px;
  position: relative;
  z-index: 100;
}
.dropdown {
  background: $brand-color-primary;
  border-radius: 0px;
  color: $white;
  .dropdown-header {
    color: $white;
  }
}
.general-dropdown-arrow {
  color: $black;
  padding-left: 5px;
  width: 20px;
  height: 12px;
}
</style>
