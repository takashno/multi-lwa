<template>
  <div class="min-h-screen bg-gray-50">
    <div class="py-8">
      <div class="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <!-- Welcome Section -->
        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900">
            ダッシュボード
          </h1>
          <p class="mt-2 text-gray-600">
            ようこそ{{ userInfo?.name }}さん、マルチアプリ管理システムへ
          </p>
        </div>

        <!-- Stats Cards -->
        <div class="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 mb-8">
          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-2 bg-blue-500 rounded-lg">
                <Icon name="heroicons:chart-bar" class="h-6 w-6 text-white" />
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">総アプリ数</h3>
                <p class="text-2xl font-bold text-blue-600">3</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-2 bg-green-500 rounded-lg">
                <Icon name="heroicons:check-circle" class="h-6 w-6 text-white" />
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">稼働中</h3>
                <p class="text-2xl font-bold text-green-600">2</p>
              </div>
            </div>
          </div>

          <div class="bg-white rounded-lg shadow p-6">
            <div class="flex items-center">
              <div class="p-2 bg-yellow-500 rounded-lg">
                <Icon name="heroicons:clock" class="h-6 w-6 text-white" />
              </div>
              <div class="ml-4">
                <h3 class="text-lg font-medium text-gray-900">メンテナンス</h3>
                <p class="text-2xl font-bold text-yellow-600">1</p>
              </div>
            </div>
          </div>
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
                    <div class="p-2 bg-blue-100 rounded-lg">
                      <Icon name="heroicons:computer-desktop" class="h-5 w-5 text-blue-600" />
                    </div>
                    <div class="ml-3">
                      <h3 class="font-medium text-gray-900">Central App</h3>
                      <p class="text-sm text-gray-500">認証・管理システム</p>
                    </div>
                  </div>
                  <UBadge color="green" variant="soft">稼働中</UBadge>
                </div>

                <div class="flex items-center justify-between p-4 border rounded-lg">
                  <div class="flex items-center">
                    <div class="p-2 bg-purple-100 rounded-lg">
                      <Icon name="heroicons:rocket-launch" class="h-5 w-5 text-purple-600" />
                    </div>
                    <div class="ml-3">
                      <h3 class="font-medium text-gray-900">Feature A</h3>
                      <p class="text-sm text-gray-500">機能Aアプリケーション</p>
                    </div>
                  </div>
                  <UBadge color="green" variant="soft">稼働中</UBadge>
                </div>

                <div class="flex items-center justify-between p-4 border rounded-lg">
                  <div class="flex items-center">
                    <div class="p-2 bg-pink-100 rounded-lg">
                      <Icon name="heroicons:star" class="h-5 w-5 text-pink-600" />
                    </div>
                    <div class="ml-3">
                      <h3 class="font-medium text-gray-900">Feature B</h3>
                      <p class="text-sm text-gray-500">機能Bアプリケーション</p>
                    </div>
                  </div>
                  <UBadge color="yellow" variant="soft">メンテナンス</UBadge>
                </div>
              </div>

              <div class="mt-6 flex space-x-3">
                <UButton 
                  to="/feature-a" 
                  color="purple" 
                  variant="soft"
                  icon="heroicons:arrow-top-right-on-square"
                >
                  Feature A を開く
                </UButton>
                <UButton 
                  to="/feature-b" 
                  color="pink" 
                  variant="soft"
                  icon="heroicons:arrow-top-right-on-square"
                >
                  Feature B を開く
                </UButton>
              </div>
            </div>
          </div>

          <!-- Recent Activity -->
          <div class="bg-white rounded-lg shadow">
            <div class="p-6 border-b border-gray-200">
              <h2 class="text-xl font-semibold text-gray-900">最近のアクティビティ</h2>
            </div>
            <div class="p-6">
              <div class="space-y-4">
                <div class="flex items-center space-x-3">
                  <div class="w-2 h-2 bg-green-500 rounded-full"></div>
                  <div>
                    <p class="text-sm text-gray-900">Feature A がデプロイされました</p>
                    <p class="text-xs text-gray-500">2分前</p>
                  </div>
                </div>
                
                <div class="flex items-center space-x-3">
                  <div class="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <div>
                    <p class="text-sm text-gray-900">新しいユーザーがログインしました</p>
                    <p class="text-xs text-gray-500">15分前</p>
                  </div>
                </div>
                
                <div class="flex items-center space-x-3">
                  <div class="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  <div>
                    <p class="text-sm text-gray-900">Feature B のメンテナンスが開始されました</p>
                    <p class="text-xs text-gray-500">1時間前</p>
                  </div>
                </div>
                
                <div class="flex items-center space-x-3">
                  <div class="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <div>
                    <p class="text-sm text-gray-900">システム設定が更新されました</p>
                    <p class="text-xs text-gray-500">3時間前</p>
                  </div>
                </div>
              </div>
              
              <div class="mt-6">
                <UButton variant="ghost" class="w-full">
                  すべてのアクティビティを表示
                </UButton>
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

// ページタイトルを設定
useHead({
  title: 'ダッシュボード - Multi LWA'
})

// 認証が必要なページとして設定
definePageMeta({
  middleware: 'auth'
})
</script>
