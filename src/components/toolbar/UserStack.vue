<script setup lang="ts">
import { useCollaborationStore } from '@/stores/collaboration.store'
import type { CollaborationUser } from '@/types/canvas'
import { computed } from 'vue'

const collaborationStore = useCollaborationStore()

const otherUsers = computed<CollaborationUser[]>(() => {
  return collaborationStore.otherUsers
})

const currentUser = computed(() => collaborationStore.currentUser)

const getContrastColor = (backgroundColor: string) => {
  let hex = backgroundColor.replace('#', '')
  let r = parseInt(hex.substring(0, 2), 16)
  let g = parseInt(hex.substring(2, 4), 16)
  let b = parseInt(hex.substring(4, 6), 16)

  const yiq = (r * 299 + g * 587 + b * 114) / 1000

  return yiq >= 128 ? '#000000' : '#ffffff'
}
</script>

<template>
  <div :class="$style.container">
    <div
      v-if="currentUser"
      :class="[$style.avatar, $style.currentUser]"
      :style="{
        backgroundColor: `#${currentUser.color}`,
        color: getContrastColor(`#${currentUser.color}`),
      }"
      :title="`${currentUser.firstName} ${currentUser.lastName}`"
    >
      {{ currentUser.firstName.charAt(0) }}{{ currentUser.lastName.charAt(0) }}
    </div>
    <div v-for="user in otherUsers" :key="user.id" :title="`${user.firstName} ${user.lastName}`">
      <div
        :class="[$style.avatar, $style.otherUser]"
        :style="{ backgroundColor: `#${user.color}`, color: getContrastColor(`#${user.color}`) }"
      >
        {{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}
      </div>
    </div>
  </div>
</template>

<style module lang="scss">
.container {
  display: flex;
}

.avatar {
  width: 20px;
  height: 20px;
  cursor: pointer;
  font-size: 0.6em;
  border-radius: 50%;
  background-color: #ccc;
  display: flex;
  align-items: center;
  justify-content: center;
}

.currentUser {
  border: 1px solid $color_primary;
  z-index: 1;
}

.otherUser {
  margin-left: -5px;
  opacity: 0.5;

  &:hover {
    opacity: 1;
  }
}
</style>
