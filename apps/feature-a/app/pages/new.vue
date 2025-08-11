<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
    <!-- ヘッダー -->
    <div class="bg-white shadow-sm border-b border-gray-100">
      <div class="container mx-auto px-6 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
              <UIcon name="i-heroicons-plus" class="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                TODO新規作成
              </h1>
              <p class="text-gray-600 mt-1">新しいタスクを追加して、効率的に管理しましょう</p>
            </div>
          </div>
          <UButton
            variant="ghost"
            icon="i-heroicons-arrow-left"
            @click="navigateTo('/')"
            class="hover:bg-gray-100 transition-colors duration-200"
          >
            一覧に戻る
          </UButton>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-6 py-8">
      <!-- 作成フォーム -->
      <div class="max-w-2xl mx-auto">
        <UCard class="bg-white shadow-xl border-0 rounded-2xl overflow-hidden">
          <template #header>
            <div class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 -m-6 mb-6">
              <div class="flex items-center space-x-3">
                <UIcon name="i-heroicons-document-text" class="w-6 h-6" />
                <h2 class="text-xl font-semibold">TODO情報入力</h2>
              </div>
              <p class="text-blue-100 mt-2 text-sm">必要な情報を入力してタスクを作成してください</p>
            </div>
          </template>

          <form @submit.prevent="handleSubmit" class="space-y-8 p-6 -m-6">
            <!-- タイトル -->
            <UFormGroup label="タイトル" name="title" required class="space-y-3">
              <template #label>
                <label class="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                  <UIcon name="i-heroicons-document-text" class="w-4 h-4 text-blue-500" />
                  <span>タイトル</span>
                  <span class="text-red-500">*</span>
                </label>
              </template>
              <UInput
                v-model="form.title"
                placeholder="TODOのタイトルを入力してください"
                icon="i-heroicons-document-text"
                size="lg"
                :error="!!errors.title"
                class="transition-all duration-200 focus:scale-[1.02] rounded-xl shadow-lg ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500"
              />
              <template #error v-if="errors.title">
                <span class="flex items-center space-x-1 text-red-500 text-sm">
                  <UIcon name="i-heroicons-exclamation-triangle" class="w-4 h-4" />
                  <span>{{ errors.title }}</span>
                </span>
              </template>
            </UFormGroup>

            <!-- 内容 -->
            <UFormGroup label="内容" name="content" class="space-y-3">
              <template #label>
                <label class="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                  <UIcon name="i-heroicons-document-text" class="w-4 h-4 text-green-500" />
                  <span>内容</span>
                </label>
              </template>
              <UTextarea
                v-model="form.content"
                placeholder="TODOの詳細な内容や説明を入力してください"
                :rows="4"
                resize
                class="transition-all duration-200 focus:scale-[1.01] rounded-xl shadow-lg ring-1 ring-gray-200 focus:ring-2 focus:ring-green-500"
              />
            </UFormGroup>

            <!-- 期日とステータスの横並び -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <!-- 期日 -->
              <UFormGroup label="期日" name="dueDate" class="space-y-3">
                <template #label>
                  <label class="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                    <UIcon name="i-heroicons-calendar-days" class="w-4 h-4 text-yellow-500" />
                    <span>期日</span>
                  </label>
                </template>
                <UInput
                  v-model="form.dueDate"
                  type="date"
                  icon="i-heroicons-calendar-days"
                  placeholder="期日を設定してください"
                  class="transition-all duration-200 focus:scale-[1.02] rounded-xl shadow-lg ring-1 ring-gray-200 focus:ring-2 focus:ring-yellow-500"
                />
              </UFormGroup>

              <!-- ステータス -->
              <UFormGroup label="ステータス" name="status" class="space-y-3">
                <template #label>
                  <label class="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                    <UIcon name="i-heroicons-flag" class="w-4 h-4 text-purple-500" />
                    <span>ステータス</span>
                  </label>
                </template>
                <USelect
                  v-model="form.status"
                  :options="statusOptions"
                  placeholder="ステータスを選択してください"
                  class="transition-all duration-200 focus:scale-[1.02] rounded-xl shadow-lg ring-1 ring-gray-200 focus:ring-2 focus:ring-purple-500"
                />
              </UFormGroup>
            </div>

            <!-- フォームアクション -->
            <div class="flex items-center justify-between pt-8 border-t border-gray-100">
              <UButton
                type="button"
                variant="ghost"
                @click="handleCancel"
                :disabled="loading"
                icon="i-heroicons-x-mark"
                class="hover:bg-gray-100 transition-colors duration-200"
              >
                キャンセル
              </UButton>

              <div class="flex space-x-4">
                <UButton
                  type="button"
                  variant="outline"
                  @click="handlePreview"
                  :disabled="!form.title || loading"
                  icon="i-heroicons-eye"
                  class="border-blue-300 text-blue-600 hover:bg-blue-50 transition-all duration-200 hover:scale-105"
                >
                  プレビュー
                </UButton>
                <UButton
                  type="submit"
                  icon="i-heroicons-plus"
                  :loading="loading"
                  :disabled="!form.title"
                  class="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
                >
                  {{ loading ? '作成中...' : 'タスクを作成' }}
                </UButton>
              </div>
            </div>
          </form>
        </UCard>
      </div>
    </div>

    <!-- プレビューモーダル -->
    <UModal v-model="previewModal.isOpen">
      <UCard class="bg-white rounded-2xl shadow-2xl border-0 overflow-hidden max-w-2xl">
        <template #header>
          <div class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 -m-6 mb-6">
            <div class="flex items-center space-x-3">
              <div class="p-2 bg-white/20 rounded-lg">
                <UIcon name="i-heroicons-eye" class="w-5 h-5" />
              </div>
              <h3 class="text-xl font-semibold">TODOプレビュー</h3>
            </div>
            <p class="text-blue-100 mt-2 text-sm">作成内容を確認してください</p>
          </div>
        </template>

        <div class="space-y-6 p-6 -m-6">
          <div class="space-y-4">
            <div class="bg-gray-50 rounded-xl p-4">
              <label class="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                <UIcon name="i-heroicons-document-text" class="w-4 h-4 text-blue-500" />
                <span>タイトル</span>
              </label>
              <p class="text-gray-900 font-medium text-lg">{{ form.title || '（未入力）' }}</p>
            </div>
            
            <div class="bg-gray-50 rounded-xl p-4">
              <label class="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                <UIcon name="i-heroicons-document-text" class="w-4 h-4 text-green-500" />
                <span>内容</span>
              </label>
              <p class="text-gray-900 whitespace-pre-wrap">{{ form.content || '（未入力）' }}</p>
            </div>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div class="bg-gray-50 rounded-xl p-4">
                <label class="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <UIcon name="i-heroicons-calendar-days" class="w-4 h-4 text-yellow-500" />
                  <span>期日</span>
                </label>
                <p class="text-gray-900 font-medium">
                  {{ form.dueDate ? formatDate(form.dueDate) : '未設定' }}
                </p>
              </div>
              
              <div class="bg-gray-50 rounded-xl p-4">
                <label class="flex items-center space-x-2 text-sm font-semibold text-gray-700 mb-2">
                  <UIcon name="i-heroicons-flag" class="w-4 h-4 text-purple-500" />
                  <span>ステータス</span>
                </label>
                <div class="mt-1">
                  <UBadge
                    :color="getStatusColor(form.status)"
                    :variant="getStatusVariant(form.status)"
                    size="lg"
                    class="px-3 py-1"
                  >
                    {{ form.status }}
                  </UBadge>
                </div>
              </div>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end space-x-4 p-6 -m-6 bg-gray-50 border-t border-gray-100">
            <UButton
              variant="ghost"
              @click="previewModal.isOpen = false"
              icon="i-heroicons-x-mark"
              class="hover:bg-gray-200 transition-colors duration-200"
            >
              閉じる
            </UButton>
            <UButton
              @click="handleSubmitFromPreview"
              icon="i-heroicons-plus"
              :loading="loading"
              class="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              この内容で作成
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- 確認モーダル -->
    <UModal v-model="confirmModal.isOpen">
      <UCard class="bg-white rounded-2xl shadow-2xl border-0 overflow-hidden max-w-lg">
        <template #header>
          <div class="bg-gradient-to-r from-yellow-500 to-orange-500 text-white p-6 -m-6 mb-6">
            <div class="flex items-center space-x-3">
              <div class="p-2 bg-white/20 rounded-lg">
                <UIcon name="i-heroicons-question-mark-circle" class="w-5 h-5" />
              </div>
              <h3 class="text-xl font-semibold">作成の確認</h3>
            </div>
            <p class="text-yellow-100 mt-2 text-sm">内容を確認してタスクを作成してください</p>
          </div>
        </template>

        <div class="space-y-4 p-6 -m-6">
          <p class="text-gray-600">
            以下の内容でTODOを作成してもよろしいですか？
          </p>
          <div class="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4 space-y-3 border border-blue-100">
            <div class="flex items-start space-x-2">
              <UIcon name="i-heroicons-document-text" class="w-4 h-4 text-blue-500 mt-0.5" />
              <div>
                <strong class="text-blue-700">タイトル:</strong>
                <span class="ml-2 text-gray-900">{{ form.title }}</span>
              </div>
            </div>
            <div v-if="form.content" class="flex items-start space-x-2">
              <UIcon name="i-heroicons-document-text" class="w-4 h-4 text-green-500 mt-0.5" />
              <div>
                <strong class="text-green-700">内容:</strong>
                <span class="ml-2 text-gray-900">{{ form.content }}</span>
              </div>
            </div>
            <div v-if="form.dueDate" class="flex items-start space-x-2">
              <UIcon name="i-heroicons-calendar-days" class="w-4 h-4 text-yellow-500 mt-0.5" />
              <div>
                <strong class="text-yellow-700">期日:</strong>
                <span class="ml-2 text-gray-900">{{ formatDate(form.dueDate) }}</span>
              </div>
            </div>
            <div class="flex items-start space-x-2">
              <UIcon name="i-heroicons-flag" class="w-4 h-4 text-purple-500 mt-0.5" />
              <div>
                <strong class="text-purple-700">ステータス:</strong>
                <span class="ml-2 text-gray-900">{{ form.status }}</span>
              </div>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end space-x-4 p-6 -m-6 bg-gray-50 border-t border-gray-100">
            <UButton
              variant="ghost"
              @click="confirmModal.isOpen = false"
              icon="i-heroicons-x-mark"
              class="hover:bg-gray-200 transition-colors duration-200"
            >
              キャンセル
            </UButton>
            <UButton
              @click="executeCreate"
              icon="i-heroicons-plus"
              :loading="loading"
              class="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              {{ loading ? '作成中...' : 'タスクを作成' }}
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { TodoCreateRequest, TodoStatus } from '~/types/todo'
import { formatDate, getStatusColor, getStatusVariant, TODO_STATUSES } from '~/types/todo'

