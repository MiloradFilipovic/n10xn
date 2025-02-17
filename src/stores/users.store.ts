import type { User } from '@/types/canvas'
import { USERS } from '../../db/users'
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUsersStore = defineStore('USERS_STORE', () => {
  const allUsers = ref<Record<string, User>>({})
  const currentUserId = ref<string | null>(null)

  const init = () => {
    loadUsers()
  }

  const loadUsers = () => {
    USERS.forEach((user) => {
      allUsers.value[user.id] = user
    })
  }

  const getById = (id: string) => {
    return allUsers.value[id]
  }

  const currentUser = () => {
    if (!currentUserId.value) return null
    return getById(currentUserId.value)
  }

  return {
    init,
    allUsers,
    currentUserId,
    loadUsers,
    getById,
    currentUser,
  }
})
