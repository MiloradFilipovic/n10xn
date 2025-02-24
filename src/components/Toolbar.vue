<script setup lang="ts">
import type { Node } from '@/types/canvas'
import { useCanvasStore } from '../stores/canvas.store'
import { computed } from 'vue'
import { useUsersStore } from '@/stores/users.store'
import Logo from './Logo.vue'

const canvasStore = useCanvasStore()
const usersStore = useUsersStore()

const currentUser = computed(() => usersStore.currentUser())
const currentDiagram = computed(() => canvasStore.currentDiagram())
</script>

<template>
  <div :class="$style.toolbar">
    <div :class="$style.controls">
      <div :class="$style.logo">
        <Logo />
        <div v-if="currentDiagram">{{ currentDiagram.name }}</div>
      </div>
    </div>
    <div :class="$style.user">
      <div :class="$style.avatar">
        {{ currentUser?.firstName.charAt(0) }}{{ currentUser?.lastName.charAt(0) }}
      </div>
      <div>{{ currentUser?.firstName }} {{ currentUser?.lastName }}</div>
    </div>
  </div>
</template>

<style module lang="scss">
.toolbar {
  display: flex;
  gap: 1em;
  padding: 1em;
  border: 1px solid #ccc;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  align-items: center;
  justify-content: space-between;
}

.controls {
  display: flex;
  gap: 1em;
}

.logo {
  display: flex;
  gap: 0.5em;
  align-items: center;
}

.user {
  display: flex;
  gap: 1em;
  align-items: center;
}

.avatar {
  width: 30px;
  height: 30px;
  font-size: 0.8em;
  border-radius: 50%;
  background-color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
