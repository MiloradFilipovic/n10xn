<script setup lang="ts">
import type { NodeProps } from '@vue-flow/core'
import { Position, Handle } from '@vue-flow/core'
import { computed, defineProps } from 'vue'
import { NODE_TYPES } from '../../../db/nodeTypes'

type props = {
  data: NodeProps
}

const props = defineProps<props>()

const nodeType = computed(() => {
  return NODE_TYPES.find((type) => type.id === props.data.data.type)
})
</script>

<template>
  <div v-if="nodeType" class="node">
    <div class="node-content">
        <div class="node-icon">
          <font-awesome-icon :icon="nodeType.icon" size="5x" fixed-width />
        </div>
      </div>
      <div class="node-name">{{ props.data.data.name }}</div>
    <Handle id="target" type="target" :position="Position.Left" />
    <Handle id="source-true" type="source" :position="Position.Right" style="top: 60px" />
    <Handle
      id="source-false"
      type="source"
      :position="Position.Right"
      style="bottom: 20px; top: auto"
    />
  </div>
</template>
