# Curriculum — Mission Control

> Naming note: the app theme is **Mission Control**. What this doc calls "belts" ship in
> the product as **clearance ranks** (Cadet · Ensign · Lieutenant · Commander · Captain ·
> Flight Director · Mission Commander), in the same order. Content is identical.

The syllabus is organized as **belts** (a game/skill-tree metaphor). Each belt is a track;
each track has **modules**; each module is one interactive lesson. Belts are *suggested*
order, not gates — a senior engineer can jump straight to Belt 5 or the AI track.

Every module follows the same 5-beat structure (detailed in [`APP_PLAN.md`](./APP_PLAN.md)):
**Hook → Animate → Sandbox → Trade-off → Recall.**

Legend: 🎬 = has a signature animation · 🎮 = has an interactive sandbox · 🧮 = algorithm deep-dive · 🧠 = memory hook is the star

---

## 🥋 Belt 0 — Foundations (White Belt)
*"How big is big? How fast is fast?" The mental models everything else stands on.*

| # | Module | Signature interaction |
|---|---|---|
| 0.1 | What is system design & why it exists | 🎬 Zoom from a napkin sketch → 1 server → planet-scale, same app |
| 0.2 | Latency numbers every engineer should know | 🎮 Animated "latency ladder": L1 cache → RAM → SSD → network → cross-continent, scaled to human time (1ns = 1s) |
| 0.3 | Back-of-the-envelope estimation | 🎮 A calculator sandbox: users → QPS → storage → bandwidth → # servers |
| 0.4 | Latency vs. throughput vs. bandwidth | 🎬 Highway metaphor (car speed vs. lanes vs. cars/hour) |
| 0.5 | Vertical vs. horizontal scaling | 🎮 Slider: grow one machine vs. add machines; watch cost & ceiling |
| 0.6 | The request lifecycle | 🎬 A single request traced end-to-end: DNS → LB → app → cache → DB → back |

---

## 🥋 Belt 1 — Building Blocks (Yellow Belt)
*The Lego bricks of every real system.*

| # | Module | Signature interaction |
|---|---|---|
| 1.1 | DNS, IP, TCP vs. UDP | 🎬 Watch a TCP 3-way handshake vs. UDP fire-and-forget |
| 1.2 | HTTP/HTTPS, TLS, HTTP/1.1 → 2 → 3 | 🎬 TLS handshake animation; head-of-line blocking visualized |
| 1.3 | Load balancers (L4 vs. L7) | 🎮🧮 Route traffic live; switch algorithms (round-robin, least-connections, weighted, IP-hash) and watch distribution |
| 1.4 | Caching — where & why | 🎬 The same request with caches at each layer (browser → CDN → app → DB) lighting up |
| 1.5 | Cache strategies | 🧮 Cache-aside vs. write-through vs. write-back vs. write-around, animated read/write paths |
| 1.6 | Cache eviction & pitfalls | 🎮🧮 LRU / LFU / FIFO fill-and-evict simulator; **thundering herd** & stampede demo |
| 1.7 | Reverse proxy & API gateway | 🎬 Show the gateway doing auth, rate-limit, routing, aggregation |
| 1.8 | CDNs & edge | 🎬 A global map: cache misses hit origin, hits served at the edge |

---

## 🥋 Belt 2 — Data at Scale (Orange Belt)
*Where most designs live or die. The heart of distributed systems.*

| # | Module | Signature interaction |
|---|---|---|
| 2.1 | SQL vs. NoSQL (and when each wins) | 🎮 Trade-off explorer: pick a workload, get a recommendation with reasons |
| 2.2 | Indexing — B-tree vs. LSM-tree | 🎬🧮 Watch a B-tree split; watch an LSM memtable flush & compact |
| 2.3 | Replication (leader-follower, multi-leader, leaderless) | 🎮🎬 Kill the leader; watch replication lag; see stale reads |
| 2.4 | Partitioning / Sharding | 🎮🧮 Range vs. hash sharding; create & fix a **hot shard** |
| 2.5 | **Consistent hashing** | 🎬🧮🧠 The signature demo: add/remove nodes on a hash ring; watch only 1/N keys move (vs. mod-N chaos) |
| 2.6 | CAP theorem & PACELC | 🎮🧠 A partition happens — you choose C or A and see the user impact |
| 2.7 | Consistency models | 🎬 Strong / eventual / causal / read-your-writes shown as timelines of two clients |
| 2.8 | ACID, BASE & transactions | 🎬 A transaction commits vs. rolls back; isolation anomalies (dirty/phantom reads) animated |
| 2.9 | Distributed transactions — 2PC vs. Saga | 🎬🧮 Watch 2PC block on a coordinator crash; watch a Saga compensate |
| 2.10 | Quorums (R + W > N) | 🎮🧮 Turn the R/W/N dials; see when reads go stale |
| 2.11 | Distributed IDs (Snowflake, UUID, ULID) | 🎬 Bit-layout builder; clock-skew hazard |

