# Mission Control · System Design 🛰️

> Learn system design the way you'll actually remember it — by *watching* systems
> breathe, break, and heal under load, then rebuilding them yourself.

An interactive, animation-first learning platform for working professionals (0 → 20+
years of experience) to master **system design, distributed-systems algorithms, and
AI/ML architectures** — not by reading walls of text, but by driving live simulations,
breaking things on purpose, and being nudged to recall what they learned.

Theme: **Mission Control** — a dark instrument-panel aesthetic. Progression is a ladder of
**clearance ranks** (Cadet → Mission Commander); each concept is a "system" you learn to
keep alive under load.

---

## Run it

```bash
npm install
npm run dev
```

Then open the printed local URL. Build a static bundle with `npm run build` (output in
`dist/`, deployable to any static host — CSP + security headers ship in `public/_headers`).

## The core bet

People remember **motion, story, and consequence**. So every concept is taught in five beats:

1. **The problem** — a scenario with stakes and a number. *"1 server, 50M requests just
   arrived. Watch it die."*
2. **See it move** — a live animation at three depths (Napkin → Working → Deep dive).
3. **The sandbox** — you drive it: turn the traffic dial, kill a node, flip the R/W quorum.
4. **The trade-off** — the lesson lands on a decision, not a definition.
5. **Lock it in** — active-recall quiz + a spaced-repetition flashcard + a memory hook.

## Build status — expanded ✅

Decisions (locked with the user): **full React scaffold**, **Mission Control theme**,
comprehensive coverage.

| Area | State |
|---|---|
| Stack | Vite + React + TypeScript + Tailwind. Static, client-only. |
| Content | **122 modules across 9 clearance ranks** authored (5-beat data each) + algorithms & glossary. |
| Ranks | Cadet · Ensign · Lieutenant · Commander · Captain · Flight Director · Mission Commander (AI/ML) · **Systems Architect (Algorithms & Consensus)** · **Security Officer (Security & Trust)**. |
| Instrument toolkit | FlowStage · NodeRing · LoadDial · CacheGrid · Timeline · TradeoffLab · LatencyLadder · EstimatorPad · MetricStrip · **BloomFilter** · Placeholder. |
| Pages | Landing · Mission Map · Module (5-beat) · Algorithms · Practice · Deck (SRS) · Reference. |
| Progress | Local-first: XP, streaks, per-module completion, spaced-repetition deck (localStorage). |
| Security | Strict CSP in prod build + deploy headers; all rendering via React escaping; no eval; no PII/backend. |

### Algorithms rank (7) — every core distributed algorithm as a real module
Raft/consensus · Paxos · gossip/SWIM · Lamport & vector clocks · CRDTs · Merkle trees ·
Bloom filters (interactive) · HyperLogLog · Count-Min Sketch · skip lists · tries ·
geohash/quadtree · MapReduce · chain replication.

### Security rank (8)
Authentication (sessions/JWT) · OAuth2/OIDC · authorization (RBAC/ABAC) · encryption at
rest & in transit (KMS/envelope) · API security & OWASP · secrets management · zero-trust & mTLS.

### Also deepened across existing ranks
Concurrency & scalability laws · serialization & connection pooling · OLTP/OLAP, WAL, MVCC,
CDC, object storage, inverted index, time-series & graph DBs · deployment strategies, load
shedding, DLQs, graceful degradation · outbox, DDD, BFF, API versioning · new case studies
(web crawler, distributed cache/lock, collaborative editor, Kafka, leaderboard) · embeddings,
model monitoring/drift, A/B & bandits, prompting-vs-RAG-vs-fine-tuning, MLOps, multimodal.

### Flagship interactions wired up
Consistent-hashing ring (add/remove nodes, compare keys-moved vs mod-N, virtual nodes),
rate-limiting token bucket, cache eviction (LRU/LFU/FIFO + hit ratio), latency ladder,
back-of-envelope estimator, LLM-serving/batching metrics, and animated architecture flows
for the request lifecycle, microservices, RAG, and every case study.

## What's next (roadmap)
- Deepen the remaining signature instruments (some modules currently reuse the closest
  built instrument or the trade-off lab).
- Belt 5 drag-and-drop **design canvas** (BuildCanvas) for the interview simulator.
- Optional: cross-device sync backend (would add auth done properly), audio/step-through
  narration, and a mobile polish pass.

---

## Planning docs
- [`CURRICULUM.md`](./CURRICULUM.md) — the full syllabus (7 ranks, algorithms, AI track, case studies).
- [`APP_PLAN.md`](./APP_PLAN.md) — pedagogy, the instrument toolkit, architecture, and roadmap.

## Design DNA
Carried from `../scaled_dot_product_attention/transformer_explorer.html`: self-contained &
secure, dark instrument aesthetic, glowing data flowing along connections, everything live.
