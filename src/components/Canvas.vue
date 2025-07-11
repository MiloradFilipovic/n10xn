<script setup lang="ts">
import { useVueFlow, VueFlow, type Edge, type Node, Position, type NodeDragEvent } from '@vue-flow/core'
import { Background } from '@vue-flow/background'

import { computed, onMounted, ref, watch } from 'vue'
import { useCanvasStore } from '@/stores/canvas.store'
import { useUIStore } from '@/stores/ui.store'
import { onKeyDown, onKeyUp } from '@vueuse/core'
import IfNode from './nodes/IfNode.vue'
import TriggerNode from './nodes/TriggerNode.vue'
import RegularNode from './nodes/RegularNode.vue'
import EdgeContextMenu from './EdgeContextMenu.vue'
import { useDevice } from '@/composables/useDevice'
import { NODE_TYPES } from '../../db/nodeTypes'
import { useNodeTypesStore } from '@/stores/nodeTypes.store'
import { useUsersStore } from '@/stores/users.store'
import { useRouter } from 'vue-router'
import { useCollaborationStore } from '@/stores/collaboration.store'
import type { NodeType } from '@/types/common'

type Props = {
  diagramId: string
}

const props = defineProps<Props>()

const canvasStore = useCanvasStore()
const uiStore = useUIStore()
const nodeTypesStore = useNodeTypesStore()
const usersStore = useUsersStore()
const collaborationStore = useCollaborationStore()

const {
  getSelectedNodes,
  onNodeDragStop,
  onSelectionDragStop,
  getSelectedEdges,
  onConnect,
  onNodesChange,
  onEdgesChange,
  onEdgeContextMenu,
} = useVueFlow()
const device = useDevice()
const router = useRouter()

const contextMenuVisible = ref(false)
const contextMenuPosition = ref({ x: 0, y: 0 })
const contextMenuEdge = ref<Edge | null>(null)

const panningKeyCode = ref<string[]>([' ', device.controlKeyCode.value])
const panningMouseButton = ref<number[]>([1])
const selectionKeyCode = ref<string | true | null>(true)

const diagram = computed(() => canvasStore.allDiagrams[props.diagramId])

const userCursors = computed(() => {
  return collaborationStore.otherUsers.map((user) => {
    return {
      id: user.id,
      username: user.username,
      position: user.cursorPosition,
      color: user.color,
    }
  })
})

const canvasNodes = computed((): Node[] => {
  if (!diagram.value) return []
  return diagram.value.nodes.map((node) => {
    return {
      id: node.id,
      type: node.type,
      position: node.position,
      height:100,
      width: 100,
      label: node.data.name,
      data: node.data,
      targetPosition: Position.Left,
      sourcePosition: Position.Right,
      class: 'vue-flow__node-custom',
    }
  })
})

const canvasEdges = computed((): Edge[] => {
  if (!diagram.value) return []
  return diagram.value.connections.map((connection) => {
    return {
      id: connection.id,
      source: connection.sourceId,
      sourceHandle: connection.sourceHandle,
      target: connection.targetId,
      targetHandle: connection.targetHandle,
      type: connection.type,
      data: connection.data,
      class: 'vue-flow__edge-custom',
    }
  })
})

function switchToPanningMode() {
  selectionKeyCode.value = null
  panningMouseButton.value = [0, 1]
}

function switchToSelectionMode() {
  selectionKeyCode.value = true
  panningMouseButton.value = [1]
}

onSelectionDragStop((event: NodeDragEvent) => {
  const nodes = event.nodes;
  const payload: Array<{ id: string; position: { x: number; y: number } }> = nodes.map((node) => {
    return {
      id: node.id,
      position: { x: node.position.x, y: node.position.y },
    }
  })
  collaborationStore.notifyNodesMoved(payload)
})

onNodeDragStop((event) => {
  const id = event.node.id
  const newPosition = event.node.computedPosition
  canvasStore.moveNodes([
    {
      id,
      position: { x: newPosition.x, y: newPosition.y },
    },
  ])
})


