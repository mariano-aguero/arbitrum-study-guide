# Arbitrum Fellowship Study Guide

A searchable, well-summarized study reference site built with [VitePress](https://vitepress.dev/). It collects condensed notes on the topics covered during the Arbitrum Stylus Fellowship (Arbitrum, Stylus, Solidity, and related material).

## Prerequisites

- Node.js 20+
- pnpm (or npm/yarn)

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

## Adding Notes

1. Create a markdown file under `docs/<topic>/`, e.g. `docs/stylus/storage.md`.
2. Register it in the sidebar in `docs/.vitepress/config.mts`.
3. Keep entries short and summary-oriented — this is a quick-reference site, not long-form docs.

## Structure

```
docs/
├── .vitepress/config.mts   # site config, nav, and sidebar
├── index.md                # home page
└── arbitrum/               # one folder per topic
    └── overview.md
```
