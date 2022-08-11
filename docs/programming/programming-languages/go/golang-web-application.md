---
lang: zh-CN
description: Golang Web Application

sidebar:
  - text: 上一级
    link: ../

  - ./golang-study.md
---

# Golang Web Application

## 教程地址

[Go Web 编程快速入门【Golang/Go语言】(完结)](https://www.bilibili.com/video/BV1Xv411k7Xn)

## Handle 请求

### 内置 handler

#### http.NotFoundHandler

返回一个 handler，它给每个请求的响应都是 `404 page not found`。

#### http.RerdirectHandler

返回一个 handler，它把每个请求使用给定的状态码跳转到指定的 URL。

#### http.StripPrefix

返回一个 hanlder，它从请求 URL 中去掉指定的前缀，然后再调用另一个 handler。

- 如果请求的 URL 与提供的前缀不符，那么返回 404

#### http.TimeoutHandler

返回一个 handler，它用来在指定的时间内运行传入的 handler。

#### http.FileServer

返回一个 handler，使用基于 root 的文件系统来响应请求。