// Meta設定
useHead({
  title: 'TODO新規作成 - Feature A',
  meta: [
    { name: 'description', content: 'TODOタスクの新規作成画面' }
  ]
})

// State
const form = ref<TodoCreateRequest & { status: TodoStatus }>({
  title: '',
  content: '',
  dueDate: null,
  status: '未着手'
})

const errors = ref<Record<string, string>>({})
const loading = ref(false)

// Modal states
const previewModal = ref({
  isOpen: false
})

const confirmModal = ref({
  isOpen: false
})

// Options
const statusOptions = TODO_STATUSES.filter(status => status !== '削除').map(status => ({
  label: status,
  value: status
}))

// Methods
const validateForm = (): boolean => {
  errors.value = {}
  
  if (!form.value.title?.trim()) {
    errors.value.title = 'タイトルは必須です'
    return false
  }
  
  if (form.value.title.length > 100) {
    errors.value.title = 'タイトルは100文字以内で入力してください'
    return false
  }
  
  return true
}

const handleSubmit = () => {
  if (!validateForm()) return
  confirmModal.value.isOpen = true
}

const handlePreview = () => {
  if (!validateForm()) return
  previewModal.value.isOpen = true
}

const handleSubmitFromPreview = () => {
  previewModal.value.isOpen = false
  confirmModal.value.isOpen = true
}

