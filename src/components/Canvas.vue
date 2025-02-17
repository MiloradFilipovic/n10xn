<script setup lang="ts">
import { useVueFlow, VueFlow, type Edge, type Node } from '@vue-flow/core'

import SpecialNode from './nodes/SpecialNode.vue'
import SpecialEdge from './edges/SpecialEdge.vue'
import { computed, watch } from 'vue'
import { useCanvasStore } from '@/stores/canvas.store'

type Props = {
  diagramId: string
}

const props = defineProps<Props>()

const canvasStore = useCanvasStore()
const { getSelectedNodes, onNodeDragStop, getSelectedEdges } = useVueFlow()

const diagram = computed(() => canvasStore.allDiagrams[props.diagramId])

const canvasNodes = computed((): Node[] => {
  if (!diagram.value) return []
  return diagram.value.nodes.map((node) => {
    return {
      id: node.id,
      type: node.type,
      position: node.position,
      data: node.data,
      class: 'vue-flow__node-custom',
    }
  })
})

const canvasEdges = computed((): Edge[] => {
  if (!diagram.value) return []
  return diagram.value.connections.map((connection) => {
    return {
      id: connection.id,
      source: connection.source,
      target: connection.target,
      type: connection.type,
      data: connection.data,
      class: 'vue-flow__edge-custom',
    }
  })
})

onNodeDragStop((event) => {
  const id = event.node.id
  const newPosition = event.node.computedPosition
  canvasStore.moveNode(id, { x: newPosition.x, y: newPosition.y })
})

watch([getSelectedNodes, getSelectedEdges], ([nextNodes, nextEdges]) => {
  const selectedNodeIds = nextNodes.map((node) => node.id)
  const selectedEdgeIds = nextEdges.map((edge) => edge.id)
  canvasStore.selectedNodes = selectedNodeIds
  canvasStore.selectedConnections = selectedEdgeIds
})
</script>

<template>
  <div :class="$style['canvas-container']">
    <VueFlow v-model:nodes="canvasNodes" :edges="canvasEdges">
      <template #node-special="specialNodeProps">
        <SpecialNode v-bind="specialNodeProps" />
      </template>

      <template #edge-special="specialEdgeProps">
        <SpecialEdge v-bind="specialEdgeProps" />
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
}
</style>
