<script setup lang="ts">
import { onMounted } from 'vue'
import { useNodeTypesStore } from './stores/nodeTypes.store'
import { useUsersStore } from './stores/users.store'

const usersStore = useUsersStore()
const nodeTypesStore = useNodeTypesStore()

onMounted(() => {
  usersStore.init()
  nodeTypesStore.init()
})
</script>
<template>
  <RouterView />
</template>
