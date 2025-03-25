<script setup lang="ts">
import { useNodeTypesStore } from '@/stores/nodeTypes.store'
import NodeTypeItem from '@/components/nodeSidebar/NodeListItem.vue'
import type { NodeType } from '@/types/common'
import { useUsersStore } from '@/stores/users.store'
import { useRouter } from 'vue-router'
import { useCollaborationStore } from '@/stores/collaboration.store'

const router = useRouter()

const nodeTypesStore = useNodeTypesStore()
const usersStore = useUsersStore()
const collaborationStore = useCollaborationStore()

const emit = defineEmits({
  'node-type-selected': (nodeType: NodeType) => true,
})

const onLogoutClick = () => {
  collaborationStore.destroySession()
  usersStore.logout()
  router.push('/')
}
</script>

<template>
  <div :class="$style.container">
    <ul :class="$style['node-types-list']">
      <NodeTypeItem
        v-for="nodeType in nodeTypesStore.allNodeTypes"
        :key="nodeType.id"
        :node-type="nodeType"
        @click="emit('node-type-selected', nodeType)"
      />
    </ul>
    <div :class="$style['footer']">
      <div :class="$style['footer-item']">
        <router-link to="/home"><font-awesome-icon icon="home" size="l" fixed-width /></router-link>
      </div>
      <div :class="$style['footer-item']" @click="onLogoutClick">
        <font-awesome-icon icon="arrow-right-from-bracket" size="l" fixed-width />
      </div>
    </div>
  </div>
</template>

<style module lang="scss">
.container {
  padding: 1em;
  border: 1px solid $color_medium;
  border-radius: 4px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  background-color: #fff;
  position: absolute;
  top: 80px;
}

.node-types-list {
  list-style: none;
  padding: 0;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5em;
}

.footer {
  display: flex;
  padding-top: 2em;
}

.footer-item {
  cursor: pointer;
  padding: 0.5em;
  border-radius: 4px;
  transition: background-color 0.2s;

  a {
    color: inherit;
  }

  &:hover {
    background-color: $color_light;
  }
}
</style>
