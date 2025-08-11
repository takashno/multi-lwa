<template>
  <div class="min-h-screen bg-gray-50">
    <div class="py-8">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <!-- Welcome Section -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">
            Menu
          </h1>
          <p class="mt-2 text-gray-600">
            ようこそ{{ userInfo?.name }}さん、マルチアプリ管理システムへ
          </p>
        </div>

        <!-- Quick Actions -->
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <!-- Applications -->
          <div class="bg-white rounded-lg shadow">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-xl font-semibold text-gray-900">アプリケーション</h2>
            </div>
            <div class="p-6">
              <div class="space-y-4">

                <div class="flex items-center justify-between p-4 border rounded-lg">
                  <div class="flex items-center">
                    <div class="ml-3">
                      <h3 class="font-medium text-gray-900">Feature A</h3>
                      <UButton @click="navigateToFeatureA" color="purple" variant="soft"
                        icon="heroicons:arrow-top-right-on-square">
                        Feature A を開く
                      </UButton>
                    </div>
                  </div>
                </div>

                <div class="flex items-center justify-between p-4 border rounded-lg">
                  <div class="flex items-center">
                    <div class="ml-3">
                      <h3 class="font-medium text-gray-900">Feature B</h3>
                      <UButton @click="navigateToFeatureA" color="purple" variant="soft"
                        icon="heroicons:arrow-top-right-on-square">
                        Feature B を開く
                      </UButton>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const { userInfo } = storeToRefs(useAuthStore())

// Feature A への遷移
const navigateToFeatureA = () => {
  // デバッグ情報
  console.log('Central - Navigating to Feature A')

  if (typeof window !== 'undefined') {
    const authToken = localStorage.getItem('auth_token')

    if (!authToken || authToken === 'null' || authToken === '') {
      console.error('Central - No valid JWT token found')
      alert('認証エラー：有効なJWTトークンが見つかりません')
      return
    }

    console.log('Central - JWT Token found:', authToken.substring(0, 20) + '...')

    // JWTトークンをAuthorizationヘッダーに設定してFeature Aに遷移
    // Feature A側でJWTを受け取り、Cognitoから最新のユーザー情報を取得する
    const params = new URLSearchParams({
      jwt_token: authToken
    })

    window.location.href = `http://localhost:3002/?${params.toString()}`
  }
}

// ページタイトルを設定
useHead({
  title: 'ダッシュボード - Multi LWA'
})

// 認証が必要なページとして設定
definePageMeta({
  middleware: 'auth'
})
</script>
