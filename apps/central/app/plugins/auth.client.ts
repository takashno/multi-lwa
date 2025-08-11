export default defineNuxtPlugin(async () => {
  const { useAuthStore } = await import('../stores/auth')
  const authStore = useAuthStore()
  
  // Initialize auth state from localStorage
  authStore.initializeAuth()
})
