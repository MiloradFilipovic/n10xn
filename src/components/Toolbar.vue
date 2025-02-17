<script setup lang="ts">
import type { Node } from '@/types/canvas'
import { useCanvasStore } from '../stores/canvas.store'
import { computed } from 'vue'
import { useUsersStore } from '@/stores/users.store'

const canvasStore = useCanvasStore()
const usersStore = useUsersStore()

const currentUser = computed(() => usersStore.currentUser())
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
  <div :class="$style.toolbar">
    <div :class="$style.controls">
      <div v-if="currentDiagram">{{ currentDiagram.name }}</div>
      <button @click="onAddButtonClick">Add Node</button>
      <button @click="removeSelectedNodes" :disabled="selectedNodes.length === 0">
        Delete Nodes
      </button>
    </div>
    <div :class="$style.user">
      <div :class="$style.avatar">
        {{ currentUser?.firstName.charAt(0) }}{{ currentUser?.lastName.charAt(0) }}
      </div>
      <div>{{ currentUser?.firstName }} {{ currentUser?.lastName }}</div>
    </div>
  </div>
</template>

<style module lang="scss">
.toolbar {
  display: flex;
  gap: 1em;
  padding: 1em;
  font-family: Arial, Helvetica, sans-serif;
  background-color: #f0f0f0;
  align-items: center;
  justify-content: space-between;
}

.controls {
  display: flex;
  gap: 1em;
}

.user {
  display: flex;
  gap: 1em;
  align-items: center;
}

.avatar {
  width: 30px;
  height: 30px;
  font-size: 0.8em;
  border-radius: 50%;
  background-color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
