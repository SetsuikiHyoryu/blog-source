import { defineUserConfig } from 'vuepress'
import type { DefaultThemeOptions } from 'vuepress'

export default defineUserConfig<DefaultThemeOptions>({
  // 站点配置
  port: 19769,
  lang: 'zh-CN',
  title: '冰龍與雪風的工作室',
  head: [['link', { rel: 'icon', href: '/images/logo.png' }]],

  plugins: [['@vuepress/plugin-search', true]],

  // 多语言
  locales: {
    '/': {
      lang: 'zh-CN',
      description: '个人博客',
    },

    '/languages/ja/': {
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

        sidebar: {
          '/': [
            '/',

            {
              text: '编程',
              collapsible: true,

              children: [
                '/programming/programming-languages/',
                '/programming/front-back-connect/',
              ],
            },

            {
              text: '马克思主义',
              collapsible: true,
              children: [],
            },
          ],
        },

        navbar: [
          {
            text: '文章',

            children: [
              {
                text: '编程',
                children: ['/programming/programming-languages/'],
              },

              {
                text: '马克思主义',
                children: [],
              },
            ],
          },
        ],
      },

      '/languages/ja/': {
        selectLanguageName: '日本語',

        sidebar: {
          '/languages/ja/': [
            './',

            {
              text: 'プログラミング',
              collapsible: true,
              children: ['./programming/programming-languages/'],
            },

            {
              text: 'マルクス主義',
              collapsible: true,
              children: [],
            },
          ],
        },

        navbar: [
          {
            text: '文章',

            children: [
              {
                text: 'プログラミング',
                children: ['/languages/ja/programming/programming-languages/'],
              },

              {
                text: 'マルクス主義',
                children: [],
              },
            ],
          },
        ],
      },
    },
  },
})
