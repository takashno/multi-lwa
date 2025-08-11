<template>
  <div class="min-h-screen bg-gray-50">
    <!-- Navigation -->
    <nav class="bg-white shadow">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between h-16">
          <div class="flex items-center">
            <NuxtLink to="/" class="text-xl font-bold text-purple-600 flex items-center">
              <Icon name="heroicons:rocket-launch" class="h-6 w-6 mr-2" />
              Feature A
            </NuxtLink>
          </div>
          <div class="flex items-center space-x-4">
            <UButton
              @click="backToCentral"
              variant="soft"
              color="gray"
              size="sm"
              icon="heroicons:arrow-left"
            >
              Central
            </UButton>
            <AuthButton />
          </div>
        </div>
      </div>
    </nav>

    <!-- Main content -->
    <main class="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-white border-t">
      <div class="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
        <p class="text-center text-sm text-gray-500">
          © 2025 Multi-LWA Feature A - タスク管理システム
        </p>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
const backToCentral = () => {
  // 実際の本番環境では、Central アプリのドメインに遷移
  if (typeof window !== 'undefined') {
    window.location.href = 'http://localhost:3000/'
  }
}
</script>
