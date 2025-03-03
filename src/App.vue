<script setup lang="ts">
import { onMounted, ref } from 'vue'
import Canvas from '@/components/Canvas.vue'
import Toolbar from '@/components/Toolbar.vue'
import NodeSidebar from '@/components/NodeSidebar.vue'
import { useCanvasStore } from '@/stores/canvas.store'
import { useUsersStore } from '@/stores/users.store'
import { useNodeTypesStore } from '@/stores/nodeTypes.store'
import type { NodeType } from './types/common'
import { useUIStore } from './stores/ui.store'

const canvasStore = useCanvasStore()
const usersStore = useUsersStore()
const nodeTypesStore = useNodeTypesStore()
const uiStore = useUIStore()

const currentDiagramId = ref<string | null>(null)

onMounted(() => {
  nodeTypesStore.init()
  usersStore.init()
  usersStore.currentUserId = '1'
  canvasStore.init()
  canvasStore.createNewDiagram('Untitled', '1')
  currentDiagramId.value = canvasStore.currentDiagramId
})

const onNodeTypeSelected = (nodeType: NodeType) => {
  canvasStore.addNode(nodeType, uiStore.lastClickedPosition)
}
</script>

<template>
  <div v-if="currentDiagramId" :class="$style.app">
    <Toolbar />
    <Canvas :diagram-id="currentDiagramId" />
    <NodeSidebar @node-type-selected="onNodeTypeSelected" />
  </div>
  <div v-else>Loading...</div>
</template>

<style module lang="scss">
.app {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>
