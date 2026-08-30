import type { ModuleContent } from "@/types/content";

export const belt4: ModuleContent[] = [
  {
    id: "monolith-microservices",
    code: "4.1",
    beltId: "patterns",
    title: "Monolith → microservices",
    tagline: "One deploy vs many; simplicity vs autonomy.",
    hook: "Two teams keep blocking each other on one giant codebase. Split it into services? Congratulations — you traded a coding problem for a distributed-systems problem.",
    tiers: {
      napkin:
        "A monolith is one deployable app. Microservices split it into independent services owned by different teams.",
      working:
        "Monoliths are simple to build, test, and deploy but couple teams and scale as one unit. Microservices give team autonomy and independent scaling/deploys but add network calls, distributed data, and operational overhead. A modular monolith is often the sweet spot.",
      deep: "Split along business capabilities (bounded contexts), not layers. Each service owns its data. Beware the distributed monolith: services so chatty and coupled you get microservice pain with monolith rigidity.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "One app becomes several communicating services.",
      nodes: [
        { id: "gw", label: "Gateway", x: 8, y: 50, kind: "net" },
        { id: "s1", label: "Users", x: 42, y: 22, kind: "app" },
        { id: "s2", label: "Orders", x: 42, y: 78, kind: "app" },
        { id: "s3", label: "Payments", x: 78, y: 50, kind: "app" },
      ],
      edges: [
        { from: "gw", to: "s1" },
        { from: "gw", to: "s2" },
        { from: "s2", to: "s3" },
      ],
    },
    tradeoff: {
      axis: "Simplicity ↔ Team autonomy",
      left: "Monolith",
      right: "Microservices",
      consequence:
        "A monolith is easy to run but couples teams and scales as one. Microservices let teams ship independently but you pay in network complexity, distributed data, and ops.",
    },
    recall: [
      {
        q: "A 'distributed monolith' is bad because it has…",
        options: [
          "Too few services",
          "Microservice complexity WITHOUT independent deployability",
          "No network calls",
          "One database only",
        ],
        answer: 1,
        explain: "Tightly coupled services must deploy together — all the cost, none of the autonomy.",
      },
    ],
    memory: {
      analogy: "A monolith is one big kitchen; microservices are food trucks — independent, but now you coordinate a fleet.",
      why: "Because org scaling (many teams) often drives architecture more than technical scaling does.",
    },
    tags: ["microservices", "architecture"],
    interactive: true,
  },
  {
    id: "api-styles",
    code: "4.2",
    beltId: "patterns",
    title: "REST vs GraphQL vs gRPC",
    tagline: "Resources, graphs, or fast RPC.",
    hook: "Your mobile app makes 8 calls to render one screen and downloads fields it never shows. Is that REST's fault — or the wrong API style?",
    tiers: {
      napkin:
        "REST models resources over HTTP (simple, cacheable). GraphQL lets clients ask for exactly the fields they need in one query. gRPC is fast binary RPC for service-to-service.",
      working:
        "REST is universal and cache-friendly but over/under-fetches. GraphQL solves fetch shape and avoids round-trips but complicates caching and can hide expensive resolvers. gRPC (HTTP/2 + protobuf) is compact and fast, ideal internally, weaker in browsers.",
      deep: "GraphQL needs query cost limits and dataloaders to avoid N+1 and abuse. gRPC needs schema/versioning discipline. Choose per boundary: REST/GraphQL at the edge, gRPC between services.",
    },
    instrument: "TradeoffLab",
    tradeoff: {
      axis: "Flexibility ↔ Cacheability",
      left: "GraphQL (flexible)",
      right: "REST (cacheable)",
      consequence:
        "GraphQL fetches exactly what each client needs in one trip but is hard to cache and easy to abuse. REST is simple and HTTP-cacheable but over/under-fetches.",
    },
    recall: [
      {
        q: "gRPC is typically chosen for…",
        options: [
          "Public browser APIs",
          "Fast, strongly-typed service-to-service calls",
          "Static file hosting",
          "SQL queries",
        ],
        answer: 1,
        explain: "Binary protobuf over HTTP/2 makes gRPC compact and fast, ideal for internal RPC.",
      },
    ],
    memory: {
      analogy: "REST = a fixed menu, GraphQL = build-your-own-plate, gRPC = the kitchen's fast internal shorthand.",
      why: "Because different consumers (browsers, mobile, services) want different fetch shapes and speeds.",
    },
    tags: ["api", "rest", "graphql", "grpc"],
    interactive: true,
  },
  {
    id: "realtime-websockets-sse",
    code: "4.3",
    beltId: "patterns",
    title: "Real-time: WebSockets, SSE, polling",
    tagline: "Push updates without hammering the server.",
    hook: "Users want live scores. Do you have the browser ask 'any news?' every second (polling) — or open a channel the server can push through?",
    tiers: {
      napkin:
        "Long polling repeatedly asks; SSE is a one-way server→client stream; WebSockets are a full two-way persistent channel.",
      working:
        "Polling is simple but wasteful/laggy. SSE is great for one-way feeds (notifications, prices) over plain HTTP with auto-reconnect. WebSockets suit bidirectional, low-latency needs (chat, games) but need connection state and scaling care.",
      deep: "Persistent connections change scaling: you manage millions of open sockets, sticky routing, and fan-out via pub/sub. Fall back gracefully; use SSE when you don't need client→server streaming.",
    },
    instrument: "Timeline",
    instrumentConfig: {
      actors: ["Client", "Server"],
      caption: "WebSocket: server pushes without a new request.",
      events: [
        { t: 0, from: 0, to: 1, label: "open socket" },
        { t: 1, from: 1, to: 0, label: "push update" },
        { t: 2, from: 1, to: 0, label: "push update" },
      ],
    },
    tradeoff: {
      axis: "Simplicity ↔ Latency",
      left: "Polling",
      right: "WebSockets",
      consequence:
        "Polling is trivial and stateless but wastes requests and adds lag. WebSockets give instant bidirectional push but require managing millions of stateful connections.",
    },
    recall: [
      {
        q: "For a one-way live price feed, the lightest good fit is…",
        options: ["Full WebSockets", "Server-Sent Events (SSE)", "Long polling every 5m", "gRPC"],
        answer: 1,
        explain: "SSE streams server→client over HTTP with auto-reconnect — no need for two-way sockets.",
      },
    ],
    memory: {
      analogy: "Polling = calling to ask 'anything yet?'; WebSocket = leaving the line open so they just tell you.",
      why: "Because repeatedly asking wastes resources and adds latency for inherently push-shaped data.",
    },
    tags: ["realtime", "websockets", "sse"],
    interactive: true,
  },
  {
    id: "message-queues-pubsub",
    code: "4.4",
    beltId: "patterns",
    title: "Message queues & pub/sub",
    tagline: "Decouple producers from consumers.",
    hook: "A traffic spike hits. Instead of buckling, your system absorbs it into a queue and processes at its own pace. How does that buffer save you?",
    tiers: {
      napkin:
        "A queue lets producers hand off work to be processed later by consumers, decoupling them in time. Pub/sub broadcasts events to many subscribers.",
      working:
        "Queues (SQS, RabbitMQ) smooth spikes, enable retries, and let you scale consumers independently. Pub/sub / logs (Kafka) fan events out to multiple consumer groups and retain a replayable log.",
      deep: "Delivery semantics matter: at-least-once (needs idempotent consumers), at-most-once, or effectively-once. Watch ordering (per-partition in Kafka), backlog growth, poison messages (DLQs), and consumer lag.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "Producer → queue → consumers scale independently.",
      nodes: [
        { id: "p", label: "Producer", x: 8, y: 50, kind: "app" },
        { id: "q", label: "Queue", x: 42, y: 50, kind: "cache" },
        { id: "c1", label: "Consumer", x: 82, y: 28, kind: "app" },
        { id: "c2", label: "Consumer", x: 82, y: 72, kind: "app" },
      ],
      edges: [
        { from: "p", to: "q" },
        { from: "q", to: "c1" },
        { from: "q", to: "c2" },
      ],
    },
    tradeoff: {
      axis: "Coupling ↔ Complexity",
      left: "Direct sync calls",
      right: "Async via queue",
      consequence:
        "Direct calls are simple and immediate but couple availability and can't absorb spikes. Queues decouple and buffer but add eventual processing, ordering concerns, and duplicate handling.",
    },
    recall: [
      {
        q: "At-least-once delivery requires consumers to be…",
        options: ["Faster", "Idempotent (safe to process a duplicate)", "Encrypted", "Single-threaded"],
        answer: 1,
        explain: "Since a message may be delivered twice, processing it twice must not cause harm.",
      },
    ],
    memory: {
      analogy: "A restaurant ticket rail: cooks (consumers) pull orders when ready; the waiter (producer) doesn't wait.",
      why: "Because synchronous coupling makes one slow component stall everything; queues absorb and decouple.",
    },
    tags: ["queues", "pubsub", "kafka", "async"],
    interactive: true,
  },
  {
    id: "event-driven",
    code: "4.5",
    beltId: "patterns",
    title: "Event-driven architecture",
    tagline: "React to events, don't command steps.",
    hook: "Adding a new step to checkout means editing five services. In an event-driven design, the new service just... listens. How?",
    tiers: {
      napkin:
        "Services emit events ('OrderPlaced') and other services react, instead of one service directly calling all the others.",
      working:
        "Choreography: services react to each other's events (loose coupling, but flow is implicit and hard to trace). Orchestration: a central coordinator directs the flow (explicit, but a coupling point). Both decouple who-does-what from who-triggers-it.",
      deep: "Events as facts enable extensibility (new consumers without touching producers) but make end-to-end flows harder to see and debug. Need schemas/versioning, idempotency, and good tracing.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "One event, many independent reactions.",
      nodes: [
        { id: "o", label: "Order Svc", x: 10, y: 50, kind: "app" },
        { id: "bus", label: "Event Bus", x: 40, y: 50, kind: "net" },
        { id: "e", label: "Email", x: 80, y: 20, kind: "app" },
        { id: "s", label: "Shipping", x: 84, y: 50, kind: "app" },
        { id: "a", label: "Analytics", x: 80, y: 80, kind: "app" },
      ],
      edges: [
        { from: "o", to: "bus" },
        { from: "bus", to: "e" },
        { from: "bus", to: "s" },
        { from: "bus", to: "a" },
      ],
    },
    tradeoff: {
      axis: "Extensibility ↔ Traceability",
      left: "Choreography",
      right: "Orchestration",
      consequence:
        "Choreography adds consumers without touching producers but makes the overall flow implicit and hard to trace. Orchestration makes flows explicit and debuggable but centralizes coupling in the coordinator.",
    },
    recall: [
      {
        q: "A key benefit of event-driven architecture is…",
        options: [
          "Simpler debugging of end-to-end flows",
          "Adding new reactions without modifying the event producer",
          "Guaranteed strong consistency",
          "Fewer services",
        ],
        answer: 1,
        explain: "New consumers just subscribe; the producer that emits the event doesn't change.",
      },
    ],
    memory: {
      analogy: "A newspaper: the publisher prints once; anyone can subscribe and react without the publisher knowing.",
      why: "Because tightly-scripted call chains resist change; broadcasting facts lets the system grow at the edges.",
    },
    tags: ["events", "architecture", "decoupling"],
    interactive: true,
  },
  {
    id: "cqrs-event-sourcing",
    code: "4.6",
    beltId: "patterns",
    title: "CQRS & event sourcing",
    tagline: "Separate reads from writes; store the log.",
    hook: "What if you never stored the current balance — only every deposit and withdrawal ever made? You could rebuild any state, at any past moment, from the log.",
    tiers: {
      napkin:
        "CQRS separates the write model from the read model. Event sourcing stores state as an append-only log of events; current state is derived by replaying them.",
      working:
        "CQRS lets you optimize and scale reads and writes independently (different stores, shapes). Event sourcing gives a full audit trail, time-travel, and easy new read models — you rebuild by replaying events.",
      deep: "Costs: eventual consistency between write and read sides, event schema evolution, and replay/snapshotting for performance. Powerful for auditability (finance) but overkill for simple CRUD.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "Commands append events; projections build read views.",
      nodes: [
        { id: "c", label: "Command", x: 8, y: 50, kind: "client" },
        { id: "log", label: "Event Log", x: 40, y: 50, kind: "db" },
        { id: "rv", label: "Read View", x: 78, y: 30, kind: "cache" },
        { id: "rv2", label: "Analytics View", x: 78, y: 72, kind: "cache" },
      ],
      edges: [
        { from: "c", to: "log" },
        { from: "log", to: "rv" },
        { from: "log", to: "rv2" },
      ],
    },
    tradeoff: {
      axis: "Auditability ↔ Simplicity",
      left: "Event sourcing",
      right: "Store current state",
      consequence:
        "Event sourcing gives a perfect history and time-travel but adds replay, schema-evolution, and eventual-consistency complexity. Storing current state is simple but forgets how you got there.",
    },
    recall: [
      {
        q: "In event sourcing, current state is obtained by…",
        options: [
          "Reading a single row",
          "Replaying the log of past events",
          "Asking the cache",
          "A SQL JOIN",
        ],
        answer: 1,
        explain: "State is a fold over the append-only event log (often accelerated with snapshots).",
      },
    ],
    memory: {
      analogy: "A bank ledger: you don't store 'balance = $500', you store every transaction and add them up.",
      why: "Because the sequence of changes is often more valuable (and auditable) than just the latest value.",
    },
    tags: ["cqrs", "event-sourcing", "architecture"],
    interactive: true,
  },
  {
    id: "serverless",
    code: "4.7",
    beltId: "patterns",
    title: "Serverless & FaaS",
    tagline: "Scale to zero, pay per request.",
    hook: "Your job runs twice a day. Why pay for a server 24/7? Serverless spins up on demand and vanishes — but the first request pays a 'cold start' tax.",
    tiers: {
      napkin:
        "Serverless runs your code on demand without you managing servers; it scales automatically, even to zero, and you pay per invocation.",
      working:
        "Great for spiky, event-driven, or low-traffic workloads. Trade-offs: cold starts (first-call latency), execution time/memory limits, statelessness, and vendor lock-in. State goes to managed stores.",
      deep: "Cold starts hurt latency-sensitive paths (mitigate with provisioned concurrency). Watch per-invocation cost at high sustained volume — it can exceed running your own boxes. Best for glue, events, and bursty jobs.",
    },
    instrument: "TradeoffLab",
    tradeoff: {
      axis: "Cost efficiency ↔ Latency/control",
      left: "Serverless (scale to zero)",
      right: "Always-on servers",
      consequence:
        "Serverless costs nothing when idle and scales instantly but suffers cold starts and limits. Always-on servers give consistent low latency and control but you pay for idle capacity.",
    },
    recall: [
      {
        q: "A 'cold start' in serverless is…",
        options: [
          "A database backup",
          "The latency of spinning up a new function instance for a request",
          "A cache miss",
          "A failed deploy",
        ],
        answer: 1,
        explain: "When no warm instance exists, the platform must initialize one, adding first-request latency.",
      },
    ],
    memory: {
      analogy: "A motion-sensor light: off (free) until someone walks in, then it flickers on (cold start).",
      why: "Because paying for idle servers is wasteful for spiky or rare workloads.",
    },
    tags: ["serverless", "faas", "architecture"],
    interactive: true,
  },
  {
    id: "service-mesh",
    code: "4.8",
    beltId: "patterns",
    title: "Service mesh & sidecars",
    tagline: "Move networking out of your app.",
    hook: "Fifty services each reimplementing retries, mTLS, and tracing. What if you pushed all of it into a proxy that rides alongside every service?",
    tiers: {
      napkin:
        "A service mesh puts a sidecar proxy next to each service to handle service-to-service networking: mTLS, retries, load balancing, and observability.",
      working:
        "The data plane (sidecars, e.g. Envoy) intercepts traffic; the control plane configures them. You get consistent security, traffic policy, and telemetry without changing app code.",
      deep: "Costs: extra hops/latency per call, operational complexity, and resource overhead per sidecar. Worth it at many-services scale; overkill for a handful. Alternatives: mesh-lite libraries or gateway-only patterns.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "Sidecars handle mTLS, retries, and metrics.",
      nodes: [
        { id: "a", label: "Svc A", x: 12, y: 40, kind: "app" },
        { id: "pa", label: "Sidecar", x: 38, y: 60, kind: "net" },
        { id: "pb", label: "Sidecar", x: 66, y: 60, kind: "net" },
        { id: "b", label: "Svc B", x: 88, y: 40, kind: "app" },
      ],
      edges: [
        { from: "a", to: "pa" },
        { from: "pa", to: "pb" },
        { from: "pb", to: "b" },
      ],
    },
    tradeoff: {
      axis: "Consistency ↔ Overhead",
      left: "Service mesh",
      right: "In-app libraries",
      consequence:
        "A mesh gives uniform security/observability with zero app changes but adds latency, resource, and ops overhead per sidecar. In-app libraries avoid the overhead but drift across languages and teams.",
    },
    recall: [
      {
        q: "A service mesh sidecar typically handles…",
        options: [
          "Business logic",
          "mTLS, retries, load balancing, and telemetry",
          "Database schema",
          "Frontend rendering",
        ],
        answer: 1,
        explain: "The sidecar owns cross-cutting network concerns so app code doesn't have to.",
      },
    ],
    memory: {
      analogy: "Giving every employee a personal translator/bodyguard so they all communicate securely the same way.",
      why: "Because reimplementing networking concerns in every service and language is inconsistent and error-prone.",
    },
    tags: ["service-mesh", "microservices", "networking"],
    interactive: true,
  },
  {
    id: "batch-vs-stream",
    code: "4.9",
    beltId: "patterns",
    title: "Batch vs stream (Lambda/Kappa)",
    tagline: "Process on a schedule vs as it arrives.",
    hook: "Your dashboard is always an hour behind because it recomputes nightly. What if you processed each event the moment it arrived instead?",
    tiers: {
      napkin:
        "Batch processes large chunks on a schedule (simple, high-throughput, laggy). Stream processes events continuously (low latency, more complex).",
      working:
        "Lambda architecture runs both a batch layer (accurate, slow) and a speed layer (fast, approximate), merging results — powerful but duplicated logic. Kappa architecture uses a single streaming pipeline (reprocess by replaying the log).",
      deep: "Streaming introduces windowing, watermarks, late/out-of-order events, and exactly-once concerns. Kappa simplifies by treating batch as bounded stream. Choose by freshness needs vs operational simplicity.",
    },
    instrument: "TradeoffLab",
    tradeoff: {
      axis: "Freshness ↔ Simplicity",
      left: "Streaming (Kappa)",
      right: "Batch",
      consequence:
        "Streaming gives near-real-time results but adds windowing, ordering, and exactly-once complexity. Batch is simple and high-throughput but your data is always as stale as the last run.",
    },
    recall: [
      {
        q: "Kappa architecture differs from Lambda by…",
        options: [
          "Using only batch",
          "Using a single streaming pipeline (no separate batch layer)",
          "Avoiding logs",
          "Requiring SQL",
        ],
        answer: 1,
        explain: "Kappa handles everything as a stream and reprocesses by replaying the log, avoiding dual logic.",
      },
    ],
    memory: {
      analogy: "Batch = doing all the laundry on Sunday; streaming = washing each item as it gets dirty.",
      why: "Because some insights are worthless if they're hours old, and some don't need to be instant.",
    },
    tags: ["batch", "streaming", "data", "architecture"],
    interactive: true,
  },
  {
    id: "strangler-fig",
    code: "4.10",
    beltId: "patterns",
    title: "Migration: the Strangler Fig",
    tagline: "Replace the legacy system without a big-bang rewrite.",
    hook: "The 15-year-old system runs the business. A rewrite-and-switch is suicide. How do you replace it a piece at a time, while it keeps running?",
    tiers: {
      napkin:
        "The Strangler Fig pattern gradually routes functionality from the old system to the new one, feature by feature, until the old one can be removed.",
      working:
        "Put a facade/proxy in front. Route a slice of traffic/features to the new implementation; grow the slice as confidence rises; retire old code once nothing uses it. Always reversible.",
      deep: "Key enablers: a routing layer, keeping data in sync during the transition (dual-write or CDC), and clear seams. Avoids the huge risk of big-bang rewrites but requires discipline to actually finish the strangle.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "Proxy sends new features to the new system.",
      nodes: [
        { id: "u", label: "Client", x: 8, y: 50, kind: "client" },
        { id: "px", label: "Proxy", x: 38, y: 50, kind: "net" },
        { id: "old", label: "Legacy", x: 78, y: 28, kind: "db" },
        { id: "new", label: "New Svc", x: 78, y: 72, kind: "app" },
      ],
      edges: [
        { from: "u", to: "px" },
        { from: "px", to: "old" },
        { from: "px", to: "new" },
      ],
    },
    tradeoff: {
      axis: "Safety ↔ Speed",
      left: "Strangler (incremental)",
      right: "Big-bang rewrite",
      consequence:
        "Incremental migration is low-risk and reversible but slow and requires running two systems with synced data. A big-bang rewrite is faster in theory but routinely fails catastrophically.",
    },
    recall: [
      {
        q: "The Strangler Fig pattern avoids the main risk of…",
        options: [
          "Caching",
          "A big-bang rewrite-and-switch",
          "Load balancing",
          "Using microservices",
        ],
        answer: 1,
        explain: "It migrates incrementally behind a facade instead of a risky all-at-once cutover.",
      },
    ],
    memory: {
      analogy: "A strangler fig vine grows around a tree, slowly replacing it until the original is gone — but the shape stays standing the whole time.",
      why: "Because rewriting critical systems all at once almost always fails; incremental replacement is survivable.",
    },
    tags: ["migration", "legacy", "architecture"],
    interactive: true,
  },
];
