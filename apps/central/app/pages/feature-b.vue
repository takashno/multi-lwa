<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
      <div class="text-center">
        <div class="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-pink-100 mb-4">
          <Icon name="heroicons:star" class="h-8 w-8 text-pink-600" />
        </div>
        
        <h1 class="text-2xl font-bold text-gray-900 mb-2">
          Feature B アプリケーション
        </h1>
        
        <div class="mb-4">
          <UBadge color="yellow" variant="soft">メンテナンス中</UBadge>
        </div>
        
        <p class="text-gray-600 mb-6">
          機能Bアプリケーションは現在メンテナンス中です
        </p>
        
        <div class="space-y-4">
          <UButton
            @click="navigateToFeatureB"
            color="pink"
            size="lg"
            class="w-full"
            disabled
            icon="heroicons:wrench-screwdriver"
          >
            メンテナンス中
          </UButton>
          
          <UButton
            to="/"
            variant="ghost"
            class="w-full"
            icon="heroicons:arrow-left"
          >
            ダッシュボードに戻る
          </UButton>
        </div>
        
        <div class="mt-6 p-4 bg-yellow-50 rounded-lg">
          <div class="flex items-center justify-center">
            <Icon name="heroicons:exclamation-triangle" class="h-5 w-5 text-yellow-600 mr-2" />
            <p class="text-sm text-yellow-700">
              メンテナンス予定: 2024年1月15日まで
            </p>
          </div>
        </div>
        
        <div class="mt-4 text-xs text-gray-500">
          <p>メンテナンス完了後、Feature B アプリケーションのドメインに移動します</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const navigateToFeatureB = () => {
  // メンテナンス中のため無効化
  console.log('Feature B is under maintenance')
}

// ページタイトルを設定
useHead({
  title: 'Feature B - Multi LWA'
})

// 認証が必要
definePageMeta({
  middleware: 'auth'
})
</script>
