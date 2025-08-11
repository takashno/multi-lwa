<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8">
      <div>
        <div class="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-blue-100">
          <Icon name="heroicons:lock-closed" class="h-6 w-6 text-blue-600" />
        </div>
        <h2 class="mt-6 text-center text-3xl font-extrabold text-gray-900">
          アカウントにサインイン
        </h2>
        <p class="mt-2 text-center text-sm text-gray-600">
          Multi LWA システムへようこそ
        </p>
      </div>
      
      <div class="mt-8 space-y-6">
        <div class="rounded-md shadow-sm bg-white p-8">
          <div class="text-center space-y-4">
            <p class="text-gray-600">
              安全なCognito認証でログインしてください
            </p>
            
            <UButton
              @click="handleLogin"
              :loading="isLoading"
              size="lg"
              color="blue"
              class="w-full"
              icon="heroicons:arrow-right-on-rectangle"
            >
              {{ isLoading ? 'ログイン中...' : 'ログイン' }}
            </UButton>
            
            <!-- Development mode login -->
            <div v-if="isDevelopment" class="pt-4 border-t border-gray-200">
              <p class="text-xs text-gray-500 mb-2">開発モード</p>
              <UButton
                @click="handleDevLogin"
                variant="soft"
                color="gray"
                size="sm"
                class="w-full"
              >
                テストユーザーでログイン
              </UButton>
            </div>
          </div>
        </div>
        
        <div class="text-center text-xs text-gray-500">
          <p>
            このシステムは AWS Cognito で保護されています
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const authStore = useAuthStore()
const router = useRouter()

const isLoading = ref(false)
const isDevelopment = process.env.NODE_ENV === 'development'

// 既にログインしている場合はダッシュボードにリダイレクト
watchEffect(() => {
  if (authStore.isLoggedIn) {
    router.push('/')
  }
})

const handleLogin = async () => {
  try {
    isLoading.value = true
    await authStore.login()
  } catch (error) {
    console.error('Login error:', error)
    // エラーハンドリング
  } finally {
    isLoading.value = false
  }
}

const handleDevLogin = async () => {
  try {
    isLoading.value = true
    authStore.setUser({
      id: 'dev-user-123',
      name: '開発テストユーザー',
      email: 'dev@example.com'
    }, 'dev-mock-token')
    
    // ダッシュボードにリダイレクト
    await router.push('/')
  } catch (error) {
    console.error('Dev login error:', error)
  } finally {
    isLoading.value = false
  }
}

// ページタイトルを設定
useHead({
  title: 'ログイン - Multi LWA'
})

// ゲストのみアクセス可能
definePageMeta({
  middleware: 'guest'
})</script>
