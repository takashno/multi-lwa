<template>
  <div>
    <UButton
      v-if="!isAuthenticated"
      @click="login"
      color="primary"
      size="sm"
    >
      ログイン
    </UButton>
    <div v-else class="relative">
      <UButton
        @click="showMenu = !showMenu"
        color="neutral"
        :label="userInfo?.name || 'ユーザー'"
        trailing-icon="i-heroicons-chevron-down-20-solid"
      />
      <!-- 一時的な簡素なメニュー -->
      <div v-if="showMenu" class="absolute top-full right-0 mt-2 w-48 bg-white rounded-md shadow-lg border z-50">
        <div class="py-1">
          <button @click="navigateTo('/'); showMenu = false" class="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center">
            <Icon name="heroicons:home" class="h-4 w-4 mr-2" />
            ダッシュボード
          </button>
          <button @click="navigateTo('/feature-a'); showMenu = false" class="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center">
            <Icon name="heroicons:rocket-launch" class="h-4 w-4 mr-2" />
            Feature A
          </button>
          <button @click="navigateTo('/feature-b'); showMenu = false" class="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center">
            <Icon name="heroicons:star" class="h-4 w-4 mr-2" />
            Feature B
          </button>
          <hr class="my-1" />
          <button @click="logout(); showMenu = false" class="w-full px-4 py-2 text-left hover:bg-gray-100 flex items-center text-red-600">
            <Icon name="heroicons:arrow-left-on-rectangle" class="h-4 w-4 mr-2" />
            ログアウト
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const authStore = useAuthStore()
const showMenu = ref(false)

const isAuthenticated = computed(() => authStore.isAuthenticated)
const userInfo = computed(() => authStore.userInfo)

const login = () => {
  authStore.login()
}

const logout = () => {
  authStore.logout()
  showMenu.value = false
}
</script>
