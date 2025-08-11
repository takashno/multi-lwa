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
          機能Aアプリケーションに移動します
        </p>
        
        <div class="space-y-4">
          <UButton
            @click="navigateToFeatureA"
            color="purple"
            size="lg"
            class="w-full"
            icon="heroicons:arrow-top-right-on-square"
          >
            Feature A を開く
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
          <p>このリンクは将来的に Feature A アプリケーションのドメインに移動します</p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
const navigateToFeatureA = () => {
  // TODO: 将来的には実際のFeature Aアプリケーションのドメインに移動
  // 例: window.location.href = 'https://feature-a.your-domain.com'
  
  // 現在は開発中のメッセージを表示
  alert('Feature A アプリケーションは開発中です。\n将来的には独立したドメインに移動します。')
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
