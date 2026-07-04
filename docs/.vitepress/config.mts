import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/arbitrum-study-guide/',
  title: 'Arbitrum Fellowship Study Guide',
  description:
    'Summarized study notes and reference material from the Arbitrum Stylus Fellowship',
  lang: 'en-US',
  lastUpdated: true,

  themeConfig: {
    search: {
      provider: 'local',
    },

    nav: [
      { text: 'Home', link: '/' },
      { text: 'Modules', link: '/modules/1.1-ethereum-execution-model' },
    ],

    sidebar: [
      {
        text: 'Module 1 — Ethereum Foundations',
        items: [
          {
            text: '1.1 Ethereum Execution Model',
            link: '/modules/1.1-ethereum-execution-model',
          },
        ],
      },
    ],

    outline: 'deep',

    socialLinks: [
      {
        icon: 'github',
        link: 'https://github.com/mariano-aguero/arbitrum-study-guide',
      },
    ],
  },
})
