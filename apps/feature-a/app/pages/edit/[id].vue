<template>
  <div class="container mx-auto px-6 py-8">
    <!-- ヘッダー -->
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="text-3xl font-bold text-gray-900">TODO編集</h1>
        <p class="text-gray-600 mt-2">タスクの内容を編集します</p>
      </div>
      <UButton
        variant="ghost"
        icon="i-heroicons-arrow-left"
        @click="navigateTo('/')"
      >
        一覧に戻る
      </UButton>
    </div>

    <!-- ローディング -->
    <div v-if="loading.fetch" class="flex justify-center py-12">
      <UIcon name="i-heroicons-arrow-path" class="animate-spin text-blue-600" size="24" />
    </div>

    <!-- エラー表示 -->
    <UCard v-else-if="fetchError" class="text-center py-12">
      <UIcon name="i-heroicons-exclamation-triangle" class="mx-auto text-red-500 mb-4" size="48" />
      <h3 class="text-lg font-medium text-gray-900 mb-2">TODOが見つかりません</h3>
      <p class="text-gray-600 mb-4">指定されたTODOは存在しないか、削除されています。</p>
      <UButton @click="navigateTo('/')">一覧に戻る</UButton>
    </UCard>

    <!-- 編集フォーム -->
    <UCard v-else class="max-w-2xl">
      <template #header>
        <div class="flex items-center justify-between">
          <h2 class="text-lg font-semibold">TODO情報編集</h2>
          <div class="flex items-center space-x-2 text-sm text-gray-500">
            <span>作成: {{ formatDateTime(originalTodo.createdAt) }}</span>
            <span>•</span>
            <span>更新: {{ formatDateTime(originalTodo.updatedAt) }}</span>
          </div>
        </div>
      </template>

      <form @submit.prevent="handleSubmit" class="space-y-6">
        <!-- タイトル -->
        <UFormGroup label="タイトル" name="title" required>
          <UInput
            v-model="form.title"
            placeholder="TODOのタイトルを入力してください"
            icon="i-heroicons-document-text"
            size="lg"
            :error="!!errors.title"
          />
          <template #error v-if="errors.title">
            <span class="text-red-500 text-sm">{{ errors.title }}</span>
          </template>
        </UFormGroup>

        <!-- 内容 -->
        <UFormGroup label="内容" name="content">
          <UTextarea
            v-model="form.content"
            placeholder="TODOの詳細な内容や説明を入力してください"
            :rows="4"
            resize
          />
        </UFormGroup>

        <!-- 期日 -->
        <UFormGroup label="期日" name="dueDate">
          <UInput
            v-model="form.dueDate"
            type="date"
            icon="i-heroicons-calendar-days"
            placeholder="期日を設定してください"
          />
        </UFormGroup>

        <!-- ステータス -->
        <UFormGroup label="ステータス" name="status">
          <USelect
            v-model="form.status"
            :options="statusOptions"
            placeholder="ステータスを選択してください"
          />
        </UFormGroup>

        <!-- 変更検知 -->
        <div v-if="hasChanges" class="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div class="flex items-center space-x-2">
            <UIcon name="i-heroicons-information-circle" class="text-blue-600" />
            <span class="text-blue-800 font-medium">変更が検出されました</span>
          </div>
          <p class="text-blue-700 text-sm mt-1">保存ボタンを押して変更を反映してください。</p>
        </div>

        <!-- フォームアクション -->
        <div class="flex items-center justify-between pt-6">
          <UButton
            type="button"
            variant="ghost"
            @click="handleCancel"
            :disabled="loading.update"
          >
            キャンセル
          </UButton>

          <div class="flex space-x-3">
            <UButton
              type="button"
              variant="outline"
              @click="handleReset"
              :disabled="!hasChanges || loading.update"
            >
              リセット
            </UButton>
            <UButton
              type="button"
              variant="outline"
              @click="handlePreview"
              :disabled="!form.title || loading.update"
            >
              プレビュー
            </UButton>
            <UButton
              type="submit"
              icon="i-heroicons-check"
              :loading="loading.update"
              :disabled="!form.title || !hasChanges"
            >
              保存
            </UButton>
          </div>
        </div>
      </form>
    </UCard>

    <!-- プレビューモーダル -->
    <UModal v-model="previewModal.isOpen">
      <UCard>
        <template #header>
          <div class="flex items-center space-x-2">
            <UIcon name="i-heroicons-eye" />
            <h3 class="text-lg font-medium">TODO編集プレビュー</h3>
          </div>
        </template>

        <div class="space-y-4">
          <div>
            <label class="text-sm font-medium text-gray-700">タイトル</label>
            <p class="text-gray-900 font-medium">{{ form.title || '（未入力）' }}</p>
          </div>
          
          <div>
            <label class="text-sm font-medium text-gray-700">内容</label>
            <p class="text-gray-900 whitespace-pre-wrap">{{ form.content || '（未入力）' }}</p>
          </div>
          
          <div>
            <label class="text-sm font-medium text-gray-700">期日</label>
            <p class="text-gray-900">
              {{ form.dueDate ? formatDate(form.dueDate) : '未設定' }}
            </p>
          </div>
          
          <div>
            <label class="text-sm font-medium text-gray-700">ステータス</label>
            <div class="mt-1">
              <UBadge
                :color="getStatusColor(form.status)"
                :variant="getStatusVariant(form.status)"
              >
                {{ form.status }}
              </UBadge>
            </div>
          </div>

          <!-- 変更箇所のハイライト -->
          <div v-if="hasChanges" class="border-t pt-4">
            <label class="text-sm font-medium text-blue-700">変更箇所</label>
            <div class="mt-2 space-y-2">
              <div v-for="change in getChanges()" :key="change.field" class="text-sm">
                <span class="font-medium">{{ change.field }}:</span>
                <span class="text-red-600">{{ change.before }}</span>
                <span class="text-gray-500">→</span>
                <span class="text-green-600">{{ change.after }}</span>
              </div>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end space-x-3">
            <UButton
              variant="ghost"
              @click="previewModal.isOpen = false"
            >
              閉じる
            </UButton>
            <UButton
              @click="handleSubmitFromPreview"
              icon="i-heroicons-check"
              :loading="loading.update"
              :disabled="!hasChanges"
            >
              この内容で保存
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>

    <!-- 確認モーダル -->
    <UModal v-model="confirmModal.isOpen">
      <UCard>
        <template #header>
          <div class="flex items-center space-x-2">
            <UIcon name="i-heroicons-question-mark-circle" class="text-yellow-500" />
            <h3 class="text-lg font-medium">保存の確認</h3>
          </div>
        </template>

        <div class="space-y-4">
          <p class="text-gray-600">
            以下の変更を保存してもよろしいですか？
          </p>
          <div class="bg-gray-50 rounded-lg p-4 space-y-2">
            <div v-for="change in getChanges()" :key="change.field" class="text-sm">
              <span class="font-medium">{{ change.field }}:</span>
              <span class="text-red-600">{{ change.before }}</span>
              <span class="text-gray-500">→</span>
              <span class="text-green-600">{{ change.after }}</span>
            </div>
          </div>
        </div>

        <template #footer>
          <div class="flex justify-end space-x-3">
            <UButton
              variant="ghost"
              @click="confirmModal.isOpen = false"
            >
              キャンセル
            </UButton>
            <UButton
              @click="executeUpdate"
              icon="i-heroicons-check"
              :loading="loading.update"
            >
              保存
            </UButton>
          </div>
        </template>
      </UCard>
    </UModal>
  </div>
