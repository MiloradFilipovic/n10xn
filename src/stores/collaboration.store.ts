import type { CollaborationUser, User } from '@/types/canvas'
import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as Y from 'yjs'
import { createYjsProvider, YSweetProvider } from '@y-sweet/client'

export const Y_SWEET_AUTH_ENDPOINT = '/.netlify/functions/ysweet-auth'

export const useCollaborationStore = defineStore('COLLABORATION_STORE', () => {
  const usersInSession = ref<CollaborationUser[]>([])
  const cursorPosition = ref<{ x: number; y: number } | null>(null)

  const document = ref<Y.Doc | null>(null)
  const provider = ref<YSweetProvider | null>(null)

  const initRoom = (roomId: string) => {
    usersInSession.value = []
    document.value = new Y.Doc()
    provider.value = createYjsProvider(document.value, roomId, Y_SWEET_AUTH_ENDPOINT)

    const awareness = provider.value.awareness

    awareness.on('change', () => {
      const values = Array.from(awareness.getStates().values())
      for (const value of values) {
        const user = value.user as CollaborationUser
        if (user) {
          if (user.status === 'online') {
            const existingUserIndex = usersInSession.value.findIndex((u) => u.id === user.id)
            if (existingUserIndex !== -1) {
              usersInSession.value[existingUserIndex] = user
            } else {
              usersInSession.value.push(user)
            }
          } else if (user.status === 'offline') {
            usersInSession.value = usersInSession.value.filter((u) => u.id !== user.id)
          }
        }
      }
    })
  }

  const addUserToSession = (user: User) => {
    const randomColor = Math.floor(Math.random() * 16777215).toString(16)
    provider.value?.awareness.setLocalStateField('user', {
      ...user,
      status: 'online',
      color: randomColor,
    })
  }

  const setCursorPosition = (user: User, position: { x: number; y: number }) => {
    cursorPosition.value = position
    provider.value?.awareness.setLocalStateField('user', {
      ...user,
      status: 'online',
      cursorPosition: position,
    })
  }

  const removeUserFromSession = (user: User) => {
    provider.value?.awareness.setLocalStateField('user', {
      ...user,
      status: 'offline',
      color: null,
    })
  }

  return {
    usersInSession,
    document,
    provider,
    initRoom,
    addUserToSession,
    removeUserFromSession,
    setCursorPosition,
  }
})
