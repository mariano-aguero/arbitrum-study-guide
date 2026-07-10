# Live Q&A — Week 2

> Open session to discuss doubts, review exercises, and deep-dive into the topics covered during Week 2 (modules 2.1–2.4). Brief recap of each topic below.

## Nitro Architecture

**Nitro** is the software stack that runs Arbitrum One. Its execution is a **"Geth sandwich"**: a lightly forked **Geth** runs the EVM (so it's EVM-equivalent), **ArbOS** sits on top handling L2 gas, cross-chain messaging and upgrades, and the **sequencer** orders txs and gives instant *soft* confirmations. Batched txs are compressed (Brotli) and posted to Ethereum as blobs, where they reach *hard* finality (~10–20 min). If the sequencer censors you, the **delayed inbox** lets you force inclusion via L1.

📖 Detail: [2.1 Nitro Architecture](/modules/2.1-nitro-architecture)

## BoLD Fraud Proofs

Arbitrum is an **optimistic rollup**: posted state is assumed valid unless challenged. Validators post **assertions** to L1 with a large **bond** (3,600 ETH on One). **BoLD** makes validation **permissionless** (anyone can challenge) and — the key property — **time-bounded**: every dispute resolves in a fixed ~6.4 days no matter how many attackers, because the honest party fights all of them **in parallel** (all-vs-all) instead of one-at-a-time. A dispute **bisects** down to a single WASM step that Ethereum verifies. One honest party always wins.

📖 Detail: [2.2 Fraud Proofs & BoLD](/modules/2.2-fraud-proofs-and-bold)

## Bridging Patterns

L1↔L2 communication runs through an **Inbox** (down) and **Outbox** (up). **L1→L2** uses **retryable tickets** — an L1 tx that guarantees eventual L2 execution (auto- or manual-redeem, ~7-day expiry). **L2→L1** uses **`ArbSys.sendTxToL1`** and is subject to the **~7-day challenge period** before you can claim on L1. The **canonical token bridge** is built on this: deposits lock on L1 + mint on L2 (fast); withdrawals burn on L2 + release on L1 (slow) — which is why third-party "fast bridges" exist.

📖 Detail: [2.3 Cross-chain Messaging & Bridges](/modules/2.3-cross-chain-messaging-and-bridges)

## Arbitrum Deployment

Arbitrum is **EVM-equivalent**, so Foundry/Hardhat/viem all work by just swapping the RPC (Arbitrum One `42161`, Sepolia `421614`). Two differences: **gas is two-dimensional** (cheap L2 execution + the dominant L1 calldata-posting cost — estimate with `NodeInterface.gasEstimateComponents`), and there are **precompiles** (`ArbSys`, `ArbGasInfo`, `NodeInterface`) for L2-only features. **Timeboost** auctions a short "express lane" instead of running latency races for ordering.

📖 Detail: [2.4 Building on Arbitrum (EVM)](/modules/2.4-building-on-arbitrum-evm)

## Week 2 Outcomes

### 1. Deploy a Solidity contract to Arbitrum Sepolia

Same flow as any EVM chain — the contract code doesn't change, only the endpoint. Point your tool at chain **421614** (`https://sepolia-rollup.arbitrum.io/rpc`): `forge create ... --rpc-url <sepolia> --private-key $PK --broadcast --verify`, or a Hardhat deploy script `--network arbitrumSepolia`. Get testnet ETH by bridging Sepolia L1 ETH through [bridge.arbitrum.io](https://bridge.arbitrum.io) (or a faucet), and verify on `sepolia.arbiscan.io`.

### 2. Explain the relationship between Arbitrum One and Nitro

**Nitro is the software; Arbitrum One is a chain that runs it.** Nitro is the node stack (the Geth sandwich + ArbOS + sequencer + fraud-proof machinery). Arbitrum One is the specific production L2 — one deployment of Nitro that settles to Ethereum mainnet. Other chains (Arbitrum Nova, Orbit chains, testnets) also run Nitro with different configs. So "Nitro" is the *engine*, "Arbitrum One" is one *car* built on it.

### 3. Explain Nitro's deterministic STF and BoLD's role

The **State Transition Function** is the rule "state + txs → new state", and it's **deterministic**: anyone re-running the same inputs gets the exact same result. That determinism is what makes fraud proofs *possible* — if two validators disagree about the new state, exactly one is wrong, and it can be proven. **BoLD** is the mechanism that *enforces* it: it lets anyone challenge a bad assertion and, through bisection down to one WASM step verified on L1, guarantees the honest result wins in bounded time. STF determinism = "there's a single correct answer"; BoLD = "and here's how we prove it and punish liars."

### 4. Trace a withdrawal from L2 to L1 step by step

1. On L2, a contract calls **`ArbSys.sendTxToL1`** → this queues an L2→L1 message.
2. The message rides in an **assertion** posted to L1, which must be **confirmed** — you **wait out the ~7-day challenge period** (BoLD guarantees it resolves in bounded time).
3. Once confirmed, build the proof: **`NodeInterface.constructOutboxProof`**.
4. Call the **Outbox's `executeTransaction`** on L1 with that proof → the message executes and funds are released on L1.

The message exists immediately but isn't *executable* until the window passes — that's the ~7-day withdrawal delay users feel, and the reason fast bridges front the funds.