const executeCreate = async () => {
  if (!validateForm()) return
  
  try {
    loading.value = true
    
    const createData: TodoCreateRequest = {
      title: form.value.title,
      content: form.value.content || '',
      dueDate: form.value.dueDate || null,
      status: form.value.status
    }
    
    const response = await $fetch('/api/todos', {
      method: 'POST',
      body: createData
    })
    
    if (response.success) {
      useToast().add({
        title: '成功',
        description: 'TODOを作成しました。',
        color: 'success'
      })
      
      confirmModal.value.isOpen = false
      
      // 一覧画面に戻る
      await navigateTo('/')
    } else {
      throw new Error('Failed to create todo')
    }
  } catch (error) {
    console.error('TODO作成に失敗しました:', error)
    useToast().add({
      title: 'エラー',
      description: 'TODO作成に失敗しました。',
      color: 'error'
    })
  } finally {
    loading.value = false
  }
}

const handleCancel = () => {
  // 入力内容がある場合は確認
  if (form.value.title || form.value.content) {
    if (confirm('入力した内容が失われますが、よろしいですか？')) {
      navigateTo('/')
    }
  } else {
    navigateTo('/')
  }
}

// Lifecycle
onMounted(() => {
  // クエリパラメータから初期値を設定
  const route = useRoute()
  if (route.query.title) {
    form.value.title = route.query.title as string
  }
  if (route.query.content) {
    form.value.content = route.query.content as string
  }
})
</script>
