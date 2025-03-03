<script setup lang="ts">
import { useVueFlow, VueFlow, type Edge, type Node, Position } from '@vue-flow/core'
import { Background } from '@vue-flow/background'

import { computed, markRaw, ref, watch } from 'vue'
import { useCanvasStore } from '@/stores/canvas.store'
import { useUIStore } from '@/stores/ui.store'
import { onKeyDown, onKeyUp } from '@vueuse/core'
import IfNode from './nodes/IfNode.vue'
import TriggerNode from './nodes/TriggerNode.vue'
import { NODE_TYPES } from '../../db/nodeTypes'
import RegularNode from './nodes/RegularNode.vue'
import { useDevice } from '@/composables/useDevice'

type Props = {
  diagramId: string
}

const props = defineProps<Props>()

const canvasStore = useCanvasStore()
const uiStore = useUIStore()
const {
  getSelectedNodes,
  onNodeDragStop,
  getSelectedEdges,
  onConnect,
  onNodesChange,
  onEdgesChange,
} = useVueFlow()
const device = useDevice()

const panningKeyCode = ref<string[]>([' ', device.controlKeyCode.value])
const panningMouseButton = ref<number[]>([1])
const selectionKeyCode = ref<string | true | null>(true)

const diagram = computed(() => canvasStore.allDiagrams[props.diagramId])

const canvasNodes = computed((): Node[] => {
  if (!diagram.value) return []
  return diagram.value.nodes.map((node) => {
    return {
      id: node.id,
      type: node.type,
      position: node.position,
      height: 100,
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

onNodeDragStop((event) => {
  const id = event.node.id
  const newPosition = event.node.computedPosition
  canvasStore.moveNode(id, { x: newPosition.x, y: newPosition.y })
})

onConnect((event) => {
  console.log('onConnect', event)
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
</script>

<template>
  <div :class="$style['canvas-container']">
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
</style>
