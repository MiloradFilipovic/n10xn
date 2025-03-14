<script setup lang="ts">
import type { Diagram } from '@/types/canvas'
import { computed } from 'vue'

type Props = {
  diagram: Diagram
}

const props = defineProps<Props>()

const timeAgo = computed(() => {
  const date = new Date(props.diagram.updatedAt)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  const seconds = Math.floor(diff / 1000)
  const minutes = Math.floor(seconds / 60)
  const hours = Math.floor(minutes / 60)
  const days = Math.floor(hours / 24)
  const weeks = Math.floor(days / 7)
  const months = Math.floor(weeks / 4)
  const years = Math.floor(months / 12)

  if (years > 0) {
    return `${years} year${years > 1 ? 's' : ''} ago`
  } else if (months > 0) {
    return `${months} month${months > 1 ? 's' : ''} ago`
  } else if (weeks > 0) {
    return `${weeks} week${weeks > 1 ? 's' : ''} ago`
  } else if (days > 0) {
    return `${days} day${days > 1 ? 's' : ''} ago`
  } else if (hours > 0) {
    return `${hours} hour${hours > 1 ? 's' : ''} ago`
  } else if (minutes > 0) {
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`
  } else {
    return `${seconds} second${seconds > 1 ? 's' : ''} ago`
  }
})

const triggerNode = computed(() => {
  const trigger = props.diagram.nodes.find((node) => node.type === 'trigger')
  switch (trigger?.nodeType) {
    case 'manual-trigger':
      return 'Triggered Manually'
    case 'cron-trigger':
      return 'Triggered on Schedule'
    default:
      return 'No trigger node'
  }
})
</script>

<template>
  <div :class="$style['diagram-card']">
    <router-link :to="{ name: 'canvas', params: { id: props.diagram.id } }">
      <div :class="$style['card-body']">
        <h5 :class="$style['card-title']">{{ props.diagram.name }}</h5>
        <div :class="$style['card-meta']">
          <span v-if="triggerNode">{{ triggerNode }}</span>
          <span v-else>Triggered by User</span>
          <span>Last updated {{ timeAgo }}</span>
        </div>
      </div>
    </router-link>
  </div>
</template>

<style lang="scss" module>
.diagram-card {
  padding: 0.5em;
  border: 1px solid $color_medium;
  border-radius: 4px;
  background-color: #fff;

  &:hover {
    cursor: pointer;
    background-color: $color_light;
  }

  a {
    text-decoration: none;
    color: inherit;
  }
}

.card-body {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.card-title {
  margin: 0;
  font-weight: normal;
  color: $color_primary;
}

.card-meta {
  font-size: 0.8em;
  color: $color_medium;
  display: flex;

  span + span {
    &::before {
      content: '|';
      margin: 0 0.5em;
    }
  }
}
</style>
