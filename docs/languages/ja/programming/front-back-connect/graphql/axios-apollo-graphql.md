---
lang: ja
description: axios と Apollo で GraphQL を学習する

sidebar:
  - text: 戻る
    link: ../../front-back-connect/
  
  - ./axios-apollo-graphql.md
---

# axios と Apollo で GraphQL を学習する

## 技術スタック

|技術スタック|応用範囲|説明|
|-|-|-|
|TypeScript|クライアント側 / サーバー側|言語|
|Vue3|クライアント側|JavaScript フレームワーク|
|Vite|クライアント側|Vue フレームワーク|
|axios|クライアント側|HTTP リクエストの実現|
|GraphQL|クライアント側 / サーバー側|クライアント、サーバー間データクエリ言語|
|Express|サーバー側|Node フレームワーク|
|Apollo|サーバー側|GraphQL サーバー側実現|
|Mongoose|サーバー側|MongoDB に基づいたデータモデル定義実現|
|MongoDB|データベース|ドキュメント指向データベース|
|Docker|アプリケーション管理プラットフォーム|本プロジェクトは MongoDB を Docker の中に入れている|

## ソース倉庫

- [クライアント側](https://github.com/SetsuikiHyoryu/vue3_study_comprehensive)
- [サーバー側](https://github.com/SetsuikiHyoryu/vue3_study_comprehensive_server)

## Vite で Vue プロジェクトを作成

vite ホームページ：<https://ja.vitejs.dev/guide/>

### axios を使用

axios ホームページ：<https://github.com/axios/axios>

#### 1. axios インスタンスの作成及び axios をパッケージング

```typescript
// src/utils/http/axios/index.ts

import axios from 'axios'

// 1. axios インスタンスを作成
const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 1000,
})

// 2. axios リクエストをパッケージング
export const sendRequest = async (
  query: string,
  variables?: { [property: string]: any }
): Promise<{ [property: string]: any }> => {
  const { data } = await axiosInstance({
    method: 'POST',
    url: '',
    data: { query, variables },
  })

  return data.data
}
```

#### 2. API を作成

1. パラメータ及び戻り値のモデルを作成

   ```typescript
   // src/api/model/works.ts

   // 作品信息
   export interface WorkModel {
     title: string
     author: string
   }

   // 获取作品参数
   export interface QueryWorksParameters {
     title?: string
     author?: string
   }

   // 获取作品列表返回值
   export type QueryWorksModel = WorkModel[]

   ```

2. API を作成

   ```typescript
   // src/api/works.ts

   import { sendRequest } from '../utils/http/axios'
   import type { QueryWorksModel, WorkModel } from './model'
   import { QueryWorksParameters } from './model/works'

   export const queryWorks = async ({
     title,
     author,
   }: QueryWorksParameters): Promise<QueryWorksModel> => {
     const query = `
       query getWorks($title: String, $author: String) {
         works(title: $title, author: $author) {
           title
           author
         }
       }
     `

     const { works } = await sendRequest(query, { title, author })

     return works
   }

   export const addWork = async ({ title, author }: WorkModel): Promise<boolean> => {
     const mutation = `
       mutation addWork($title: String!, $author: String!) {
         addWork(title: $title, author: $author)
       }
     `

     const { addWork } = await sendRequest(mutation, { title, author })

     return addWork
   }

   ```

#### 3. 画面で API をコール

```vue
<!-- src/App.vue -->

<script setup lang="ts">
import BaseButton from './components/button/BaseButton.vue'

import { InputHTMLAttributes, reactive, ref } from 'vue'
import { queryWorks, addWork } from './api/works'
import type { QueryWorksModel, WorkModel } from './api/model'

// 输入
type FormState = WorkModel

const formState = reactive<FormState>({
  title: '',
  author: '',
})

const handleSetFormTitle = ($envet: Event): void => {
  message.value = ''
  formState.title = ($envet.target as InputHTMLAttributes).value
}

const handleSetFormAuthor = ($evnet: Event): void => {
  message.value = ''
  formState.author = ($evnet.target as InputHTMLAttributes).value
}

// 添加
const message = ref<string>('')

const handleAddWork = async (): Promise<void> => {
  const emptyExisted = Object.keys(formState).some((key: string): boolean => {
    const _key = key as keyof FormState
    return !formState[_key]
  })

  if (emptyExisted) {
    message.value = '增加时内容不可以为空'
    return
  }

  const successed: boolean = await addWork({
    title: formState.title,
    author: formState.author,
  })

  message.value = successed ? '添加成功' : '添加失败'
}

// 检索
const works = ref<QueryWorksModel>()

const handleSetWorks = async (): Promise<void> => {
  message.value = ''
  works.value = await queryWorks({ title: formState.title, author: formState.author })
}
</script>

<template>
  <div class="app">
    <div class="input-group">
      <input type="text" placeholder="请输入作品名" @input="handleSetFormTitle" />
      <input type="text" placeholder="请输入作者名" @input="handleSetFormAuthor" />
    </div>

    <div class="message">{{ message }}</div>

    <div class="button-group">
      <BaseButton title="请求作品" @click="handleSetWorks" />
      <BaseButton title="增加作品" @click="handleAddWork" />
    </div>

    <BaseButton
      class="delete-button"
      title="清除当前列表"
      @click="
        () => {
          works = []
          message = ''
        }
      "
    />

    <div v-for="(item, index) in works" :key="index" class="works-card">
      <span>作品名：《{{ item.title }}》</span>
      <span>作者：{{ item.author }}</span>
    </div>
  </div>
</template>

<style scoped>
.app {
  color: #000;
  font-size: 2rem;
}

.input-group {
  display: flex;
  gap: 1rem;
}

input {
  font-size: 1.3rem;
  padding: 0.5rem 1rem;
  width: 11rem;
}

.message {
  font-size: 1.2rem;
  margin: 1rem;
}

.button-group {
  display: flex;
  gap: 1rem;
  margin: 1rem 0 0;
}

.delete-button {
  margin: 1rem 0 0;
}

.works-card {
  background: rgba(255, 255, 255, 0.7);
  display: flex;
  flex-direction: column;
  font-size: 1.3rem;
  margin: 1rem 0 0 0;
  padding: 0.5rem 1rem;
  width: 20rem;
}

@media (max-width: 500px) {
  .input-group {
    flex-direction: column;
  }

  .button-group {
    flex-direction: column;
  }

  .works-card {
    width: 100%;
  }
}

@media (min-width: 501px) {
  .delete-button {
    width: 100%;
  }
}
</style>


```

## 安装 GraphQL、Apollo、Express

流れの冊子：<https://graphql.org/code/#javascript>

### Express を使用

express ホームページ：<https://expressjs.com/>

#### 1. サーバーを作成

1. src/app.ts を作成

   ```typescript
   // src\app.ts

   import express from 'express'
   import type { Express } from 'express'

   const app: Express = express()

   export default app
   ```

2. src/server.ts を作成

   ```typescript
   // src\server.ts

   import app from './app'

   const PORT = 9491

   app.get('/', (request, response) => {
     response.send('successed')
   })

   app.listen(PORT, () => {
     console.log(`您的服务已启动至 ${PORT} 端口`)
   })
   ```

3. 起動後に localhost に `successed` が表示されたら成功。

#### 2. Apollo を使用

Apollo ホームページ：<https://www.apollographql.com/docs/apollo-server/getting-started/>

1. 型を作成：src/schemas/typeDefs.ts

   ```typescript
   // src\schemas\typeDefs.ts

   import { gql } from 'apollo-server-express'

   const typeDefs = gql`
     type Work {
       title: String!
       author: String!
     }

     type Query {
       works: [Work]
     }
   `

   export default typeDefs

   ```

2. 解析機を作成：src/schemas/resolvers

   ```typescript
   // src\schemas\resolvers.ts

   // dummy data
   const works = [
     {
       title: '商君书',
       author: '商鞅',
     },
   ]

   const resolvers = {
     Query: {
       works: () => works,
     },
   }

   export default resolvers

   ```

3. Apollo サーバーインスタンスを作成

   ```typescript
   // src\app.ts

   import express from 'express'
   import type { Express } from 'express'
   import { createServer } from 'http'
   import type { Server } from 'http'
   import { ApolloServer, ExpressContext } from 'apollo-server-express'
   import { ApolloServerPluginDrainHttpServer } from 'apollo-server-core'
   import { typeDefs, resolvers } from './schemas'

   const app: Express = express()
   const httpServer: Server = createServer(app)

   const server = new ApolloServer<ExpressContext>({
     typeDefs,
     resolvers,
     plugins: [ApolloServerPluginDrainHttpServer({ httpServer })],
   })

   export { app, httpServer, server }
   ```

4. Apollo サーバーを起動

   ```typescript
   // src\server.ts

   import type { Server } from 'http'
   import { app, httpServer, server } from './app'

   const PORT = 9491

   const startApolloServer = async (): Promise<void> => {
     await server.start()

     server.applyMiddleware({ app })

     await new Promise(
       (resolve): Server => httpServer.listen({ port: PORT }, resolve as () => void)
     )

     console.log(`您的服务已启动至 ${PORT} 端口`)
   }

   startApolloServer()

   ```

## MongoDB を使用

### 1. Docker で MongoDB をインストール

- ユーザーの管理無しでは一部のアクセス権限が無いので管理が必要
- [Docker 安装 MongoDB](https://www.runoob.com/docker/docker-install-mongodb.html)
- [MongoDB用户权限管理配置](https://www.cnblogs.com/yucongblog/p/6595946.html)
- [MongoDB数据库、集合、文档的操作](https://www.cnblogs.com/yucongblog/p/6636112.html)

### 2. Mongoose で MongoDB に接続

Mongoose ホームページ：<https://mongoosejs.com/docs/index.html>

#### 1. Model を作成

```typescript
// src\models\works.ts

import { Schema, model } from 'mongoose'
import type { Model, Document } from 'mongoose'

export interface WorkInterface extends Document {
  title: string
  author: string
}

export interface QueryWorksParameters {
  title?: string
  author?: string
}

export type AddWorkParameter = WorkInterface

const WorkSchema: Schema = new Schema<WorkInterface>({
  title: { type: String, required: true },
  author: { type: String, required: true },
})

const WorkModel: Model<WorkInterface> = model<WorkInterface>('Works', WorkSchema)

export default WorkModel

```

#### 2. データベースに接続する

```typescript
// src\models\index.ts

import { connect } from 'mongoose'
import WorkModel from './works'

const main = async (): Promise<void> => {
  // 端口之后的路由为数据库名，数据库及用戸需要自己创建
  await connect('mongodb://localhost:27017/testDB', { user: 'apollo', pass: 'password' })
}

main()
  .then(() => console.log('数据库连接成功。'))
  .catch((error) => console.log(error))

export { WorkModel }

```

#### 3. 解析機の実現を替える

```typescript
// src\schemas\resolvers.ts

import type {
  AddWorkParameter,
  QueryWorksParameters,
  WorkInterface,
} from '../models/works'

import { WorkModel } from '../models/index'

const resolvers = {
  Query: {
    works: async (
      parent: any,
      { title, author }: QueryWorksParameters
    ): Promise<WorkInterface[]> => {
      const titleRegex = new RegExp(title ?? 'null')
      const authorRegex = new RegExp(author ?? 'null')

      if (!title && !author) {
        return WorkModel.find({})
      }

      if (title && author) {
        return WorkModel.find({
          author: { $regex: authorRegex },
          title: { $regex: titleRegex },
        })
      }

      if (title && !author) {
        return WorkModel.find({ author: { $regex: authorRegex } })
      }

      if (author && !title) {
        return WorkModel.find({ title: { $regex: titleRegex } })
      }

      return []
    },
  },

  Mutation: {
    addWork: async (
      parent: any,
      { title, author }: AddWorkParameter
    ): Promise<boolean> => {
      const oldList = await WorkModel.find({})

      const existed = oldList.some((item: WorkInterface): boolean => {
        return item.title === title && item.author === author
      })

      if (existed) {
        return false
      }

      const newList = await WorkModel.insertMany([{ author, title }])

      return newList > oldList
    },
  },
}

export default resolvers

```
