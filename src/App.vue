<script setup lang="ts">
import { onMounted } from 'vue'
import { useNodeTypesStore } from './stores/nodeTypes.store'
import { useUsersStore } from './stores/users.store'
import { useCanvasStore } from './stores/canvas.store'

const usersStore = useUsersStore()
const nodeTypesStore = useNodeTypesStore()
const canvasStore = useCanvasStore()

onMounted(() => {
  usersStore.init()
  nodeTypesStore.init()
  canvasStore.init()
})
</script>
<template>
  <RouterView />
</template>
