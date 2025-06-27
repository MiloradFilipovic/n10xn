import type { CollaborationUser, Connection, Node, User } from '@/types/canvas'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import * as Y from 'yjs'
import { createYjsProvider, YSweetProvider } from '@y-sweet/client'
import { useUsersStore } from './users.store'
import { useCanvasStore } from './canvas.store'

export const Y_SWEET_AUTH_ENDPOINT = '/.netlify/functions/ysweet-auth'

export const useCollaborationStore = defineStore('COLLABORATION_STORE', () => {
  const usersStore = useUsersStore()
  const canvasStore = useCanvasStore()

  const usersInSession = ref<Record<number, CollaborationUser>>({})
  const cursorPosition = ref<{ x: number; y: number } | null>(null)
  const clientId = ref<number | null>(null)

  const document = ref<Y.Doc | null>(null)
  const provider = ref<YSweetProvider | null>(null)

  const currentUser = computed(() => {
    return usersInSession.value[clientId.value || 0]
  })

  const currentDiagram = computed(() => {
    return canvasStore.currentDiagram()
  })

  const otherUsers = computed(() => {
    return Object.values(usersInSession.value).filter((user) => user.clientId !== clientId.value)
  })

  const otherUserCurrentlyEditingDiagramName = computed(() => {
    return Object.values(usersInSession.value).find((user) => user.isEditingDiagramName && user.clientId !== clientId.value)
  })

  const initSession = (roomId: string) => {
    usersInSession.value = []
    document.value = new Y.Doc()
    provider.value = createYjsProvider(document.value, roomId, Y_SWEET_AUTH_ENDPOINT)

    provider.value.awareness.on('change', handleAwarenessChange)

    if (!currentDiagram.value) return
    
    // Init current diagram metadata and nodes
    // TODO: Check if this is needed
    const yMetadata = document.value.getMap('metadata')
    if (!yMetadata.get('name')) {
      yMetadata.set('name', currentDiagram.value.name)
    }

    const yNodes = document.value.getMap('nodes')
    const yConnections = document.value.getMap('connections')
    if (otherUsers.value.length === 0 && yNodes.size === 0) {
      currentDiagram.value.nodes.forEach((node) => {
        yNodes.set(node.id, node)
      })
      currentDiagram.value.connections.forEach((connection) => {
        yConnections.set(connection.id, connection)
      })
    }

    // React to node changes
    yNodes.observe(event => {
      // Only react to changes by other users
      // TODO: Check if this is working
      if (event.transaction.origin === provider.value?.awareness.clientID) return
      event.changes.keys.forEach((change, key) => {
        if (change.action === 'update') { 
          const node = yNodes.get(key) as Node
          if (node) {
            // Find the node in the current diagram and replace it
            // TODO: This can be more optimized by fine graining the updates
            if (currentDiagram.value) {
              const index = currentDiagram.value.nodes.findIndex((n) => n.id === key)
              if (index !== undefined && index !== -1) {
                currentDiagram.value.nodes[index] = node
              }
            }
          }
        } else if (change.action === 'add') {
          const node = yNodes.get(key) as Node
          if (!node || !node.id) return
          // Add the new node to the current diagram
          if (currentDiagram.value) {
            const index = currentDiagram.value.nodes.findIndex((n) => n.id === key)
            if (index === -1) {
              currentDiagram.value.nodes.push(node)
            }
          }
        } else if (change.action === 'delete') {
          // Remove the node from the current diagram
          if (currentDiagram.value) {
            const index = currentDiagram.value.nodes.findIndex((n) => n.id === key)
            if (index !== -1) {
              currentDiagram.value.nodes.splice(index, 1)
            }
          }
        }
      })
    })

    // React to connection changes
    yConnections.observe(event => {
      // Only react to changes by other users
      if (event.transaction.origin === provider.value?.awareness.clientID) return
      event.changes.keys.forEach((change, key) => {
        if (change.action === 'update') {
          const connection = yConnections.get(key) as Connection
          if (connection) {
            // Find the connection in the current diagram and replace it
            if (currentDiagram.value) {
              const index = currentDiagram.value.connections.findIndex((c) => c.id === key)
              if (index !== undefined && index !== -1) {
                currentDiagram.value.connections[index] = connection
              }
            }
          }
        } else if (change.action === 'add') {
          const connection = yConnections.get(key) as Connection
          if (!connection || !connection.id) return
          // Add the new connection to the current diagram
          if (currentDiagram.value) {
            const index = currentDiagram.value.connections.findIndex((c) => c.id === key)
            if (index === -1) {
              currentDiagram.value.connections.push(connection)
            }
          }
        } else if (change.action === 'delete') {
          // Remove the connection from the current diagram
          if (currentDiagram.value) {
            const index = currentDiagram.value.connections.findIndex((c) => c.id === key)
            if (index !== -1) {
              currentDiagram.value.connections.splice(index, 1)
            }
          }
        }
      })
    })

    // React to metadata changes
    yMetadata.observe(event => {
      event.changes.keys.forEach((change, key) => {
        if (change.action === 'update') {
          switch (key) {
            case 'name':
              const name = yMetadata.get('name') as string
              if (name) {
                canvasStore.renameCurrentDiagram(yMetadata.get('name') as string);
              }
              break
            case 'updatedAt':
              const updatedAt = yMetadata.get('updatedAt') as string
              if (updatedAt) {
                canvasStore.setUpdatedAt(yMetadata.get('updatedAt') as string);
              }
          }
        }
      })
    })
  }

  const joinSession = () => {
    const currentUser = usersStore.currentUser
    if (currentUser) {
      addUserToSession(currentUser)
    }
  }

  const destroySession = () => {
    leaveSession()
    provider.value?.awareness.off('change', handleAwarenessChange)
    provider.value?.destroy()
    document.value?.destroy()
  }

  const handleAwarenessChange = () => {
    const states = provider.value?.awareness.getStates()
    const users: Record<number, CollaborationUser> = {}

    if (states) {
      Array.from(states.entries()).forEach(([clientId, state]) => {
        if (state.user && state.cursorPosition !== undefined) {
          users[clientId] = {
            clientId,
            ...state.user,
            cursorPosition: state.cursorPosition,
            isEditingDiagramName: state.isEditingDiagramName,
          }
        }
      })
    }
    usersInSession.value = users
  }

  const addUserToSession = (user: User) => {
    if (!provider.value) return

    const randomColor = Math.floor(Math.random() * 16777215).toString(16)

    clientId.value = provider.value.awareness.clientID

    provider.value.awareness.setLocalState({
      user: {
        username: user.username,
        firstName: user.firstName,
        lastName: user.lastName,
        color: randomColor,
      },
      isEditingDiagramName: false,
      cursorPosition: { x: 0, y: 0 },
    })
  }

  const leaveSession = () => {
    provider.value?.awareness.setLocalState(null)
  }

  // TODO: Add better typing for local awareness state
  const setCursorPosition = (position: { x: number; y: number }) => {
    cursorPosition.value = position
    const currentState = provider.value?.awareness.getLocalState() || {}

    provider.value?.awareness.setLocalState({
      ...currentState,
      cursorPosition: position,
    })
  }

  const setEditingDiagramName = (isEditing: boolean) => {
    const currentState = provider.value?.awareness.getLocalState() || {}
    provider.value?.awareness.setLocalState({
      ...currentState,
      isEditingDiagramName: isEditing,
    })
  }

  const notifyDiagramNameChange = (name: string) => {
    const yMetadata = document.value?.getMap('metadata')
    yMetadata?.set('name', name)
    yMetadata?.set('updatedAt', new Date().toISOString())
  }

  const notifyNodesMoved = (nodes: Array<{ id: string; position: { x: number; y: number } }>) => {
    const yNodes = document.value?.getMap('nodes')
    // Package all updates in a single transaction
    document.value?.transact(() => {
      nodes.forEach(({ id, position }) => { 
        const node = yNodes?.get(id) as Node
        if (node) {
          node.position = position
          yNodes?.set(id, node)
        }
      }) 
    })
  }

  const notifyNodeAdded = (node: Node) => {
    const yNodes = document.value?.getMap('nodes')
    yNodes?.set(node.id, node)
  }

  const notifyNodeDeleted = (nodeId: string) => {
    const yNodes = document.value?.getMap('nodes')
    yNodes?.delete(nodeId)
  }

  const notifyConnectionAdded = (connection: Connection) => {
    const yConnections = document.value?.getMap('connections')
    yConnections?.set(connection.id, connection)
  }

  const notifyConnectionDeleted = (connectionId: string) => {
    const yConnections = document.value?.getMap('connections')
    yConnections?.delete(connectionId)
  }

  return {
    usersInSession,
    document,
    provider,
    initSession,
    addUserToSession,
    joinSession,
    destroySession,
    leaveSession,
    setCursorPosition,
    currentUser,
    otherUsers,
    otherUserCurrentlyEditingDiagramName,
    setEditingDiagramName,
    notifyDiagramNameChange,
    notifyNodeAdded,
    notifyNodesMoved,
    notifyNodeDeleted,
    notifyConnectionAdded,
    notifyConnectionDeleted,
  }
})
