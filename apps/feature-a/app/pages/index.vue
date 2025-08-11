<template>
  <div class="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
    <!-- ヘッダー -->
    <div class="bg-white shadow-sm border-b border-gray-100">
      <div class="container mx-auto px-6 py-6">
        <div class="flex items-center justify-between">
          <div class="flex items-center space-x-4">
            <div class="p-2 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl">
              <UIcon name="i-heroicons-clipboard-document-list" class="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 class="text-3xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                TODO一覧
              </h1>
              <p class="text-gray-600 mt-1">タスクを効率的に管理しましょう</p>
            </div>
          </div>
          <UButton
            icon="i-heroicons-plus"
            size="lg"
            @click="navigateTo('/new')"
            class="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            新規作成
          </UButton>
        </div>
      </div>
    </div>

    <div class="container mx-auto px-6 py-8">
      <!-- フィルター・検索エリア -->
      <UCard class="mb-8 bg-white shadow-xl border-0 rounded-2xl overflow-hidden">
        <template #header>
          <div class="bg-gradient-to-r from-gray-50 to-gray-100 p-6 -m-6 mb-6">
            <div class="flex items-center space-x-3">
              <UIcon name="i-heroicons-funnel" class="w-5 h-5 text-gray-600" />
              <h2 class="text-lg font-semibold text-gray-800">フィルター・検索</h2>
            </div>
          </div>
        </template>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6 p-6 -m-6">
          <!-- 検索 -->
          <div class="space-y-2">
            <label class="flex items-center space-x-2 text-sm font-semibold text-gray-700">
              <UIcon name="i-heroicons-magnifying-glass" class="w-4 h-4 text-blue-500" />
              <span>検索</span>
            </label>
            <UInput
              v-model="searchQuery"
              placeholder="タイトルや内容で検索..."
              icon="i-heroicons-magnifying-glass"
              @input="handleSearch"
              class="rounded-xl shadow-lg ring-1 ring-gray-200 focus:ring-2 focus:ring-blue-500 transition-all duration-200"
            />
          </div>
          <!-- ステータスフィルター -->
          <div class="space-y-2">
            <label class="flex items-center space-x-2 text-sm font-semibold text-gray-700">
              <UIcon name="i-heroicons-flag" class="w-4 h-4 text-green-500" />
              <span>ステータス</span>
            </label>
            <USelect
              v-model="statusFilter"
              :options="statusOptions"
              placeholder="ステータスで絞り込み"
              @change="loadTodos"
              class="rounded-xl shadow-lg ring-1 ring-gray-200 focus:ring-2 focus:ring-green-500 transition-all duration-200"
            />
          </div>
          <!-- 表示件数 -->
          <div class="space-y-2">
            <label class="flex items-center space-x-2 text-sm font-semibold text-gray-700">
              <UIcon name="i-heroicons-list-bullet" class="w-4 h-4 text-purple-500" />
              <span>表示件数</span>
            </label>
            <USelect
              v-model="pageSize"
              :options="pageSizeOptions"
              @change="handlePageSizeChange"
              class="rounded-xl shadow-lg ring-1 ring-gray-200 focus:ring-2 focus:ring-purple-500 transition-all duration-200"
            />
          </div>
        </div>
      </UCard>

      <!-- TODO一覧テーブル -->
      <UCard class="bg-white shadow-xl border-0 rounded-2xl overflow-hidden">
        <template #header>
          <div class="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6 -m-6 mb-6">
            <div class="flex items-center justify-between">
              <div class="flex items-center space-x-3">
                <UIcon name="i-heroicons-clipboard-document-list" class="w-6 h-6" />
                <h2 class="text-xl font-semibold">
                  TODO一覧 ({{ pagination.total }}件)
                </h2>
              </div>
              <UButton
                variant="ghost"
                icon="i-heroicons-arrow-path"
                @click="loadTodos"
                :loading="pending"
                class="text-white hover:bg-white/20 transition-colors duration-200"
              >
                更新
              </UButton>
            </div>
            <p class="text-blue-100 mt-2 text-sm">クリックして詳細を表示・編集できます</p>
          </div>
        </template>

        <div v-if="pending" class="flex justify-center py-12">
          <div class="flex flex-col items-center space-y-4">
            <UIcon name="i-heroicons-arrow-path" class="animate-spin text-blue-600" size="32" />
            <p class="text-gray-600 font-medium">データを読み込み中...</p>
          </div>
        </div>

        <div v-else-if="todos.length === 0" class="text-center py-16">
          <div class="bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl p-8 mx-8">
            <UIcon name="i-heroicons-document-text" class="mx-auto text-gray-400 mb-6" size="64" />
            <h3 class="text-xl font-semibold text-gray-900 mb-3">TODOがありません</h3>
            <p class="text-gray-600 mb-6 max-w-md mx-auto">
              {{ searchQuery || statusFilter ? '検索条件に一致するTODOが見つかりません。条件を変更してみてください。' : '最初のTODOを作成して、タスク管理を始めましょう！' }}
            </p>
            <UButton 
              @click="navigateTo('/new')" 
              v-if="!searchQuery && !statusFilter"
              icon="i-heroicons-plus"
              class="bg-gradient-to-r from-blue-500 to-indigo-600 hover:from-blue-600 hover:to-indigo-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
            >
              最初のTODOを作成
            </UButton>
          </div>
        </div>

        <div v-else class="overflow-hidden rounded-xl">
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200">
              <thead class="bg-gradient-to-r from-gray-50 to-gray-100">
                <tr>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <div class="flex items-center space-x-2">
                      <UIcon name="i-heroicons-document-text" class="w-4 h-4 text-blue-500" />
                      <span>タイトル</span>
                    </div>
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <div class="flex items-center space-x-2">
                      <UIcon name="i-heroicons-calendar-days" class="w-4 h-4 text-yellow-500" />
                      <span>期日</span>
                    </div>
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <div class="flex items-center space-x-2">
                      <UIcon name="i-heroicons-flag" class="w-4 h-4 text-green-500" />
                      <span>ステータス</span>
                    </div>
                  </th>
                  <th class="px-6 py-4 text-left text-xs font-bold text-gray-700 uppercase tracking-wider">
                    <div class="flex items-center space-x-2">
                      <UIcon name="i-heroicons-clock" class="w-4 h-4 text-purple-500" />
                      <span>更新日</span>
                    </div>
                  </th>
                  <th class="px-6 py-4 text-right text-xs font-bold text-gray-700 uppercase tracking-wider">
                    操作
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white divide-y divide-gray-100">
                <tr
                  v-for="todo in todos"
                  :key="todo.id"
                  class="hover:bg-gradient-to-r hover:from-blue-50 hover:to-indigo-50 transition-all duration-200 cursor-pointer group"
                  @click="navigateTo(`/edit/${todo.id}`)"
                >
                  <td class="px-6 py-5">
                    <div class="max-w-xs">
                      <h4 class="text-sm font-semibold text-gray-900 truncate group-hover:text-blue-700 transition-colors duration-200">
                        {{ todo.title }}
                      </h4>
                      <p class="text-sm text-gray-600 truncate mt-1" v-if="todo.content">
                        {{ todo.content }}
                      </p>
                    </div>
                  </td>
                  <td class="px-6 py-5 whitespace-nowrap">
                    <div v-if="todo.dueDate" class="flex items-center space-x-2">
                      <span class="text-sm text-gray-900 font-medium">
                        {{ formatDate(todo.dueDate) }}
                      </span>
                      <UIcon 
                        v-if="isOverdue(todo.dueDate)" 
                        name="i-heroicons-exclamation-triangle" 
                        class="w-4 h-4 text-red-500" 
                      />
                      <UIcon 
                        v-else-if="isDueSoon(todo.dueDate)" 
                        name="i-heroicons-clock" 
                        class="w-4 h-4 text-yellow-500" 
                      />
                    </div>
                    <span v-else class="text-sm text-gray-400 italic">未設定</span>
                  </td>
                  <td class="px-6 py-5 whitespace-nowrap">
                    <UBadge
                      :color="getStatusColor(todo.status)"
                      :variant="getStatusVariant(todo.status)"
                      class="px-3 py-1 text-xs font-semibold"
                    >
                      {{ todo.status }}
                    </UBadge>
                  </td>
                  <td class="px-6 py-5 whitespace-nowrap text-sm text-gray-600 font-medium">
                    {{ formatDateTime(todo.updatedAt) }}
                  </td>
                  <td class="px-6 py-5 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex justify-end space-x-2">
                      <UButton
                        variant="ghost"
                        size="sm"
                        icon="i-heroicons-pencil"
                        @click.stop="navigateTo(`/edit/${todo.id}`)"
                        class="hover:bg-blue-100 hover:text-blue-700 transition-colors duration-200"
                      >
                        編集
                      </UButton>
                      <UButton
                        variant="ghost"
                        size="sm"
                        color="error"
                        icon="i-heroicons-trash"
                        @click.stop="handleDelete(todo)"
                        :loading="deletingIds.has(todo.id)"
                        class="hover:bg-red-100 hover:text-red-700 transition-colors duration-200"
                      >
                        削除
                      </UButton>
                    </div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- ページネーション -->
        <template #footer v-if="pagination.totalPages > 1">
          <div class="bg-gradient-to-r from-gray-50 to-gray-100 p-6 -m-6 border-t border-gray-200">
            <div class="flex items-center justify-between">
              <div class="text-sm text-gray-700 font-medium">
                {{ (pagination.page - 1) * pagination.limit + 1 }}～{{ Math.min(pagination.page * pagination.limit, pagination.total) }}件 / {{ pagination.total }}件
              </div>
              <UPagination
                v-model="pagination.page"
                :page-count="pagination.limit"
                :total="pagination.total"
                @update:model-value="handlePageChange"
                class="[&>*]:shadow-lg [&>*]:border-0"
              />
            </div>
          </div>
        </template>
      </UCard>

      <!-- 削除確認モーダル -->
      <UModal v-model="deleteModal.isOpen">
        <UCard class="bg-white rounded-2xl shadow-2xl border-0 overflow-hidden max-w-lg">
          <template #header>
            <div class="bg-gradient-to-r from-red-500 to-pink-600 text-white p-6 -m-6 mb-6">
              <div class="flex items-center space-x-3">
                <div class="p-2 bg-white/20 rounded-lg">
                  <UIcon name="i-heroicons-exclamation-triangle" class="w-5 h-5" />
                </div>
                <h3 class="text-xl font-semibold">TODO削除の確認</h3>
              </div>
              <p class="text-red-100 mt-2 text-sm">この操作は取り消すことができません</p>
            </div>
          </template>

          <div class="space-y-4 p-6 -m-6">
            <p class="text-gray-600">
              以下のTODOを削除してもよろしいですか？
            </p>
            <div class="bg-gradient-to-br from-red-50 to-pink-50 rounded-xl p-4 border border-red-100">
              <h4 class="font-semibold text-gray-900 mb-2">{{ deleteModal.todo?.title }}</h4>
              <p class="text-sm text-gray-600" v-if="deleteModal.todo?.content">
                {{ deleteModal.todo.content }}
              </p>
            </div>
            <div class="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
              <div class="flex items-center space-x-2">
                <UIcon name="i-heroicons-exclamation-triangle" class="w-4 h-4 text-yellow-600" />
                <p class="text-sm text-yellow-800 font-medium">
                  削除されたTODOは復元できません。
                </p>
              </div>
            </div>
          </div>

          <template #footer>
            <div class="flex justify-end space-x-4 p-6 -m-6 bg-gray-50 border-t border-gray-100">
              <UButton
                variant="ghost"
                @click="deleteModal.isOpen = false"
                icon="i-heroicons-x-mark"
                class="hover:bg-gray-200 transition-colors duration-200"
              >
                キャンセル
              </UButton>
              <UButton
                color="error"
                @click="confirmDelete"
                :loading="deleteModal.loading"
                icon="i-heroicons-trash"
                class="bg-gradient-to-r from-red-500 to-pink-600 hover:from-red-600 hover:to-pink-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
              >
                {{ deleteModal.loading ? '削除中...' : '削除する' }}
              </UButton>
            </div>
          </template>
        </UCard>
      </UModal>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Todo, TodoStatus, TodoListResponse } from '~/types/todo'
