import type { ModuleContent } from "@/types/content";

export const belt3: ModuleContent[] = [
  {
    id: "availability-nines-slo",
    code: "3.1",
    beltId: "reliability",
    title: "Availability, nines & SLOs",
    tagline: "What '99.9%' actually costs you.",
    hook: "Your boss wants 'five nines'. That's 5 minutes of downtime per year — including deploys, incidents, and that DNS outage. Is it worth it?",
    tiers: {
      napkin:
        "Availability is the fraction of time a system works. Each extra 'nine' cuts allowed downtime tenfold — and roughly multiplies cost.",
      working:
        "99.9% ≈ 8.8h/yr, 99.99% ≈ 53m/yr, 99.999% ≈ 5m/yr. SLI = the measured metric, SLO = the target, SLA = the contractual promise (with penalties). Error budgets turn reliability into a spendable resource.",
      deep: "Availability multiplies across dependencies in series (0.999³ ≈ 0.997), so deep call chains erode it fast. Error budgets let teams balance shipping speed vs reliability instead of chasing 100%.",
    },
    instrument: "EstimatorPad",
    instrumentConfig: { mode: "nines" },
    tradeoff: {
      axis: "Reliability ↔ Cost/velocity",
      left: "More nines",
      right: "Ship faster",
      consequence:
        "Each nine demands redundancy, testing, and slower change — real money and velocity. An error budget lets you spend acceptable downtime on shipping features.",
    },
    recall: [
      {
        q: "99.9% availability allows roughly how much downtime per year?",
        options: ["~5 minutes", "~53 minutes", "~8.8 hours", "~3.6 days"],
        answer: 2,
        explain: "0.1% of a year ≈ 8.76 hours.",
      },
    ],
    memory: {
      analogy: "Nines are like safety margins on a bridge — each extra one costs a lot more steel.",
      why: "Because '100% uptime' is impossible, so you must quantify and budget for failure.",
    },
    tags: ["availability", "slo", "reliability"],
    interactive: true,
  },
  {
    id: "redundancy-failover",
    code: "3.2",
    beltId: "reliability",
    title: "Redundancy & failover",
    tagline: "No single thing can take you down.",
    hook: "Every component you own will fail eventually. The question isn't if — it's whether a spare takes over before your users notice.",
    tiers: {
      napkin:
        "Redundancy means having spares; failover means automatically switching to them when something dies.",
      working:
        "Active-passive keeps a standby ready (simpler, wasted capacity, failover delay). Active-active runs all nodes live (full utilization, instant failover, but needs shared/consistent state). Health checks + heartbeats trigger the switch.",
      deep: "Beware split-brain: both nodes think they're primary. Fencing, leases, and quorum-based leader election prevent it. Failover isn't free — connections drop, caches cold-start, and the standby must actually be tested.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "Primary fails → traffic fails over to standby.",
      nodes: [
        { id: "u", label: "Client", x: 8, y: 50, kind: "client" },
        { id: "lb", label: "LB", x: 34, y: 50, kind: "net" },
        { id: "p", label: "Primary", x: 74, y: 28, kind: "app" },
        { id: "s", label: "Standby", x: 74, y: 72, kind: "app" },
      ],
      edges: [
        { from: "u", to: "lb" },
        { from: "lb", to: "p" },
        { from: "lb", to: "s" },
      ],
    },
    tradeoff: {
      axis: "Cost ↔ Recovery speed",
      left: "Active-passive",
      right: "Active-active",
      consequence:
        "Active-passive wastes a warm spare and has failover lag but is simpler. Active-active uses all capacity and fails over instantly but needs consistent shared state and risks split-brain.",
    },
    recall: [
      {
        q: "'Split-brain' during failover means…",
        options: [
          "The database ran out of memory",
          "Two nodes both believe they are primary",
          "The cache was evicted",
          "The load balancer crashed",
        ],
        answer: 1,
        explain: "Both nodes accept writes independently, diverging state — prevented by fencing/quorum.",
      },
    ],
    memory: {
      analogy: "A co-pilot ready to take the controls the instant the pilot is incapacitated.",
      why: "Because hardware and software fail, and unattended failures become outages.",
    },
    tags: ["redundancy", "failover", "availability"],
    interactive: true,
  },
  {
    id: "rate-limiting",
    code: "3.3",
    beltId: "reliability",
    deepDive: [
      "Token bucket needs just 2 numbers per key (tokens, last-refill timestamp) — O(1) memory.",
      "At scale, use Redis with an atomic Lua script (or INCR + EXPIRE) so counts stay correct across nodes.",
      "Return HTTP 429 with a Retry-After header; pair with client-side exponential backoff + jitter.",
      "Sliding-window-log is exact but O(requests) memory; sliding-window-counter approximates it cheaply.",
    ],
    title: "Rate limiting",
    tagline: "Token bucket, leaky bucket, sliding window.",
    hook: "One buggy client sends 50,000 requests a second. Without a limiter, it takes down the service for everyone. Turn the traffic dial and watch each algorithm cope.",
    tiers: {
      napkin:
        "Rate limiting caps how many requests a client can make in a window, protecting the system from abuse and overload.",
      working:
        "Token bucket: tokens refill at a steady rate, each request spends one — allows bursts up to the bucket size. Leaky bucket: requests drain at a fixed rate — smooths bursts. Fixed window: simple counter per interval (boundary spikes). Sliding window: smooths the boundary problem.",
      deep: "At scale, limiters need shared state (Redis) with atomic ops to be accurate across nodes; local limiters drift. Token bucket is the common default for its burst tolerance. Return 429 with Retry-After; combine with backoff on the client.",
    },
    instrument: "LoadDial",
    instrumentConfig: { mode: "ratelimit" },
    tradeoff: {
      axis: "Burst tolerance ↔ Smoothness",
      left: "Token bucket (bursty)",
      right: "Leaky bucket (smooth)",
      consequence:
        "Token bucket permits short bursts (good UX for spiky-but-legit traffic) but lets brief spikes through. Leaky bucket enforces a strict steady rate (protective) but rejects legitimate bursts.",
    },
    recall: [
      {
        q: "Which algorithm naturally ALLOWS short bursts up to a cap?",
        options: ["Leaky bucket", "Token bucket", "Fixed window with size 1", "None"],
        answer: 1,
        explain: "Accumulated tokens let a client burst until the bucket empties, then refill-rate applies.",
      },
      {
        q: "Why do distributed rate limiters usually use Redis with atomic operations?",
        options: [
          "For encryption",
          "So the count is accurate across many app nodes",
          "To store user passwords",
          "To reduce latency to zero",
        ],
        answer: 1,
        explain: "Per-node counters drift; a shared atomic counter keeps the limit correct cluster-wide.",
      },
    ],
    memory: {
      analogy: "Token bucket = a jar of arcade tokens that refills slowly; you can spend a handful at once, then wait.",
      mnemonic: "Tokens for bursts, leaks for smoothness.",
      why: "Because a single misbehaving client can exhaust shared capacity and take everyone down.",
    },
    tags: ["rate-limiting", "algorithms", "reliability"],
    interactive: true,
  },
  {
    id: "circuit-breaker-bulkhead",
    code: "3.4",
    beltId: "reliability",
    title: "Circuit breakers & bulkheads",
    tagline: "Stop failure from spreading.",
    hook: "A downstream service slows to a crawl. Your threads pile up waiting for it, and soon YOUR service is down too. How do you contain the fire?",
    tiers: {
      napkin:
        "A circuit breaker stops calling a failing dependency for a while. A bulkhead isolates resources so one failure can't sink the whole ship.",
      working:
        "Breaker states: closed (normal) → open (fail fast after too many errors) → half-open (test with a trickle). Bulkheads partition thread pools/connections per dependency so a slow one can't exhaust everything.",
      deep: "Breakers prevent cascading failure and give the dependency time to recover; tune thresholds and timeouts carefully to avoid flapping. Pair with timeouts, fallbacks, and load shedding for graceful degradation.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "Breaker opens → calls fail fast instead of piling up.",
      nodes: [
        { id: "a", label: "Service A", x: 12, y: 50, kind: "app" },
        { id: "cb", label: "Breaker", x: 46, y: 50, kind: "net" },
        { id: "b", label: "Slow Service B", x: 84, y: 50, kind: "app" },
      ],
      edges: [
        { from: "a", to: "cb" },
        { from: "cb", to: "b" },
      ],
    },
    tradeoff: {
      axis: "Resilience ↔ Freshness",
      left: "Trip early / fallback",
      right: "Keep trying live",
      consequence:
        "Tripping early and serving a fallback protects you but may return stale or degraded results. Insisting on live calls maximizes freshness but risks cascading failure when the dependency is sick.",
    },
    recall: [
      {
        q: "An OPEN circuit breaker will…",
        options: [
          "Retry the dependency on every request",
          "Fail fast without calling the dependency",
          "Encrypt the request",
          "Add more threads",
        ],
        answer: 1,
        explain: "Open = fail fast, sparing both your threads and the ailing dependency until half-open probes recover.",
      },
    ],
    memory: {
      analogy: "An electrical breaker that pops to stop a short circuit from burning down the house.",
      why: "Because a single slow dependency can consume your resources and cascade into total failure.",
    },
    tags: ["resilience", "circuit-breaker", "reliability"],
    interactive: true,
  },
  {
    id: "retries-backoff-idempotency",
    code: "3.5",
    beltId: "reliability",
    title: "Retries, backoff & idempotency",
    tagline: "Retry safely, not catastrophically.",
    hook: "A blip fails 10,000 requests. All 10,000 clients retry at the exact same instant. Congratulations — you just DDoSed yourself.",
    tiers: {
      napkin:
        "Retries recover from transient failures — but naive retries synchronize into storms. Backoff and jitter spread them out; idempotency makes them safe.",
      working:
        "Exponential backoff doubles the wait each attempt; jitter randomizes it so clients don't retry in lockstep. Idempotency keys ensure a retried write isn't applied twice (no double charge).",
      deep: "Cap retries and total time; retry only idempotent or safely-keyed operations. Add retry budgets and deadlines to avoid amplifying an overload. 'Retry storms' are a top cause of cascading outages.",
    },
    instrument: "Timeline",
    instrumentConfig: {
      actors: ["Client", "Server"],
      caption: "Exponential backoff + jitter spreads retries.",
      events: [
        { t: 0, from: 0, to: 1, label: "try (fail)" },
        { t: 1, from: 0, to: 1, label: "wait ~1s ±jitter" },
        { t: 2, from: 0, to: 1, label: "wait ~2s ±jitter" },
        { t: 3, from: 1, to: 0, label: "success" },
      ],
    },
    tradeoff: {
      axis: "Recovery ↔ Overload risk",
      left: "Aggressive retries",
      right: "Backoff + budget",
      consequence:
        "Aggressive retries recover faster from blips but can amplify an outage into a storm. Backoff with jitter and a retry budget recovers gently without knocking the system over.",
    },
    recall: [
      {
        q: "Adding JITTER to exponential backoff prevents…",
        options: [
          "Encryption overhead",
          "Many clients retrying at the exact same moment",
          "Cache misses",
          "Data loss",
        ],
        answer: 1,
        explain: "Randomized delays de-synchronize retries, avoiding thundering-herd retry storms.",
      },
    ],
    memory: {
      analogy: "After a concert, everyone leaving the parking lot at once jams it; staggering exits (jitter) keeps traffic flowing.",
      mnemonic: "Backoff to wait, jitter to scatter, idempotency to stay safe.",
      why: "Because retries are essential but synchronized retries turn a small failure into a big one.",
    },
    tags: ["retries", "idempotency", "resilience"],
    interactive: true,
  },
  {
    id: "backpressure",
    code: "3.6",
    beltId: "reliability",
    title: "Backpressure & flow control",
    tagline: "Slow the producer before the buffer bursts.",
    hook: "A fast producer floods a slow consumer. The queue grows, memory fills, latency explodes, then everything crashes. What signal tells the producer to ease off?",
    tiers: {
      napkin:
        "Backpressure is the system telling upstream 'slow down, I can't keep up' instead of silently piling up work.",
      working:
        "Bounded queues, blocking/credit-based flow control, and reactive streams propagate pressure upstream. Without it, unbounded buffers cause memory blowups and latency spikes, then cascading failure.",
      deep: "Options when overloaded: block, buffer (bounded), drop (load shed), or sample. Explicit backpressure (credits, HTTP/2 flow control, TCP windows) beats implicit crashes. Shed load early and predictably.",
    },
    instrument: "LoadDial",
    instrumentConfig: { mode: "backpressure" },
    tradeoff: {
      axis: "Throughput ↔ Stability",
      left: "Accept everything",
      right: "Apply backpressure / shed",
      consequence:
        "Accepting all input maximizes throughput until buffers overflow and everything collapses. Backpressure or load-shedding sacrifices some requests to keep the system stable and responsive.",
    },
    recall: [
      {
        q: "Without backpressure, a fast producer + slow consumer leads to…",
        options: [
          "Perfect balance",
          "Unbounded queue growth, memory blowup, and cascading failure",
          "Faster consumers",
          "Stronger consistency",
        ],
        answer: 1,
        explain: "Work accumulates faster than it drains; bounded queues + backpressure prevent the blowup.",
      },
    ],
    memory: {
      analogy: "A checkout line with a full-basket sign: they stop letting people in before the store overflows.",
      why: "Because unbounded buffering just delays the crash; you must signal upstream to slow down.",
    },
    tags: ["backpressure", "flow-control", "reliability"],
    interactive: true,
  },
  {
    id: "observability",
    code: "3.7",
    beltId: "reliability",
    title: "Observability: logs, metrics, traces",
    tagline: "You can't fix what you can't see.",
    hook: "It's 3am, the app is slow, and you have 40 services. Where is the time going? Without observability, you're guessing.",
    tiers: {
      napkin:
        "The three pillars: logs (what happened), metrics (how much/how fast, aggregated), traces (the path of one request across services).",
      working:
        "Metrics power dashboards and alerts (rates, errors, durations — RED/USE). Logs give detail for a specific event. Distributed traces stitch one request's spans across services to find the slow hop.",
      deep: "High-cardinality data is expensive — sample traces, aggregate metrics, structure logs. Alert on symptoms (SLO burn) not causes. Correlate all three via trace/request ids for fast root-cause.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "One trace lights up across services.",
      nodes: [
        { id: "gw", label: "Gateway", x: 8, y: 50, kind: "net" },
        { id: "s1", label: "Svc A", x: 34, y: 30, kind: "app" },
        { id: "s2", label: "Svc B", x: 60, y: 70, kind: "app" },
        { id: "db", label: "DB", x: 88, y: 50, kind: "db" },
      ],
      edges: [
        { from: "gw", to: "s1" },
        { from: "s1", to: "s2" },
        { from: "s2", to: "db" },
      ],
    },
    tradeoff: {
      axis: "Insight ↔ Cost",
      left: "Capture everything",
      right: "Sample / aggregate",
      consequence:
        "Capturing every log/trace gives total insight but is very expensive at scale. Sampling and aggregation cut cost dramatically but can miss rare events.",
    },
    recall: [
      {
        q: "To find WHICH service in a chain is slow for one request, you use…",
        options: ["Logs", "A single metric", "A distributed trace", "The load balancer"],
        answer: 2,
        explain: "Traces break one request into per-service spans, exposing the slow hop.",
      },
    ],
    memory: {
      analogy: "Metrics are the car's dashboard gauges; logs are the mechanic's notes; a trace is the GPS route of one trip.",
      mnemonic: "Logs = events, Metrics = numbers, Traces = journeys.",
      why: "Because at scale you can't SSH into boxes — you need signals designed in from the start.",
    },
    tags: ["observability", "monitoring", "reliability"],
    interactive: true,
  },
  {
    id: "chaos-engineering",
    code: "3.8",
    beltId: "reliability",
    title: "Chaos engineering",
    tagline: "Break it on purpose, in daylight.",
    hook: "Would your system survive a server dying right now? The only way to know is to kill one — deliberately, while you're watching.",
    tiers: {
      napkin:
        "Chaos engineering injects controlled failures (killed nodes, added latency, dropped packets) to verify the system survives — before a real outage tests it for you.",
      working:
        "Form a hypothesis ('if a node dies, users see no error'), inject the failure in a controlled blast radius, measure, and fix what breaks. Start in staging, then production with guardrails.",
      deep: "Automate game days and continuous chaos (latency, region loss, dependency failure). The value is uncovering hidden coupling and untested failover paths — resilience you can't prove by reading code.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "Inject a fault; watch resilience hold (or not).",
      nodes: [
        { id: "u", label: "Users", x: 8, y: 50, kind: "client" },
        { id: "lb", label: "LB", x: 34, y: 50, kind: "net" },
        { id: "a", label: "Node A", x: 74, y: 28, kind: "app" },
        { id: "b", label: "Node B ✕", x: 74, y: 72, kind: "app" },
      ],
      edges: [
        { from: "u", to: "lb" },
        { from: "lb", to: "a" },
        { from: "lb", to: "b" },
      ],
    },
    tradeoff: {
      axis: "Safety ↔ Realism",
      left: "Test in staging",
      right: "Test in production",
      consequence:
        "Staging chaos is safe but misses real traffic and scale. Production chaos is the true test but needs a tight blast radius and instant rollback to avoid harming users.",
    },
    recall: [
      {
        q: "The point of chaos engineering is to…",
        options: [
          "Cause outages to punish teams",
          "Discover weaknesses under controlled failure before real incidents",
          "Replace monitoring",
          "Speed up the database",
        ],
        answer: 1,
        explain: "Controlled experiments reveal hidden coupling and untested recovery paths safely.",
      },
    ],
    memory: {
      analogy: "A fire drill: you start the alarm on purpose to check everyone knows the exits — before a real fire.",
      why: "Because failover and resilience that are never tested tend not to work when it counts.",
    },
    tags: ["chaos", "resilience", "reliability"],
    interactive: true,
  },
  {
    id: "disaster-recovery",
    code: "3.9",
    beltId: "reliability",
    title: "Disaster recovery: RTO & RPO",
    tagline: "When a whole region goes dark.",
    hook: "An entire cloud region goes offline. How long until you're back (RTO), and how much data can you afford to lose (RPO)? Those two numbers shape your whole architecture.",
    tiers: {
      napkin:
        "Disaster recovery plans for large-scale failures. RTO = how fast you must recover; RPO = how much recent data you can lose.",
      working:
        "Strategies range from backup-and-restore (cheap, slow) to pilot-light, warm standby, and multi-region active-active (fast, expensive). Lower RTO/RPO costs more. Replication frequency sets your RPO.",
      deep: "Multi-region adds data consistency and failover complexity (DNS, global load balancing, data sync). Test failover regularly — untested DR plans routinely fail. Backups must be restorable and off-region.",
    },
    instrument: "TradeoffLab",
    tradeoff: {
      axis: "Recovery speed ↔ Cost",
      left: "Multi-region active-active",
      right: "Backup & restore",
      consequence:
        "Active-active gives near-zero RTO/RPO but doubles infrastructure and adds consistency complexity. Backup-and-restore is cheap but means hours of downtime and lost recent data.",
    },
    recall: [
      {
        q: "RPO (Recovery Point Objective) measures…",
        options: [
          "How long recovery takes",
          "How much recent data you can afford to lose",
          "The number of replicas",
          "The cache hit ratio",
        ],
        answer: 1,
        explain: "RPO = acceptable data loss window; RTO = acceptable downtime. Replication frequency drives RPO.",
      },
    ],
    memory: {
      analogy: "RTO = how fast the spare generator kicks in; RPO = how much work you lose between saves.",
      mnemonic: "RTO = Time to recover, RPO = Point (of data) you lose.",
      why: "Because whole regions do fail, and 'we'll figure it out then' is not a plan.",
    },
    tags: ["disaster-recovery", "rto", "rpo", "reliability"],
    interactive: true,
  },
];
