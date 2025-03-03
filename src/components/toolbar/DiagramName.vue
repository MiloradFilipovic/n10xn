<script setup lang="ts">
import type { Diagram } from '@/types/canvas'
import { onClickOutside } from '@vueuse/core'
import { nextTick, ref, useTemplateRef } from 'vue'

type Props = {
  diagram: Diagram
}

const props = defineProps<Props>()

const emit = defineEmits({
  'diagram-name-updated': (newName: string) => true,
})

const editMode = ref(false)
const nameInput = useTemplateRef<HTMLInputElement>('nameInput')

onClickOutside(nameInput, (event) => (editMode.value = false))

const switchToEditMode = () => {
  editMode.value = true
  nextTick(() => {
    if (nameInput.value) {
      nameInput.value.focus()
      nameInput.value.select()
    }
  })
}

const switchToLabelMode = () => {
  editMode.value = false
  if (nameInput.value) {
    emit('diagram-name-updated', nameInput.value.value)
  }
}
</script>

<template>
  <div :class="$style.container">
    <div v-if="!editMode" :class="$style.label" @click="switchToEditMode">
      {{ props.diagram.name }}
    </div>
    <input
      v-else
      ref="nameInput"
      :class="$style['name-input']"
      tabindex="0"
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
