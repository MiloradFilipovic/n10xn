<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted } from 'vue'
import { useNodeTypesStore } from '@/stores/nodeTypes.store'
import type { NodeType } from '@/types/common'
import type { Edge } from '@vue-flow/core'

type Props = {
  visible: boolean
  position: { x: number; y: number }
  edge: Edge | null
}

type Emits = {
  close: []
  'node-type-selected': [nodeType: NodeType, edge: Edge]
}

const props = defineProps<Props>()
const emit = defineEmits<Emits>()

const nodeTypesStore = useNodeTypesStore()
const menuRef = ref<HTMLElement>()

const availableNodeTypes = computed(() => {
  return Object.values(nodeTypesStore.allNodeTypes).filter((nodeType) => {
    return nodeType.type !== 'trigger';
  })
})

const handleNodeTypeSelect = (nodeType: NodeType) => {
  if (props.edge) {
    emit('node-type-selected', nodeType, props.edge)
  }
  emit('close')
}

const handleClickOutside = (event: MouseEvent) => {
  if (menuRef.value && !menuRef.value.contains(event.target as Node)) {
    emit('close')
  }
}

const handleEscape = (event: KeyboardEvent) => {
  if (event.key === 'Escape') {
    emit('close')
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleEscape)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleEscape)
})
</script>

<template>
  <div
    v-if="visible"
    ref="menuRef"
    :class="$style['context-menu']"
    :style="{
      left: position.x + 'px',
      top: position.y + 'px',
    }"
  >
    <div :class="$style['menu-header']">Add Node</div>
    <div
      v-for="nodeType in availableNodeTypes"
      :key="nodeType.id"
      :class="$style['menu-item']"
      @click="handleNodeTypeSelect(nodeType)"
    >
      <font-awesome-icon :icon="nodeType.icon" :class="$style['node-icon']" />
      <div :class="$style['node-info']">
        <div :class="$style['node-name']">{{ nodeType.name }}</div>
        <div :class="$style['node-description']">{{ nodeType.description }}</div>
      </div>
    </div>
  </div>
</template>

<style module lang="scss">
.context-menu {
  position: fixed;
  background: #fff;
  border: 1px solid $color_medium;
  border-radius: 4px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 1000;
  min-width: 250px;
  max-width: 300px;
  padding: 0.5em 0;
}

.menu-header {
  padding: 0.5em 1em;
  color: $color_primary;
  border-bottom: 1px solid $color_medium;
}

.menu-item {
  display: flex;
  align-items: center;
  padding: 12px 16px;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: #f5f5f5;
  }
}

.node-icon {
  font-size: 16px;
  color: $color_medium;
  margin-right: 12px;
  width: 16px;
  text-align: center;
}

.node-info {
  flex: 1;
}

.node-name {
  font-weight: 500;
  color: $color_primary;
  margin-bottom: 2px;
}

.node-description {
  font-size: 12px;
  color: $color_medium;
  line-height: 1.3;
}
</style>