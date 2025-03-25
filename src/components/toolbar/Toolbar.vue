<script setup lang="ts">
import { useCanvasStore } from '../../stores/canvas.store'
import { computed } from 'vue'
import Logo from '@/components/toolbar/Logo.vue'
import DiagramName from './DiagramName.vue'
import UserStack from './UserStack.vue'
import { useCollaborationStore } from '@/stores/collaboration.store'

const canvasStore = useCanvasStore()
const collaborationStore = useCollaborationStore()

const currentDiagram = computed(() => canvasStore.currentDiagram())

const renameDiagram = (newName: string) => {
  canvasStore.renameCurrentDiagram(newName)
  collaborationStore.notifyDiagramNameChange(newName)
}
</script>

<template>
  <div :class="$style.toolbar">
    <div :class="$style.controls">
      <div :class="$style['main-content']">
        <router-link to="/home">
          <Logo size="small" />
        </router-link>
        <DiagramName
          v-if="currentDiagram"
          :name="currentDiagram.name"
          @diagram-name-updated="renameDiagram"
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

  a {
    text-decoration: none;
  }
}
</style>
