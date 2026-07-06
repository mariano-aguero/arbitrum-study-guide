# Live Q&A — Week 1

> Open session to discuss doubts, review exercises, and deep-dive into the topics covered during Week 1 (modules 1.1–1.5). Brief recap of each topic below.

## Ethereum Fundamentals

Ethereum is a **replicated state machine**: one global state (accounts, balances, contract storage) that only changes through signed transactions, batched into blocks and finalized (~13 min) by proof-of-stake consensus. Two account types — **EOAs** (key-controlled, the only ones that can initiate txs) and **contracts** (code-controlled). L1 is intentionally slow (~15 TPS) to stay decentralized; that's why L2s like Arbitrum exist — they execute off-chain and anchor security to Ethereum.

📖 Detail: [1.1 Execution Model](/modules/1.1-ethereum-execution-model) · [1.5 Why L2s Exist](/modules/1.5-why-l2s-exist)

## EVM Execution Model

The EVM is a **deterministic virtual machine**: same bytecode + same input + same state = same result on every node — that's what makes consensus possible. Code operates over four data locations, from cheap to expensive: **stack** (32-byte words, max 1,024), **memory** (volatile scratch space), **calldata** (read-only input: 4-byte selector + ABI-encoded args) and **storage** (persistent, the costly one). Every opcode costs **gas** (EIP-1559: base fee burned + tip to the validator), which prices computation and prevents infinite loops. Contracts communicate results outward via **events/logs**, which off-chain apps and indexers consume.

📖 Detail: [1.1 Execution Model](/modules/1.1-ethereum-execution-model) · [1.2 ABI & calldata](/modules/1.2-solidity-abi-contract-lifecycle)

## Solidity Patterns

The recurring patterns that matter: **visibility** (`private` ≠ secret on-chain), **modifiers** for reusable guards (`onlyOwner`), **storage packing** to save slots, and the security trio — **Checks-Effects-Interactions** against reentrancy, checked arithmetic (default since 0.8), and explicit **access control** on every state-changing function. Deployed code is **immutable**: upgrades require proxy patterns (Transparent/UUPS) with stable storage layout. For tokens and access control, inherit from **OpenZeppelin** instead of writing from scratch.

📖 Detail: [1.2 Solidity, ABI & Contract Lifecycle](/modules/1.2-solidity-abi-contract-lifecycle)

## Dev Tooling Setup

**Foundry** is the contract-side default: `forge` (build/test in Solidity, fuzzing built-in), `anvil` (local node, mainnet forking with `--fork-url`), `cast` (CLI calls). **Hardhat** when the workflow is JS/TS-heavy. Frontend: **viem + wagmi** — typed reads (`useReadContract`), two-phase writes (`useWriteContract` → `useWaitForTransactionReceipt`), wallets via MetaMask/WalletConnect/RainbowKit. For debugging, the block explorer (Etherscan/Otterscan) is the first tool: decoded calldata, logs, internal txs. Supporting infra: Chainlink (oracles), The Graph (indexing), IPFS/Arweave (storage).

📖 Detail: [1.3 Dev Environment & Tooling](/modules/1.3-dev-environment-tooling) · [1.4 Critical Infrastructure](/modules/1.4-critical-infrastructure)

## Week 1 Outcomes

By the end of the week you should be able to:

- [ ] **Read & understand a Solidity contract end-to-end** — open any verified contract and follow it: state variables and their storage layout, visibility of each function, what the modifiers guard, which functions mutate state vs read it, and what each `emit` communicates to the outside.
- [ ] **Compile and deploy a sample contract to a local Hardhat or Foundry node** — the full local loop: `anvil` (or `npx hardhat node`) for a chain with funded accounts, `forge create` / a deploy script to put the contract on it, and `cast call` / console to interact. No testnet, no real ETH.
- [ ] **Explain the gas model and the EVM execution path** — trace a tx from signature to state change: calldata in (selector + args) → opcodes over stack/memory/storage → gas metered per opcode under EIP-1559 (base fee burned + tip), refund of the unused limit, revert if it runs out.
- [ ] **Identify when an oracle or an indexer is needed in a dApp design** — spot the two gaps: the contract needs *external data* (a price, randomness) → oracle (Chainlink); the frontend needs *historical/aggregated queries* ("all deposits by user") that raw RPC can't serve → indexer (The Graph, Ponder).