import { formatDate, formatDateTime, getStatusColor, getStatusVariant, isDueSoon, isOverdue } from '~/types/todo'

// Meta設定
useHead({
  title: 'TODO一覧 - Feature A',
  meta: [
    { name: 'description', content: 'TODOタスクの一覧表示・管理画面' }
  ]
})

// State
const todos = ref<Todo[]>([])
const pending = ref(false)
const searchQuery = ref('')
const statusFilter = ref<TodoStatus | ''>('')
const pageSize = ref(10)
const deletingIds = ref(new Set<number>())

// ページネーション
const pagination = ref({
  page: 1,
  limit: 10,
  total: 0,
  totalPages: 0
})

// 削除モーダル
const deleteModal = ref({
  isOpen: false,
  todo: null as Todo | null,
  loading: false
})

// Options
const statusOptions = [
  { label: 'すべて', value: '' },
  { label: '未着手', value: '未着手' },
  { label: '着手中', value: '着手中' },
  { label: '完了', value: '完了' }
]

const pageSizeOptions = [
  { label: '10件表示', value: 10 },
  { label: '25件表示', value: 25 },
  { label: '50件表示', value: 50 }
]

// Methods
const loadTodos = async () => {
  try {
    pending.value = true
    
    const params = new URLSearchParams({
      page: pagination.value.page.toString(),
      limit: pagination.value.limit.toString()
    })
    
    if (searchQuery.value) {
      params.append('search', searchQuery.value)
    }
    
    if (statusFilter.value) {
      params.append('status', statusFilter.value)
    }
    
    const response = await $fetch<TodoListResponse>(`/api/todos?${params}`)
    
    if (response.success) {
      todos.value = response.data
      pagination.value = response.pagination!
    } else {
      throw new Error('Failed to load todos')
    }
  } catch (error) {
    console.error('TODO一覧の取得に失敗しました:', error)
    useToast().add({
      title: 'エラー',
      description: 'TODO一覧の取得に失敗しました。',
      color: 'error'
    })
  } finally {
    pending.value = false
  }
}