---

## 🥋 Belt 3 — Reliability & Robustness (Green Belt)
*Designing for the day everything goes wrong — because it will.*

| # | Module | Signature interaction |
|---|---|---|
| 3.1 | Availability, the "nines", SLA/SLO/SLI | 🎮 Downtime budget calculator (99.9% = 8.76h/yr) |
| 3.2 | Redundancy, failover & health checks | 🎬 Active-passive vs. active-active; watch failover on a heartbeat miss |
| 3.3 | **Rate limiting** | 🎮🧮 Token bucket / leaky bucket / fixed & sliding window, driven by a live traffic dial |
| 3.4 | Circuit breakers & bulkheads | 🎬🎮 Trip a breaker under failure; isolate a failing dependency |
| 3.5 | Retries, backoff, jitter & idempotency | 🎬 Watch a retry storm form, then tame it with exponential backoff + jitter |
| 3.6 | Backpressure & flow control | 🎬 A fast producer floods a slow consumer; apply backpressure |
| 3.7 | Observability — logs, metrics, traces | 🎬 A distributed trace lighting up across 5 services |
| 3.8 | Chaos engineering | 🎮 "Break-it" mode: inject latency/faults and see resilience patterns hold |
| 3.9 | Disaster recovery, RTO/RPO, multi-region | 🎮 Region goes dark; measure recovery objectives |

---

## 🥋 Belt 4 — Architecture Patterns (Blue Belt)
*Assembling the bricks into shapes with names.*

| # | Module | Signature interaction |
|---|---|---|
| 4.1 | Monolith → modular monolith → microservices | 🎬🧠 Same app, three architectures; migrate live and see the cost |
| 4.2 | API styles — REST vs. GraphQL vs. gRPC | 🎮 Same query over all three; compare payloads & round-trips |
| 4.3 | Real-time — WebSockets, SSE, long polling | 🎬 Message delivery latency compared side by side |
| 4.4 | Message queues & pub/sub | 🎮 Producers/consumers, backlog buildup, consumer groups |
| 4.5 | Event-driven architecture | 🎬 Choreography vs. orchestration of events |
| 4.6 | CQRS & event sourcing | 🎬 Rebuild state by replaying an event log |
| 4.7 | Serverless & FaaS | 🎬 Cold start vs. warm; scale-to-zero and burst |
| 4.8 | Service mesh & sidecars | 🎬 mTLS, retries, and observability pushed into the mesh |
| 4.9 | Batch vs. stream (Lambda vs. Kappa) | 🎬 The same metric via batch and streaming pipelines |
| 4.10 | Migration strategy (Strangler Fig) | 🎬🧠 Incrementally route traffic off the legacy system |

---

## 🥋 Belt 5 — Case Studies / Interview Simulator (Purple Belt)
*Put it together. Each is a guided, interactive design you build step by step, with
trade-off checkpoints and a "how the real one does it" reveal.*

| # | Design | Concepts it forces you to use |
|---|---|---|
| 5.1 | URL shortener (TinyURL) | Hashing, base62, read-heavy caching, DB choice |
| 5.2 | Distributed rate limiter | Token bucket at scale, shared counters, Redis |
| 5.3 | News feed (Twitter/Instagram) | Fan-out on write vs. read, the celebrity problem |
| 5.4 | Chat system (WhatsApp) | WebSockets, presence, delivery/read receipts, ordering |
| 5.5 | Video streaming (YouTube/Netflix) | CDN, adaptive bitrate, transcoding pipeline, storage |
| 5.6 | Ride-sharing (Uber) 🧮 | Geospatial indexing (geohash / quadtree), matching |
| 5.7 | Typeahead / search 🧮 | Trie, ranking, sharded index |
| 5.8 | Payment system | Idempotency, exactly-once, ledger, reconciliation |
| 5.9 | Notification system | Multi-channel fan-out, dedup, prioritization |
| 5.10 | Distributed job scheduler | Leader election, at-least-once, cron at scale |

