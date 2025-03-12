import type { Connection, Diagram, Node } from '@/types/canvas'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import { DIAGRAMS } from '../../db/diagrams'
import type { NodeType } from '@/types/common'
import { useUsersStore } from './users.store'
import type { Edge } from '@vue-flow/core'

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

    const newNodeName = `${getUniqueNodeName(nodeType)}`
    const newNode: Node = {
      id: new Date().getTime().toString(),
      type: nodeType.type,
      position: position || { x: 10, y: 10 },
      data: {
        ...nodeType.parameters,
        name: newNodeName,
        type: nodeType.id,
      },
    }

    diagram.nodes.push(newNode)
  }

  const getUniqueNodeName = (nodeType: NodeType) => {
    const diagram = currentDiagram()
    if (!diagram) return
    const otherNodesOfType = diagram.nodes.filter((node) => node.data.type === nodeType.id)
    if (otherNodesOfType.length === 0) return nodeType.name
    return `${nodeType.name} ${otherNodesOfType.length}`
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

  const connectNodes = (
    source: { id: string; handle?: string },
    target: { id: string; handle?: string },
  ) => {
    const diagram = currentDiagram()
    if (!diagram) return
    const connection: Connection = {
      id: `${source.id}_${target.id}`,
      sourceId: source.id,
      sourceHandle: source.handle,
      targetId: target.id,
      targetHandle: target.handle,
    }
    addConnection(connection)
  }

  const addNodeOnEdge = (nodeType: NodeType, edge: Edge, xPosition: number) => {
    const distance = 50
    const diagram = currentDiagram()
    if (!diagram) return
    const sourceNode = diagram.nodes.find((node) => node.id === edge.source)
    const targetNode = diagram.nodes.find((node) => node.id === edge.target)
    if (!sourceNode || !targetNode) return
    removeConnection(edge.id)
    const newNodeName = `${getUniqueNodeName(nodeType)}`
    const newNode: Node = {
      id: new Date().getTime().toString(),
      type: nodeType.type,
      position: {
        x: xPosition - distance,
        y: (sourceNode.position.y + targetNode.position.y) / 2,
      },
      data: {
        ...nodeType.parameters,
        name: newNodeName,
        type: nodeType.id,
      },
    }
    diagram.nodes.push(newNode)
    connectNodes({ id: sourceNode.id }, { id: newNode.id })
    connectNodes({ id: newNode.id }, { id: targetNode.id })
    // And we also want to push downstream nodes to the right by 100px
    diagram.nodes
      .filter((node) => node.position.x > newNode.position.x)
      .forEach((node) => {
        moveNode(node.id, { x: node.position.x + distance * 2, y: node.position.y })
      })
  }

  const renameCurrentDiagram = (name: string) => {
    const diagram = currentDiagram()
    if (!diagram) return
    diagram.name = name
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
    renameCurrentDiagram,
    addNodeOnEdge,
  }
})
