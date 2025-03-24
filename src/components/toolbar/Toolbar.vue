<script setup lang="ts">
import { useCanvasStore } from '../../stores/canvas.store'
import { computed } from 'vue'
import { useUsersStore } from '@/stores/users.store'
import Logo from '@/components/toolbar/Logo.vue'
import DiagramName from './DiagramName.vue'
import { useCollaborationStore } from '@/stores/collaboration.store'
import type { CollaborationUser } from '@/types/canvas'
import UserStack from './UserStack.vue'

const canvasStore = useCanvasStore()
const usersStore = useUsersStore()
const collaborationStore = useCollaborationStore()

const currentUser = computed(() => usersStore.currentUser)
const currentDiagram = computed(() => canvasStore.currentDiagram())

const otherUsers = computed<CollaborationUser[]>(() => {
  return collaborationStore.otherUsers
})
</script>

<template>
  <div :class="$style.toolbar">
    <div :class="$style.controls">
      <div :class="$style['main-content']">
        <Logo size="small" />
        <DiagramName
          v-if="currentDiagram"
          :name="currentDiagram.name"
          @diagram-name-updated="canvasStore.renameCurrentDiagram"
        />
      </div>
    </div>
    <UserStack />
  </div>
</template>

<style module lang="scss">
.toolbar {
  display: flex;
  gap: 1em;
  padding: 0.6em 1em;
  border: 1px solid $color_medium;
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

.main-content {
  display: flex;
  gap: 0.5em;
  align-items: center;
}
</style>
