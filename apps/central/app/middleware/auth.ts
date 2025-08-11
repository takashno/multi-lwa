export default defineNuxtRouteMiddleware((to) => {
  const authStore = useAuthStore()
  
  // 認証されていない場合、ログインページにリダイレクト
  if (!authStore.isLoggedIn) {
    return navigateTo('/login')
  }
})
