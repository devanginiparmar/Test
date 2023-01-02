<script setup>
import WorkFlow from './components/workflow/WorkFlow.vue';
import AppHeader from './components/AppHeader.vue';
import AppDrawer from './components/AppDrawer.vue';
</script>
<template>
  <QLayout view="hHh lpR fFf">
    <QHeader elevated>
      <QToolbar>
        <AppHeader />
      </QToolbar>
    </QHeader>

    <QDrawer :behavior="'desktop'" :width="70" :model-value="true">
      <AppDrawer />
    </QDrawer>
    <QPageContainer>
      <WorkFlow />
      <!-- <router-view /> -->
    </QPageContainer>
  </QLayout>
</template>
<style lang="scss">
@import '@/assets/scss/zvaluate-style.scss';
</style>
