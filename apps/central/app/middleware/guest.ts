export default defineNuxtRouteMiddleware(() => {
  const authStore = useAuthStore()
  
  // 既にログインしている場合、ダッシュボードにリダイレクト
  if (authStore.isLoggedIn) {
    return navigateTo('/')
  }
})
