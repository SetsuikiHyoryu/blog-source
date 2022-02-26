---
lang: zh-CN
description: sample

sidebar:
  - text: 上一级
    link: /programming/front-back-connect/
  
  - /programming/front-back-connect/graphql/vue-express-graphql.md
  
---

# 使用 Vue 和 Express 学习 GraphQL

## 使用 Vite 创建 Vue 项目

vite 官网：<https://cn.vitejs.dev/guide/>

### 1. 安装 axios 依赖

axios 官网：<https://github.com/axios/axios>

### 2. 创建 axios 实例并封装 axios

```typescript
// src/utils/http/axios/index.ts

import axios from 'axios'

const axiosInstance = axios.create({
  baseURL: 'http://localhost:3000/api',
  timeout: 1000,
})

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

### 3. 创建 API

1. 创建参数与返回值模型

   ```typescript
   // src/api/model/works.ts

   // 作品信息
   export interface WorkModel {
     title: string
     author: string
   }

   // 获取作品列表返回值
   export type QueryWorksListModel = WorkModel[]

   ```

2. 创建 API

   ```typescript
   // src/api/works.ts

   import { sendRequest } from '../utils/http/axios'
   import type { QueryWorksListModel } from './model'

   export const queryWorksList = async (): Promise<QueryWorksListModel> => {
     const query = `
       query {
         worksList {
           title
           author
         }
       }
     `

     const { worksList } = await sendRequest(query)

     return worksList
   }

   ```

### 4. 在画面中调用 API

```vue
<!-- src/App.vue -->

<script setup lang="ts">
import BaseButton from './components/button/BaseButton.vue'

import { queryWorksList } from './api/works'
import { ref } from 'vue'
import type { QueryWorksListModel } from './api/model'

const worksList = ref<QueryWorksListModel>()

const handleSetWorksList = async (): Promise<void> => {
  worksList.value = await queryWorksList()
}
</script>

<template>
  <div class="app">
    <div class="button-group">
      <BaseButton title="请求所有作品" @click="handleSetWorksList" />
      <BaseButton title="清除当前列表" @click="() => (worksList = [])" />
    </div>

    <div v-for="(item, index) in worksList" :key="index" class="works-card">
      <span>作品名：{{ item.title }}</span>
      <span>作者：{{ item.author }}</span>
    </div>
  </div>
</template>

<style scoped>
/** ... */
</style>

```

## 安装 GraphQL、Apollo、Express

流程手册：<https://graphql.org/code/#javascript>

### 使用 Express

express 官网：<https://expressjs.com/>

#### 1. 创建服务

1. 创建 src/app.ts

   ```typescript
   import express from 'express'
   import type { Express } from 'express'

   const app: Express = express()

   export default app
   ```

2. 创建 src/server.ts

   ```typescript
   import app from './app'

   const PORT = 9491

   app.get('/', (request, response) => {
     response.send('successed')
   })

   app.listen(PORT, () => {
     console.log(`您的服务已启动至 ${PORT} 端口`)
   })
   ```

3. 启动服务后如果能从 localhost 访问到 `successed` 即为成功。

#### 2. 使用 Apollo

Apollo 官网：<https://www.apollographql.com/docs/apollo-server/getting-started/>

1. 创建类型：src/schemas/typeDefs.ts

   ```typescript
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

2. 创建解析器：src/schemas/resolvers

   ```typescript
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

3. 创建 Apollo 服务器实例

   ```typescript
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

4. 启动 Apollo 服务器

   ```typescript
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

## 使用 MongoDB

### 1. 在 Docker 上安装 MongoDB

- 需要进行用戸管理，否则没有权限
- [Docker 安装 MongoDB](https://www.runoob.com/docker/docker-install-mongodb.html)
- [MongoDB用户权限管理配置](https://www.cnblogs.com/yucongblog/p/6595946.html)
- [MongoDB数据库、集合、文档的操作](https://www.cnblogs.com/yucongblog/p/6636112.html)

### 2. 使用 mongoose 连接 MongoDB

mongoose 官网：<https://mongoosejs.com/docs/index.html>
