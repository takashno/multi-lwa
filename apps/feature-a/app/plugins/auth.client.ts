export default defineNuxtPlugin(async () => {
  const { useAuthStore } = await import('../stores/auth')
  const authStore = useAuthStore()
  
  // URL パラメータからJWTトークンを取得
  if (typeof window !== 'undefined') {
    const url = new URL(window.location.href)
    const jwtToken = url.searchParams.get('jwt_token')
    
    console.log('Feature A - Auth Plugin Initialized')
    console.log('URL Params - JWT Token:', jwtToken ? jwtToken.substring(0, 20) + '...' : 'None')
    
    // JWTトークンがURL パラメータに存在する場合の処理
    if (jwtToken && jwtToken !== 'null' && jwtToken !== '') {
      console.log('Feature A - JWT token received from Central')
      
      // JWTトークンをlocalStorageに保存
      localStorage.setItem('auth_token', jwtToken)
      
      try {
        // Cognito（IDP）からユーザー情報を取得
        await fetchUserInfoFromCognito(jwtToken, authStore)
        
        console.log('Feature A - User info fetched from Cognito')
      } catch (error) {
        console.error('Feature A - Failed to fetch user info from Cognito:', error)
        
        // Cognitoからの情報取得に失敗した場合、Centralにリダイレクト
        localStorage.removeItem('auth_token')
        window.location.href = 'http://localhost:3000/auth'
        return
      }
      
      // URL からJWTパラメータを削除（セキュリティのため）
      const cleanUrl = `${window.location.protocol}//${window.location.host}${window.location.pathname}`
      window.history.replaceState({}, '', cleanUrl)
    } else {
      // JWTトークンがない場合、localStorageから復元を試行
      authStore.initializeAuth()
    }
  }
  
  console.log('Feature A - Final Auth State:')
  console.log('- Token exists:', !!localStorage.getItem('auth_token'))
  console.log('- Is Logged In:', authStore.isLoggedIn)
  console.log('- User Info:', authStore.userInfo?.name || 'None')
})

// Cognito（IDP）からユーザー情報を取得する関数
async function fetchUserInfoFromCognito(jwtToken: string, authStore: any) {
  try {
    // TODO: 実際のCognito UserInfoエンドポイントに置き換える
    // const cognitoUserInfoUrl = 'https://your-cognito-domain.auth.region.amazoncognito.com/oauth2/userInfo'
    
    // 開発環境用のモック実装
    if (process.env.NODE_ENV === 'development') {
      console.log('Feature A - Using mock Cognito user info (development mode)')
      
      // JWTトークンの検証をシミュレート
      await new Promise(resolve => setTimeout(resolve, 500)) // API呼び出しをシミュレート
      
      const mockUserInfo = {
        id: 'cognito-user-123',
        name: 'Cognitoユーザー',
        email: 'cognito-user@example.com',
        sub: 'cognito-sub-123'
      }
      
      authStore.setUser(mockUserInfo, jwtToken)
      return
    }
    
    // 本番環境用のCognito UserInfo API呼び出し
    const response = await fetch('https://your-cognito-domain.auth.region.amazoncognito.com/oauth2/userInfo', {
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
        'Content-Type': 'application/json'
      }
    })
    
    if (!response.ok) {
      throw new Error(`Cognito UserInfo API error: ${response.status}`)
    }
    
    const cognitoUserInfo = await response.json()
    
    // Cognitoのレスポンスを内部形式に変換
    const userInfo = {
      id: cognitoUserInfo.sub,
      name: cognitoUserInfo.name || cognitoUserInfo.preferred_username,
      email: cognitoUserInfo.email,
      sub: cognitoUserInfo.sub
    }
    
    authStore.setUser(userInfo, jwtToken)
    
  } catch (error) {
    console.error('Feature A - Cognito UserInfo fetch failed:', error)
    throw error
  }
}
