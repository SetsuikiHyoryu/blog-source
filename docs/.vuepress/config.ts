import { defineUserConfig } from 'vuepress'
import type { DefaultThemeOptions } from 'vuepress'

export default defineUserConfig<DefaultThemeOptions>({
  // 站点配置
  lang: 'zh-CN',
  title: '冰龍與雪風的工作室',
  description: '个人博客',

  // 多语言
  locales: {
    '/': {
      lang: 'zh-CN',
    },

    '/ja/': {
      lang: 'ja',
    },
  },

  // 主题和它的配置
  theme: '@vuepress/theme-default',

  themeConfig: {
    // logo: 'https://vuejs.org/images/logo.png',

    locales: {
      '/': {
        selectLanguageName: '简体中文',
      },

      '/ja/': {
        selectLanguageName: '日本語',
      },
    },
  },
})
