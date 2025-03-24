import type { CollaborationUser, User } from '@/types/canvas'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import * as Y from 'yjs'
import { createYjsProvider, YSweetProvider } from '@y-sweet/client'
import { useUsersStore } from './users.store'

export const Y_SWEET_AUTH_ENDPOINT = '/.netlify/functions/ysweet-auth'

export const useCollaborationStore = defineStore('COLLABORATION_STORE', () => {
  const usersStore = useUsersStore()

  const usersInSession = ref<Record<number, CollaborationUser>>({})
  const cursorPosition = ref<{ x: number; y: number } | null>(null)
  const clientId = ref<number | null>(null)

  const document = ref<Y.Doc | null>(null)
  const provider = ref<YSweetProvider | null>(null)

  const currentUser = computed(() => {
    return usersInSession.value[clientId.value || 0]
  })

  const otherUsers = computed(() => {
    return Object.values(usersInSession.value).filter((user) => user.clientId !== clientId.value)
  })

  const initRoom = (roomId: string) => {
    usersInSession.value = []
    document.value = new Y.Doc()
    provider.value = createYjsProvider(document.value, roomId, Y_SWEET_AUTH_ENDPOINT)

    provider.value.awareness.on('change', handleAwarenessChange)
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
          }
        }
      })
    }
    usersInSession.value = users
  }

  const joinSession = () => {
    const currentUser = usersStore.currentUser
    if (currentUser) {
      addUserToSession(currentUser)
    }
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
      cursorPosition: { x: 0, y: 0 },
    })
  }

  const setCursorPosition = (position: { x: number; y: number }) => {
    cursorPosition.value = position
    const currentState = provider.value?.awareness.getLocalState() || {}

    provider.value?.awareness.setLocalState({
      ...currentState,
      cursorPosition: position,
    })
  }

  const leaveSession = () => {
    provider.value?.awareness.setLocalState(null)
  }

  return {
    usersInSession,
    document,
    provider,
    initRoom,
    addUserToSession,
    joinSession,
    leaveSession,
    setCursorPosition,
    currentUser,
    otherUsers,
  }
})
