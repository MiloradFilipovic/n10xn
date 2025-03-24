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
      :style="{ zIndex: otherUsers.length + 1 }"
      :title="`${currentUser.firstName} ${currentUser.lastName}`"
    >
      {{ currentUser.firstName.charAt(0) }}{{ currentUser.lastName.charAt(0) }}
    </div>
    <div v-for="user, index in otherUsers" :key="user.id" :title="`${user.firstName} ${user.lastName}`">
      <div
        :class="[$style.avatar, $style.otherUser]"
        :style="{ backgroundColor: `#${user.color}`, color: getContrastColor(`#${user.color}`), zIndex: otherUsers.length - index }"
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
  display: flex;
  align-items: center;
  justify-content: center;
}

.currentUser {
  background-color: $color-dark;
  color: $color-light;
  font-weight: bold;
  z-index: 1;
}

.otherUser {
  position: relative;
  margin-left: -5px;
  opacity: 0.7;

  &:hover {
    opacity: 1;
  }
}
</style>
