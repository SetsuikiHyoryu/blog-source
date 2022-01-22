#!/usr/bin/env sh

# 确保脚本抛出遇到的错误
set -e

# 上传源码
git add -A
git commit -m 'feat: update blog'
git push origin main

# 生成静态文件
npm run docs:build

# 进入生成的文件夹
cd docs/.vuepress/dist

# 如果是发布到自定义域名
# echo 'www.example.com' > CNAME

# 部属博客到 GitHub
git init
git add -A
git commit -m 'auto deploy'
git branch -M vuepress

# 如果发布到 https://<USERNAME>.github.io
# git push -f git@github.com:<USERNAME>/<USERNAME>.github.io.git master
git push -f git@private:SetsuikiHyoryu/SetsuikiHyoryu.github.io.git vuepress

# 如果发布到 https://<USERNAME>.github.io/<REPO>
# git push -f git@github.com:<USERNAME>/<REPO>.git master:gh-pages

cd -