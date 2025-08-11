// Feature A - TODO API (オンメモリ版)
// 将来的にはRDBに接続する予定

import type { Todo, TodoStatus, TodoCreateRequest, TodoUpdateRequest } from '~/types/todo'

// オンメモリストレージ（サーバー再起動でリセット）
let todos: Todo[] = [
  {
    id: 1,
    title: 'プロジェクト計画書作成',
    content: '新規プロジェクトの詳細な計画書を作成する。スコープ、スケジュール、リソースを明確にする。',
    dueDate: '2024-02-15',
    status: '未着手',
    createdAt: '2024-01-01T10:00:00Z',
    createdBy: 'dummy-user-001',
    updatedAt: '2024-01-01T10:00:00Z',
    updatedBy: 'dummy-user-001'
  },
  {
    id: 2,
    title: 'API設計レビュー',
    content: 'REST API設計書のレビューを実施。エンドポイント設計、データモデル、エラーハンドリングを確認する。',
    dueDate: '2024-02-10',
    status: '着手中',
    createdAt: '2024-01-02T11:00:00Z',
    createdBy: 'dummy-user-001',
    updatedAt: '2024-01-05T14:30:00Z',
    updatedBy: 'dummy-user-001'
  },
  {
    id: 3,
    title: 'データベース設計',
    content: 'PostgreSQLを使用したデータベーススキーマ設計。正規化、インデックス設計、パフォーマンス考慮。',
    dueDate: '2024-02-20',
    status: '完了',
    createdAt: '2024-01-03T09:00:00Z',
    createdBy: 'dummy-user-001',
    updatedAt: '2024-01-10T16:45:00Z',
    updatedBy: 'dummy-user-001'
  }
]

let nextId = 4

export default defineEventHandler(async (event) => {
  const method = getMethod(event)
  const query = getQuery(event)
  const url = event.node.req.url?.split('/').pop()
  
  console.log(`Feature A API - ${method} /api/todos`, { query, url })

  switch (method) {
    case 'GET':
      // クエリパラメータでIDが指定されている場合（単一TODO取得）
      if (query.id) {
        const todoId = parseInt(query.id as string)
        const todo = todos.find(t => t.id === todoId && t.status !== '削除')
        
        if (!todo) {
          throw createError({
            statusCode: 404,
            statusMessage: 'TODO not found'
          })
        }
        
        return {
          success: true,
          data: todo
        }
      } else {
        // TODO一覧取得（ページネーション付き）
        const page = parseInt(query.page as string) || 1
        const limit = parseInt(query.limit as string) || 10
        const status = query.status as TodoStatus
        const search = query.search as string
        
        // フィルタリング
        let filteredTodos = todos.filter(todo => todo.status !== '削除')
        
        if (status) {
          filteredTodos = filteredTodos.filter(todo => todo.status === status)
        }
        
        if (search) {
          filteredTodos = filteredTodos.filter(todo => 
            todo.title.toLowerCase().includes(search.toLowerCase()) ||
            todo.content.toLowerCase().includes(search.toLowerCase())
          )
        }
        
        // ソート（更新日降順）
        filteredTodos.sort((a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime())
        
        // ページネーション
        const total = filteredTodos.length
        const totalPages = Math.ceil(total / limit)
        const offset = (page - 1) * limit
        const paginatedTodos = filteredTodos.slice(offset, offset + limit)
        
        return {
          success: true,
          data: paginatedTodos,
          pagination: {
            total,
            page,
            limit,
            totalPages
          }
        }
      }

    case 'POST':
      // TODO作成
      const body: TodoCreateRequest = await readBody(event)
      
      if (!body.title) {
        throw createError({
          statusCode: 400,
          statusMessage: 'Title is required'
        })
      }
      
      const newTodo: Todo = {
        id: nextId++,
        title: body.title,
        content: body.content || '',
        dueDate: body.dueDate || null,
        status: body.status || '未着手',
        createdAt: new Date().toISOString(),
        createdBy: 'dummy-user-001', // 後でJWTから取得
        updatedAt: new Date().toISOString(),
        updatedBy: 'dummy-user-001'
      }
      
      todos.unshift(newTodo)
      
      console.log('Feature A API - TODO created:', newTodo)
      
      return {
        success: true,
        data: newTodo
      }

    case 'PUT':
      // TODO更新
      const todoId = parseInt((query.id as string) || (url as string))
      const updateBody: TodoUpdateRequest = await readBody(event)
      
      const todoIndex = todos.findIndex(t => t.id === todoId)
      if (todoIndex === -1) {
        throw createError({
          statusCode: 404,
          statusMessage: 'TODO not found'
        })
      }
      
      todos[todoIndex] = {
        ...todos[todoIndex],
        ...updateBody,
        updatedAt: new Date().toISOString(),
        updatedBy: 'dummy-user-001' // 後でJWTから取得
      }
      
      console.log('Feature A API - TODO updated:', todos[todoIndex])
      
      return {
        success: true,
        data: todos[todoIndex]
      }

    case 'DELETE':
      // TODO削除（論理削除）
      const deleteId = parseInt((query.id as string) || (url as string))
      const deleteIndex = todos.findIndex(t => t.id === deleteId)
      
      if (deleteIndex === -1) {
        throw createError({
          statusCode: 404,
          statusMessage: 'TODO not found'
        })
      }
      
      // 論理削除
      todos[deleteIndex] = {
        ...todos[deleteIndex],
        status: '削除',
        updatedAt: new Date().toISOString(),
        updatedBy: 'dummy-user-001'
      }
      
      console.log('Feature A API - TODO deleted:', todos[deleteIndex])
      
      return {
        success: true,
        data: todos[deleteIndex]
      }

    default:
      throw createError({
        statusCode: 405,
        statusMessage: 'Method not allowed'
      })
  }
})
