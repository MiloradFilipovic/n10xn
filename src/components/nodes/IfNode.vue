<script setup lang="ts">
import type { NodeProps } from '@vue-flow/core'
import { Position, Handle } from '@vue-flow/core'
import { defineProps } from 'vue'

defineProps<NodeProps>()
</script>

<template>
  <div>
    <div>{{ data.name }}</div>
    <Handle type="target" :position="Position.Left" />
    <Handle id="source-true" type="source" :position="Position.Right" style="top: 20px" />
    <Handle
      id="source-false"
      type="source"
      :position="Position.Right"
      style="bottom: 20px; top: auto"
    />
  </div>
</template>
