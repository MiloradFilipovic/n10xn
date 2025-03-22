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
import { useUsersStore } from '@/stores/users.store'
import type { CollaborationUser } from '@/types/canvas'

const route = useRoute()

const canvasStore = useCanvasStore()
const uiStore = useUIStore()
const collaborationStore = useCollaborationStore()
const usersStore = useUsersStore()

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
  collaborationStore.initRoom(id)
  if (collaborationStore.provider) {
    const currentUser = usersStore.currentUser
    if (currentUser) {
      collaborationStore.addCurrentUserToSession(currentUser)
    }
  }
})

onBeforeUnmount(() => {
  console.log('unmounting')

  if (collaborationStore.provider) {
    const currentUser = usersStore.currentUser
    if (currentUser) {
      collaborationStore.removeUserFromSession(currentUser)
    }
  }
})

const onNodeTypeSelected = (nodeType: NodeType) => {
  canvasStore.addNode(nodeType, uiStore.lastClickedPosition)
}
</script>

<template>
  <div v-if="currentDiagramId" :class="$style.editor">
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
