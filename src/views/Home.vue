<script setup lang="ts">
import Logo from '@/components/toolbar/Logo.vue'
import { useCanvasStore } from '@/stores/canvas.store'
import { useUsersStore } from '@/stores/users.store'
import { Background } from '@vue-flow/background'
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'

const usersStore = useUsersStore()
const canvasStore = useCanvasStore()
const router = useRouter()

onMounted(() => {
  if (!usersStore.isLoggedIn) {
    router.push({ name: 'login' })
  }
})
</script>

<template>
  <div :class="$style['diagram-list']">
    <div :class="$style.header">
      <div :class="$style['main-content']">
        <Logo size="small" />
        <div>{{ usersStore.currentUser?.email }}</div>
      </div>
      <div :class="$style['buttons']">
        <button @click="router.push({ name: 'canvas', params: { id: 'new' } })">
          Create New Diagram
        </button>
      </div>
    </div>
    <div :class="$style.list">
      <div :class="$style.empty">No diagrams</div>
      <!-- <div v-if="Object.keys(canvasStore.allDiagrams).length === 0" :class="$style.empty">
        No diagrams
      </div> -->
      <!-- <div v-else>
        <div v-for="diagram in Object.values(canvasStore.allDiagrams)" :key="diagram.id">
          <router-link :to="{ name: 'canvas', params: { id: diagram.id } }">
            {{ diagram.name }}
          </router-link>
        </div>
      </div> -->
    </div>
    <div :class="$style.background">
      <Background />
    </div>
  </div>
</template>

<style module lang="scss">
.diagram-list {
  padding: 2em 1em;
  display: flex;
  flex-direction: column;
  gap: 1em;
  align-items: center;
  justify-content: center;
}

.background {
  z-index: -1;
}

.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 70%;
  padding: 1em;
  border-bottom: 1px solid $color_medium;
}

.main-content {
  display: flex;
  gap: 0.5em;
  align-items: center;
}

button {
  padding: 0.5em;
  border: none;
  border-radius: 4px;
  background-color: $color_primary;
  color: #fff;
  cursor: pointer;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 1em;
}

.empty {
  color: $color_medium;
  text-align: center;
  font-style: italic;
}
</style>
