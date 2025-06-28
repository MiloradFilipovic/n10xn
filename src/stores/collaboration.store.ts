import type { CollaborationUser, Connection, Node, User } from '@/types/canvas'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import * as Y from 'yjs'
import { createYjsProvider, YSweetProvider } from '@y-sweet/client'
import { useUsersStore } from './users.store'
import { useCanvasStore } from './canvas.store'

// Type for Y.js awareness state
interface AwarenessState {
  user?: {
    username: string
    firstName: string
    lastName: string
    color: string
  }
  cursorPosition?: { x: number; y: number }
  isEditingDiagramName?: boolean
}


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
    const yMetadata = document.value.getMap('metadata')
    const yNodes = document.value.getMap('nodes')
    const yConnections = document.value.getMap('connections')
    
    // Wait briefly for initial provider setup, then proceed with sync logic
    setTimeout(() => {
      // Only seed if this is the first user and there's no existing data
      const hasExistingData = yNodes.size > 0 || yConnections.size > 0 || yMetadata.get('name')
      const isFirstUser = Object.keys(usersInSession.value).length <= 1
      
      if (!hasExistingData && isFirstUser && currentDiagram.value) {
        try {
          document.value?.transact(() => {
            // Set metadata
            yMetadata.set('name', currentDiagram.value!.name)
            yMetadata.set('updatedAt', currentDiagram.value!.updatedAt)
            
            // Set nodes
            currentDiagram.value!.nodes.forEach((node) => {
              yNodes.set(node.id, { ...node })
            })
            
            // Set connections
            currentDiagram.value!.connections.forEach((connection) => {
              yConnections.set(connection.id, { ...connection })
            })
          }, 'initial-sync')
        } catch (error) {
          console.error('Error during initial sync:', error)
        }
      }
    }, 200) // Small delay to allow for initial awareness sync

    // React to node changes
    yNodes.observe(event => {
      // Only react to changes by other users (check for local transaction origins)
      if (event.transaction.local) return
      
      try {
        // Batch all changes to reduce DOM updates using Y.js event.changes.keys
        const updates: Node[] = []
        const additions: Node[] = []
        const deletions: string[] = []
        
        for (const [key, change] of event.changes.keys) {
          switch (change.action) {
            case 'update': {
              const node = yNodes.get(key) as Node
              if (node) updates.push(node)
              break
            }
            case 'add': {
              const node = yNodes.get(key) as Node
              if (node?.id) additions.push(node)
              break
            }
            case 'delete': {
              deletions.push(key)
              break
            }
          }
        }
        
        // Apply all changes in batch
        if (updates.length > 0) {
          updates.forEach(node => canvasStore.updateNodeFromRemote(node))
        }
        if (additions.length > 0) {
          additions.forEach(node => canvasStore.addNodeFromRemote(node))
        }
        if (deletions.length > 0) {
          deletions.forEach(nodeId => canvasStore.removeNodeFromRemote(nodeId))
        }
      } catch (error) {
        console.error('Error handling node changes:', error)
      }
    })

    // React to connection changes
    yConnections.observe(event => {
      if (event.transaction.local) return
      
      try {
        const updates: Connection[] = []
        const additions: Connection[] = []
        const deletions: string[] = []
        
        // Use Y.js optimized change detection
        for (const [key, change] of event.changes.keys) {
          switch (change.action) {
            case 'update': {
              const connection = yConnections.get(key) as Connection
              if (connection) updates.push(connection)
              break
            }
            case 'add': {
              const connection = yConnections.get(key) as Connection
              if (connection?.id) additions.push(connection)
              break
            }
            case 'delete': {
              deletions.push(key)
              break
            }
          }
        }
        
        // Apply all changes in batch
        if (updates.length > 0) {
          updates.forEach(connection => canvasStore.updateConnectionFromRemote(connection))
        }
        if (additions.length > 0) {
          additions.forEach(connection => canvasStore.addConnectionFromRemote(connection))
        }
        if (deletions.length > 0) {
          deletions.forEach(connectionId => canvasStore.removeConnectionFromRemote(connectionId))
        }
      } catch (error) {
        console.error('Error handling connection changes:', error)
      }
    })

    // React to metadata changes
    yMetadata.observe(event => {
      try {
        // Use Y.js optimized change detection for metadata
        for (const [key, change] of event.changes.keys) {
          if (change.action === 'update') {
            switch (key) {
              case 'name': {
                const name = yMetadata.get('name') as string
                if (name) {
                  canvasStore.renameCurrentDiagram(name)
                }
                break
              }
              case 'updatedAt': {
                const updatedAt = yMetadata.get('updatedAt') as string
                if (updatedAt) {
                  canvasStore.setUpdatedAt(updatedAt)
                }
                break
              }
            }
          }
        }
      } catch (error) {
        console.error('Error handling metadata changes:', error)
      }
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
    
    // Reset state
    usersInSession.value = {}
    cursorPosition.value = null
    clientId.value = null
  }

  const handleAwarenessChange = () => {
    try {
      const states = provider.value?.awareness.getStates()
      const users: Record<number, CollaborationUser> = {}

      if (states) {
        Array.from(states.entries()).forEach(([clientId, state]) => {
          const typedState = state as AwarenessState
          if (typedState.user && typedState.cursorPosition !== undefined) {
            users[clientId] = {
              clientId,
              id: clientId.toString(),
              ...typedState.user,
              status: 'online' as const,
              cursorPosition: typedState.cursorPosition,
              isEditingDiagramName: typedState.isEditingDiagramName || false,
            }
          }
        })
      }
      usersInSession.value = users
    } catch (error) {
      console.error('Error handling awareness change:', error)
    }
  }

  const addUserToSession = (user: User) => {
    if (!provider.value) return

    const randomColor = Math.floor(Math.random() * 16777215).toString(16)

    // Set clientId before updating awareness state
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
    } as AwarenessState)
  }

  const leaveSession = () => {
    provider.value?.awareness.setLocalState(null)
  }

  const setCursorPosition = (position: { x: number; y: number }) => {
    cursorPosition.value = position
    
    const currentState = (provider.value?.awareness.getLocalState() as AwarenessState) || {}
    provider.value?.awareness.setLocalState({
      ...currentState,
      cursorPosition: position,
    } as AwarenessState)
  }

  const setEditingDiagramName = (isEditing: boolean) => {
    const currentState = (provider.value?.awareness.getLocalState() as AwarenessState) || {}
    provider.value?.awareness.setLocalState({
      ...currentState,
      isEditingDiagramName: isEditing,
    } as AwarenessState)
  }

  const notifyDiagramNameChange = (name: string) => {
    const yMetadata = document.value?.getMap('metadata')
    try {
      document.value?.transact(() => {
        yMetadata?.set('name', name)
        yMetadata?.set('updatedAt', new Date().toISOString())
      }, 'diagram-name-change')
    } catch (error) {
      console.error('Error updating diagram name:', error)
    }
  }

  const notifyNodesMoved = (nodes: Array<{ id: string; position: { x: number; y: number } }>) => {
    const yNodes = document.value?.getMap('nodes')
    try {
      document.value?.transact(() => {
        nodes.forEach(({ id, position }) => { 
          const node = yNodes?.get(id) as Node
          if (node) {
            // Shallow copy the node and update its position (TODO: Will need to deep copy if adding more properties)
            const updatedNode = { ...node, position: { ...position } }
            yNodes?.set(id, updatedNode)
          }
        }) 
      }, 'nodes-move')
    } catch (error) {
      console.error('Error moving nodes:', error)
    }
  }

  const notifyNodeAdded = (node: Node) => {
    const yNodes = document.value?.getMap('nodes')
    try {
      document.value?.transact(() => {
        yNodes?.set(node.id, node)
      }, 'node-add')
    } catch (error) {
      console.error('Error adding node:', error)
    }
  }

  const notifyNodeDeleted = (nodeId: string) => {
    const yNodes = document.value?.getMap('nodes')
    try {
      document.value?.transact(() => {
        yNodes?.delete(nodeId)
      }, 'node-delete')
    } catch (error) {
      console.error('Error deleting node:', error)
    }
  }

  const notifyConnectionAdded = (connection: Connection) => {
    const yConnections = document.value?.getMap('connections')
    try {
      document.value?.transact(() => {
        yConnections?.set(connection.id, connection)
      }, 'connection-add')
    } catch (error) {
      console.error('Error adding connection:', error)
    }
  }

  const notifyConnectionDeleted = (connectionId: string) => {
    const yConnections = document.value?.getMap('connections')
    try {
      document.value?.transact(() => {
        yConnections?.delete(connectionId)
      }, 'connection-delete')
    } catch (error) {
      console.error('Error deleting connection:', error)
    }
  }

  const notifyNodeAddedOnEdge = (
    nodeToAdd: Node,
    connectionToRemove: string,
    connectionsToAdd: Connection[],
    nodesToMove: Array<{ id: string; position: { x: number; y: number } }>
  ) => {
    const yNodes = document.value?.getMap('nodes')
    const yConnections = document.value?.getMap('connections')
    
    try {
      document.value?.transact(() => {
        // Remove the original connection
        yConnections?.delete(connectionToRemove)
        
        // Add the new node
        yNodes?.set(nodeToAdd.id, nodeToAdd)
        
        // Add the new connections
        connectionsToAdd.forEach((connection) => {
          yConnections?.set(connection.id, connection)
        })
        
        // Move downstream nodes
        nodesToMove.forEach(({ id, position }) => {
          const node = yNodes?.get(id) as Node
          if (node) {
            const updatedNode = { ...node, position: { ...position } }
            yNodes?.set(id, updatedNode)
          }
        })
      }, 'node-add-on-edge')
    } catch (error) {
      console.error('Error adding node on edge:', error)
    }
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
    notifyNodeAddedOnEdge,
  }
})
