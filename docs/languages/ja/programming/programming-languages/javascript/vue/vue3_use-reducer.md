---
lang: ja
description: Vue3 の中で useReducer を実装することを学習する

sidebar:
  - text: 戻る
    link: ./

  - ./vue3_use-reducer.md
---

# Vue3 の中で useReducer を実装することを学習する

- 学習した課程：<https://www.bilibili.com/video/BV1n34y1e7ui>
- 私の倉庫：<https://github.com/SetsuikiHyoryu/vue3_use-reducer>

※ 手間を省ける為に、本文では今回のポイントではないファイルや定義への説明を省略した。Vue に詳しくない同志は私の倉庫を見てください。

## src 内のディレクトリ構造

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

## 1. useReducer を作成

1. `src` の中で `hooks` ディレクトリを作成
2. `useReducer.ts` を作成し、`useReducer` を定義する
3. `index.ts` を作成し、`useReducer` を書き出す

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

## 2. reducer を作成

1. reducer の使用が必要の部品のディレクトリの中で `store` ディレクトリを作成
2. `store` の中で `reducer.ts` を作成し、 `todoReducer` を定義する
   - 同時に `index.ts`、`actionTypes`、`types` を定義する

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

## 3. action を作成

1. `store` の中で `actions.ts` を作成

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

## 4. 画面部品の中で reducer を使用

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

// 今回は直接空白の配列を与えたが、`store` ディレクトリの中に `state.ts` を作成して初期値を集中的に管理することも可能
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
