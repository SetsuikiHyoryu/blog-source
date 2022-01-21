import { defineUserConfig } from 'vuepress'
import type { DefaultThemeOptions } from 'vuepress'

export default defineUserConfig<DefaultThemeOptions>({
  // 站点配置
  port: 19769,
  lang: 'zh-CN',
  title: '冰龍與雪風的工作室',

  plugins: [['@vuepress/plugin-search', true]],

  // 多语言
  locales: {
    '/': {
      lang: 'zh-CN',
      description: '个人博客',
    },

    '/multiple-languages/ja/': {
      lang: 'ja',
      description: '個人ブログ',
    },
  },

  // 主题和它的配置
  theme: '@vuepress/theme-default',

  themeConfig: {
    logo: '/images/logo.png',

    repo: 'https://github.com/SetsuikiHyoryu/blog-source',

    locales: {
      '/': {
        selectLanguageName: '简体中文',

        navbar: [
          { text: '文章一览', link: '/article-index.md' },

          {
            text: '编程',

            children: [
              {
                text: '前端',
                children: [
                  {
                    text: 'TypeScript',
                    link: '/programming/frontend/typescript/index.md',
                  },
                ],
              },

              {
                text: '后端',
                children: [
                  { text: 'Go', link: '/programming/backend/go/index.md' },
                ],
              },
            ],
          },
        ],

        sidebar: {
          '/': [
            {
              text: '编程',
              collapsible: true,

              children: [
                { text: '前端', link: '/programming/frontend/' },
                { text: '后端', link: '/programming/backend/' },
              ],
            },
          ],

          '/programming/frontend/': [
            {
              text: 'TypeScript',
              collapsible: true,
              children: ['/programming/frontend/typescript/sample.md'],
            },
          ],
        },
      },

      '/multiple-languages/ja/': {
        selectLanguageName: '日本語',

        navbar: [
          { text: '文章一覧', link: '/multiple-languages/ja/article-index.md' },
        ],
      },
    },
  },
})
