<template>
  <div>
    <QMenu auto-close no-parent-event :model-value="true" @hide="$emit('close-context-menu')">
      <QList style="min-width: 100px">
        <QItem clickable @click="$emit('open-config-panel', 'operation')">
          <QItemSection>Configure component</QItemSection>
        </QItem>
        <q-separator />
        <QItem clickable @click="$emit('open-config-panel', 'input')">
          <QItemSection>Configure input</QItemSection>
        </QItem>
        <q-separator />
        <QItem clickable @click="$emit('open-config-panel', 'output')">
          <QItemSection>Configure output</QItemSection>
        </QItem>
        <q-separator />
        <QItem clickable @click="$emit('delete-component')">
          <QItemSection>Delete component</QItemSection>
        </QItem>
      </QList>
    </QMenu>
  </div>
</template>
