export default defineNuxtPlugin(() => {
  // JWTトークンを自動的にヘッダーに追加するコンポーザブルを提供
  const getAuthHeaders = (): Record<string, string> => {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    }
    
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('auth_token')
      
      if (token && token !== 'null' && token !== '') {
        console.log('Feature A - JWT token found:', token.substring(0, 20) + '...')
        headers['Authorization'] = `Bearer ${token}`
      } else {
        console.log('Feature A - No JWT token found')
      }
    }
    
    return headers
  }
  
  // グローバルに利用可能な認証付きfetch関数を提供
  const authenticatedFetch = async (url: string, options: RequestInit = {}) => {
    const authHeaders = getAuthHeaders()
    
    const enhancedOptions: RequestInit = {
      ...options,
      headers: {
        ...authHeaders,
        ...(options.headers as Record<string, string> || {})
      }
    }
    
    console.log('Feature A - Authenticated API Request:', {
      url,
      hasAuthHeader: !!enhancedOptions.headers && 'Authorization' in enhancedOptions.headers
    })
    
    try {
      const response = await fetch(url, enhancedOptions)
      
      // 401 Unauthorized の場合は認証エラーとして処理
      if (response.status === 401) {
        console.log('Feature A - Authentication failed (401), redirecting to Central login')
        
        if (typeof window !== 'undefined') {
          localStorage.removeItem('auth_token')
          localStorage.removeItem('user_info')
          window.location.href = 'http://localhost:3000/auth'
        }
      }
      
      return response
    } catch (error) {
      console.error('Feature A - API Request Error:', error)
      throw error
    }
  }
  
  console.log('Feature A - API plugin initialized with JWT support')
  
  // Nuxt アプリに提供
  return {
    provide: {
      authenticatedFetch,
      getAuthHeaders
    }
  }
})
