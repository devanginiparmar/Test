<script setup>
import { ref, watch } from 'vue';
import { Handle, Position } from '@vue-flow/core';
import { useComponent } from '../component-composable';

const props = defineProps({
  id: String,
  selected: Boolean
});
watch(
  () => props.selected,
  (isSelected) => (selectedColor.value = isSelected)
);
const { isNotCycle } = useComponent(props.id);
const transparent = ref(true);
let selectedColor = ref(false);
////////////////////////////////////////////.
</script>

<template>
  <div>
    <!-- Handle for different utilities -->
    <Handle id="source" class="handle" type="source" :position="Position.Right" :is-valid-connection="isNotCycle" />

    <div
      @mouseenter="transparent = false"
      @mouseleave="transparent = true"
      class="d-flex flex-column align-items-center"
    >
      <!-- Delete Button and color controls -->
      <div class="d-flex button-container" :class="{ transparent: transparent }" style="margin-bottom: 0.5rem">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          fill="currentColor"
          class="bi bi-trash3 delete-button"
          viewBox="0 0 16 16"
          @click="(event) => deleteElement(event, id)"
        >
          <path
            d="M6.5 1h3a.5.5 0 0 1 .5.5v1H6v-1a.5.5 0 0 1 .5-.5ZM11 2.5v-1A1.5 1.5 0 0 0 9.5 0h-3A1.5 1.5 0 0 0 5 1.5v1H2.506a.58.58 0 0 0-.01 0H1.5a.5.5 0 0 0 0 1h.538l.853 10.66A2 2 0 0 0 4.885 16h6.23a2 2 0 0 0 1.994-1.84l.853-10.66h.538a.5.5 0 0 0 0-1h-.995a.59.59 0 0 0-.01 0H11Zm1.958 1-.846 10.58a1 1 0 0 1-.997.92h-6.23a1 1 0 0 1-.997-.92L3.042 3.5h9.916Zm-7.487 1a.5.5 0 0 1 .528.47l.5 8.5a.5.5 0 0 1-.998.06L5 5.03a.5.5 0 0 1 .47-.53Zm5.058 0a.5.5 0 0 1 .47.53l-.5 8.5a.5.5 0 1 1-.998-.06l.5-8.5a.5.5 0 0 1 .528-.47ZM8 4.5a.5.5 0 0 1 .5.5v8.5a.5.5 0 0 1-1 0V5a.5.5 0 0 1 .5-.5Z"
          />
        </svg>
      </div>
      <!-- Delete Button and color controls -->

      <div
        class="main-container"
        :style="{
          border: '3px red solid'
        }"
      >
        <div class="starting-step">
          <!-- Label part -->
          <div class="d-flex align-items-center justify-content-center">
            <div class="p-2 starting-step-header" :id="id + 'label'">Label</div>
          </div>
          <!-- Label part -->
        </div>
        <div class="content">
          <!-- Title part -->
          <div>Dataset</div>
          <!-- Title part -->

          <!-- Subtitle part -->
          <div>Subtitle</div>
          <!-- Subtitle part -->
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
[contenteditable]:focus,
textarea:focus {
  outline: 2px #74747463 solid;
  border-radius: 1rem;
}
.container-color {
  width: 1rem;
  height: 1rem;
  margin-right: 5px;
  border-radius: 1rem;
}
.add-title {
  text-align: left;
  border-radius: 1rem;
  padding: 0.4rem;
  margin-bottom: 0.4rem;
  font-weight: bold;
  width: 90%;
}
textarea {
  width: 95%;
  display: block;
  text-align: left;
  border-radius: 1rem;
  padding: 0.4rem;
  border: 2px rgb(203, 203, 203) dashed;
}
.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  background-color: #fff;
  padding: 0.5rem 1rem 0.5rem 1rem;
  width: 100%;
  border-bottom-left-radius: 1rem;
  border-bottom-right-radius: 1rem;
  cursor: pointer;
}
.handle {
  background-color: white;
  width: 1rem;
  height: 1rem;
  border: 2px solid;
  position: absolute;
  top: 5.1rem;
}
.handle:hover {
  width: 1.3rem;
  height: 1.3rem;
  transition: width, height 0.5s;
}
.button-container {
  background-color: white;
  padding: 5px;
  margin: 0;
  border-radius: 1rem;
  color: rgba(255, 0, 0, 0.877);
  cursor: pointer;
  opacity: 100%;
  transition: opacity 0.5s;
}
.transparent {
  opacity: 0%;
}
.delete-button:hover {
  background-color: #eee;
  border-radius: 1rem;
}
.starting-step {
  border-top-left-radius: 1rem;
  border-top-right-radius: 1rem;
  width: 18rem;
  height: 3rem;
  font-size: medium;
  text-align: left;
  padding-left: 0.5rem;
  padding-top: 0.3rem;
  background-color: rgba(255, 255, 255, 0.442);
}
.starting-step {
  border-bottom: 1px solid #eee;
}
.main-container {
  width: calc(18rem + 6px);
  height: 100%;
  border-radius: 1rem;
  box-shadow: rgba(0, 0, 0, 0.35) 0px 5px 15px;
}
.main-container:hover {
  border: 3px solid #d5cb07;
  border-radius: 1rem;
}
</style>
