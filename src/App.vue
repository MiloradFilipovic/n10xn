<script setup lang="ts">
import Canvas from './components/Canvas.vue'
import Toolbar from './components/Toolbar.vue'
import { useCanvasStore } from './stores/canvas.store'

const canvasStore = useCanvasStore()
</script>

<template>
  <div :class="$style.app">
    <Toolbar />
    <Canvas :diagram="canvasStore.diagram" />
  </div>
</template>

<style module lang="scss">
.app {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>
