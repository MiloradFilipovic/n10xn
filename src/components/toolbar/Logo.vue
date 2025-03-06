<script lang="ts" setup>
type Props = {
  size?: 'small' | 'medium' | 'large'
}

withDefaults(defineProps<Props>(), {
  size: 'medium',
})
</script>
<template>
  <div :class="[$style.container, $style[size]]">
    <span :class="$style.n">n</span>
    <span :class="$style.tenX">10x</span>
    <span :class="$style.n">n</span>
  </div>
</template>
<style module lang="scss">
.container {
  display: flex;
  position: relative;
  bottom: 2px;
  font-weight: bold;
  align-content: center;
  color: $color_dark;

  &.small {
    font-size: 1.4em;
    .tenX {
      padding: 2px;
    }

    .n {
      padding: 2px;
    }
  }
  &.medium {
    font-size: 2em;
  }
  &.large {
    font-size: 3em;
  }
}

.tenX {
  background-color: $color_primary;
  color: $color_light;
  border-radius: 4px;
}
</style>
