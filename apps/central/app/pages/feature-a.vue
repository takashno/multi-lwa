<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center">
    <div class="max-w-md w-full bg-white rounded-lg shadow-lg p-8">
      <div class="text-center">
        <div class="mx-auto h-16 w-16 flex items-center justify-center rounded-full bg-purple-100 mb-4">
          <Icon name="heroicons:rocket-launch" class="h-8 w-8 text-purple-600" />
        </div>
        
        <h1 class="text-2xl font-bold text-gray-900 mb-2">
          Feature A アプリケーション
        </h1>
        
        <p class="text-gray-600 mb-6">
          タスク管理システムに移動します
        </p>
        
        <div class="space-y-4">
          <UButton
            @click="navigateToFeatureA"
            color="purple"
            size="lg"
            class="w-full"
            icon="heroicons:arrow-top-right-on-square"
          >
            タスク管理を開く
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
        
        <div class="mt-6 text-xs text-gray-500">
          <p>認証状態を引き継いでFeature Aアプリに移動します</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const navigateToFeatureA = () => {
  // 現在はローカル開発環境での検証
  // 本番環境では実際のFeature Aドメインに移動
  if (typeof window !== 'undefined') {
    window.location.href = 'http://localhost:3002/'
  }
}

// ページタイトルを設定
useHead({
  title: 'Feature A - Multi LWA'
})

// 認証が必要
definePageMeta({
  middleware: 'auth'
})
</script>
