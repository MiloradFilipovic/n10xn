<script setup lang="ts">
import { useCollaborationStore } from '@/stores/collaboration.store'
import type { Diagram } from '@/types/canvas'
import { onClickOutside } from '@vueuse/core'
import { computed, nextTick, ref, useTemplateRef } from 'vue'

type Props = {
  name: string
}

const props = defineProps<Props>()

const emit = defineEmits({
  'diagram-name-updated': (newName: string) => true,
})

const collaborationStore = useCollaborationStore()

const editMode = ref(false)
const nameInput = useTemplateRef<HTMLInputElement>('nameInput')

const otherUserCurrentlyEditingDiagramName = computed(() => {
  return collaborationStore.otherUserCurrentlyEditingDiagramName;
})

onClickOutside(nameInput, (event) => (switchToLabelMode()))

const switchToEditMode = () => {
  if (otherUserCurrentlyEditingDiagramName.value !== undefined) {
    return
  }
  
  editMode.value = true
  collaborationStore.setEditingDiagramName(true)
  nextTick(() => {
    if (nameInput.value) {
      nameInput.value.focus()
      nameInput.value.select()
    }
  })
}

const switchToLabelMode = () => {
  editMode.value = false
  collaborationStore.setEditingDiagramName(false)
  if (nameInput.value && nameInput.value.value !== '') {
    emit('diagram-name-updated', nameInput.value.value)
  }
}
</script>

<template>
  <div :class="$style.container" :title="otherUserCurrentlyEditingDiagramName ? `Currently being edited by ${otherUserCurrentlyEditingDiagramName.username}` : ''">
    <div v-if="!editMode" :class="{[$style.label]: true, [$style.disabled]: otherUserCurrentlyEditingDiagramName !== undefined}" @click="switchToEditMode">
      {{ props.name }}
    </div>
    <input
      v-else
      ref="nameInput"
      :class="$style['name-input']"
      :value="props.name"
      tabindex="0"
      :disabled="otherUserCurrentlyEditingDiagramName !== undefined"
      @keydown.enter="switchToLabelMode"
    />
  </div>
</template>

<style module lang="scss">
.container {
  color: $color_primary;
}

.label {
  cursor: pointer;

  &.disabled {
    cursor: not-allowed;
  }
}

.name-input {
  border: none;
  outline: none;
  font-size: 1em;
  color: $color_primary;
  background-color: transparent;
  border-bottom: 1px solid $color_primary;
}
</style>
