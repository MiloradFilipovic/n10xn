<script setup lang="ts">
import Logo from '@/components/toolbar/Logo.vue'
import { Background } from '@vue-flow/background'
</script>

<template>
  <div :class="$style['diagram-list']">
    <Logo size="large" />
    <p>A less powerful, harder to pronounce but more expensive alternative to n8n</p>
    <RouterLink to="/diagram/new">Get started</RouterLink>
    <div :class="$style.background">
      <Background />
    </div>
  </div>
</template>

<style module lang="scss">
.diagram-list {
  padding: 5em 1em;
  display: flex;
  flex-direction: column;
  gap: 1em;
  align-items: center;
  justify-content: center;
}

.background {
  z-index: -1;
}
</style>
