import type { ModuleContent } from "@/types/content";

/** Extensions to Belt 4 (Patterns) and Belt 5 (Case Studies). */
export const extPatternsCases: ModuleContent[] = [
  // ---------- Belt 4 ----------
  {
    id: "outbox-pattern",
    code: "4.11",
    beltId: "patterns",
    title: "The transactional outbox",
    tagline: "Update the DB and publish an event, atomically.",
    hook: "You save an order, then publish 'OrderPlaced' to Kafka. The DB commit succeeds but the publish fails. Now your systems disagree forever. How do you make both happen or neither?",
    tiers: {
      napkin:
        "The outbox pattern writes the event into an 'outbox' table in the same DB transaction as the business change, then a separate process publishes those rows to the message broker.",
      working:
        "Because the row and the outbox entry commit together, you never lose an event or publish one for an uncommitted change. A relay (often via CDC) reads the outbox and publishes, marking rows sent — giving reliable at-least-once delivery.",
      deep: "It solves the dual-write problem (DB + broker can't share a transaction). Consumers must be idempotent (at-least-once). Combine with CDC/Debezium to tail the outbox. The inbox pattern does the mirror image for dedup on the consumer side.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "One transaction writes data + outbox; a relay publishes.",
      nodes: [
        { id: "app", label: "App (1 txn)", x: 8, y: 50, kind: "app" },
        { id: "db", label: "DB + outbox", x: 40, y: 50, kind: "db" },
        { id: "relay", label: "Relay/CDC", x: 68, y: 50, kind: "net" },
        { id: "broker", label: "Broker", x: 92, y: 50, kind: "cache" },
      ],
      edges: [
        { from: "app", to: "db" },
        { from: "db", to: "relay" },
        { from: "relay", to: "broker" },
      ],
    },
    tradeoff: {
      axis: "Reliability ↔ Simplicity",
      left: "Outbox + relay",
      right: "Dual write",
      consequence:
        "The outbox guarantees the event and the data commit together but adds an outbox table and a relay process. A direct dual-write is simpler but loses or duplicates events whenever one of the two writes fails.",
    },
    recall: [
      {
        q: "The outbox pattern solves which problem?",
        options: [
          "Slow queries",
          "The dual-write problem (DB commit + event publish not being atomic)",
          "Cache eviction",
          "TLS handshakes",
        ],
        answer: 1,
        explain: "Writing the event in the same transaction as the data makes them atomic; a relay publishes reliably.",
      },
    ],
    memory: {
      analogy: "Drop your outgoing letter in your own locked mailbox as part of finishing the task; the courier collects it later — guaranteed.",
      why: "Because a database and a message broker can't share a transaction, so naive dual writes drift.",
    },
    tags: ["outbox", "events", "consistency", "microservices"],
    interactive: true,
  },
  {
    id: "ddd-bounded-contexts",
    code: "4.12",
    beltId: "patterns",
    title: "DDD & bounded contexts",
    tagline: "Draw service boundaries that don't hurt.",
    hook: "You split into microservices along technical layers — and now every feature touches five services. The problem wasn't microservices; it was where you cut them.",
    tiers: {
      napkin:
        "Domain-Driven Design says split systems along business capabilities ('bounded contexts'), not technical layers. Each context owns its model and data.",
      working:
        "A bounded context is a boundary where a term (e.g., 'Customer') has one consistent meaning. Services aligned to contexts change independently; the same concept can differ across contexts. Well-drawn boundaries minimize cross-service chatter.",
      deep: "A context map defines relationships (shared kernel, anti-corruption layer) between contexts. The ubiquitous language keeps code and business aligned. Bad boundaries → the distributed monolith; good ones → true team autonomy.",
    },
    instrument: "TradeoffLab",
    tradeoff: {
      axis: "Boundary by capability ↔ by layer",
      left: "Bounded contexts",
      right: "Technical layers",
      consequence:
        "Splitting by business capability keeps most changes inside one service (autonomy) but requires real domain modeling. Splitting by technical layer is easy to draw but makes every feature cut across many services.",
    },
    recall: [
      {
        q: "A bounded context is best described as…",
        options: [
          "A network boundary",
          "A boundary within which a domain term has one consistent meaning",
          "A database shard",
          "A rate limit",
        ],
        answer: 1,
        explain: "It scopes a model so 'Customer' means one thing inside it — the basis for good service boundaries.",
      },
    ],
    memory: {
      analogy: "Departments in a company: 'account' means something different to Sales vs Support, and each owns its own version.",
      why: "Because microservices split along the wrong seams create more coupling, not less.",
    },
    tags: ["ddd", "microservices", "architecture", "boundaries"],
    interactive: true,
  },
  {
    id: "bff-pattern",
    code: "4.13",
    beltId: "patterns",
    title: "Backend for Frontend (BFF)",
    tagline: "A tailored API per client.",
    hook: "Your mobile app needs 3 fields; your web app needs 30. One shared API forces both to compromise. What if each client had its own backend?",
    tiers: {
      napkin:
        "A BFF is a thin backend dedicated to one frontend (web, mobile, TV), shaping and aggregating downstream services exactly for that client's needs.",
      working:
        "Each BFF aggregates calls, trims payloads, and formats responses for its client, so the app makes one call instead of many. It absorbs client-specific logic that would otherwise bloat shared services or the client.",
      deep: "BFFs reduce over/under-fetching and chattiness (especially on mobile). The cost is more services to maintain and possible logic duplication across BFFs. GraphQL is an alternative that lets clients shape queries without a BFF per platform.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "Each client talks to its own tailored backend.",
      nodes: [
        { id: "web", label: "Web", x: 8, y: 28, kind: "client" },
        { id: "mob", label: "Mobile", x: 8, y: 72, kind: "client" },
        { id: "bffw", label: "Web BFF", x: 38, y: 28, kind: "app" },
        { id: "bffm", label: "Mobile BFF", x: 38, y: 72, kind: "app" },
        { id: "svcs", label: "Services", x: 80, y: 50, kind: "net" },
      ],
      edges: [
        { from: "web", to: "bffw" },
        { from: "mob", to: "bffm" },
        { from: "bffw", to: "svcs" },
        { from: "bffm", to: "svcs" },
      ],
    },
    tradeoff: {
      axis: "Tailoring ↔ Duplication",
      left: "BFF per client",
      right: "One shared API",
      consequence:
        "A BFF per client gives each an optimal, minimal API and one round trip, but means more services and some duplicated logic. One shared API is less to maintain but forces every client into a lowest-common-denominator contract.",
    },
    recall: [
      {
        q: "The main win of a BFF is…",
        options: [
          "Encryption",
          "A per-client API that avoids over/under-fetching and chatty calls",
          "Sharding the database",
          "Removing all backends",
        ],
        answer: 1,
        explain: "Each frontend gets exactly the shape and aggregation it needs in a single call.",
      },
    ],
    memory: {
      analogy: "A personal translator for each guest, phrasing the same information in exactly their language.",
      why: "Because different clients have very different data and payload needs that one API can't serve well.",
    },
    tags: ["bff", "api", "architecture", "frontend"],
    interactive: true,
  },
  {
    id: "api-versioning",
    code: "4.14",
    beltId: "patterns",
    title: "API versioning & evolution",
    tagline: "Change the contract without breaking clients.",
    hook: "A million apps depend on your API. You need to rename a field. Do it wrong and you break every one of them overnight.",
    tiers: {
      napkin:
        "API versioning lets you evolve a contract while old clients keep working — via URL versions (/v2), headers, or backward-compatible changes.",
      working:
        "Prefer additive, backward-compatible changes (add optional fields, never remove/rename in place). When breaking changes are unavoidable, version explicitly and run versions in parallel with a deprecation window. Expand-then-contract for schema migrations.",
      deep: "Semantic versioning signals intent; contract tests catch breaks. Old clients (especially mobile — users don't update) can persist for years, so plan long deprecation cycles and telemetry on version usage. Tolerant readers ignore unknown fields.",
    },
    instrument: "TradeoffLab",
    tradeoff: {
      axis: "Move fast ↔ Don't break clients",
      left: "Break & bump version",
      right: "Backward-compatible only",
      consequence:
        "Breaking and versioning lets you clean up the design but forces clients to migrate and you to run multiple versions. Staying backward-compatible never breaks anyone but accumulates cruft you can rarely remove.",
    },
    recall: [
      {
        q: "The safest way to evolve an API in place is to…",
        options: [
          "Rename fields immediately",
          "Add new optional fields without removing/renaming existing ones",
          "Delete unused fields right away",
          "Change types silently",
        ],
        answer: 1,
        explain: "Additive, backward-compatible changes don't break existing clients; removals need a versioned deprecation cycle.",
      },
    ],
    memory: {
      analogy: "Renovating a shop while keeping the old entrance open until everyone knows about the new one.",
      why: "Because clients (especially mobile) update slowly, so contracts must evolve without sudden breaks.",
    },
    tags: ["api", "versioning", "compatibility", "architecture"],
    interactive: true,
  },

  // ---------- Belt 5 ----------
  {
    id: "design-web-crawler",
    code: "5.11",
    beltId: "case-studies",
    title: "Design a web crawler",
    tagline: "Fetch the web without melting it (or looping forever).",
    hook: "Crawl billions of pages, never visit the same URL twice, respect politeness, and keep going for weeks. Where do you even store 'seen'?",
    tiers: {
      napkin:
        "A crawler pulls URLs from a frontier queue, fetches pages, extracts new links, dedupes them, and repeats — at massive scale.",
      working:
        "A URL frontier (prioritized, politeness-aware queues) feeds fetcher workers. Seen-URL dedup uses a Bloom filter (billions of URLs cheaply). Parsers extract links; content is deduped by hash; robots.txt and per-domain rate limits enforce politeness.",
      deep: "Politeness (per-host delay) and prioritization (freshness, importance) are core. Distribute by domain hash to keep host state local. Handle traps (infinite calendars), dedup near-duplicate content (simhash), and recrawl by change frequency.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "frontier → fetch → parse → dedupe → back to frontier.",
      nodes: [
        { id: "f", label: "URL Frontier", x: 10, y: 50, kind: "cache" },
        { id: "fetch", label: "Fetchers", x: 38, y: 30, kind: "app" },
        { id: "parse", label: "Parser", x: 66, y: 55, kind: "app" },
        { id: "seen", label: "Seen (Bloom)", x: 90, y: 30, kind: "cache" },
      ],
      edges: [
        { from: "f", to: "fetch" },
        { from: "fetch", to: "parse" },
        { from: "parse", to: "seen" },
        { from: "parse", to: "f" },
      ],
    },
    tradeoff: {
      axis: "Coverage ↔ Politeness/cost",
      left: "Crawl aggressively",
      right: "Crawl politely",
      consequence:
        "Aggressive crawling covers the web faster but hammers sites (and gets you blocked). Polite crawling (per-host delays, robots.txt) is sustainable and respectful but slower to achieve coverage.",
    },
    recall: [
      {
        q: "A crawler uses a Bloom filter mainly to…",
        options: [
          "Rank pages",
          "Cheaply check if a URL has already been seen",
          "Encrypt pages",
          "Store page content",
        ],
        answer: 1,
        explain: "Billions of 'seen' URLs won't fit exactly; a Bloom filter answers 'definitely new' in tiny space.",
      },
    ],
    memory: {
      analogy: "Exploring a huge maze: keep a queue of doors to try and a cheap way to remember which you've opened.",
      why: "Because it combines frontier queues, dedup at scale (Bloom), politeness, and distributed fetching — a rich systems problem.",
    },
    tags: ["case-study", "crawler", "bloom-filter"],
    interactive: true,
  },
  {
    id: "design-distributed-cache",
    code: "5.12",
    beltId: "case-studies",
    title: "Design a distributed cache",
    tagline: "Redis/Memcached at cluster scale.",
    hook: "Your cache no longer fits on one box. Spread it across 20 — but when one dies, you don't want every key to move.",
    tiers: {
      napkin:
        "A distributed cache spreads keys across many nodes so total memory and throughput scale, with clients routing each key to the right node.",
      working:
        "Consistent hashing maps keys to nodes so adding/removing a node moves only ~1/N of keys. Add replication for availability, eviction (LRU) per node, and TTLs. Handle hot keys (replicate or client-side cache) and thundering herds (request coalescing).",
      deep: "Choose invalidation strategy (TTL vs explicit), decide on write path (cache-aside common), and plan for node failure (rehash + cold-cache stampede). Redis Cluster shards with hash slots; client or proxy handles routing.",
    },
    instrument: "NodeRing",
    tradeoff: {
      axis: "Availability ↔ Memory cost",
      left: "Replicate cache",
      right: "Single copy per key",
      consequence:
        "Replicating cached data survives node loss and spreads hot-key reads but doubles memory. A single copy per key is memory-efficient but a node failure cold-starts all its keys, stampeding the origin.",
    },
    recall: [
      {
        q: "Which algorithm keeps key movement minimal when cache nodes are added/removed?",
        options: ["mod-N hashing", "Consistent hashing", "Round-robin", "FIFO"],
        answer: 1,
        explain: "Consistent hashing moves only ~1/N of keys on membership change, avoiding a cache-wide reshuffle.",
      },
    ],
    memory: {
      analogy: "A coat check split across many racks by a stable rule, so adding a rack only reshuffles a few coats.",
      why: "Because caches outgrow one machine and node churn must not invalidate everything.",
    },
    tags: ["case-study", "cache", "consistent-hashing", "redis"],
    interactive: true,
  },
  {
    id: "design-distributed-lock",
    code: "5.13",
    beltId: "case-studies",
    title: "Design a distributed lock",
    tagline: "One winner across many machines.",
    hook: "Two servers both try to charge a card 'only once.' You need exactly one of them to win a lock that spans machines — even if the holder crashes.",
    tiers: {
      napkin:
        "A distributed lock ensures only one process across a cluster holds a resource at a time, with automatic release if the holder dies.",
      working:
        "Options: a lock key in Redis with an expiry (SET NX PX) + a unique token to release safely; or a coordination service (ZooKeeper/etcd) using ephemeral nodes + consensus. Expiry prevents deadlock if the holder crashes.",
      deep: "Locks are dangerous: clock skew and GC pauses can let a lock expire while the holder thinks it's held (fencing tokens fix this — the resource rejects stale tokens). Redlock is debated; consensus-backed locks (etcd) are safer. Prefer idempotency over locks when possible.",
    },
    instrument: "Timeline",
    instrumentConfig: {
      actors: ["Node A", "Lock (etcd)", "Node B"],
      caption: "A acquires; B waits until release/expiry.",
      events: [
        { t: 0, from: 0, to: 1, label: "acquire (token=7)" },
        { t: 1, from: 2, to: 1, label: "acquire → blocked" },
        { t: 2, from: 0, to: 1, label: "release" },
        { t: 3, from: 2, to: 1, label: "acquire (token=8)" },
      ],
    },
    tradeoff: {
      axis: "Safety ↔ Availability",
      left: "Consensus lock (etcd)",
      right: "Redis expiry lock",
      consequence:
        "A consensus-backed lock is safe under failures and partitions but slower and needs a consensus cluster. A simple Redis expiry lock is fast and easy but can be unsafe under clock skew/GC pauses without fencing tokens.",
    },
    recall: [
      {
        q: "A fencing token protects against…",
        options: [
          "Slow networks",
          "A stale lock holder (paused/expired) still writing to the resource",
          "Cache misses",
          "SQL injection",
        ],
        answer: 1,
        explain: "The resource accepts only the highest token seen, rejecting a delayed holder whose lock already expired.",
      },
    ],
    memory: {
      analogy: "A single 'talking stick' with a numbered tag; the room ignores anyone waving an old tag number.",
      why: "Because coordinating exclusive access across machines with crashes and pauses is deceptively hard.",
    },
    tags: ["case-study", "distributed-lock", "etcd", "consensus"],
    interactive: true,
  },
  {
    id: "design-collaborative-editor",
    code: "5.14",
    beltId: "case-studies",
    title: "Design a collaborative editor",
    tagline: "Google Docs: many cursors, one document.",
    hook: "Ten people type in the same paragraph at once. Everyone's edits must merge live, in order, with no lost keystrokes. How?",
    tiers: {
      napkin:
        "Real-time collaboration syncs concurrent edits so all users converge to the same document, using Operational Transformation (OT) or CRDTs.",
      working:
        "Clients send edit operations over WebSockets to a server that orders and rebroadcasts them. OT transforms concurrent operations against each other to preserve intent; CRDTs merge commutatively without a central sequencer. Presence (cursors) is a separate lightweight channel.",
      deep: "OT needs careful transform functions and usually a central server; CRDTs work peer-to-peer/offline but carry metadata. Persist an oplog for history/undo. Handle late joiners (snapshot + tail) and network partitions (buffer + reconcile).",
    },
    instrument: "Timeline",
    instrumentConfig: {
      actors: ["User A", "Server", "User B"],
      caption: "Concurrent ops are ordered and merged for all.",
      events: [
        { t: 0, from: 0, to: 1, label: "insert 'x'@2" },
        { t: 0, from: 2, to: 1, label: "insert 'y'@2" },
        { t: 1, from: 1, to: 0, label: "merged op" },
        { t: 1, from: 1, to: 2, label: "merged op" },
      ],
    },
    tradeoff: {
      axis: "OT ↔ CRDT",
      left: "Operational Transformation",
      right: "CRDTs",
      consequence:
        "OT is compact and battle-tested (Google Docs) but usually needs a central server and tricky transform logic. CRDTs merge peer-to-peer and offline with simpler correctness but carry more metadata overhead.",
    },
    recall: [
      {
        q: "The core challenge in collaborative editing is…",
        options: [
          "Encrypting text",
          "Merging concurrent edits so everyone converges without losing intent",
          "Storing large files",
          "Rate limiting",
        ],
        answer: 1,
        explain: "OT or CRDTs reconcile simultaneous operations into one consistent document for all users.",
      },
    ],
    memory: {
      analogy: "A shared whiteboard where everyone draws at once, yet the marks always end up in a sensible, agreed order.",
      why: "Because concurrent edits to shared text must merge live without conflicts or lost work.",
    },
    tags: ["case-study", "collaboration", "crdt", "ot", "realtime"],
    interactive: true,
  },
  {
    id: "design-message-queue",
    code: "5.15",
    beltId: "case-studies",
    title: "Design a message queue (Kafka)",
    tagline: "A durable, replayable event log at scale.",
    hook: "Millions of events per second, consumed by many teams, replayable from any point, never lost. That's not a queue — it's a distributed log.",
    tiers: {
      napkin:
        "A log-based broker (Kafka) stores events in ordered, partitioned, append-only logs. Producers append; consumers read at their own offset and can replay.",
      working:
        "Topics split into partitions (the unit of parallelism and ordering). Each partition is replicated across brokers for durability; one leader handles writes. Consumers in a group split partitions; each tracks its offset, enabling replay and independent consumption.",
      deep: "Ordering is per-partition (choose partition keys carefully). Durability comes from replication + acks; throughput from sequential disk writes + zero-copy. Tune retention, in-sync replicas (acks=all), and consumer lag monitoring. Exactly-once needs idempotent producers + transactions.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "Partitioned, replicated log; consumer groups read offsets.",
      nodes: [
        { id: "p", label: "Producers", x: 8, y: 50, kind: "app" },
        { id: "part", label: "Partitions (replicated)", x: 45, y: 50, kind: "db" },
        { id: "g1", label: "Group A", x: 82, y: 28, kind: "app" },
        { id: "g2", label: "Group B", x: 82, y: 72, kind: "app" },
      ],
      edges: [
        { from: "p", to: "part" },
        { from: "part", to: "g1" },
        { from: "part", to: "g2" },
      ],
    },
    tradeoff: {
      axis: "Ordering ↔ Parallelism",
      left: "Few partitions",
      right: "Many partitions",
      consequence:
        "Fewer partitions give stronger ordering (one order per partition) but limit consumer parallelism. Many partitions scale throughput massively but only guarantee ordering within each partition, not across the topic.",
    },
    recall: [
      {
        q: "In Kafka, message ordering is guaranteed…",
        options: ["Across the whole topic", "Within a single partition", "Never", "Only for one consumer"],
        answer: 1,
        explain: "Order holds per partition; cross-partition order isn't guaranteed, so keys route related events together.",
      },
    ],
    memory: {
      analogy: "A row of append-only ledgers; each reader keeps a bookmark and can re-read from any page.",
      why: "Because decoupled, durable, replayable event streams underpin modern event-driven systems.",
    },
    tags: ["case-study", "kafka", "queues", "streaming"],
    interactive: true,
  },
  {
    id: "design-leaderboard",
    code: "5.16",
    beltId: "case-studies",
    title: "Design a real-time leaderboard",
    tagline: "Top-N rankings over millions of players.",
    hook: "50 million players, scores changing every second, and everyone wants to know 'what's my rank?' instantly. Sorting 50M rows per request is a non-starter.",
    tiers: {
      napkin:
        "A leaderboard needs fast score updates and fast rank queries. A sorted data structure (Redis sorted set / skip list) maintains order incrementally.",
      working:
        "Redis sorted sets (ZADD/ZRANK/ZREVRANGE) keep scores ordered via a skip list, giving O(log n) updates and top-N reads. For huge scale, shard by score range or region and merge, and cache the top-K. Approximate rank for the long tail.",
      deep: "Exact global rank for tens of millions is expensive; use per-shard ranks + a coarse global histogram for approximate percentile. Handle ties (secondary sort by time), score decay for 'trending', and hot updates. Persist to a DB; Redis is the serving layer.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "Scores update a sorted set; top-N served instantly.",
      nodes: [
        { id: "g", label: "Score events", x: 8, y: 50, kind: "app" },
        { id: "zset", label: "Sorted Set (skip list)", x: 48, y: 50, kind: "cache" },
        { id: "api", label: "Rank / Top-N", x: 88, y: 50, kind: "app" },
      ],
      edges: [
        { from: "g", to: "zset" },
        { from: "zset", to: "api" },
      ],
    },
    tradeoff: {
      axis: "Exact rank ↔ Scale/cost",
      left: "Exact global rank",
      right: "Approximate/sharded",
      consequence:
        "Exact global rank is precise but expensive to maintain over tens of millions of live scores. Sharded/approximate ranks (per-region + histograms) scale cheaply but give estimated positions for the long tail.",
    },
    recall: [
      {
        q: "Redis sorted sets give fast leaderboard ops because they're backed by a…",
        options: ["Hash table", "Skip list (ordered)", "B-tree on disk", "Bloom filter"],
        answer: 1,
        explain: "A skip list keeps entries ordered with O(log n) insert and rank/range queries.",
      },
    ],
    memory: {
      analogy: "A scoreboard that re-sorts itself the instant a score changes, so 'who's #1' is always ready.",
      why: "Because re-sorting millions of scores per query is impossible; you maintain order incrementally.",
    },
    tags: ["case-study", "leaderboard", "redis", "skip-list"],
    interactive: true,
  },
];
