import type { ModuleContent } from "@/types/content";

export const belt5: ModuleContent[] = [
  {
    id: "design-url-shortener",
    code: "5.1",
    beltId: "case-studies",
    title: "Design a URL shortener",
    tagline: "TinyURL: read-heavy, tiny writes, huge scale.",
    hook: "Turn a 2,000-character URL into 'sd.co/aX9k' — and serve billions of redirects with sub-10ms latency. Where's the hard part?",
    tiers: {
      napkin:
        "Store a mapping from a short code to a long URL. On visit, look up the code and redirect.",
      working:
        "Generate short codes via base62 of an auto-increment id or a hash (handle collisions). It's massively read-heavy, so cache hot codes aggressively (CDN + Redis). Store mappings in a key-value/SQL store; use a 301/302 redirect.",
      deep: "Use a distributed counter or key-generation service (pre-allocated ranges) to avoid a write bottleneck. Analytics via async events. 302 (not 301) if you want to keep counting clicks. Custom aliases need uniqueness checks.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "Redirect served from cache; write path mints codes.",
      nodes: [
        { id: "u", label: "User", x: 8, y: 50, kind: "client" },
        { id: "cdn", label: "Cache", x: 34, y: 30, kind: "cache" },
        { id: "app", label: "Redirect Svc", x: 62, y: 55, kind: "app" },
        { id: "kv", label: "KV Store", x: 90, y: 55, kind: "db" },
      ],
      edges: [
        { from: "u", to: "cdn" },
        { from: "cdn", to: "app" },
        { from: "app", to: "kv" },
      ],
    },
    tradeoff: {
      axis: "Code generation: counter ↔ hash",
      left: "Counter (base62 id)",
      right: "Hash of URL",
      consequence:
        "A counter gives short, collision-free, sequential codes but needs a coordinated id generator (and codes are guessable). Hashing is stateless but must handle collisions and yields longer codes.",
    },
    recall: [
      {
        q: "A URL shortener is dominated by…",
        options: ["Writes", "Reads (redirects)", "Deletes", "Joins"],
        answer: 1,
        explain: "Redirects vastly outnumber creations, so caching the read path is the key optimization.",
      },
    ],
    memory: {
      analogy: "A coat check: you hand over a long coat (URL) and get a tiny numbered tag (short code).",
      why: "Because it's the canonical 'read-heavy, cache-everything, generate-unique-ids' interview design.",
    },
    tags: ["case-study", "caching", "ids"],
    interactive: true,
  },
  {
    id: "design-rate-limiter",
    code: "5.2",
    beltId: "case-studies",
    title: "Design a distributed rate limiter",
    tagline: "Enforce limits accurately across many nodes.",
    hook: "Allow 100 requests/minute per API key — but the traffic is spread across 30 servers that don't talk to each other. How do they agree on the count?",
    tiers: {
      napkin:
        "Track each key's request count and reject when it exceeds the limit within the window.",
      working:
        "Use a shared store (Redis) with an atomic token-bucket or sliding-window counter keyed by API key. Each node checks/decrements the shared counter. Return 429 + Retry-After when exceeded.",
      deep: "Local per-node limits drift; a central store is accurate but adds latency and a dependency. Hybrid: local approximate limiting + periodic sync. Watch Redis as a hotspot; shard by key; handle Redis failure (fail-open vs fail-closed).",
    },
    instrument: "LoadDial",
    instrumentConfig: { mode: "ratelimit" },
    tradeoff: {
      axis: "Accuracy ↔ Latency",
      left: "Central counter (Redis)",
      right: "Local per-node limits",
      consequence:
        "A central counter is accurate cluster-wide but adds a network hop and a shared dependency. Local limits are fast and dependency-free but let clients exceed the true global limit.",
    },
    recall: [
      {
        q: "When the limiter's shared store (Redis) is briefly down, 'fail-open' means…",
        options: [
          "Block all traffic",
          "Allow requests through without limiting",
          "Return cached data",
          "Shut down",
        ],
        answer: 1,
        explain: "Fail-open favors availability (allow traffic); fail-closed favors protection (block) — a deliberate choice.",
      },
    ],
    memory: {
      analogy: "A shared tally sheet at the door that every bouncer marks, so the club never exceeds capacity.",
      why: "Because per-node counting silently multiplies the real limit by the number of nodes.",
    },
    tags: ["case-study", "rate-limiting", "redis"],
    interactive: true,
  },
  {
    id: "design-news-feed",
    code: "5.3",
    beltId: "case-studies",
    title: "Design a news feed",
    tagline: "Fan-out on write vs read; the celebrity problem.",
    hook: "A user with 50 million followers posts. Do you instantly copy it into 50 million feeds — or assemble each feed on demand? Both answers break at scale.",
    tiers: {
      napkin:
        "A feed shows recent posts from people you follow, ranked and paginated.",
      working:
        "Fan-out on write (push): precompute each follower's feed on post — fast reads, huge write amplification for popular users. Fan-out on read (pull): assemble at read time — cheap writes, slow reads. Most systems use a hybrid.",
      deep: "The celebrity problem: pushing to millions is infeasible, so pull those posts at read time and push for normal users. Cache feeds, precompute ranking features, paginate with cursors. Ranking (relevance) adds an ML layer.",
    },
    instrument: "TradeoffLab",
    tradeoff: {
      axis: "Fan-out: write ↔ read",
      left: "Push (on write)",
      right: "Pull (on read)",
      consequence:
        "Push precomputes feeds for instant reads but explodes writes for high-follower accounts. Pull keeps writes cheap but makes reads expensive. Hybrid pushes for most, pulls for celebrities.",
    },
    recall: [
      {
        q: "The 'celebrity problem' pushes designs toward…",
        options: [
          "Pure fan-out on write for everyone",
          "Pulling celebrity posts at read time (hybrid)",
          "Deleting followers",
          "Stronger consistency",
        ],
        answer: 1,
        explain: "Fanning a celebrity post to tens of millions of feeds is infeasible, so those are pulled on read.",
      },
    ],
    memory: {
      analogy: "Push = mailing a copy to every subscriber; pull = everyone comes to the newsstand. Celebrities are too popular to mail.",
      why: "Because write vs read amplification is the defining trade-off of social systems.",
    },
    tags: ["case-study", "feed", "fan-out"],
    interactive: true,
  },
  {
    id: "design-chat",
    code: "5.4",
    beltId: "case-studies",
    title: "Design a chat system",
    tagline: "WhatsApp: presence, delivery, ordering.",
    hook: "Two ticks, then blue. Behind those little checkmarks is a system delivering billions of ordered, real-time messages across flaky mobile networks.",
    tiers: {
      napkin:
        "Clients keep a persistent connection to a server that routes messages between them and stores them for offline delivery.",
      working:
        "WebSocket connections to gateway servers (with a connection registry). Messages persist in a store, route via the recipient's connected server (or queue if offline). Delivery/read receipts and presence are extra event streams.",
      deep: "Ordering per conversation (sequence numbers), at-least-once delivery with client dedup, fan-out for group chats, and end-to-end encryption. Millions of stateful connections need sticky routing + pub/sub between gateways.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "Message routed via connected gateways.",
      nodes: [
        { id: "a", label: "Phone A", x: 8, y: 30, kind: "client" },
        { id: "g1", label: "Gateway", x: 36, y: 50, kind: "net" },
        { id: "q", label: "Msg Store", x: 62, y: 25, kind: "db" },
        { id: "g2", label: "Gateway", x: 66, y: 70, kind: "net" },
        { id: "b", label: "Phone B", x: 92, y: 60, kind: "client" },
      ],
      edges: [
        { from: "a", to: "g1" },
        { from: "g1", to: "q" },
        { from: "g1", to: "g2" },
        { from: "g2", to: "b" },
      ],
    },
    tradeoff: {
      axis: "Delivery guarantee ↔ Complexity",
      left: "At-least-once + dedup",
      right: "Best-effort",
      consequence:
        "At-least-once with client dedup guarantees messages arrive but needs sequence tracking and idempotent handling. Best-effort is simple but drops messages on flaky networks.",
    },
    recall: [
      {
        q: "Chat gateways need a connection registry / pub-sub because…",
        options: [
          "To encrypt messages",
          "To find which server the recipient is currently connected to",
          "To cache images",
          "To shard the database",
        ],
        answer: 1,
        explain: "With millions of sockets across many gateways, you must locate the recipient's live connection.",
      },
    ],
    memory: {
      analogy: "A switchboard operator connecting two callers, holding messages when one is unreachable.",
      why: "Because real-time, ordered, guaranteed delivery over unreliable networks is genuinely hard.",
    },
    tags: ["case-study", "chat", "websockets", "realtime"],
    interactive: true,
  },
  {
    id: "design-video-streaming",
    code: "5.5",
    beltId: "case-studies",
    title: "Design video streaming",
    tagline: "YouTube/Netflix: transcode, CDN, adaptive bitrate.",
    hook: "One uploaded video must play smoothly on a 4K TV and a 3G phone, to millions of people at once, worldwide. That's not one file — it's dozens, everywhere.",
    tiers: {
      napkin:
        "Upload once, transcode into many resolutions, store in blob storage, and serve chunks from a CDN near each viewer.",
      working:
        "An async pipeline transcodes the upload into multiple bitrates/resolutions, split into small segments (HLS/DASH). The player adapts bitrate to bandwidth. CDNs cache segments globally; metadata lives in a database.",
      deep: "Adaptive bitrate streaming switches quality per-segment to avoid buffering. Pre-position popular content at edges; use origin shielding. Live streaming adds low-latency pipelines. Storage/egress cost dominates.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "Upload → transcode → CDN → adaptive playback.",
      nodes: [
        { id: "up", label: "Upload", x: 6, y: 40, kind: "client" },
        { id: "tr", label: "Transcode", x: 30, y: 55, kind: "app" },
        { id: "blob", label: "Blob Store", x: 54, y: 30, kind: "db" },
        { id: "cdn", label: "CDN", x: 78, y: 55, kind: "cache" },
        { id: "v", label: "Viewer", x: 95, y: 40, kind: "client" },
      ],
      edges: [
        { from: "up", to: "tr" },
        { from: "tr", to: "blob" },
        { from: "blob", to: "cdn" },
        { from: "cdn", to: "v" },
      ],
    },
    tradeoff: {
      axis: "Quality ↔ Buffering",
      left: "Higher bitrate",
      right: "Adapt down fast",
      consequence:
        "Serving higher bitrate looks better but risks buffering on weak connections. Aggressively adapting down keeps playback smooth but reduces visual quality.",
    },
    recall: [
      {
        q: "Adaptive bitrate streaming works by…",
        options: [
          "Sending one huge file",
          "Switching segment quality based on the viewer's bandwidth",
          "Using UDP only",
          "Caching in the database",
        ],
        answer: 1,
        explain: "The player picks each segment's quality to match current bandwidth, avoiding stalls.",
      },
    ],
    memory: {
      analogy: "A tailor pre-making the same suit in every size, stocked in shops worldwide, so anyone gets a fit instantly.",
      why: "Because one video + global scale + varied devices forces transcoding, chunking, and edge delivery.",
    },
    tags: ["case-study", "video", "cdn", "streaming"],
    interactive: true,
  },
  {
    id: "design-ride-sharing",
    code: "5.6",
    beltId: "case-studies",
    title: "Design ride-sharing (Uber)",
    tagline: "Geospatial matching at city scale.",
    hook: "You tap 'request ride'. In under a second, the system finds the nearest available driver among hundreds of thousands moving through the city. How does it search a map that fast?",
    tiers: {
      napkin:
        "Track driver locations, and when a rider requests, find nearby available drivers and match one.",
      working:
        "Drivers stream location updates. Use a geospatial index (geohash or quadtree) to query 'drivers near this point' fast. A matching service picks the best driver; a trip service manages state. Location updates are high-write.",
      deep: "Geohash buckets nearby points into shared prefixes for cheap proximity queries; quadtrees adapt to density. Handle surge (pricing), ETA (routing), and the write storm of location pings (in-memory + sharded by region).",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "Location pings feed a geo-index; matcher pairs riders.",
      nodes: [
        { id: "d", label: "Drivers", x: 8, y: 30, kind: "client" },
        { id: "geo", label: "Geo Index", x: 40, y: 50, kind: "cache" },
        { id: "m", label: "Matcher", x: 70, y: 30, kind: "app" },
        { id: "r", label: "Rider", x: 92, y: 55, kind: "client" },
      ],
      edges: [
        { from: "d", to: "geo" },
        { from: "geo", to: "m" },
        { from: "r", to: "m" },
      ],
    },
    tradeoff: {
      axis: "Geohash ↔ Quadtree",
      left: "Geohash (uniform)",
      right: "Quadtree (adaptive)",
      consequence:
        "Geohash is simple and shardable but wastes cells in sparse areas and can overload dense ones. Quadtrees adapt to density (fine in cities, coarse in country) but are more complex to maintain.",
    },
    recall: [
      {
        q: "Geospatial indexes (geohash/quadtree) exist to make which query fast?",
        options: [
          "Sorting by name",
          "Finding entities near a point",
          "Counting all rows",
          "Joining two tables",
        ],
        answer: 1,
        explain: "They turn 2D proximity into cheap prefix/tree lookups instead of scanning everything.",
      },
    ],
    memory: {
      analogy: "Dividing a map into a grid so you only check the squares near you, not the whole city.",
      why: "Because 'nearest driver' over hundreds of thousands of moving points needs spatial indexing, not brute force.",
    },
    tags: ["case-study", "geospatial", "matching"],
    interactive: true,
  },
  {
    id: "design-typeahead",
    code: "5.7",
    beltId: "case-studies",
    title: "Design search typeahead",
    tagline: "Suggestions in milliseconds, per keystroke.",
    hook: "You type 'sys' and instantly see 'system design', 'sysadmin', 'system of a down'. That suggestion arrived before you finished the word — how?",
    tiers: {
      napkin:
        "As the user types a prefix, return the most likely completions, ranked by popularity.",
      working:
        "Build a trie (prefix tree) of terms; each node caches its top-K completions so a prefix lookup is instant. Serve from memory/edge; debounce keystrokes; update popularity from query logs offline.",
      deep: "Precompute top-K per node to avoid traversing subtrees at query time. Shard the trie by prefix; refresh rankings via batch jobs. Personalization and typo-tolerance (edit distance) add layers.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "Keystroke → prefix lookup in the trie → top-K.",
      nodes: [
        { id: "u", label: "Keystroke", x: 8, y: 50, kind: "client" },
        { id: "edge", label: "Edge Cache", x: 36, y: 50, kind: "cache" },
        { id: "trie", label: "Trie Service", x: 68, y: 50, kind: "app" },
        { id: "logs", label: "Query Logs", x: 92, y: 50, kind: "db" },
      ],
      edges: [
        { from: "u", to: "edge" },
        { from: "edge", to: "trie" },
        { from: "trie", to: "logs" },
      ],
    },
    tradeoff: {
      axis: "Freshness ↔ Query speed",
      left: "Precompute top-K",
      right: "Compute at query time",
      consequence:
        "Precomputing top-K per node makes lookups instant but rankings lag until the next rebuild. Computing at query time is always fresh but too slow for per-keystroke latency.",
    },
    recall: [
      {
        q: "The core data structure for typeahead is a…",
        options: ["Hash ring", "Trie (prefix tree)", "B-tree", "Bloom filter"],
        answer: 1,
        explain: "A trie maps prefixes to completions; caching top-K per node makes it instant.",
      },
    ],
    memory: {
      analogy: "A phone book where each partial spelling instantly flips to the right page of names.",
      why: "Because per-keystroke latency budgets are tiny, forcing precomputation and in-memory prefix trees.",
    },
    tags: ["case-study", "trie", "search"],
    interactive: true,
  },
  {
    id: "design-payments",
    code: "5.8",
    beltId: "case-studies",
    title: "Design a payment system",
    tagline: "Exactly-once money movement.",
    hook: "A user taps 'Pay' twice because the page hung. You must charge them exactly once — never zero, never twice. In a distributed system, that's surprisingly hard.",
    tiers: {
      napkin:
        "Record intended payments, execute them against a provider, and keep an accurate ledger — without double-charging.",
      working:
        "Idempotency keys make retries safe (same key = same charge). A double-entry ledger records every movement immutably. Async reconciliation compares your records with the provider's. State machines track payment lifecycle.",
      deep: "Exactly-once is achieved via idempotency + dedup, not magic — the network is at-least-once. Use sagas for multi-step flows, outbox pattern for reliable event emission, and strong consistency for balances. Auditability is paramount.",
    },
    instrument: "Timeline",
    instrumentConfig: {
      actors: ["Client", "Payment Svc", "Provider"],
      caption: "Idempotency key makes the retry a no-op.",
      events: [
        { t: 0, from: 0, to: 1, label: "pay (key=abc)" },
        { t: 1, from: 1, to: 2, label: "charge" },
        { t: 2, from: 0, to: 1, label: "retry (key=abc)" },
        { t: 3, from: 1, to: 0, label: "same result (no double charge)" },
      ],
    },
    tradeoff: {
      axis: "Consistency ↔ Availability",
      left: "Strong (balances)",
      right: "Eventual (analytics)",
      consequence:
        "Money balances demand strong consistency and auditability even at latency cost. Peripheral data (receipts, analytics) can be eventually consistent for availability and speed.",
    },
    recall: [
      {
        q: "'Exactly-once' charging is actually implemented via…",
        options: [
          "A faster network",
          "Idempotency keys + deduplication over an at-least-once system",
          "Disabling retries",
          "Caching the response",
        ],
        answer: 1,
        explain: "Networks are at-least-once; idempotency keys ensure a repeated request applies the charge only once.",
      },
    ],
    memory: {
      analogy: "A ticket with a unique number: hand it in twice and you still only get one entry.",
      why: "Because with money, both losing a charge and duplicating it are unacceptable — correctness is non-negotiable.",
    },
    tags: ["case-study", "payments", "idempotency", "ledger"],
    interactive: true,
  },
  {
    id: "design-notifications",
    code: "5.9",
    beltId: "case-studies",
    title: "Design a notification system",
    tagline: "Fan-out across push, email, SMS.",
    hook: "One event ('your order shipped') must reach a user via push, email, or SMS — deduped, respecting their preferences, without spamming them or melting the providers.",
    tiers: {
      napkin:
        "Take an event, decide who to notify and how (channel), then deliver reliably across providers.",
      working:
        "An event enters a queue; a service resolves recipient preferences and channels, then hands each message to channel workers (APNs/FCM, email, SMS) with rate limiting and retries. Dedup prevents repeats.",
      deep: "Handle provider failures (retry/fallback channel), prioritization (OTP > marketing), throttling, template rendering, and delivery tracking. Idempotency keys dedupe; DLQs catch poison messages; user preference/quiet-hours logic is central.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "Event fans out to channel workers.",
      nodes: [
        { id: "e", label: "Event", x: 8, y: 50, kind: "app" },
        { id: "q", label: "Queue", x: 34, y: 50, kind: "cache" },
        { id: "push", label: "Push", x: 74, y: 20, kind: "app" },
        { id: "email", label: "Email", x: 78, y: 50, kind: "app" },
        { id: "sms", label: "SMS", x: 74, y: 80, kind: "app" },
      ],
      edges: [
        { from: "e", to: "q" },
        { from: "q", to: "push" },
        { from: "q", to: "email" },
        { from: "q", to: "sms" },
      ],
    },
    tradeoff: {
      axis: "Reach ↔ Annoyance",
      left: "Notify on everything",
      right: "Aggressive dedup/throttle",
      consequence:
        "Notifying on every event maximizes reach but spams users and providers. Heavy dedup and throttling respect users and cost but risk missing time-sensitive alerts.",
    },
    recall: [
      {
        q: "Why route notifications through a queue?",
        options: [
          "To encrypt them",
          "To decouple, buffer spikes, and enable retries per channel",
          "To store user passwords",
          "To render HTML",
        ],
        answer: 1,
        explain: "Queuing absorbs bursts and lets each channel retry independently without blocking the producer.",
      },
    ],
    memory: {
      analogy: "A mailroom that takes one memo and sends it by the recipient's preferred method — post, fax, or courier.",
      why: "Because multi-channel, deduped, preference-aware, provider-resilient delivery has many moving parts.",
    },
    tags: ["case-study", "notifications", "fan-out", "queues"],
    interactive: true,
  },
  {
    id: "design-job-scheduler",
    code: "5.10",
    beltId: "case-studies",
    title: "Design a distributed job scheduler",
    tagline: "Cron at scale, exactly-ish once.",
    hook: "A million scheduled jobs must fire at the right time, exactly once, even if the machine that owns them dies mid-run. Who's in charge, and what happens when they crash?",
    tiers: {
      napkin:
        "Store jobs with their schedules; a scheduler picks due jobs and dispatches them to workers to run.",
      working:
        "Persist jobs and next-run times; a leader (elected via Raft/ZooKeeper) polls for due jobs and enqueues them; workers pull and execute with at-least-once semantics + idempotency. Track state to avoid double runs.",
      deep: "Leader election prevents multiple schedulers firing the same job; leases/heartbeats detect dead workers to re-run. Handle clock skew, missed runs (catch-up policy), backpressure, and priority. Shard the job space for scale.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "Leader dispatches due jobs to workers.",
      nodes: [
        { id: "db", label: "Job Store", x: 10, y: 50, kind: "db" },
        { id: "lead", label: "Leader", x: 42, y: 50, kind: "net" },
        { id: "w1", label: "Worker", x: 82, y: 28, kind: "app" },
        { id: "w2", label: "Worker", x: 82, y: 72, kind: "app" },
      ],
      edges: [
        { from: "db", to: "lead" },
        { from: "lead", to: "w1" },
        { from: "lead", to: "w2" },
      ],
    },
    tradeoff: {
      axis: "Delivery: at-least-once ↔ at-most-once",
      left: "At-least-once + idempotent",
      right: "At-most-once",
      consequence:
        "At-least-once guarantees a job runs (may run twice — needs idempotency) — safest for must-run work. At-most-once never double-runs but may skip a job if a worker dies mid-execution.",
    },
    recall: [
      {
        q: "Leader election in a job scheduler prevents…",
        options: [
          "Slow jobs",
          "Multiple schedulers firing the same job simultaneously",
          "Clock drift",
          "Large payloads",
        ],
        answer: 1,
        explain: "A single elected leader ensures one authority decides which jobs fire, avoiding duplicates.",
      },
    ],
    memory: {
      analogy: "A single foreman handing out tasks; if he collapses, the crew elects a new one so work never stops or doubles.",
      why: "Because timed, exactly-once execution across a fault-prone cluster combines consensus, leases, and idempotency.",
    },
    tags: ["case-study", "scheduler", "leader-election", "consensus"],
    interactive: true,
  },
];
