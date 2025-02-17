<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Canvas from './components/Canvas.vue'
import Toolbar from './components/Toolbar.vue'
import { useCanvasStore } from './stores/canvas.store'
import { useUsersStore } from './stores/users.store'

const canvasStore = useCanvasStore()
const usersStore = useUsersStore()
const currentDiagramId = ref<string | null>(null)

onMounted(() => {
  usersStore.init()
  usersStore.currentUserId = '1'
  canvasStore.init()
  currentDiagramId.value = Object.keys(canvasStore.allDiagrams)[0]
  canvasStore.currentDiagramId = currentDiagramId.value
})
</script>

<template>
  <div v-if="currentDiagramId" :class="$style.app">
    <Toolbar />
    <Canvas :diagram-id="currentDiagramId" />
  </div>
  <div v-else>Loading...</div>
</template>

<style>
@import './assets/main.scss';
</style>

<style module lang="scss">
.app {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>
