import { defineConfig } from 'vitepress'

export default defineConfig({
  base: '/arbitrum-study-guide/',
  title: 'Arbitrum Study Guide',
  description:
    'Concise, searchable study notes on Ethereum, Arbitrum and Stylus — a quick-reference guide for the web3 community',
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
          {
            text: '1.2 Solidity, ABI & Contract Lifecycle',
            link: '/modules/1.2-solidity-abi-contract-lifecycle',
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
