import type { ModuleContent } from "@/types/content";

/** Extensions to Belt 0 (Foundations), Belt 1 (Building Blocks), Belt 3 (Reliability). */
export const extCore: ModuleContent[] = [
  // ---------- Belt 0 ----------
  {
    id: "concurrency-parallelism",
    code: "0.7",
    beltId: "foundations",
    title: "Concurrency & parallelism",
    tagline: "Threads, async, locks, and races.",
    hook: "Two threads increment the same counter a million times. The result isn't 2 million — it's a mess. Welcome to the hardest bugs in computing.",
    tiers: {
      napkin:
        "Concurrency is dealing with many things at once (structure); parallelism is doing many things at once (execution). Shared mutable state is where it goes wrong.",
      working:
        "Threads share memory (fast, but race conditions need locks); processes are isolated (safe, costlier). Async/event-loop concurrency (one thread, non-blocking I/O) scales I/O-bound work cheaply. Locks/mutexes protect critical sections but risk deadlock and contention.",
      deep: "Race conditions, deadlocks (circular waits), and livelock are the classic hazards. Prefer immutable data, message passing, or lock-free structures (CAS) to shared locks. CPU-bound → parallelism (multiple cores/processes); I/O-bound → async concurrency.",
    },
    instrument: "TradeoffLab",
    tradeoff: {
      axis: "Shared memory ↔ Isolation",
      left: "Threads + locks",
      right: "Processes / message passing",
      consequence:
        "Threads with shared memory are fast and lightweight but expose you to races, deadlocks, and subtle bugs. Isolated processes or message passing are safer and simpler to reason about but cost more memory and communication overhead.",
    },
    recall: [
      {
        q: "For I/O-bound workloads (many network calls), the cheapest way to scale is usually…",
        options: ["More threads with locks", "Async / event-loop concurrency", "Buying faster CPUs", "Adding locks"],
        answer: 1,
        explain: "Non-blocking async lets one thread juggle thousands of waiting I/O operations without thread overhead.",
      },
    ],
    memory: {
      analogy: "One chef juggling many dishes (async) vs many chefs in one kitchen sharing counters and fighting over knives (threads + locks).",
      why: "Because multi-core scaling and high-concurrency servers depend on getting shared state right.",
    },
    tags: ["concurrency", "parallelism", "threads", "fundamentals"],
    interactive: true,
  },
  {
    id: "scalability-laws",
    code: "0.8",
    beltId: "foundations",
    title: "Amdahl's & Universal Scalability Law",
    tagline: "Why 100 machines aren't 100× faster.",
    hook: "You doubled your servers but got only 40% more throughput. The math of scaling has hard limits — and coordination makes it worse.",
    tiers: {
      napkin:
        "Amdahl's Law: the serial part of a task caps your speedup no matter how many cores you add. The Universal Scalability Law adds a penalty for coordination between nodes.",
      working:
        "If 10% of work is serial, max speedup is 10× even with infinite cores. The USL shows throughput can actually *decrease* past a point because contention and coherency (cross-node coordination) cost more than the parallelism gains.",
      deep: "Design to shrink the serial/coordinated fraction: shard, avoid shared locks, embrace eventual consistency, and minimize cross-node chatter. This is why 'just add machines' hits a wall — and why architecture, not hardware, sets the ceiling.",
    },
    instrument: "TradeoffLab",
    tradeoff: {
      axis: "Parallelism ↔ Coordination cost",
      left: "More nodes",
      right: "Less coordination",
      consequence:
        "Adding nodes increases parallelism but every shared lock or cross-node sync adds coordination cost. Past a point, more nodes yield diminishing — even negative — returns unless you reduce coordination.",
    },
    recall: [
      {
        q: "If 20% of a job is strictly serial, the maximum possible speedup is…",
        options: ["20×", "5×", "Unlimited", "100×"],
        answer: 1,
        explain: "Amdahl's Law: max speedup = 1 / serial fraction = 1/0.2 = 5×.",
      },
    ],
    memory: {
      analogy: "Nine women can't make a baby in one month — some work simply can't be parallelized.",
      mnemonic: "Speedup ≤ 1 / (serial fraction).",
      why: "Because scaling has mathematical limits, and coordination overhead can make more machines slower.",
    },
    tags: ["scaling", "amdahl", "performance", "fundamentals"],
    interactive: true,
  },

  // ---------- Belt 1 ----------
  {
    id: "serialization-formats",
    code: "1.9",
    beltId: "building-blocks",
    title: "Serialization: JSON, Protobuf, Avro",
    tagline: "How data becomes bytes on the wire.",
    hook: "The same message is 400 bytes as JSON and 90 bytes as Protobuf. Multiply by a billion messages a day and the format choice becomes an architecture decision.",
    tiers: {
      napkin:
        "Serialization turns objects into bytes for transport/storage. JSON is human-readable text; Protobuf/Avro/Thrift are compact binary formats with schemas.",
      working:
        "JSON is universal and debuggable but verbose and schema-less. Protobuf is small, fast, and strongly typed (great for gRPC/internal services). Avro shines for data pipelines with schema evolution. Binary formats need the schema to decode.",
      deep: "Schema evolution (adding/removing fields safely) is the real concern for long-lived data — Protobuf field numbers and Avro schemas handle forward/backward compatibility. Choose text at the edge (browsers), binary internally and for storage/streams.",
    },
    instrument: "TradeoffLab",
    tradeoff: {
      axis: "Readability ↔ Efficiency",
      left: "JSON (text)",
      right: "Protobuf (binary)",
      consequence:
        "JSON is human-readable and universal but verbose and slower to parse. Binary formats like Protobuf are compact and fast with strong typing but need the schema to decode and aren't human-readable.",
    },
    recall: [
      {
        q: "Why prefer Protobuf over JSON for high-volume service-to-service calls?",
        options: [
          "It's human-readable",
          "Smaller payloads, faster parsing, strong typing",
          "It needs no schema",
          "It works only in browsers",
        ],
        answer: 1,
        explain: "Compact binary encoding + a schema cuts bytes and CPU dramatically at scale.",
      },
    ],
    memory: {
      analogy: "JSON is a handwritten letter; Protobuf is a dense telegram in an agreed code — tiny, but you need the codebook.",
      why: "Because at high volume, payload size and parse speed directly drive cost and latency.",
    },
    tags: ["serialization", "protobuf", "json", "networking"],
    interactive: true,
  },
  {
    id: "connection-pooling",
    code: "1.10",
    beltId: "building-blocks",
    title: "Connection pooling",
    tagline: "Reuse connections instead of reopening.",
    hook: "Every database query opens a new TCP+TLS connection — a 50ms handshake before any real work. At thousands of QPS, that alone melts your database.",
    tiers: {
      napkin:
        "A connection pool keeps a set of open connections ready to reuse, avoiding the cost of establishing a new one per request.",
      working:
        "Opening connections is expensive (handshakes, auth) and databases cap concurrent connections. A pool bounds and reuses them; requests borrow and return. Size it to the DB's limit, not the app's traffic.",
      deep: "Too small a pool → requests queue; too large → the DB thrashes and exhausts its connection limit. With many app instances, use a proxy (PgBouncer) to multiplex. Watch pool-exhaustion timeouts and connection leaks.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "Requests borrow from a bounded pool of open connections.",
      nodes: [
        { id: "r", label: "Requests", x: 8, y: 50, kind: "client" },
        { id: "pool", label: "Conn Pool", x: 45, y: 50, kind: "cache" },
        { id: "db", label: "Database", x: 85, y: 50, kind: "db" },
      ],
      edges: [
        { from: "r", to: "pool" },
        { from: "pool", to: "db" },
      ],
    },
    tradeoff: {
      axis: "Pool size: small ↔ large",
      left: "Small pool",
      right: "Large pool",
      consequence:
        "A small pool protects the database but queues requests under load (higher latency). A large pool serves bursts but can exhaust the DB's connection limit and cause it to thrash.",
    },
    recall: [
      {
        q: "A connection pool should generally be sized to…",
        options: [
          "Your peak request rate",
          "The database's safe concurrent-connection limit",
          "One per user",
          "As large as possible",
        ],
        answer: 1,
        explain: "The DB, not the app, is the constraint — oversized pools overwhelm it.",
      },
    ],
    memory: {
      analogy: "A taxi rank of idling cabs ready to go, instead of building a new car for every passenger.",
      why: "Because connection setup is expensive and databases cap concurrent connections.",
    },
    tags: ["connection-pool", "database", "performance"],
    interactive: true,
  },

  // ---------- Belt 3 ----------
  {
    id: "deployment-strategies",
    code: "3.10",
    beltId: "reliability",
    title: "Deployment strategies",
    tagline: "Ship without downtime or drama.",
    hook: "You need to deploy to a million users. Flip a switch and pray? Or shift 1% of traffic, watch the graphs, and roll back in seconds if it's bad?",
    tiers: {
      napkin:
        "Safe rollouts avoid big-bang deploys. Rolling updates replace instances gradually; blue-green swaps between two environments; canary sends a small % of traffic to the new version first.",
      working:
        "Blue-green gives instant rollback (flip back to blue) but doubles infrastructure. Canary limits blast radius and validates on real traffic before full rollout. Feature flags decouple deploy from release, enabling instant toggles and A/B tests.",
      deep: "Automate rollback on SLO burn. Decouple schema changes (expand/contract migrations) so old and new code coexist. Progressive delivery (canary + automated analysis) is the modern default; feature flags add per-user targeting and kill switches.",
    },
    instrument: "TradeoffLab",
    tradeoff: {
      axis: "Safety ↔ Cost/speed",
      left: "Canary / blue-green",
      right: "Deploy all at once",
      consequence:
        "Canary and blue-green limit blast radius and enable fast rollback but cost extra infrastructure and slow the rollout. Deploying everything at once is fast and cheap but a bad release hits everyone instantly.",
    },
    recall: [
      {
        q: "A canary deployment reduces risk by…",
        options: [
          "Deploying to everyone at once",
          "Sending a small % of traffic to the new version first",
          "Skipping tests",
          "Doubling the servers permanently",
        ],
        answer: 1,
        explain: "Validating on a small slice of real traffic catches problems before they reach everyone.",
      },
    ],
    memory: {
      analogy: "A canary in a coal mine: expose a small group first; if they're fine, everyone follows.",
      why: "Because every deploy is a risk, and limiting blast radius + fast rollback is how you ship safely at scale.",
    },
    tags: ["deployment", "canary", "blue-green", "reliability"],
    interactive: true,
  },
  {
    id: "load-shedding-timeouts",
    code: "3.11",
    beltId: "reliability",
    title: "Timeouts, deadlines & load shedding",
    tagline: "Fail fast; drop work to survive.",
    hook: "Overloaded, your service tries to serve everyone — and serves no one, because every request times out. Sometimes saying 'no' fast is how you stay alive.",
    tiers: {
      napkin:
        "Timeouts cap how long you wait; deadlines propagate a budget across a call chain; load shedding drops excess requests early so the system stays responsive under overload.",
      working:
        "Without timeouts, one slow dependency ties up all your threads. Propagate a deadline so downstream calls don't work on already-doomed requests. Under overload, shed low-priority traffic (return 503) to protect the rest — better than collapsing entirely.",
      deep: "Set timeouts below the caller's deadline; budget them across hops. Shed by priority (drop retries/batch before user-facing). Combine with admission control and queue limits. Graceful degradation (serve cached/partial results) beats total failure.",
    },
    instrument: "LoadDial",
    instrumentConfig: { mode: "ratelimit" },
    tradeoff: {
      axis: "Serve everything ↔ Shed load",
      left: "Accept all requests",
      right: "Shed under overload",
      consequence:
        "Trying to serve every request under overload means all of them slow down and time out — total collapse. Shedding excess (fast 503s) sacrifices some requests so the rest stay fast and the system survives.",
    },
    recall: [
      {
        q: "Propagating a 'deadline' down a call chain prevents…",
        options: [
          "Encryption",
          "Services doing work for requests that have already timed out upstream",
          "Caching",
          "Sharding",
        ],
        answer: 1,
        explain: "A shared deadline lets each hop skip work that can no longer be delivered in time.",
      },
    ],
    memory: {
      analogy: "A busy ER triaging: turning away minor cases fast keeps the whole hospital functioning for the critical ones.",
      why: "Because an overloaded system that tries to do everything ends up doing nothing.",
    },
    tags: ["timeouts", "load-shedding", "resilience", "reliability"],
    interactive: true,
  },
  {
    id: "dead-letter-queues",
    code: "3.12",
    beltId: "reliability",
    title: "Dead letter queues",
    tagline: "Quarantine the messages that won't process.",
    hook: "One malformed message fails, gets retried forever, and blocks the whole queue behind it. Where do 'poison' messages go to stop the bleeding?",
    tiers: {
      napkin:
        "A dead letter queue (DLQ) is where messages go after they repeatedly fail processing, so they don't block the main queue or retry endlessly.",
      working:
        "After N failed attempts, the consumer routes the message to a DLQ instead of retrying forever. This keeps the pipeline flowing while preserving failed messages for inspection, fixing, and replay.",
      deep: "Pair with exponential backoff on retries and alerting on DLQ depth (a growing DLQ signals a bug or bad input). Include failure metadata for debugging. Have a replay path once the root cause is fixed.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "After N failures, route the poison message to the DLQ.",
      nodes: [
        { id: "q", label: "Main Queue", x: 10, y: 50, kind: "cache" },
        { id: "c", label: "Consumer", x: 45, y: 50, kind: "app" },
        { id: "ok", label: "Processed", x: 82, y: 28, kind: "db" },
        { id: "dlq", label: "DLQ", x: 82, y: 72, kind: "cache" },
      ],
      edges: [
        { from: "q", to: "c" },
        { from: "c", to: "ok" },
        { from: "c", to: "dlq" },
      ],
    },
    tradeoff: {
      axis: "Throughput ↔ Message loss risk",
      left: "DLQ after N retries",
      right: "Retry forever",
      consequence:
        "Routing to a DLQ after a few retries keeps the pipeline flowing but requires a process to inspect/replay those messages. Retrying forever never 'loses' a message but a single poison message can stall the whole queue.",
    },
    recall: [
      {
        q: "The main purpose of a dead letter queue is to…",
        options: [
          "Speed up the database",
          "Isolate repeatedly-failing messages so they don't block the pipeline",
          "Encrypt messages",
          "Load balance consumers",
        ],
        answer: 1,
        explain: "Quarantining poison messages keeps the main queue flowing while preserving them for later analysis.",
      },
    ],
    memory: {
      analogy: "A returns bin at the post office for undeliverable mail, so the line keeps moving.",
      why: "Because one un-processable message shouldn't be able to jam an entire queue.",
    },
    tags: ["dlq", "queues", "resilience", "reliability"],
    interactive: true,
  },
  {
    id: "graceful-degradation",
    code: "3.13",
    beltId: "reliability",
    title: "Graceful degradation",
    tagline: "Lose a feature, not the whole app.",
    hook: "The recommendations service is down. Should the entire homepage 500 — or should it just quietly show a generic 'popular items' list and carry on?",
    tiers: {
      napkin:
        "Graceful degradation means when a dependency fails, the system drops to a reduced-but-functional experience instead of failing completely.",
      working:
        "Identify which features are essential vs enhancements. When an enhancement's dependency fails, serve a fallback (cached/default/partial data) and keep the core working. Combine with circuit breakers and timeouts to trigger fallbacks fast.",
      deep: "Design explicit fallback tiers per dependency and test them (chaos). Distinguish critical-path failures (must fail) from optional ones (degrade). Communicate degraded state to users and dashboards. It's the difference between 'search is a bit worse' and 'the whole site is down'.",
    },
    instrument: "TradeoffLab",
    tradeoff: {
      axis: "Full features ↔ Resilience",
      left: "All-or-nothing",
      right: "Degrade gracefully",
      consequence:
        "Requiring every dependency to be up gives the full experience but any one failure takes the whole thing down. Degrading gracefully keeps the core alive with fallbacks but means users sometimes see a reduced experience.",
    },
    recall: [
      {
        q: "Graceful degradation means that when a non-critical dependency fails, the app…",
        options: [
          "Returns a 500 for everything",
          "Serves a reduced-but-working experience (fallback)",
          "Retries forever",
          "Shuts down",
        ],
        answer: 1,
        explain: "Core functionality continues via fallbacks; only the affected enhancement is reduced.",
      },
    ],
    memory: {
      analogy: "A car with a flat spare tire: slower and limited, but you still get home instead of being stranded.",
      why: "Because total outages are far costlier than a temporarily reduced experience.",
    },
    tags: ["degradation", "fallback", "resilience", "reliability"],
    interactive: true,
  },
];
