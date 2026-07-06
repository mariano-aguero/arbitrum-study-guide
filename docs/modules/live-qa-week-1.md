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

### 1. Read & understand a Solidity contract end-to-end

Every contract is built from the same pieces, in roughly this order:

```solidity
// SPDX-License-Identifier: MIT
pragma solidity ^0.8.33;              // 1. compiler version

import {ERC20} from "@openzeppelin/..."; // 2. imports (audited libs)

contract Vault is ERC20 {             // 3. inheritance
    address public owner;             // 4. state variables → live in storage
    mapping(address => uint256) public deposits;

    event Deposited(address indexed who, uint256 amount); // 5. events

    error NotOwner();                 // 6. custom errors (cheaper than strings)

    modifier onlyOwner() {            // 7. reusable guards
        if (msg.sender != owner) revert NotOwner();
        _;
    }

    constructor() ERC20("Vault", "VLT") { // 8. runs ONCE at deploy
        owner = msg.sender;
    }

    receive() external payable {}     // 9. accepts plain ETH transfers

    function deposit() external payable {   // 10. the actual logic
        deposits[msg.sender] += msg.value;  //     writes → cost gas
        emit Deposited(msg.sender, msg.value);
    }

    function balanceOf_(address a) external view returns (uint256) {
        return deposits[a];           // `view` → read-only, free via eth_call
    }
}
```

How to read one end-to-end: start at the **state variables** (that's the data model), then the **constructor** (initial setup), then each **external/public function** asking three questions — *who can call it* (modifiers/requires), *what state does it change*, *what does it emit*. `view`/`pure` functions are the read-only API; `payable` ones can receive ETH.

### 2. Compile and deploy a sample contract to a local node

The full loop with **Foundry**, step by step:

```bash
# 1. Scaffold a project (src/, test/, foundry.toml)
forge init my-vault && cd my-vault

# 2. Compile: Solidity → bytecode + ABI (in out/)
forge build

# 3. In another terminal: local chain — 10 accounts pre-funded
#    with 10,000 ETH, private keys printed on screen
anvil

# 4. Deploy: sends a tx with the bytecode, no `to` address
forge create src/Vault.sol:Vault \
  --rpc-url http://localhost:8545 \
  --private-key <one-anvil-key> --broadcast
#    → prints "Deployed to: 0x5FbDB..."

# 5. Interact from the CLI
cast send 0x5FbDB... "deposit()" --value 1ether --private-key <key> \
  --rpc-url http://localhost:8545                       # write (tx)
cast call 0x5FbDB... "balanceOf_(address)" <addr> \
  --rpc-url http://localhost:8545                       # read (free)
```

With **Hardhat** the loop is the same with JS/TS tooling: `npx hardhat node` (local chain) → `npx hardhat compile` → deploy script with `npx hardhat run scripts/deploy.ts --network localhost`.

### 3. Explain the gas model and the EVM execution path

What happens between "sign" and "state changed", step by step:

1. **You sign a tx** specifying: `to`, calldata (selector + args), a **gas limit** (max you allow), and EIP-1559 fees (**max fee** ceiling + **priority tip**).
2. **Upfront charge** — before running anything, the protocol deducts the intrinsic cost: 21,000 base + a fee per calldata byte. Not enough limit? Rejected.
3. **The EVM executes** the contract's bytecode opcode by opcode, using the **stack** for operands, **memory** for scratch data, **storage** for persistent writes. Each opcode deducts gas from the limit: `ADD` costs 3, an `SSTORE` (storage write) up to 20,000+ — writing is what's expensive.
4. **Two possible endings:**
   - **Out of gas or `revert`** → *all* state changes are rolled back, but the gas consumed up to that point is *not* refunded (the computation happened).
   - **Success** → state persists, events are written as logs into the receipt.
5. **Final bill** = `gas used × (base fee + tip)`. The **base fee is burned** (set per block by protocol, ±12.5% with demand); the **tip goes to the validator**; whatever's left of your limit and of `max fee − actual fee` is **refunded**.

### 4. Identify when an oracle or an indexer is needed

Two different gaps, two different tools:

| The gap | The tool | Examples |
|---|---|---|
| **The contract** needs data that doesn't exist on-chain, *at execution time* | **Oracle** (Chainlink) | ETH/USD price for a liquidation, verifiable randomness for a mint, calling a function on schedule |
| **The frontend** needs historical or aggregated queries that raw RPC can't answer efficiently | **Indexer** (The Graph, Ponder, Subsquid) | "all deposits by this user", leaderboards, volume charts, activity feeds |

Rules of thumb: if the *EVM must know it to execute correctly* → oracle. If *only humans/UIs need it after the fact* → indexer (it just reads the events your contract already emits — which is why emitting good events matters). Current state of one thing (`balanceOf`) needs neither: a direct `eth_call` is enough.
