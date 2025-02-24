import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useUIStore = defineStore('UI_STORE', () => {
  const lastClickedPosition = ref({ x: 400, y: 100 })

  return { lastClickedPosition }
})
