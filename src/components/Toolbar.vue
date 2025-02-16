<script setup lang="ts">
import { useVueFlow, type Node } from '@vue-flow/core'
import { useCanvasStore } from '../stores/canvas.store'

const { addNodes, getSelectedNodes, removeNodes } = useVueFlow()
const canvasStore = useCanvasStore()

const onAddButtonClick = () => {
  const newNode: Node = {
    id: Date.now().toString(),
    type: 'default',
    position: {
      x: Math.random() * 1000,
      y: Math.random() * 1000,
    },
    data: { label: `Node ${canvasStore.diagram.nodes.length + 1}` },
    class: 'vue-flow__node-custom',
  }
  addNodes([newNode])
}

const removeSelectedNodes = () => {
  const selectedNodes = getSelectedNodes.value
  removeNodes(selectedNodes)
}
</script>

<template>
  <div :class="$style.toolbar">
    <button @click="onAddButtonClick">Add Node</button>
    <button @click="removeSelectedNodes" :disabled="getSelectedNodes.length === 0">
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
  background-color: #f0f0f0;
  align-items: center;
}
</style>
