<script setup lang="ts">
import { onBeforeUnmount, onMounted, ref } from 'vue'
import Canvas from '@/components/Canvas.vue'
import Toolbar from '@/components/toolbar/Toolbar.vue'
import NodeSidebar from '@/components/nodeSidebar/NodeSidebar.vue'
import { useCanvasStore } from '@/stores/canvas.store'
import type { NodeType } from '../types/common'
import { useUIStore } from '../stores/ui.store'
import { useRoute } from 'vue-router'
import { useCollaborationStore } from '@/stores/collaboration.store'

const route = useRoute()

const canvasStore = useCanvasStore()
const uiStore = useUIStore()
const collaborationStore = useCollaborationStore()

const currentDiagramId = ref<string | null>(null)

onMounted(() => {
  const id = route.params.id as string

  const existingDiagram = canvasStore.allDiagrams[id]
  if (existingDiagram) {
    currentDiagramId.value = id
    canvasStore.currentDiagramId = id
  } else {
    canvasStore.createNewDiagram('Untitled', '1')
    currentDiagramId.value = canvasStore.currentDiagramId
  }

  // Init Yjs
  collaborationStore.initSession(id)
  collaborationStore.joinSession()

  window.addEventListener('beforeunload', leaveSession)
})

onBeforeUnmount(() => {
  leaveSession()
  window.removeEventListener('beforeunload', leaveSession)
})

const leaveSession = () => {
  collaborationStore.destroySession()
}

const onNodeTypeSelected = (nodeType: NodeType) => {
  canvasStore.addNode(nodeType, uiStore.lastClickedPosition)
}

const setCursorPos = (e: MouseEvent) => {
  // TODO: Think about throttling this
  collaborationStore.setCursorPosition({ x: e.clientX, y: e.clientY })
}
</script>

<template>
  <div v-if="currentDiagramId" :class="$style.editor" @mousemove="setCursorPos">
    <Toolbar />
    <Canvas :diagram-id="currentDiagramId" />
    <NodeSidebar @node-type-selected="onNodeTypeSelected" />
  </div>
  <div v-else>Loading...</div>
</template>

<style module lang="scss">
.editor {
  width: 100%;
  height: 100vh;
  overflow: hidden;
}
</style>
