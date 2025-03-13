import type { User } from '@/types/canvas'
import { USERS } from '../../db/users'
import { defineStore } from 'pinia'
import { computed, ref } from 'vue'

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

  const currentUser = computed(() => {
    if (!currentUserId.value) return null
    return getById(currentUserId.value)
  })

  const isLoggedIn = computed(() => !!currentUserId.value)

  const login = (email: string, password: string) => {
    const user = USERS.find((user) => user.email === email && user.password === password)
    if (!user) return false
    currentUserId.value = user.id
    return true
  }

  const logout = () => {
    currentUserId.value = null
  }

  return {
    init,
    allUsers,
    loadUsers,
    getById,
    currentUser,
    login,
    isLoggedIn,
    logout,
  }
})