onConnect((event) => {
  canvasStore.connectNodes(
    { id: event.source, handle: event.sourceHandle ?? undefined },
    { id: event.target, handle: event.targetHandle ?? undefined },
  )
})

const onCanvasClick = (event: MouseEvent) => {
  uiStore.lastClickedPosition = { x: event.layerX, y: event.layerY }
}

onNodesChange((updates) => {
  updates.forEach((update) => {
    if (update.type === 'remove') {
      canvasStore.removeNode(update.id)
    }
  })
})

onEdgesChange((updates) => {
  updates.forEach((update) => {
    if (update.type === 'remove') {
      canvasStore.removeConnection(update.id)
    }
  })
})

onEdgeContextMenu((event) => {
  event.event.preventDefault()
  contextMenuVisible.value = true
  let x = 0
  let y = 0
  if ('clientX' in event.event && 'clientY' in event.event) {
    x = event.event.clientX
    y = event.event.clientY
  } else if ('touches' in event.event && event.event.touches.length > 0) {
    x = event.event.touches[0].clientX
    y = event.event.touches[0].clientY
  }
  contextMenuPosition.value = { x, y }
  contextMenuEdge.value = event.edge
})

const handleNodeTypeSelected = (nodeType: NodeType, edge: Edge) => {
  canvasStore.addNodeOnEdge(nodeType, edge)
  closeContextMenu()
}

const closeContextMenu = () => {
  contextMenuVisible.value = false
  contextMenuEdge.value = null
}

onKeyDown(panningKeyCode.value, switchToPanningMode, {
  dedupe: true,
})

onKeyUp(panningKeyCode.value, switchToSelectionMode)

watch([getSelectedNodes, getSelectedEdges], ([nextNodes, nextEdges]) => {
  const selectedNodeIds = nextNodes.map((node) => node.id)
  const selectedEdgeIds = nextEdges.map((edge) => edge.id)
  canvasStore.selectedNodes = selectedNodeIds
  canvasStore.selectedConnections = selectedEdgeIds
})

onMounted(() => {
  if (!usersStore.isLoggedIn) {
    router.push({ name: 'login' })
  }
  useVueFlow().fitView()
})
</script>

<template>
  <div :class="$style['canvas-container']">
    <div
      v-for="cursor in userCursors"
      :key="cursor.id"
      :class="$style['user-cursor']"
      :style="{
        top: (cursor.position?.y ?? 0) + 'px',
        left: (cursor.position?.x ?? 0) + 'px',
        color: `#${cursor.color}`,
      }"
    >
      <font-awesome-icon icon="mouse-pointer" :class="$style['cursor-icon']" />
      <span :class="$style['cursor-user']">{{ cursor.username }}</span>
    </div>
    <VueFlow
      v-model:nodes="canvasNodes"
      :edges="canvasEdges"
      :pan-on-drag="panningMouseButton"
      :selection-key-code="selectionKeyCode"
      :zoom-activation-key-code="panningKeyCode"
      :pan-activation-key-code="panningKeyCode"
      @click="onCanvasClick"
    >
      <Background />
      <template #node-if="props">
        <IfNode :data="props" />
      </template>
      <template #node-trigger="props">
        <TriggerNode :data="props" />
      </template>
      <template #node-regular="props">
        <RegularNode :data="props" />
      </template>
    </VueFlow>
    <EdgeContextMenu
      :visible="contextMenuVisible"
      :position="contextMenuPosition"
      :edge="contextMenuEdge"
      @close="closeContextMenu"
      @node-type-selected="handleNodeTypeSelected"
    />
  </div>
</template>

<style>
@import '@vue-flow/core/dist/style.css';
@import '@vue-flow/core/dist/theme-default.css';
@import '../assets/canvas.scss';
</style>

<style module lang="scss">
.canvas-container {
  width: 100%;
  height: 100%;
  overflow: hidden;
}

.user-cursor {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 0.5em;
  font-size: 12px;
  pointer-events: none;
  z-index: 100;
}
</style>
