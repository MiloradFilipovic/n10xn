<script setup lang="ts">
import type { Node } from '@/types/canvas'
import { useCanvasStore } from '../stores/canvas.store'
import { computed } from 'vue'

const canvasStore = useCanvasStore()

const currentDiagram = computed(() => canvasStore.currentDiagram())
const selectedNodes = computed(() => canvasStore.selectedNodes)

const onAddButtonClick = () => {
  if (!currentDiagram.value) return
  const newNode: Node = {
    id: Date.now().toString(),
    type: 'default',
    position: {
      x: Math.random() * 1000,
      y: Math.random() * 1000,
    },
    data: { label: `Node ${currentDiagram.value.nodes.length + 1}` },
    class: 'vue-flow__node-custom',
  }
  canvasStore.addNode(newNode)
}

const removeSelectedNodes = () => {
  canvasStore.removeSelectedNodes()
}
</script>

<template>
  <div v-if="currentDiagram" :class="$style.toolbar">
    <div>{{ currentDiagram.name }}</div>
    <button @click="onAddButtonClick">Add Node</button>
    <button @click="removeSelectedNodes" :disabled="selectedNodes.length === 0">
      Delete Nodes
    </button>
  </div>
</template>

<style module lang="scss">
.toolbar {
  width: 100%;
  height: 50px;
  display: flex;
  gap: 1em;
  padding: 0 1em;
  font-family: Arial, Helvetica, sans-serif;
  background-color: #f0f0f0;
  align-items: center;
}
</style>