---

## 🥋 Belt 6 — AI / ML System Design (Black Belt) ⭐
*The track that makes this different from every other system-design site. Designing the
infrastructure behind modern AI — from feature pipelines to LLM serving to agents.*

### 6A — ML systems foundations
| # | Module | Signature interaction |
|---|---|---|
| 6.1 | The ML system lifecycle | 🎬 Data → train → eval → deploy → monitor → retrain loop |
| 6.2 | Batch vs. online inference | 🎮 Latency/cost/freshness trade-off dial |
| 6.3 | Feature stores & training/serving skew | 🎬 The same feature computed offline vs. online, drifting apart |
| 6.4 | Data & training pipelines | 🎬 A pipeline with backfills, checkpoints, and failures |

### 6B — Serving at scale
| # | Module | Signature interaction |
|---|---|---|
| 6.5 | Model serving & inference | 🎮 **Dynamic batching** simulator: throughput vs. latency |
| 6.6 | GPU economics & optimization | 🎬 Quantization, distillation; watch memory & speed change |
| 6.7 | Distributed training 🧮 | 🎬 Data / model / pipeline / tensor parallelism, animated across GPUs |
| 6.8 | Vector databases & ANN search 🧮 | 🎬🧮 HNSW graph traversal & IVF partitions visualized |

### 6C — LLM & agentic systems
| # | Module | Signature interaction |
|---|---|---|
| 6.9 | LLM serving internals 🧮 | 🎬 KV cache, continuous batching, **PagedAttention**, speculative decoding |
| 6.10 | RAG architecture | 🎮 Build a RAG pipeline; tune chunking/top-k and watch answer quality/latency |
| 6.11 | Recommendation systems | 🎬🧮 Two-stage: candidate generation → ranking, at scale |
| 6.12 | Agentic architectures | 🎬 Tool use, planning, memory, multi-agent orchestration |
| 6.13 | Model routing & MoE / cascades | 🎮 Route easy queries to cheap models, hard ones to big models |
| 6.14 | LLM guardrails, evals & observability | 🎬 A prompt passing through input/output guardrails; eval scoring |
| 6.15 | Prompt/response caching & cost control | 🎮 Cost dashboard as caching & routing are toggled |

---

## 🧮 Cross-cutting: Algorithm & Strategy Deep-Dives
*Standalone, animation-heavy pages for the algorithms that power the concepts above.
Linked from every module that uses them, and browsable on their own.*

| Algorithm / strategy | Where it's used |
|---|---|
| Consistent hashing (+ virtual nodes) | Sharding, caches, load balancing |
| Raft / leader election | Replication, schedulers, consensus |
| Paxos (conceptual) | Consensus foundations |
| Gossip / epidemic protocols | Membership, anti-entropy |
| Merkle trees | Replica sync, Git, blockchains |
| Vector clocks & Lamport timestamps | Causality, conflict detection |
| CRDTs | Collaborative editing, multi-leader |
| Bloom filter / Count-Min / HyperLogLog 🧠 | Space-efficient membership & counting |
| Token bucket / leaky bucket | Rate limiting, traffic shaping |
| LRU / LFU / ARC | Cache eviction |
| Exponential backoff + jitter | Retry safety |
| Geohash / quadtree / R-tree | Geospatial search |
| Trie | Typeahead, routing tables |
| HNSW / IVF (ANN) | Vector search |
| MapReduce / shuffle | Big-data processing |

---

## Cross-cutting: "Numbers & Trade-offs" reference deck
A always-available, searchable set of **flashcards / cheat-sheets**:
- Latency numbers, capacity math, the nines table.
- Every major **trade-off** as a slider with two labeled ends
  (Consistency ↔ Availability, Latency ↔ Throughput, Cost ↔ Redundancy, Freshness ↔ Load).
- A **glossary** with one-line + one-analogy definitions.

---

## What "done" looks like per module
A module ships when it has all five beats, passes a self-recall quiz, is keyboard- and
screen-reader-accessible, and runs offline with no external calls. See
[`APP_PLAN.md`](./APP_PLAN.md) for the module template and quality bar.
