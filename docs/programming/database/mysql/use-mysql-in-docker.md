---
lang: zh-CN
descriptioin: 在 Docker 上使用 Mysql

sidebar:
  - text: 上一级
    link: ../
  - ./use-mysql-in-docker.md
---
# 在 Docker 上使用 MongoDB

## 参考视频

[Docker で MySQL の最小構成を構築します。データ永続化設定もあり](https://www.youtube.com/watch?v=0qNTbkFfR4U)

## 1. 在主机建立保存数据库的目录

|目录|说明|
|:-|:-|
|mysql|根目录|
|mysql/data|数据库保存文件夹|

## 2. 创建 docker-compose.yml 文件

```yml
# mysql/docker-compose.yml

version: "3.9"

services:
  mysql:
    image: mysql:8.0.31
    port:
      - 3306:3306
      - 33060:33060
    environment:
      # Need to set password for root user.
      - MYSQL_ROOT_PASSWORD=password
      # Time zone.
      - TZ=Asia/Tokyo
    # 使用卷映射本地目录以保存数据
    volumes:
      - ./data:/var/lib/mysql
```

## 3. 在 docker 中启动服务

```shell
# 编译服务
docker-compose build
# 启动容器 --detach, -d: Run containers in the background.
docker-compose up --detach
# 查询容器状态
docker-compose ps
# 查看容器输出日志 --follow, -f: Follow log outpu.
docker-compose logs --follow mongo
# 停止容器
docker-compose stop
# 停止容器并删除容器及网络
docker-compose down
# 停止容器并删除容器、网络、镜像
docker-compose down --rmi all
```

## 4. 在容器中访问 Mysql

```shell
# Mysql is server name in `docker-compose.yml`.
docker exec -it mysql bash
```

then

```bash
mysql -u root -ppassword
```
