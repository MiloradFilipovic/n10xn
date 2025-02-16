<script setup lang="ts">
import { VueFlow } from '@vue-flow/core'
import type { Diagram } from '@/types/canvas'

// these components are only shown as examples of how to use a custom node or edge
// you can find many examples of how to create these custom components in the examples page of the docs
import SpecialNode from './nodes/SpecialNode.vue'
import SpecialEdge from './edges/SpecialEdge.vue'

type Props = {
  diagram: Diagram
}

const props = defineProps<Props>()
</script>

<template>
  <div :class="$style['canvas-container']">
    <VueFlow :nodes="props.diagram.nodes" :edges="props.diagram.edges">
      <!-- bind your custom node type to a component by using slots, slot names are always `node-<type>` -->
      <template #node-special="specialNodeProps">
        <SpecialNode v-bind="specialNodeProps" />
      </template>

      <!-- bind your custom edge type to a component by using slots, slot names are always `edge-<type>` -->
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