</template>

<script setup lang="ts">
import type { Todo, TodoUpdateRequest, TodoStatus } from '~/types/todo'
import { formatDate, formatDateTime, getStatusColor, getStatusVariant, TODO_STATUSES } from '~/types/todo'

// Meta設定
useHead({
  title: 'TODO編集 - Feature A',
  meta: [
    { name: 'description', content: 'TODOタスクの編集画面' }
  ]
})

// Router
const route = useRoute()
const todoId = parseInt(route.params.id as string)

// State
const originalTodo = ref<Todo>({} as Todo)
const form = ref<TodoUpdateRequest & { status: TodoStatus }>({
  title: '',
  content: '',
  dueDate: null,
  status: '未着手'
})

const errors = ref<Record<string, string>>({})
const fetchError = ref(false)

const loading = ref({
  fetch: false,
  update: false
})

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

// Computed
const hasChanges = computed(() => {
  return (
    form.value.title !== originalTodo.value.title ||
    form.value.content !== originalTodo.value.content ||
    form.value.dueDate !== originalTodo.value.dueDate ||
    form.value.status !== originalTodo.value.status
  )
})

// Methods
const loadTodo = async () => {
  try {
    loading.value.fetch = true
    fetchError.value = false
    
    const response = await $fetch<{ success: boolean; data: Todo }>(`/api/todos`, {
      query: { id: todoId }
    })
    
    if (response.success && response.data) {
      originalTodo.value = response.data
      
      // フォームに初期値を設定
      form.value = {
        title: originalTodo.value.title,
        content: originalTodo.value.content,
        dueDate: originalTodo.value.dueDate,
        status: originalTodo.value.status
      }
    } else {
      throw new Error('Failed to load todo')
    }
  } catch (error) {
    console.error('TODO取得に失敗しました:', error)
    fetchError.value = true
  } finally {
    loading.value.fetch = false
  }
}

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

