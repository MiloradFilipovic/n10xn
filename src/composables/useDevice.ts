import { ref } from 'vue'

export function useDevice() {
  const userAgent = ref(navigator.userAgent.toLowerCase())
  const isMacOs = ref(userAgent.value.includes('macintosh'))
  const controlKeyCode = ref(isMacOs.value ? 'Meta' : 'Control')

  return {
    userAgent,
    isMacOs,
    controlKeyCode,
  }
}
