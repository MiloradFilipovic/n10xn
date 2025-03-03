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
  <div v-if="nodeType" :class="$style['node']">
    <div :class="$style['node-name']">{{ props.data.data.name }}</div>
    <div :class="$style['node-icon']">
      <font-awesome-icon :icon="nodeType.icon" size="3x" fixed-width />
    </div>
    <Handle id="source" type="source" :position="Position.Right" />
  </div>
</template>

<style module lang="scss">
.node {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.node-icon {
  color: $color_medium;
}

.node-name {
  position: absolute;
  top: 110%;
  display: block;
  width: 100%;
  text-align: center;
  color: $color_medium;
}
</style>
