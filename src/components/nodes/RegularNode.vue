<script setup lang="ts">
import { computed, defineProps } from 'vue'
import { Position, Handle, type NodeProps } from '@vue-flow/core'
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
    <Handle id="source" type="source" :position="Position.Right" />
    <Handle id="target" type="target" :position="Position.Left" />
  </div>
</template>