<script setup lang="ts">
import { useNodeTypesStore } from '@/stores/nodeTypes.store'
import NodeTypeItem from '@/components/nodeSidebar/NodeListItem.vue'
import type { NodeType } from '@/types/common'

const nodeTypesStore = useNodeTypesStore()

const emit = defineEmits({
  'node-type-selected': (nodeType: NodeType) => true,
})
</script>

<template>
  <div :class="$style.container">
    <ul :class="$style['node-types-list']">
      <NodeTypeItem
        v-for="nodeType in nodeTypesStore.allNodeTypes"
        :key="nodeType.id"
        :node-type="nodeType"
        @click="emit('node-type-selected', nodeType)"
      />
    </ul>
  </div>
</template>

<style module lang="scss">
.container {
  padding: 1em;
  border: 1px solid $color_medium;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  position: absolute;
  top: 80px;
}

.node-types-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}
</style>
