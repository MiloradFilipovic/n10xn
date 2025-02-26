import type { Connection, Diagram, Node } from '@/types/canvas'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { DIAGRAMS } from '../../db/diagrams'
import type { NodeType } from '@/types/common'
import { useUsersStore } from './users.store'

export const useCanvasStore = defineStore('CANVAS_STORE', () => {
  const allDiagrams = ref<Record<string, Diagram>>({})
  const currentDiagramId = ref<string | null>(null)
  const selectedNodes = ref<string[]>([])
  const selectedConnections = ref<string[]>([])

  const init = () => {
    loadDiagrams()
  }

  const loadDiagrams = () => {
    DIAGRAMS.forEach((diagram) => {
      allDiagrams.value[diagram.id] = diagram
    })
  }

  const createNewDiagram = (name: string, authorId: string) => {
    const newDiagramId = new Date().getTime().toString()
    const newDiagram: Diagram = {
      id: newDiagramId,
      name,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      deleted: false,
      authorId,
      nodes: [],
      connections: [],
    }
    allDiagrams.value[newDiagramId] = newDiagram
    currentDiagramId.value = newDiagramId
  }

  const getById = (id: string) => {
    return allDiagrams.value[id]
  }

  const currentDiagram = () => {
    if (!currentDiagramId.value) return null
    return getById(currentDiagramId.value)
  }

  const addNode = (nodeType: NodeType, position?: { x: number; y: number }) => {
    const diagram = currentDiagram()
    if (!diagram) return

    const newNodeName = `${nodeType.name} ${diagram.nodes.length + 1}`
    const newNode: Node = {
      id: new Date().getTime().toString(),
      type: nodeType.type,
      position: position || { x: 10, y: 10 },
      data: {
        ...nodeType.parameters,
        name: newNodeName,
      },
    }

    diagram.nodes.push(newNode)
  }

  const addConnection = (connection: Connection) => {
    const diagram = currentDiagram()
    if (!diagram) return

    diagram.connections.push(connection)
  }

  const removeNode = (nodeId: string) => {
    const diagram = currentDiagram()
    if (!diagram) return

    const index = diagram.nodes.findIndex((node) => node.id === nodeId)
    if (index === -1) return

    diagram.nodes.splice(index, 1)
  }

  const removeConnection = (connectionId: string) => {
    const diagram = currentDiagram()
    if (!diagram) return

    const index = diagram.connections.findIndex((connection) => connection.id === connectionId)
    if (index === -1) return

    diagram.connections.splice(index, 1)
  }

  const moveNode = (nodeId: string, position: { x: number; y: number }) => {
    const diagram = currentDiagram()
    if (!diagram) return

    const node = diagram.nodes.find((node) => node.id === nodeId)
    if (!node) return

    node.position = position
  }

  const removeSelectedNodes = () => {
    const diagram = currentDiagram()
    if (!diagram) return

    selectedNodes.value.forEach((nodeId) => {
      removeNode(nodeId)
    })
  }

  const removeSelectedConnections = () => {
    const diagram = currentDiagram()
    if (!diagram) return

    selectedConnections.value.forEach((connectionId) => {
      removeConnection(connectionId)
    })
  }

  const connectNodes = (fromNodeId: string, toNodeId: string) => {
    const diagram = currentDiagram()
    if (!diagram) return
    const connection: Connection = {
      id: `${fromNodeId}_${toNodeId}`,
      source: fromNodeId,
      target: toNodeId,
    }
    addConnection(connection)
  }

  return {
    allDiagrams,
    createNewDiagram,
    currentDiagramId,
    currentDiagram,
    init,
    getById,
    loadDiagrams,
    addNode,
    addConnection,
    removeNode,
    removeConnection,
    moveNode,
    selectedNodes,
    selectedConnections,
    removeSelectedNodes,
    removeSelectedConnections,
    connectNodes,
  }
})
