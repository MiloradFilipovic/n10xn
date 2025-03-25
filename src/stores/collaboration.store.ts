import type { CollaborationUser, User } from '@/types/canvas'
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
    return canvasStore.currentDiagram
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
    // Init current diagram metadata
    const yMetadata = document.value.getMap('metadata')
    if (!yMetadata.get('name')) {
      yMetadata.set('name', currentDiagram.value.name)
    }
    // React to metadata changes
    yMetadata.observe(event => {
      event.changes.keys.forEach((change, key) => {
        if (key === 'name' && change.action === 'update') {
          const name = yMetadata.get('name') as string
          if (name) {
            canvasStore.renameCurrentDiagram(yMetadata.get('name') as string);
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
  }
})