const getChanges = () => {
  const changes = []
  
  if (form.value.title !== originalTodo.value.title) {
    changes.push({
      field: 'タイトル',
      before: originalTodo.value.title,
      after: form.value.title
    })
  }
  
  if (form.value.content !== originalTodo.value.content) {
    changes.push({
      field: '内容',
      before: originalTodo.value.content || '（未入力）',
      after: form.value.content || '（未入力）'
    })
  }
  
  if (form.value.dueDate !== originalTodo.value.dueDate) {
    changes.push({
      field: '期日',
      before: originalTodo.value.dueDate ? formatDate(originalTodo.value.dueDate) : '未設定',
      after: form.value.dueDate ? formatDate(form.value.dueDate) : '未設定'
    })
  }
  
  if (form.value.status !== originalTodo.value.status) {
    changes.push({
      field: 'ステータス',
      before: originalTodo.value.status,
      after: form.value.status
    })
  }
  
  return changes
}

const handleSubmit = () => {
  if (!validateForm()) return
  if (!hasChanges.value) return
  confirmModal.value.isOpen = true
}

const handlePreview = () => {
  if (!validateForm()) return
  previewModal.value.isOpen = true
}

const handleSubmitFromPreview = () => {
  previewModal.value.isOpen = false
  if (!hasChanges.value) return
  confirmModal.value.isOpen = true
}

const handleReset = () => {
  form.value = {
    title: originalTodo.value.title,
    content: originalTodo.value.content,
    dueDate: originalTodo.value.dueDate,
    status: originalTodo.value.status
  }
  errors.value = {}
}

const executeUpdate = async () => {
  if (!validateForm()) return
  
  try {
    loading.value.update = true
    
    const updateData: TodoUpdateRequest = {
      title: form.value.title,
      content: form.value.content,
      dueDate: form.value.dueDate,
      status: form.value.status
    }
    
    const response = await $fetch('/api/todos', {
      method: 'PUT',
      query: { id: todoId },
      body: updateData
    })
    
    if (response.success) {
      useToast().add({
        title: '成功',
        description: 'TODOを更新しました。',
        color: 'success'
      })
      
      confirmModal.value.isOpen = false
      
      // 最新データを再読み込み
      await loadTodo()
    } else {
      throw new Error('Failed to update todo')
    }
  } catch (error) {
    console.error('TODO更新に失敗しました:', error)
    useToast().add({
      title: 'エラー',
      description: 'TODO更新に失敗しました。',
      color: 'error'
    })
  } finally {
    loading.value.update = false
  }
}

const handleCancel = () => {
  if (hasChanges.value) {
    if (confirm('変更内容が失われますが、よろしいですか？')) {
      navigateTo('/')
    }
  } else {
    navigateTo('/')
  }
}

// Lifecycle
onMounted(() => {
  if (!todoId || isNaN(todoId)) {
    fetchError.value = true
    return
  }
  
  loadTodo()
})
</script>
