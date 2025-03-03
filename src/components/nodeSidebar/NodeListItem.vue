<script lang="ts" setup>
import type { NodeType } from '@/types/common'

type Props = {
  nodeType: NodeType
}

const props = defineProps<Props>()
</script>

<template>
  <li :class="$style['node-type-item']">
    <div :class="$style['node-type-icon']">
      <font-awesome-icon :icon="nodeType.icon" size="xl" fixed-width />
    </div>
    <div :class="$style['node-type-name']">{{ nodeType.name }}</div>
    <div :class="$style['node-type-description']">{{ nodeType.description }}</div>
  </li>
</template>

<style module lang="scss">
.node-type-item {
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
  padding: 0.5em;
  border-radius: 4px;
  cursor: pointer;
  transition: background-color 0.2s;
  border: 1px solid $color_medium;

  &:hover {
    border-color: $color_dark;

    .node-type-icon {
      color: $color_dark;
    }
  }
}

.node-type-icon {
  grid-column: 1;
  grid-row: 1 / span 2;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0.5em;
}

.node-type-name {
  color: $color_primary;
  grid-column: 2;
  grid-row: 1;
}

.node-type-description {
  grid-column: 2;
  grid-row: 2;
  font-size: 0.8em;
}
</style>
