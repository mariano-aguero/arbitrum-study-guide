# Live Q&A — Week 3

> Open session to discuss doubts, review exercises, and deep-dive into the topics covered during Week 3 (modules 3.1–3.5): Stylus architecture, Rust for smart contracts, SDK patterns, and the deployment workflow. Brief recap of each topic below.

## Stylus Architecture

**Stylus** adds a second VM (**WASM**) next to the EVM on Arbitrum — same chain, same state, shipped as an ArbOS upgrade (MultiVM). Contracts in **Rust/C/C++** interoperate with Solidity in both directions; ArbOS routes each call to the right runtime automatically. Compute gets ~**10× cheaper** (native execution, metered in **ink** = 1/10,000 gas), but **storage costs the same** — so port the *compute*, not the token. Lifecycle: **code → activate → execute → prove**.

📖 Detail: [3.1 Introduction to Stylus](/modules/3.1-introduction-to-stylus)

## Rust for Smart Contracts

You need the **strict minimum** of Rust: ownership/borrowing (one owner; `&T` shared xor `&mut T` exclusive), traits + generics (monomorphized — watch the 24 KB compressed size limit), and `Result`/`?` error handling (a `panic!` reverts with no data). Toolchain = **rustup + cargo** plus the `wasm32-unknown-unknown` target. The big constraint is **`no_std`**: no files, network, threads, clock or floats — only `core` + `alloc`, and full determinism.

📖 Detail: [3.2 Rust for Smart Contracts](/modules/3.2-rust-for-smart-contracts)

## SDK Patterns

A contract is a Rust struct: **`sol_storage!`** declares state in **Solidity's exact slot layout**, **`#[public]`** exposes methods (mutability inferred from `&self`/`&mut self`, plus `#[payable]`), **`#[entrypoint]`** marks the dispatch target. Cross-contract calls go through typed **`sol_interface!`** bindings; errors derive **`SolidityError`** so EVM callers see normal custom errors; composition is **`#[inherit]` + `#[borrow]`** instead of inheritance. Everything rides on **Alloy** types (`U256`, `Address`) — the same stack as offchain Rust tooling. Calibrate against real code: Stylus by Example patterns, the SDK's `examples/`, and production projects in Awesome Stylus.

📖 Detail: [3.3 Stylus Rust SDK Essentials](/modules/3.3-stylus-rust-sdk-essentials) · [3.5 Reading Examples That Ship](/modules/3.5-reading-examples-that-ship)

## Deployment Workflow

The loop is **`cargo stylus new` → `check` → `deploy`** against a local **Nitro devnode** (one Docker script, RPC on `:8547`, prefunded account). `check` compiles to WASM and **simulates activation without spending gas**; `deploy` sends **two txs**: deployment (compressed WASM onchain) + **activation** — the extra step vs Solidity, where the **ArbWasm precompile (`0x71`)** compiles it to native code for a one-off data fee. Activation lasts **365 days** (`programTimeLeft` / `codehashKeepalive`). Same commands with `--endpoint https://sepolia-rollup.arbitrum.io/rpc` deploy to Sepolia.

📖 Detail: [3.4 Local Dev & First Deploy](/modules/3.4-local-dev-first-deploy)

## Week 3 Outcomes

### 1. Write, deploy, activate & call a non-trivial Stylus contract on Sepolia

The full loop, end to end: scaffold with `cargo stylus new`, define storage with `sol_storage!` and methods with `#[public]`, validate with `cargo stylus check`, then `cargo stylus deploy --endpoint <sepolia> --private-key-path ./key.txt` — watching **both** transactions land (deployment *and* activation; that second tx is what makes it callable). Interact with `cast call` / `cast send` using the ABI from `cargo stylus export-abi`, and verify on `sepolia.arbiscan.io`. "Non-trivial" means beyond the Counter template: real storage (a mapping), a typed error, an event.

### 2. Explain when Stylus beats Solidity (and when it does not)

**Stylus wins when the cost is compute or memory:** heavy math, cryptography, ZK verification, custom AMM curves, in-memory algorithms — native WASM execution makes these ~10× cheaper or more. **It does not win when the cost is storage:** `SLOAD`/`SSTORE` cost exactly the same in both VMs, so a plain token or CRUD-style contract gains nothing by porting. It's also not for languages with heavy runtimes, and not an escape from onchain rules (determinism, metering, `no_std`). The pragmatic answer is usually **hybrid**: keep storage and auth in Solidity, call a Stylus contract for the expensive compute.

### 3. Read Stylus SDK macros without consulting docs for every line

Knowing what each macro *expands to*, not just what it's for: `sol_storage!` → a struct of storage accessors (`StorageU256`, `StorageMap`…) laid out in Solidity slots; `#[public]` → the ABI router that dispatches selectors to your methods and infers view/write/pure from the receiver; `#[entrypoint]` → the contract the router starts from; `sol_interface!` → typed call bindings; `SolidityError` → ABI-encoded custom errors. The shortcut that builds this skill: run `cargo expand` on a small contract once, and skim `stylus-proc/` in the SDK repo — after that, example code reads like plain Rust.
