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
          {
            text: '1.3 Dev Environment & Tooling',
            link: '/modules/1.3-dev-environment-tooling',
          },
          {
            text: '1.4 Critical Infrastructure',
            link: '/modules/1.4-critical-infrastructure',
          },
          {
            text: '1.5 Why L2s Exist',
            link: '/modules/1.5-why-l2s-exist',
          },
          {
            text: 'Live Q&A — Week 1',
            link: '/modules/live-qa-week-1',
          },
        ],
      },
      {
        text: 'Module 2 — Arbitrum & the Nitro Stack',
        items: [
          {
            text: '2.1 Nitro Architecture',
            link: '/modules/2.1-nitro-architecture',
          },
          {
            text: '2.2 Fraud Proofs & BoLD',
            link: '/modules/2.2-fraud-proofs-and-bold',
          },
          {
            text: '2.3 Cross-chain Messaging & Bridges',
            link: '/modules/2.3-cross-chain-messaging-and-bridges',
          },
          {
            text: '2.4 Building on Arbitrum (EVM)',
            link: '/modules/2.4-building-on-arbitrum-evm',
          },
          {
            text: 'Live Q&A — Week 2',
            link: '/modules/live-qa-week-2',
          },
        ],
      },
      {
        text: 'Module 3 — Stylus Fundamentals',
        items: [
          {
            text: '3.1 Introduction to Stylus',
            link: '/modules/3.1-introduction-to-stylus',
          },
          {
            text: '3.2 Rust for Smart Contracts',
            link: '/modules/3.2-rust-for-smart-contracts',
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
