import type { NodeType } from '@/types/common'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { NODE_TYPES } from '../../db/nodeTypes'

export const useNodeTypesStore = defineStore('NODE_TYPES_STORE', () => {
  const allNodeTypes = ref<Record<string, NodeType>>({})
  const selectedNodeType = ref<string | null>(null)

  const init = () => {
    loadNodeTypes()
  }

  const loadNodeTypes = () => {
    NODE_TYPES.forEach((nodeType) => {
      allNodeTypes.value[nodeType.id] = nodeType
    })
  }

  const getById = (id: string) => {
    return allNodeTypes.value[id]
  }

  return {
    init,
    allNodeTypes,
    selectedNodeType,
    loadNodeTypes,
    getById,
  }
})
