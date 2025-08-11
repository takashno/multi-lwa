import { defineStore } from 'pinia'

interface UserInfo {
  id: string
  name: string
  email: string
}

interface AuthState {
  isAuthenticated: boolean
  userInfo: UserInfo | null
  token: string | null
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    isAuthenticated: false,
    userInfo: null,
    token: null
  }),

  getters: {
    isLoggedIn: (state) => state.isAuthenticated && !!state.token
  },

  actions: {
    async login() {
      try {
        // TODO: Implement Cognito Hosted UI login
        console.log('Redirecting to Cognito Hosted UI...')
        
        // For now, simulate login for development
        if (process.env.NODE_ENV === 'development') {
          this.setUser({
            id: 'user-123',
            name: 'テストユーザー',
            email: 'test@example.com'
          }, 'mock-token')
        } else {
          // Redirect to Cognito Hosted UI
          const cognitoUrl = this.getCognitoLoginUrl()
          if (typeof window !== 'undefined') {
            window.location.href = cognitoUrl
          }
        }
      } catch (error) {
        console.error('Login failed:', error)
        throw error
      }
    },

    async logout() {
      try {
        // TODO: Implement proper logout with Cognito
        this.clearUser()
        
        if (process.env.NODE_ENV !== 'development') {
          // Redirect to Cognito logout
          const logoutUrl = this.getCognitoLogoutUrl()
          if (typeof window !== 'undefined') {
            window.location.href = logoutUrl
          }
        }
      } catch (error) {
        console.error('Logout failed:', error)
        throw error
      }
    },

    setUser(userInfo: UserInfo, token: string) {
      this.isAuthenticated = true
      this.userInfo = userInfo
      this.token = token
      
      // Store in localStorage for persistence
      if (typeof window !== 'undefined') {
        localStorage.setItem('auth_token', token)
        localStorage.setItem('user_info', JSON.stringify(userInfo))
      }
    },

    clearUser() {
      this.isAuthenticated = false
      this.userInfo = null
      this.token = null
      
      // Clear from localStorage
      if (typeof window !== 'undefined') {
        localStorage.removeItem('auth_token')
        localStorage.removeItem('user_info')
      }
    },

    async handleAuthCallback(code: string) {
      try {
        // TODO: Exchange authorization code for tokens
        console.log('Handling auth callback with code:', code)
        
        // For now, simulate successful callback
        if (process.env.NODE_ENV === 'development') {
          this.setUser({
            id: 'user-123',
            name: 'テストユーザー',
            email: 'test@example.com'
          }, 'mock-token')
        }
      } catch (error) {
        console.error('Auth callback failed:', error)
        throw error
      }
    },

    initializeAuth() {
      // Restore auth state from localStorage
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('auth_token')
        const userInfoStr = localStorage.getItem('user_info')
        
        if (token && userInfoStr) {
          try {
            const userInfo = JSON.parse(userInfoStr)
            this.setUser(userInfo, token)
          } catch (error) {
            console.error('Failed to restore auth state:', error)
            this.clearUser()
          }
        }
      }
    },

    getCognitoLoginUrl(): string {
      // TODO: Replace with actual Cognito configuration
      const cognitoConfig = {
        domain: 'your-cognito-domain.auth.region.amazoncognito.com',
        clientId: 'your-client-id',
        redirectUri: typeof window !== 'undefined' ? `${window.location.origin}/auth/callback` : '',
        scope: 'openid email profile'
      }
      
      const params = new URLSearchParams({
        response_type: 'code',
        client_id: cognitoConfig.clientId,
        redirect_uri: cognitoConfig.redirectUri,
        scope: cognitoConfig.scope,
        code_challenge_method: 'S256',
        // TODO: Implement PKCE
        code_challenge: 'mock-challenge'
      })
      
      return `https://${cognitoConfig.domain}/oauth2/authorize?${params.toString()}`
    },

    getCognitoLogoutUrl(): string {
      // TODO: Replace with actual Cognito configuration
      const cognitoConfig = {
        domain: 'your-cognito-domain.auth.region.amazoncognito.com',
        clientId: 'your-client-id',
        logoutUri: typeof window !== 'undefined' ? window.location.origin : ''
      }
      
      const params = new URLSearchParams({
        client_id: cognitoConfig.clientId,
        logout_uri: cognitoConfig.logoutUri
      })
      
      return `https://${cognitoConfig.domain}/logout?${params.toString()}`
    }
  }
})
