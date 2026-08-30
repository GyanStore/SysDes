import type { ModuleContent } from "@/types/content";

export const belt1: ModuleContent[] = [
  {
    id: "dns-tcp-udp",
    code: "1.1",
    beltId: "building-blocks",
    title: "DNS, TCP & UDP",
    tagline: "Names to addresses; reliable vs fast.",
    hook: "Before a single byte of your app moves, the network has to answer two questions: where is the server, and how careful should we be getting there?",
    tiers: {
      napkin:
        "DNS turns a name into an IP address. TCP delivers reliably and in order; UDP fires and forgets.",
      working:
        "TCP's 3-way handshake and acknowledgements guarantee ordered, lossless delivery — great for web/APIs. UDP skips all that for minimal latency — great for video, games, DNS itself.",
      deep: "TCP head-of-line blocking means one lost packet stalls everything behind it; that's why HTTP/3 moves to QUIC over UDP. DNS is cached at many layers (browser, OS, resolver) with TTLs governing staleness.",
    },
    instrument: "Timeline",
    instrumentConfig: {
      actors: ["Client", "Server"],
      caption: "TCP handshake vs UDP fire-and-forget.",
      events: [
        { t: 0, from: 0, to: 1, label: "SYN" },
        { t: 1, from: 1, to: 0, label: "SYN-ACK" },
        { t: 2, from: 0, to: 1, label: "ACK + data" },
      ],
    },
    tradeoff: {
      axis: "Reliability ↔ Latency",
      left: "TCP (guaranteed)",
      right: "UDP (fast)",
      consequence:
        "TCP guarantees delivery and order but pays handshakes and retransmit stalls. UDP is minimal-latency but you must handle loss/reordering yourself.",
    },
    recall: [
      {
        q: "Why does real-time video often prefer UDP?",
        options: [
          "It's encrypted by default",
          "A late packet is worthless, so skipping retransmission keeps latency low",
          "It guarantees ordering",
          "It uses less bandwidth always",
        ],
        answer: 1,
        explain: "For live media, a re-sent old frame is useless; UDP avoids the stall TCP would cause.",
      },
    ],
    memory: {
      analogy: "TCP is registered mail with signatures; UDP is shouting across the room.",
      why: "Because different workloads value delivery guarantees and latency very differently.",
    },
    tags: ["networking", "protocols"],
    interactive: true,
  },
  {
    id: "http-tls",
    code: "1.2",
    beltId: "building-blocks",
    title: "HTTP, HTTPS & TLS",
    tagline: "The web's request format, made private.",
    hook: "Every 'https://' hides a cryptographic handshake that happens before your page even starts loading. What is it doing?",
    tiers: {
      napkin:
        "HTTP is the request/response format of the web. TLS wraps it in encryption so nobody can read or tamper with it.",
      working:
        "HTTP/1.1 uses one request per connection (with keep-alive); HTTP/2 multiplexes many streams over one connection; HTTP/3 runs over QUIC/UDP to kill head-of-line blocking. TLS negotiates keys via an asymmetric handshake, then uses fast symmetric encryption.",
      deep: "TLS 1.3 cuts the handshake to one round-trip (0-RTT for resumption). Terminating TLS at the load balancer/CDN offloads crypto from app servers but moves the trust boundary.",
    },
    instrument: "Timeline",
    instrumentConfig: {
      actors: ["Client", "Server"],
      caption: "TLS handshake then encrypted data.",
      events: [
        { t: 0, from: 0, to: 1, label: "ClientHello" },
        { t: 1, from: 1, to: 0, label: "ServerHello + cert" },
        { t: 2, from: 0, to: 1, label: "key exchange" },
        { t: 3, from: 0, to: 1, label: "🔒 encrypted request" },
      ],
    },
    tradeoff: {
      axis: "Security ↔ Handshake cost",
      left: "Terminate TLS at edge",
      right: "End-to-end TLS",
      consequence:
        "Terminating at the CDN/LB is fast and offloads crypto but the internal hop must be trusted. End-to-end TLS is safest but adds handshakes and CPU on every service.",
    },
    recall: [
      {
        q: "HTTP/2's main improvement over HTTP/1.1 is…",
        options: [
          "Encryption",
          "Multiplexing many streams over one connection",
          "Using UDP",
          "Removing headers",
        ],
        answer: 1,
        explain: "HTTP/2 multiplexes concurrent streams, avoiding the per-connection limits of 1.1.",
      },
    ],
    memory: {
      analogy: "TLS is sealing your letter in a tamper-evident envelope only the recipient can open.",
      why: "Because the internet is a public wire; without TLS, anyone on the path can read or alter traffic.",
    },
    tags: ["networking", "security", "http"],
    interactive: true,
  },
  {
    id: "load-balancers",
    code: "1.3",
    beltId: "building-blocks",
    deepDive: [
      "L4 (transport) balancing is fast and protocol-agnostic; L7 (application) can route by path, header, or cookie.",
      "Least-connections beats round-robin when request costs vary widely.",
      "Health checks + connection draining remove nodes gracefully without dropping in-flight requests.",
      "The LB itself must be HA (active-active with a floating IP / anycast) or it becomes the single point of failure.",
    ],
    title: "Load balancers",
    tagline: "Spread traffic; hide failures.",
    hook: "You added a second server. Now who decides which one each request goes to — and what happens the instant one dies?",
    tiers: {
      napkin:
        "A load balancer sits in front of your servers and distributes requests so no single one is overwhelmed.",
      working:
        "L4 balancers route by IP/port (fast, protocol-agnostic); L7 route by content (URL, headers, cookies). Algorithms: round-robin, least-connections, weighted, IP-hash. Health checks pull dead nodes out automatically.",
      deep: "Sticky sessions (via IP-hash or cookies) trade even distribution for cache/session locality. The LB itself must be redundant (active-active with a floating IP or DNS) or it becomes the single point of failure.",
    },
    instrument: "LoadDial",
    instrumentConfig: { mode: "balance" },
    tradeoff: {
      axis: "Even spread ↔ Session locality",
      left: "Pure round-robin",
      right: "Sticky (IP-hash)",
      consequence:
        "Round-robin spreads load evenly but scatters a user's requests. Sticky routing keeps a user on one node (good for caches/sessions) but can create hot spots when traffic is skewed.",
    },
    recall: [
      {
        q: "'Least connections' load balancing is preferable to round-robin when…",
        options: [
          "All requests take the same time",
          "Request durations vary widely",
          "You have exactly two servers",
          "You need encryption",
        ],
        answer: 1,
        explain: "With uneven request costs, least-connections avoids piling long requests onto one node.",
      },
    ],
    memory: {
      analogy: "A host at a restaurant seating guests across servers so no waiter is swamped.",
      why: "Because horizontal scaling is pointless if traffic can't be spread and failures can't be hidden.",
    },
    tags: ["load-balancing", "availability"],
    interactive: true,
  },
  {
    id: "caching-layers",
    code: "1.4",
    beltId: "building-blocks",
    deepDive: [
      "Effective latency = hit_ratio × fast + (1 − hit_ratio) × slow — small hit-ratio gains pay off hugely.",
      "Guard hot-key expiry with single-flight (coalesce misses), locks, or probabilistic early recompute.",
      "Negative caching (cache 'not found') stops repeated misses from hammering the origin.",
      "Add random TTL jitter so many keys don't expire in sync and cause a stampede.",
    ],
    title: "Caching: where & why",
    tagline: "Keep hot data close.",
    hook: "The fastest database query is the one you never make. Caches are how systems avoid work — at every layer at once.",
    tiers: {
      napkin:
        "A cache stores the result of expensive work so the next request gets it instantly.",
      working:
        "Caches live at many layers: browser, CDN (edge), reverse proxy, application (Redis/Memcached), and inside the database. Each hit avoids a slower downstream hop.",
      deep: "Cache effectiveness hinges on hit ratio and locality. The hard parts aren't storing — they're invalidation and staleness, and avoiding stampedes when a hot key expires.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "A request short-circuits at the first cache hit.",
      nodes: [
        { id: "u", label: "Browser", x: 6, y: 50, kind: "client" },
        { id: "cdn", label: "CDN", x: 30, y: 50, kind: "cache" },
        { id: "app", label: "App", x: 55, y: 50, kind: "app" },
        { id: "redis", label: "Redis", x: 78, y: 26, kind: "cache" },
        { id: "db", label: "DB", x: 92, y: 66, kind: "db" },
      ],
      edges: [
        { from: "u", to: "cdn" },
        { from: "cdn", to: "app" },
        { from: "app", to: "redis" },
        { from: "app", to: "db" },
      ],
    },
    tradeoff: {
      axis: "Freshness ↔ Load",
      left: "Short TTL",
      right: "Long TTL",
      consequence:
        "Short TTLs keep data fresh but push more load downstream. Long TTLs cut load dramatically but risk serving stale data longer.",
    },
    recall: [
      {
        q: "The two famously hard problems with caching are…",
        options: [
          "Reading and writing",
          "Invalidation and naming",
          "Compression and encryption",
          "Sharding and replication",
        ],
        answer: 1,
        explain: "Phil Karlton's quip: the hard things are cache invalidation and naming things.",
      },
    ],
    memory: {
      analogy: "Keeping snacks on your desk instead of walking to the kitchen every time.",
      why: "Because recomputing or refetching the same result is the most common avoidable cost at scale.",
    },
    tags: ["caching", "performance"],
    interactive: true,
  },
  {
    id: "cache-strategies",
    code: "1.5",
    beltId: "building-blocks",
    title: "Cache read/write strategies",
    tagline: "Cache-aside, write-through, write-back, write-around.",
    hook: "A cache is only as good as its rules for staying in sync with the database. Pick the wrong one and you serve yesterday's data — or lose today's.",
    tiers: {
      napkin:
        "Different strategies decide when the cache and database get updated relative to each other.",
      working:
        "Cache-aside: app reads cache, falls back to DB, then populates cache (most common). Write-through: writes go to cache and DB together (consistent, slower writes). Write-back: writes hit cache first, flush to DB later (fast, risk of loss). Write-around: writes skip the cache (avoids polluting it with rarely-read data).",
      deep: "Cache-aside can serve stale data between a DB write and cache invalidation; combine with short TTLs or explicit invalidation. Write-back needs durability (replication/WAL) to survive a crash before flush.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "Cache-aside: miss → DB → populate.",
      nodes: [
        { id: "app", label: "App", x: 12, y: 50, kind: "app" },
        { id: "cache", label: "Cache", x: 48, y: 30, kind: "cache" },
        { id: "db", label: "Database", x: 84, y: 66, kind: "db" },
      ],
      edges: [
        { from: "app", to: "cache" },
        { from: "app", to: "db" },
        { from: "db", to: "cache" },
      ],
    },
    tradeoff: {
      axis: "Write speed ↔ Durability",
      left: "Write-back (fast)",
      right: "Write-through (safe)",
      consequence:
        "Write-back acknowledges instantly and batches flushes, but a crash before flush loses data. Write-through is durable and consistent but every write pays the DB latency.",
    },
    recall: [
      {
        q: "The most common general-purpose caching pattern is…",
        options: ["Write-back", "Cache-aside (lazy loading)", "Write-around", "No caching"],
        answer: 1,
        explain: "Cache-aside populates on miss and keeps the cache decoupled from the write path.",
      },
    ],
    memory: {
      analogy:
        "Write-through = update your notebook and the master ledger together; write-back = jot in the notebook now, copy to the ledger later.",
      why: "Because the sync policy decides your consistency and durability guarantees, not the cache itself.",
    },
    tags: ["caching", "consistency"],
    interactive: true,
  },
  {
    id: "cache-eviction",
    code: "1.6",
    beltId: "building-blocks",
    title: "Eviction & the thundering herd",
    tagline: "LRU, LFU, FIFO — and stampedes.",
    hook: "Your cache is full. Something must go. Choose wrong and your hit ratio collapses; let a hot key expire and 10,000 requests stampede your database at once.",
    tiers: {
      napkin:
        "When a cache fills up, an eviction policy decides what to drop. LRU drops least-recently-used; LFU drops least-frequently-used; FIFO drops oldest.",
      working:
        "LRU suits recency-heavy workloads; LFU suits stable popularity; FIFO is simplest. The thundering herd (cache stampede) happens when a popular key expires and every miss hits the DB simultaneously.",
      deep: "Mitigate stampedes with request coalescing (single-flight), probabilistic early expiration, or locks. Adaptive policies (ARC, TinyLFU) balance recency and frequency to beat plain LRU.",
    },
    instrument: "CacheGrid",
    tradeoff: {
      axis: "Recency ↔ Frequency",
      left: "LRU (recency)",
      right: "LFU (frequency)",
      consequence:
        "LRU adapts fast to changing hot sets but can evict a rarely-but-regularly used item. LFU protects proven-popular items but is slow to forget yesterday's stars.",
    },
    recall: [
      {
        q: "A 'thundering herd' on a cache is caused by…",
        options: [
          "Too many cache hits",
          "A popular key expiring so all misses hit the DB at once",
          "Using LRU instead of LFU",
          "Encrypting cache values",
        ],
        answer: 1,
        explain: "Simultaneous misses on a hot key stampede the origin; coalesce requests or stagger expiry.",
      },
    ],
    memory: {
      analogy: "LRU is cleaning out the fridge item you haven't touched in longest; a stampede is the whole office hitting the coffee machine the second it's empty.",
      mnemonic: "LRU = Recently, LFU = Frequently.",
      why: "Because finite memory forces a choice, and the wrong policy silently destroys your hit ratio.",
    },
    tags: ["caching", "algorithms", "eviction"],
    interactive: true,
  },
  {
    id: "reverse-proxy-gateway",
    code: "1.7",
    beltId: "building-blocks",
    title: "Reverse proxy & API gateway",
    tagline: "One front door for many services.",
    hook: "Fifty microservices, each needing auth, rate limits, and TLS. Do you build that fifty times — or once, at the door?",
    tiers: {
      napkin:
        "A reverse proxy is a server that fronts your backends. An API gateway adds cross-cutting concerns: auth, rate limiting, routing, aggregation.",
      working:
        "The gateway centralizes what every service would otherwise reimplement: authentication, rate limiting, request routing, TLS termination, response aggregation, and versioning.",
      deep: "Beware the gateway becoming a bloated bottleneck or single point of failure. Keep business logic out of it; run it redundantly; watch its latency budget.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "Gateway fans one request out to services.",
      nodes: [
        { id: "u", label: "Client", x: 6, y: 50, kind: "client" },
        { id: "gw", label: "API Gateway", x: 34, y: 50, kind: "net" },
        { id: "s1", label: "Auth", x: 74, y: 20, kind: "app" },
        { id: "s2", label: "Orders", x: 78, y: 50, kind: "app" },
        { id: "s3", label: "Users", x: 74, y: 80, kind: "app" },
      ],
      edges: [
        { from: "u", to: "gw" },
        { from: "gw", to: "s1" },
        { from: "gw", to: "s2" },
        { from: "gw", to: "s3" },
      ],
    },
    tradeoff: {
      axis: "Centralization ↔ Bottleneck risk",
      left: "Fat gateway",
      right: "Thin gateway",
      consequence:
        "A feature-rich gateway removes duplication across services but risks becoming a bottleneck and a chokepoint. A thin gateway stays fast but pushes concerns back into services.",
    },
    recall: [
      {
        q: "Which is NOT a typical API gateway responsibility?",
        options: ["Authentication", "Rate limiting", "Core business logic", "Request routing"],
        answer: 2,
        explain: "Business logic belongs in services; the gateway handles cross-cutting concerns.",
      },
    ],
    memory: {
      analogy: "A building's front desk: it checks IDs, directs visitors, and enforces rules — but doesn't do the work inside.",
      why: "Because cross-cutting concerns implemented per-service drift and duplicate; centralizing them is cleaner.",
    },
    tags: ["gateway", "proxy", "microservices"],
    interactive: true,
  },
  {
    id: "cdn-edge",
    code: "1.8",
    beltId: "building-blocks",
    title: "CDNs & the edge",
    tagline: "Serve bytes from near the user.",
    hook: "A user in Sydney requests your image hosted in Virginia. That's a 300ms round-trip — unless a copy already lives 20km away.",
    tiers: {
      napkin:
        "A CDN caches your static (and increasingly dynamic) content at points of presence around the world, so users are served from nearby.",
      working:
        "On a cache miss, the edge fetches from origin and caches it by TTL; hits are served locally. CDNs also absorb DDoS, terminate TLS, and run edge compute close to users.",
      deep: "Cache keys, TTLs, and cache-control headers govern behavior. Purge/invalidation and cache hierarchies (edge → regional → origin) reduce origin load; edge functions push logic to the PoP.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "Edge hit vs origin fetch.",
      nodes: [
        { id: "u", label: "User (Sydney)", x: 6, y: 50, kind: "client" },
        { id: "edge", label: "Edge PoP", x: 36, y: 50, kind: "cache" },
        { id: "origin", label: "Origin (US)", x: 88, y: 50, kind: "db" },
      ],
      edges: [
        { from: "u", to: "edge" },
        { from: "edge", to: "origin" },
      ],
    },
    tradeoff: {
      axis: "Freshness ↔ Origin load",
      left: "Purge often",
      right: "Cache long at edge",
      consequence:
        "Frequent purges keep edge content fresh but hammer the origin on repopulation. Long edge TTLs slash origin load and latency but risk stale global content.",
    },
    recall: [
      {
        q: "The primary latency benefit of a CDN comes from…",
        options: [
          "Faster CPUs at the edge",
          "Physical proximity — serving from near the user",
          "Using UDP",
          "Compressing HTML",
        ],
        answer: 1,
        explain: "Distance is latency; caching content near users removes the long round-trip to origin.",
      },
    ],
    memory: {
      analogy: "Local corner shops stocking popular goods so you don't drive to the central warehouse.",
      why: "Because the speed of light is fixed — the only way to cut distance-latency is to move data closer.",
    },
    tags: ["cdn", "caching", "latency"],
    interactive: true,
  },
];
