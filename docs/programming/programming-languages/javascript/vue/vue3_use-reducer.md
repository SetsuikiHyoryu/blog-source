---
lang: zh-CN
description: 学习在 Vue3 中使用 useReducer

sidebar:
  - text: 上一级
    link: ./

  - ./vue3_use-reducer.md
---

# 学习在 Vue3 中使用 useReducer

- 教程：<https://www.bilibili.com/video/BV1n34y1e7ui>
- 我的仓库：<https://github.com/SetsuikiHyoryu/vue3_use-reducer>

※ 出于省力的目的，本文中省略了一些对非重点的文件、定义的说明，对 Vue 不熟悉的同志请查看我的仓库

## src 下的目录结构

```shell
E:.
│   App.vue
│   env.d.ts
│   main.ts
│
├───assets
│       logo.png
│
├───components
├───hooks
│       index.ts
│       useReducer.ts
│
└───views
    │   .keep
    │
    └───TodoAPP
        │   index.vue
        │   TodoForm.vue
        │   TodoList.vue
        │
        └───store
                actions.ts
                actionTypes.ts
                index.ts
                reducer.ts
                types.ts

```

## 1. 创建 useReducer

1. `src` 下新建 `hooks` 目录
2. 创建 `useReducer.ts` 文件并定义 `useReducer`
3. 创建 `index.ts` 文件将 `useReducer` 导出

### useReducer.ts

```typescript
import type { Ref, UnwrapRef } from 'vue'

import { ref } from 'vue'

export interface Action {
  type: string
  payload: any
}

export interface Reducer {
  (state: Ref<any>, action: Action): void
}

export interface Dispatch {
  (action: Action): void
}

function useReducer<State>(
  reducer: Reducer,
  initialState: State
): [Ref<UnwrapRef<State>>, Dispatch] {
  const state = ref<State>(initialState)

  const dispatch = (action: Action): void => {
    reducer(state, action)
  }

  return [state, dispatch]
}

export default useReducer

```

## 2. 创建 reducer

1. 在需要使用 reducer 的组件目录下创建 `store` 目录
2. 在 `store` 目录中定义 `reducer.ts` 文件并定义 `todoReducer`
   - 同时可以创建并定义 `index.ts`、`actionTypes`、`types` 等文件、定义

### reducer.ts

```typescript
import type { Action } from '@/hooks/useReducer'
import type { TodoList } from './types'
import type { Ref } from 'vue'

import { addTodo, removeTodo, toggleTodo } from './action'
import actionTypes from './actionTypes'

export function todoReducer(state: Ref<TodoList>, action: Action) {
  const { type, payload }: Action = action

  const actionMap = new Map<string, Function>([
    [actionTypes.ADD_TODO, addTodo],
    [actionTypes.TOGGLE_TODO, toggleTodo],
    [actionTypes.REMOVE_TODO, removeTodo],
  ])

  actionMap.get(type)?.(state, payload)
}

```

## 3. 创建 action

1. 在 `store` 目录下创建 `actions.ts`

### actions.ts

```typescript
import type { Ref } from 'vue'
import type { TodoItem, TodoList } from './types'

export function addTodo(state: Ref<TodoList>, payload: TodoItem) {
  state.value.push(payload)
}

export function toggleTodo(state: Ref<TodoList>, payload: number) {
  state.value = state.value.map<TodoItem>((item) => {
    item.id === payload && (item.completed = !item.completed)
    return item
  })
}

export function removeTodo(state: Ref<TodoList>, payload: number) {
  console.log(state.value, payload)
  state.value = state.value.filter(
    (item: TodoItem): boolean => item.id !== payload
  )
}

```

## 4. 在画面组件中使用 reducer

```html
<script lang="ts">
export default { name: 'TodoAPP' }
</script>

<script setup lang="ts">
import TodoListVue from './TodoList.vue'
import TodoForm from './TodoForm.vue'

import type { TodoItem, TodoList } from './store/types'

import { useReducer } from '@/hooks'
import { todoReducer } from './store/reducer'
import { actionTypes } from './store'

// 此次直接赋了空白数组，也可以在 `store` 目录下创建 `state.ts` 对初始值集中管理
const [todoList, todoDispatch] = useReducer<TodoList>(todoReducer, [])

function addTodo(todo: TodoItem) {
  todoDispatch({ type: actionTypes.ADD_TODO, payload: todo })
}

function toggleTodo(id: number) {
  todoDispatch({ type: actionTypes.TOGGLE_TODO, payload: id })
}

function removeTodo(id: number) {
  todoDispatch({ type: actionTypes.REMOVE_TODO, payload: id })
}
</script>

<template>
  <div id="todo-app">
    <TodoForm @add-todo="addTodo" />

    <TodoListVue
      class="todo-list"
      :todo-list="todoList"
      @toggle-todo="toggleTodo"
      @remove-todo="removeTodo"
    />
  </div>
</template>

<style scope>
#todo-app {
  height: 100%;
  padding: 2rem;
}

.todo-list {
  margin: 1rem 0 0 !important;
}
</style>

```
