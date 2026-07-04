# Arbitrum Study Guide

Concise, searchable study notes on Ethereum, Arbitrum and Stylus — a quick-reference site for the web3 community, built with [VitePress](https://vitepress.dev/).

**Live site:** https://mariano-aguero.github.io/arbitrum-study-guide/

## Prerequisites

- Node.js 20+
- pnpm

## Setup

```bash
pnpm install
```

## Development

Start the local dev server with hot reload:

```bash
pnpm dev
```

## Build & Preview

```bash
pnpm build    # static site output in docs/.vitepress/dist
pnpm preview  # serve the production build locally
```

## Deployment

Every push to `main` triggers the GitHub Actions workflow in `.github/workflows/deploy.yml`, which builds the site and publishes it to GitHub Pages.

## Adding Notes

1. Create a markdown file under `docs/modules/`, e.g. `docs/modules/1.2-solidity-basics.md`.
2. Register it in the sidebar in `docs/.vitepress/config.mts`.
3. Keep entries short and summary-oriented — this is a quick-reference site, not long-form docs.

## Structure

```
docs/
├── .vitepress/config.mts   # site config, nav, and sidebar
├── index.md                # home page
└── modules/                # one page per module
    └── 1.1-ethereum-execution-model.md
```
