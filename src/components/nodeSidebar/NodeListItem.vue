<script lang="ts" setup>
import type { NodeType } from '@/types/common'

type Props = {
  nodeType: NodeType
}

const props = defineProps<Props>()
</script>

<template>
  <li :class="$style['node-type-item']">
    <div :class="$style['node-type-name']">{{ nodeType.name }}</div>
    <div :class="$style['node-type-description']">{{ nodeType.description }}</div>
  </li>
</template>

<style module lang="scss">
.node-type-item {
  padding: 0.5em;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  border: 1px solid #ccc;

  &:hover {
    border-color: #414244;
  }
}

.node-type-name {
  color: #414244;
}

.node-type-description {
  font-size: 0.8em;
}
</style>
