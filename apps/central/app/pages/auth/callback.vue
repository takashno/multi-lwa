<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
      <div class="text-center">
        <div class="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-blue-100 mb-4">
          <Icon name="heroicons:arrow-path" class="h-8 w-8 text-blue-600 animate-spin" />
        </div>
        
        <h1 class="text-2xl font-bold text-gray-900 mb-2">
          認証処理中
        </h1>
        
        <p class="text-gray-600 mb-6">
          Cognito認証を処理しています。しばらくお待ちください...
        </p>
        
        <div v-if="error" class="mt-4 p-4 bg-red-50 rounded-lg">
          <div class="flex items-center justify-center">
            <Icon name="heroicons:exclamation-triangle" class="h-5 w-5 text-red-600 mr-2" />
            <p class="text-sm text-red-700">
              {{ error }}
            </p>
          </div>
          
          <UButton
            to="/login"
            color="red"
            variant="soft"
            class="mt-4 w-full"
            icon="heroicons:arrow-left"
          >
            ログインページに戻る
          </UButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const error = ref('')

onMounted(async () => {
  try {
    // URLからparametersを取得
    const code = route.query.code
    const state = route.query.state
    const errorParam = route.query.error
    
    if (errorParam) {
      error.value = `認証エラー: ${errorParam}`
      return
    }
    
    if (!code) {
      error.value = '認証コードが見つかりません'
      return
    }
    
    // 認証コールバックを処理
    await authStore.handleAuthCallback(String(code))
    
    // 成功時はダッシュボードにリダイレクト
    await router.push('/')
    
  } catch (err) {
    console.error('Auth callback error:', err)
    error.value = '認証処理中にエラーが発生しました'
  }
})

// ページタイトルを設定
useHead({
  title: '認証処理中 - Multi LWA'
})

// ゲストのみアクセス可能（認証前の状態）
definePageMeta({
  middleware: 'guest'
})
</script>
