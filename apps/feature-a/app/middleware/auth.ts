export default defineNuxtRouteMiddleware((to) => {
  // Feature A を単独動作モードに変更（認証チェックを一時的に無効化）
  console.log('Feature A - Auth middleware (disabled for standalone mode)')
  
  // 将来的にJWT認証を有効にする場合は以下のコメントを外す
  /*
  const authStore = useAuthStore()
  
  console.log('Feature A - Auth Middleware Check')
  console.log('Is Logged In:', authStore.isLoggedIn)
  console.log('User Info:', authStore.userInfo)
  console.log('Token:', authStore.token)
  
  if (!authStore.isLoggedIn) {
    console.log('Not authenticated, redirecting to Central login')
    if (typeof window !== 'undefined') {
      window.location.href = 'http://localhost:3000/login'
    }
    return
  }
  
  console.log('Authentication successful, allowing access')
  */
})
