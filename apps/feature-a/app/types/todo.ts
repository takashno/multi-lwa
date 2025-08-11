// Feature A - TODO型定義
// TODOアプリのドメインモデル

export type TodoStatus = '未着手' | '着手中' | '完了' | '削除'

export interface Todo {
  id: number
  title: string
  content: string
  dueDate: string | null // ISO 8601形式 (YYYY-MM-DD)
  status: TodoStatus
  createdAt: string // ISO 8601形式
  createdBy: string // ユーザーID
  updatedAt: string // ISO 8601形式
  updatedBy: string // ユーザーID
}

export interface TodoCreateRequest {
  title: string
  content?: string
  dueDate?: string | null
  status?: TodoStatus
}

export interface TodoUpdateRequest {
  title?: string
  content?: string
  dueDate?: string | null
  status?: TodoStatus
}

export interface TodoListResponse {
  success: boolean
  data: Todo[]
  pagination?: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

export interface TodoResponse {
  success: boolean
  data: Todo
}

// 定数
export const TODO_STATUSES: TodoStatus[] = ['未着手', '着手中', '完了', '削除']

// ユーティリティ関数
export const formatDate = (dateString: string | null): string => {
  if (!dateString) return ''
  return new Date(dateString).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

export const formatDateTime = (dateString: string): string => {
  return new Date(dateString).toLocaleDateString('ja-JP', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  })
}

export const getStatusColor = (status: TodoStatus): 'primary' | 'secondary' | 'success' | 'info' | 'warning' | 'error' | 'neutral' => {
  switch (status) {
    case '未着手':
      return 'neutral'
    case '着手中':
      return 'warning'
    case '完了':
      return 'success'
    case '削除':
      return 'error'
    default:
      return 'neutral'
  }
}

export const getStatusVariant = (status: TodoStatus): 'solid' | 'soft' | 'outline' | 'subtle' => {
  switch (status) {
    case '未着手':
      return 'soft'
    case '着手中':
      return 'solid'
    case '完了':
      return 'solid'
    case '削除':
      return 'soft'
    default:
      return 'soft'
  }
}

export const isDueSoon = (dueDate: string | null, days: number = 3): boolean => {
  if (!dueDate) return false
  const due = new Date(dueDate)
  const now = new Date()
  const diffTime = due.getTime() - now.getTime()
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
  return diffDays <= days && diffDays >= 0
}

export const isOverdue = (dueDate: string | null): boolean => {
  if (!dueDate) return false
  const due = new Date(dueDate)
  const now = new Date()
  return due < now
}
