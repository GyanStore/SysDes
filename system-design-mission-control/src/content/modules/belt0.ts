import type { ModuleContent } from "@/types/content";

export const belt0: ModuleContent[] = [
  {
    id: "what-is-system-design",
    code: "0.1",
    beltId: "foundations",
    title: "What is system design?",
    tagline: "The same app, from a napkin to planet scale.",
    hook: "One user loves your app. Then a million arrive on the same Tuesday. The code didn't change — so what has to?",
    tiers: {
      napkin:
        "System design is deciding how the pieces of software fit together so the whole thing stays fast, correct, and alive as it grows.",
      working:
        "It's the art of trade-offs across scale, latency, consistency, availability, and cost. You rarely pick the 'best' option — you pick the one whose downsides you can live with for this workload.",
      deep: "Every design question reduces to: where does state live, how does it move, and what happens when a part of it fails? Master those three and the buzzwords fall out naturally.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "Same request, three scales — watch the shape grow.",
      nodes: [
        { id: "u", label: "User", x: 8, y: 50, kind: "client" },
        { id: "lb", label: "Load Balancer", x: 34, y: 50, kind: "net" },
        { id: "a1", label: "App", x: 60, y: 28, kind: "app" },
        { id: "a2", label: "App", x: 60, y: 72, kind: "app" },
        { id: "db", label: "Database", x: 88, y: 50, kind: "db" },
      ],
      edges: [
        { from: "u", to: "lb" },
        { from: "lb", to: "a1" },
        { from: "lb", to: "a2" },
        { from: "a1", to: "db" },
        { from: "a2", to: "db" },
      ],
    },
    tradeoff: {
      axis: "Simplicity ↔ Scalability",
      left: "One box",
      right: "Many boxes",
      consequence:
        "One box is easy to reason about but has a hard ceiling and a single point of failure. Many boxes scale and survive failures but add coordination, consistency, and operational cost.",
    },
    recall: [
      {
        q: "System design is fundamentally the practice of…",
        options: [
          "Writing the fastest possible algorithm",
          "Choosing trade-offs so the whole system meets its goals at scale",
          "Picking the newest database",
          "Avoiding all single points of failure",
        ],
        answer: 1,
        explain:
          "There's rarely a single 'best' — you choose the trade-off whose downsides fit your workload.",
      },
    ],
    memory: {
      analogy:
        "Like designing a restaurant: cooking one meal is easy; serving 10,000 without the kitchen melting is system design.",
      why: "Because software that works for one user often collapses for a million — the bottleneck moves.",
    },
    tags: ["fundamentals", "trade-offs", "scale"],
    interactive: true,
  },
  {
    id: "latency-numbers",
    code: "0.2",
    beltId: "foundations",
    title: "Latency numbers you must know",
    tagline: "L1 cache to cross-continent, scaled to human time.",
    hook: "If reading from L1 cache took 1 second, a network round-trip to another continent would take almost 5 years. That gap is why architecture exists.",
    tiers: {
      napkin:
        "Different storage and network hops differ by orders of magnitude. Keep hot data close; touch far things rarely.",
      working:
        "Memory access ~100ns, SSD read ~16µs, same-datacenter round-trip ~500µs, cross-continent ~150ms. Each step out is ~10–1000× slower. Design to stay in the cheap tiers.",
      deep: "These numbers drive every caching, replication, and placement decision. A p99 budget of 200ms is blown by two sequential cross-region calls — so you fan out, cache, or move compute to the data.",
    },
    instrument: "LatencyLadder",
    tradeoff: {
      axis: "Freshness ↔ Latency",
      left: "Always go to source",
      right: "Serve from cache",
      consequence:
        "Going to the source is always correct but pays the full latency each time. Caching is orders of magnitude faster but can serve stale data.",
    },
    recall: [
      {
        q: "Roughly how much slower is a cross-continent round-trip than a main-memory read?",
        options: ["~10×", "~1,000×", "~1,000,000×", "About the same"],
        answer: 2,
        explain: "RAM ≈ 100ns; cross-continent ≈ 150ms ≈ 1.5 million× slower.",
      },
    ],
    memory: {
      analogy:
        "L1 cache is your hand; RAM is the next room; SSD is across town; a cross-region call is a flight abroad.",
      mnemonic: "Nano-Micro-Milli: cache, disk, network — each prefix is 1000× the last.",
      why: "Because you can't optimize what you can't feel — scaling the numbers to human time makes the gaps intuitive.",
    },
    tags: ["latency", "performance", "numbers"],
    interactive: true,
  },
  {
    id: "back-of-envelope",
    code: "0.3",
    beltId: "foundations",
    title: "Back-of-the-envelope estimation",
    tagline: "Users → QPS → storage → bandwidth → servers.",
    hook: "An interviewer asks: '100M daily users — how many servers?' You have 60 seconds and no laptop. This is the skill.",
    tiers: {
      napkin:
        "Turn a headline number (users) into the numbers that size a system: requests/second, storage, bandwidth, machines.",
      working:
        "Daily active users × actions/day ÷ 86,400s = average QPS. Multiply by a peak factor (~2–10×). Storage = objects × size × retention. Servers = peak QPS ÷ per-server capacity, plus headroom.",
      deep: "Estimates are for spotting the dominant cost, not precision. Round aggressively to powers of ten; a 2× error is fine, a 100× error means you picked the wrong architecture.",
    },
    instrument: "EstimatorPad",
    tradeoff: {
      axis: "Speed ↔ Precision",
      left: "Rough powers of ten",
      right: "Exact modelling",
      consequence:
        "Rough math finds the dominant bottleneck in seconds. Exact modelling is only worth it once you know which number actually decides the design.",
    },
    recall: [
      {
        q: "100M daily users each do 10 requests/day. Average QPS is closest to…",
        options: ["~1,200", "~12,000", "~120,000", "~1,200,000"],
        answer: 1,
        explain: "1e9 requests/day ÷ 86,400s ≈ 11,600 QPS. Apply a peak factor for capacity planning.",
      },
    ],
    memory: {
      analogy: "Like estimating paint for a house by rooms, not by counting bricks.",
      mnemonic: "Seconds in a day ≈ 100k (86,400). Divide daily counts by 100k for average/sec.",
      why: "Because the right architecture depends on order of magnitude, and you must find it before you have real data.",
    },
    tags: ["estimation", "capacity", "numbers"],
    interactive: true,
  },
  {
    id: "latency-throughput-bandwidth",
    code: "0.4",
    beltId: "foundations",
    title: "Latency vs throughput vs bandwidth",
    tagline: "Speed, capacity, and how they trade off.",
    hook: "A truck full of hard drives has terrible latency and unbeatable throughput. Which one does your user actually feel?",
    tiers: {
      napkin:
        "Latency = how long one thing takes. Throughput = how many things per second. Bandwidth = the pipe's max throughput.",
      working:
        "They're related but independent. Batching raises throughput but adds latency. Parallelism raises throughput without lowering per-item latency. Users feel latency; capacity planning cares about throughput.",
      deep: "Little's Law ties them: concurrency = throughput × latency. To handle more in flight you either go faster (lower latency) or wider (more parallel workers).",
    },
    instrument: "TradeoffLab",
    tradeoff: {
      axis: "Latency ↔ Throughput",
      left: "Send each item now",
      right: "Batch items together",
      consequence:
        "Sending immediately minimizes per-item latency but wastes overhead. Batching amortizes overhead for higher throughput at the cost of waiting to fill the batch.",
    },
    recall: [
      {
        q: "Batching requests together typically…",
        options: [
          "Lowers latency and throughput",
          "Raises throughput but can raise latency",
          "Raises latency and lowers throughput",
          "Has no effect on either",
        ],
        answer: 1,
        explain: "Batching amortizes fixed overhead (higher throughput) but items wait for the batch (higher latency).",
      },
    ],
    memory: {
      analogy:
        "Latency is how long your one letter takes; throughput is how many letters the post office moves per day; bandwidth is how big the mail truck is.",
      why: "Because 'make it faster' is ambiguous until you say whether you mean each request or all of them.",
    },
    tags: ["latency", "throughput", "little's law"],
    interactive: true,
  },
  {
    id: "vertical-horizontal-scaling",
    code: "0.5",
    beltId: "foundations",
    title: "Vertical vs horizontal scaling",
    tagline: "Grow the machine, or add machines.",
    hook: "Your server is at 100% CPU. You can buy a bigger one — once. Or add a second one — forever. Which buys you more runway?",
    tiers: {
      napkin:
        "Vertical = a bigger box. Horizontal = more boxes. Vertical is simple but hits a ceiling; horizontal scales far but needs coordination.",
      working:
        "Vertical scaling keeps a single node (no distributed complexity) but has a hard hardware limit and a single point of failure. Horizontal scaling adds nodes behind a load balancer — near-limitless, fault-tolerant, but requires statelessness or shared state.",
      deep: "The real unlock is making services stateless so any request can hit any node. State then concentrates in databases/caches, which you scale separately via replication and sharding.",
    },
    instrument: "LoadDial",
    instrumentConfig: { mode: "scaling" },
    tradeoff: {
      axis: "Simplicity ↔ Ceiling",
      left: "Scale up (one big box)",
      right: "Scale out (many boxes)",
      consequence:
        "Scaling up is operationally simple but capped and fragile. Scaling out is unbounded and resilient but forces you to solve statelessness, load balancing, and data partitioning.",
    },
    recall: [
      {
        q: "The key enabler for effective horizontal scaling of app servers is…",
        options: [
          "Faster CPUs",
          "Stateless services so any node can serve any request",
          "A bigger database",
          "More RAM per node",
        ],
        answer: 1,
        explain: "If nodes hold no per-user state, the load balancer can freely spread requests and add/remove nodes.",
      },
    ],
    memory: {
      analogy:
        "Vertical = hiring one superhuman chef. Horizontal = hiring many normal chefs. The second scales to a banquet.",
      why: "Because single machines have a ceiling and can die; the internet is built on many cheap, replaceable boxes.",
    },
    tags: ["scaling", "stateless", "capacity"],
    interactive: true,
  },
  {
    id: "request-lifecycle",
    code: "0.6",
    beltId: "foundations",
    title: "The life of a request",
    tagline: "DNS → LB → app → cache → DB → back.",
    hook: "You type a URL and hit enter. In the next 200 milliseconds, a dozen systems spring into action. Let's trace all of them.",
    tiers: {
      napkin:
        "A request travels: resolve the name (DNS), reach a load balancer, hit an app server, check a cache, maybe query a database, then travel all the way back.",
      working:
        "Each hop adds latency and can fail. Caches short-circuit expensive hops; load balancers spread work; the database is usually the slowest and most contended stop.",
      deep: "Tracing this path end-to-end (distributed tracing) is how you find where the p99 latency actually goes — it's almost never where you guessed.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "Follow one request through every hop.",
      nodes: [
        { id: "u", label: "Browser", x: 6, y: 50, kind: "client" },
        { id: "dns", label: "DNS", x: 24, y: 18, kind: "net" },
        { id: "lb", label: "Load Balancer", x: 40, y: 50, kind: "net" },
        { id: "app", label: "App Server", x: 60, y: 50, kind: "app" },
        { id: "cache", label: "Cache", x: 80, y: 22, kind: "cache" },
        { id: "db", label: "Database", x: 92, y: 62, kind: "db" },
      ],
      edges: [
        { from: "u", to: "dns" },
        { from: "u", to: "lb" },
        { from: "lb", to: "app" },
        { from: "app", to: "cache" },
        { from: "app", to: "db" },
      ],
    },
    tradeoff: {
      axis: "Hops ↔ Latency",
      left: "Add a layer (cache/proxy)",
      right: "Fewer layers",
      consequence:
        "Each layer can save work (a cache) or add safety (a proxy), but every hop is another place to add latency and to fail. Add layers that earn their keep.",
    },
    recall: [
      {
        q: "In a typical request path, which hop is most often the slowest and most contended?",
        options: ["DNS lookup", "Load balancer", "The database", "TLS handshake"],
        answer: 2,
        explain: "The database holds shared state and disk — it's usually the bottleneck, which is why we cache in front of it.",
      },
    ],
    memory: {
      analogy:
        "Like mailing a letter: look up the address (DNS), hand it to the post office (LB), a clerk processes it (app), checks a pigeonhole (cache), or opens the vault (DB).",
      why: "Because you can't optimize or debug latency without knowing every place time is spent.",
    },
    tags: ["networking", "latency", "tracing"],
    interactive: true,
  },
];