const handleSearch = useDebounceFn(() => {
  pagination.value.page = 1
  loadTodos()
}, 300)

const handlePageChange = (page: number) => {
  pagination.value.page = page
  loadTodos()
}

const handlePageSizeChange = () => {
  pagination.value.limit = pageSize.value
  pagination.value.page = 1
  loadTodos()
}

const handleDelete = (todo: Todo) => {
  deleteModal.value.todo = todo
  deleteModal.value.isOpen = true
}

const confirmDelete = async () => {
  if (!deleteModal.value.todo) return
  
  try {
    deleteModal.value.loading = true
    deletingIds.value.add(deleteModal.value.todo.id)
    
    await $fetch(`/api/todos`, {
      method: 'DELETE',
      query: { id: deleteModal.value.todo.id }
    })
    
    useToast().add({
      title: '成功',
      description: 'TODOを削除しました。',
      color: 'success'
    })
    
    deleteModal.value.isOpen = false
    deleteModal.value.todo = null
    
    // 一覧を再読み込み
    await loadTodos()
  } catch (error) {
    console.error('TODO削除に失敗しました:', error)
    useToast().add({
      title: 'エラー',
      description: 'TODO削除に失敗しました。',
      color: 'error'
    })
  } finally {
    deleteModal.value.loading = false
    if (deleteModal.value.todo) {
      deletingIds.value.delete(deleteModal.value.todo.id)
    }
  }
}

// Lifecycle
onMounted(() => {
  loadTodos()
})
</script>
