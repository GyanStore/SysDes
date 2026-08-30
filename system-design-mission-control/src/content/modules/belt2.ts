import type { ModuleContent } from "@/types/content";

export const belt2: ModuleContent[] = [
  {
    id: "sql-vs-nosql",
    code: "2.1",
    beltId: "data-at-scale",
    title: "SQL vs NoSQL",
    tagline: "Structure & joins vs scale & flexibility.",
    hook: "Two teams, same feature. One reaches for Postgres, one for DynamoDB. Both can be right — the workload decides.",
    tiers: {
      napkin:
        "SQL databases enforce a schema and excel at relationships and transactions. NoSQL trades some of that for horizontal scale and flexible shapes.",
      working:
        "Relational: strong consistency, joins, ACID — great for complex, interrelated data. NoSQL families — key-value, document, wide-column, graph — optimize for scale, write throughput, or specific access patterns.",
      deep: "Modern lines blur (distributed SQL like Spanner/Cockroach; NoSQL with transactions). Choose by access pattern and consistency needs, not hype: model your queries first, then pick the store that serves them cheaply.",
    },
    instrument: "TradeoffLab",
    tradeoff: {
      axis: "Structure ↔ Scale/flexibility",
      left: "Relational (SQL)",
      right: "NoSQL",
      consequence:
        "SQL gives joins, transactions, and integrity but scales writes harder. NoSQL scales out and flexes schema but pushes consistency and joins into your application code.",
    },
    recall: [
      {
        q: "You need multi-row transactions and rich ad-hoc queries. Best default?",
        options: ["Key-value store", "Relational SQL database", "Blob storage", "A message queue"],
        answer: 1,
        explain: "Transactions + ad-hoc joins are exactly what relational databases are built for.",
      },
    ],
    memory: {
      analogy: "SQL is a filing cabinet with strict folders; NoSQL is a big flexible bin you organize by how you'll grab things.",
      why: "Because no single database is best at everything — the access pattern picks the tool.",
    },
    tags: ["databases", "sql", "nosql"],
    interactive: true,
  },
  {
    id: "indexing-btree-lsm",
    code: "2.2",
    beltId: "data-at-scale",
    deepDive: [
      "B-tree: O(log n) reads with in-place updates → random write I/O, but excellent, predictable read latency.",
      "LSM: buffer in a memtable, flush sorted SSTables, compact later → sequential writes, high ingest throughput.",
      "LSM read amplification is tamed with Bloom filters + leveled/tiered compaction; write amplification is the cost.",
      "Rule of thumb: read-heavy → B-tree (Postgres, MySQL); write-heavy ingest → LSM (Cassandra, RocksDB).",
    ],
    title: "Indexing: B-tree vs LSM-tree",
    tagline: "Read-optimized vs write-optimized storage.",
    hook: "Why is Postgres great at reads and Cassandra great at massive writes? The answer is the shape of the tree underneath.",
    tiers: {
      napkin:
        "An index is a data structure that makes lookups fast. B-trees favor reads; LSM-trees favor writes.",
      working:
        "B-trees update in place — balanced, great for reads and range scans. LSM-trees buffer writes in memory, flush sorted files to disk, and compact them later — excellent write throughput, reads may check several files.",
      deep: "LSM read amplification is tamed with Bloom filters and tiered/leveled compaction; write amplification comes from compaction. B-trees pay random-write cost but give predictable reads. The choice is a read/write-amplification trade.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "LSM: memtable → flush → compact.",
      nodes: [
        { id: "w", label: "Write", x: 6, y: 50, kind: "client" },
        { id: "mem", label: "Memtable", x: 32, y: 50, kind: "cache" },
        { id: "l0", label: "SSTable L0", x: 62, y: 30, kind: "db" },
        { id: "l1", label: "SSTable L1", x: 88, y: 66, kind: "db" },
      ],
      edges: [
        { from: "w", to: "mem" },
        { from: "mem", to: "l0" },
        { from: "l0", to: "l1" },
      ],
    },
    tradeoff: {
      axis: "Read ↔ Write optimization",
      left: "B-tree (reads)",
      right: "LSM-tree (writes)",
      consequence:
        "B-trees give fast, predictable reads but slower random writes. LSM-trees ingest writes fast but add read and compaction overhead.",
    },
    recall: [
      {
        q: "A write-heavy workload (e.g. time-series ingestion) is best served by…",
        options: ["B-tree index", "LSM-tree storage", "No index", "A graph database"],
        answer: 1,
        explain: "LSM-trees buffer and batch writes sequentially, maximizing write throughput.",
      },
    ],
    memory: {
      analogy: "B-tree = re-sorting the bookshelf on every insert; LSM = tossing books in a pile and tidying in batches later.",
      why: "Because reads and writes pull storage design in opposite directions.",
    },
    tags: ["databases", "indexing", "storage"],
    interactive: true,
  },
  {
    id: "replication",
    code: "2.3",
    beltId: "data-at-scale",
    deepDive: [
      "Synchronous = no data loss on failover but blocks on the slowest replica; async is fast but can lose the tail of writes.",
      "Semi-sync (wait for ≥1 replica ack) is a common middle ground.",
      "Replication lag causes read-your-writes violations — route recent reads to the leader or wait for the write's log position.",
      "Failover needs fencing or quorum to avoid split-brain (two leaders both accepting writes).",
    ],
    title: "Replication",
    tagline: "Copies for availability & read scale.",
    hook: "Your one database is a single point of failure and a read bottleneck. Make copies — but now which copy is the truth?",
    tiers: {
      napkin:
        "Replication keeps copies of data on multiple nodes for durability, availability, and read scaling.",
      working:
        "Leader-follower: writes go to the leader, reads can fan out to followers (with replication lag). Multi-leader: writes anywhere, must resolve conflicts. Leaderless (Dynamo-style): quorum reads/writes.",
      deep: "Synchronous replication is durable but slow and blocks on a slow replica; asynchronous is fast but can lose recent writes on failover. Replication lag causes read-your-writes anomalies unless you route or wait.",
    },
    instrument: "Timeline",
    instrumentConfig: {
      actors: ["Leader", "Follower"],
      caption: "Async replication lag after a write.",
      events: [
        { t: 0, from: 0, to: 0, label: "write committed" },
        { t: 1, from: 0, to: 1, label: "replicate…" },
        { t: 2, from: 1, to: 1, label: "applied (lagged)" },
      ],
    },
    tradeoff: {
      axis: "Durability ↔ Write latency",
      left: "Synchronous",
      right: "Asynchronous",
      consequence:
        "Sync replication guarantees no data loss on failover but every write waits for replicas. Async is fast but a leader crash can lose the last few writes.",
    },
    recall: [
      {
        q: "Reading your own just-written comment and not seeing it is caused by…",
        options: ["A full cache", "Replication lag on an async follower", "TLS", "Sharding"],
        answer: 1,
        explain: "The follower hasn't applied the write yet — a read-your-writes violation.",
      },
    ],
    memory: {
      analogy: "Photocopying an important document to several offices; the copies briefly disagree with the original.",
      why: "Because one copy can die or bottleneck — but multiple copies must agree on the truth.",
    },
    tags: ["replication", "availability", "consistency"],
    interactive: true,
  },
  {
    id: "partitioning-sharding",
    code: "2.4",
    beltId: "data-at-scale",
    title: "Partitioning & sharding",
    tagline: "Split data so no node holds it all.",
    hook: "Your data no longer fits on one machine. Split it — but a bad split creates a 'hot shard' that melts while the others idle.",
    tiers: {
      napkin:
        "Sharding splits a dataset across nodes so each holds a slice, letting storage and writes scale horizontally.",
      working:
        "Range partitioning keeps order (great for scans, prone to hot ranges). Hash partitioning spreads evenly (kills range scans). The enemy is skew: a celebrity or a monotonically increasing key overloads one shard.",
      deep: "Rebalancing on node add/remove is the pain point — naive hashing reshuffles everything (see consistent hashing). Composite keys, salting, and per-tenant sharding tame hot spots.",
    },
    instrument: "TradeoffLab",
    tradeoff: {
      axis: "Range ↔ Hash sharding",
      left: "Range (ordered)",
      right: "Hash (even)",
      consequence:
        "Range sharding enables fast ordered scans but concentrates load on hot ranges. Hash sharding spreads load evenly but makes range queries scatter-gather across shards.",
    },
    recall: [
      {
        q: "Sharding by an auto-incrementing timestamp key tends to cause…",
        options: [
          "Perfectly even load",
          "A hot shard on the newest range",
          "Lower storage use",
          "Stronger consistency",
        ],
        answer: 1,
        explain: "All new writes target the latest range, overloading a single shard.",
      },
    ],
    memory: {
      analogy: "Splitting a phone book by letter (range) vs by a hash of the name (even). Range makes 'S' huge.",
      why: "Because data outgrows single machines, and how you split it decides whether load is balanced.",
    },
    tags: ["sharding", "partitioning", "scale"],
    interactive: true,
  },
  {
    id: "consistent-hashing",
    code: "2.5",
    beltId: "data-at-scale",
    deepDive: [
      "On add/remove, expected keys moved ≈ K/N (K keys, N nodes) — versus ~K for hash-mod-N.",
      "Virtual nodes (100–200 points per physical node) cut load variance from ~40% down to a few percent.",
      "Bounded-load variants cap any node at (1+ε)× the average to eliminate hotspots.",
      "Used in Dynamo, Cassandra, Riak, and Memcached client libraries (ketama hashing).",
    ],
    title: "Consistent hashing",
    tagline: "Add or remove a node, move only 1/N of the keys.",
    hook: "With plain hash-mod-N, adding one server remaps almost every key — a cache-wide stampede. Consistent hashing moves only the keys near the change. Watch it.",
    tiers: {
      napkin:
        "Place nodes and keys on a circular hash ring. Each key belongs to the next node clockwise. Add/remove a node and only its neighboring keys move.",
      working:
        "With mod-N hashing, changing N remaps ~all keys. On a ring, adding a node steals only the arc between it and its predecessor — about 1/N of keys. Virtual nodes (many points per physical node) smooth out uneven arcs.",
      deep: "Consistent hashing underpins distributed caches (Memcached clients), Dynamo/Cassandra partitioning, and shard routers. Virtual nodes fix load skew and make rebalancing on failure gradual; bounded-load variants cap any node's share.",
    },
    instrument: "NodeRing",
    tradeoff: {
      axis: "Even load ↔ Metadata cost",
      left: "Few virtual nodes",
      right: "Many virtual nodes",
      consequence:
        "Few vnodes means less bookkeeping but uneven arcs (some nodes get more keys). Many vnodes balance load beautifully but grow the routing table and rebalancing work.",
    },
    recall: [
      {
        q: "The core win of consistent hashing over hash-mod-N is that adding a node…",
        options: [
          "Remaps all keys",
          "Moves only about 1/N of the keys",
          "Requires no hashing",
          "Improves consistency",
        ],
        answer: 1,
        explain: "Only keys on the new node's arc move; the rest stay put — no full reshuffle.",
      },
      {
        q: "Virtual nodes are used to…",
        options: [
          "Encrypt keys",
          "Balance load and smooth rebalancing across physical nodes",
          "Reduce the number of servers",
          "Guarantee strong consistency",
        ],
        answer: 1,
        explain: "Spreading each physical node across many ring points evens out arc sizes.",
      },
    ],
    memory: {
      analogy:
        "Guests seated around a round table by birthday. Add a chair and only the guests between it and the last chair shuffle — nobody else moves.",
      mnemonic: "Ring + clockwise-next-node = only neighbors move.",
      why: "Because rebalancing a cache or shard set shouldn't invalidate everything every time a node joins or dies.",
    },
    tags: ["hashing", "sharding", "algorithms", "distributed"],
    interactive: true,
  },
  {
    id: "cap-pacelc",
    code: "2.6",
    beltId: "data-at-scale",
    deepDive: [
      "It's per-operation, not per-database — many stores offer tunable consistency per request.",
      "PACELC: even with no partition (Else), you still trade Latency vs Consistency on every request.",
      "'CA' isn't achievable for distributed systems — partitions are inevitable, so you pick CP or AP.",
      "Spanner is effectively CP (via TrueTime); Dynamo/Cassandra default to AP with tunable quorums.",
    ],
    title: "CAP & PACELC",
    tagline: "During a partition, pick C or A.",
    hook: "The network splits your cluster in two. A write arrives on each side. Do you accept it (risk conflict) or reject it (risk downtime)? You must choose.",
    tiers: {
      napkin:
        "CAP: during a network Partition you can keep Consistency OR Availability, not both. PACELC adds: Else (no partition), you trade Latency vs Consistency.",
      working:
        "CP systems refuse operations that can't be made consistent (they sacrifice availability). AP systems stay up and reconcile later (they serve possibly-stale data). PACELC notes that even in normal operation you trade latency for consistency.",
      deep: "It's per-operation, not per-database: many systems offer tunable consistency. The real questions are 'how often do partitions happen?' and 'what does stale/unavailable cost this specific operation?'",
    },
    instrument: "TradeoffLab",
    tradeoff: {
      axis: "Consistency ↔ Availability",
      left: "CP (consistent)",
      right: "AP (available)",
      consequence:
        "CP refuses uncertain operations during a partition — correct but returns errors. AP keeps serving — available but may return stale or conflicting data to reconcile later.",
    },
    recall: [
      {
        q: "During a network partition, an AP system chooses to…",
        options: [
          "Reject requests to stay consistent",
          "Keep serving, accepting possible staleness",
          "Shut down entirely",
          "Switch to SQL",
        ],
        answer: 1,
        explain: "AP favors availability, reconciling divergent data after the partition heals.",
      },
    ],
    memory: {
      analogy: "Two shop tills lose their link. CP: stop selling to avoid double-spend. AP: keep selling, sort out conflicts later.",
      mnemonic: "During Partition: C or A. Else: Latency or Consistency (PACELC).",
      why: "Because networks WILL partition, and the system must have a pre-decided answer for what to sacrifice.",
    },
    tags: ["cap", "consistency", "availability", "distributed"],
    interactive: true,
  },
  {
    id: "consistency-models",
    code: "2.7",
    beltId: "data-at-scale",
    title: "Consistency models",
    tagline: "Strong, eventual, causal, read-your-writes.",
    hook: "Two users refresh the same page a millisecond apart and see different data. Is that a bug — or the consistency model you chose?",
    tiers: {
      napkin:
        "A consistency model is the promise a system makes about what reads can see after writes.",
      working:
        "Strong (linearizable): everyone sees the latest write immediately. Eventual: replicas converge over time. Causal: cause-before-effect ordering is preserved. Read-your-writes: you always see your own updates.",
      deep: "Stronger models cost latency and availability (see CAP). Session guarantees (read-your-writes, monotonic reads) are cheap, high-value middle grounds implemented via sticky routing or version tracking.",
    },
    instrument: "Timeline",
    instrumentConfig: {
      actors: ["Writer", "Reader A", "Reader B"],
      caption: "Same write, three readers, different visibility.",
      events: [
        { t: 0, from: 0, to: 0, label: "write X=1" },
        { t: 1, from: 1, to: 1, label: "reads X=1 (fresh)" },
        { t: 1, from: 2, to: 2, label: "reads X=0 (stale)" },
      ],
    },
    tradeoff: {
      axis: "Consistency ↔ Latency",
      left: "Strong",
      right: "Eventual",
      consequence:
        "Strong consistency gives one obvious truth but requires coordination that adds latency and hurts availability. Eventual consistency is fast and available but exposes temporary disagreement.",
    },
    recall: [
      {
        q: "Which model guarantees you always see your OWN most recent write?",
        options: ["Eventual", "Read-your-writes", "None", "FIFO"],
        answer: 1,
        explain: "Read-your-writes (a session guarantee) ensures your updates are visible to you.",
      },
    ],
    memory: {
      analogy: "A group chat where some phones update instantly (strong) and some lag a few seconds (eventual).",
      why: "Because 'is this data current?' has many possible answers, and the model sets user expectations.",
    },
    tags: ["consistency", "distributed"],
    interactive: true,
  },
  {
    id: "acid-base-transactions",
    code: "2.8",
    beltId: "data-at-scale",
    title: "ACID, BASE & transactions",
    tagline: "All-or-nothing vs soft-state.",
    hook: "You transfer $100: debit one account, credit another. The server crashes between the two. What stops the money from vanishing?",
    tiers: {
      napkin:
        "A transaction groups operations so they all succeed or all fail. ACID guarantees this strictly; BASE relaxes it for scale.",
      working:
        "ACID = Atomicity, Consistency, Isolation, Durability. Isolation levels (read-committed, repeatable-read, serializable) trade concurrency for anomaly protection (dirty/non-repeatable/phantom reads). BASE = Basically Available, Soft state, Eventual consistency.",
      deep: "Serializable isolation is safest but limits concurrency; MVCC gives snapshot isolation cheaply. Distributed transactions across services are hard — often replaced by sagas (see next module).",
    },
    instrument: "TradeoffLab",
    tradeoff: {
      axis: "Isolation ↔ Concurrency",
      left: "Serializable",
      right: "Read-committed",
      consequence:
        "Serializable prevents all anomalies but serializes conflicting work (lower throughput). Weaker isolation allows more concurrency but exposes anomalies your code must tolerate.",
    },
    recall: [
      {
        q: "The 'A' in ACID (atomicity) guarantees that…",
        options: [
          "Reads are fast",
          "A transaction either fully completes or fully rolls back",
          "Data is encrypted",
          "Replicas agree instantly",
        ],
        answer: 1,
        explain: "Atomicity is all-or-nothing — no partial application of a transaction.",
      },
    ],
    memory: {
      analogy: "Booking a flight AND hotel as one deal — if the hotel fails, the flight is cancelled too.",
      mnemonic: "ACID = Atomic, Consistent, Isolated, Durable.",
      why: "Because partial updates corrupt data, and concurrent updates collide without isolation rules.",
    },
    tags: ["transactions", "acid", "databases"],
    interactive: true,
  },
  {
    id: "2pc-vs-saga",
    code: "2.9",
    beltId: "data-at-scale",
    title: "Distributed transactions: 2PC vs Saga",
    tagline: "Lock-and-commit vs compensate.",
    hook: "One order touches payments, inventory, and shipping — three services, three databases. How do you keep them consistent without a global lock that freezes on a single crash?",
    tiers: {
      napkin:
        "Two-phase commit (2PC) coordinates all services to commit together. Sagas break the work into steps, each with a compensating undo.",
      working:
        "2PC: a coordinator asks all participants to prepare, then commit — strong consistency but blocks if the coordinator dies mid-commit. Saga: run local transactions in sequence; if one fails, run compensations (refund, restock) to unwind — available, eventually consistent.",
      deep: "2PC's blocking and coordinator failure make it rare across microservices. Sagas (orchestrated or choreographed) dominate but require idempotent steps and careful compensation design; they expose intermediate states.",
    },
    instrument: "Timeline",
    instrumentConfig: {
      actors: ["Order", "Payment", "Inventory"],
      caption: "Saga: step fails → compensate.",
      events: [
        { t: 0, from: 0, to: 1, label: "charge ✓" },
        { t: 1, from: 0, to: 2, label: "reserve ✗" },
        { t: 2, from: 0, to: 1, label: "refund (compensate)" },
      ],
    },
    tradeoff: {
      axis: "Consistency ↔ Availability",
      left: "2PC (strong)",
      right: "Saga (available)",
      consequence:
        "2PC keeps everything atomically consistent but blocks and fails hard if the coordinator dies. Sagas stay available and scalable but are only eventually consistent and expose partial states.",
    },
    recall: [
      {
        q: "The main drawback of two-phase commit in microservices is…",
        options: [
          "It's too fast",
          "It blocks and is fragile to coordinator failure",
          "It can't be encrypted",
          "It needs no coordinator",
        ],
        answer: 1,
        explain: "Participants hold locks awaiting the coordinator; if it dies mid-commit, they block.",
      },
    ],
    memory: {
      analogy: "2PC = everyone signs the contract at once or nobody does. Saga = do each step, and if one fails, reverse the earlier steps.",
      why: "Because atomic commit across independent services is expensive and fragile at scale.",
    },
    tags: ["transactions", "saga", "microservices", "distributed"],
    interactive: true,
  },
  {
    id: "quorums",
    code: "2.10",
    beltId: "data-at-scale",
    deepDive: [
      "R + W > N guarantees every read set overlaps the most recent write set → strong consistency.",
      "N=3, R=2, W=2 tolerates one node down for both reads and writes.",
      "W=N, R=1 gives fast reads but fragile writes; W=1, R=N is the reverse.",
      "Sloppy quorums + hinted handoff keep writes available during partitions; read repair fixes stale replicas afterward.",
    ],
    title: "Quorums (R + W > N)",
    tagline: "Overlap reads and writes to guarantee freshness.",
    hook: "Data is on 3 replicas. If you write to 2 and read from 2, at least one node in your read saw the write. That overlap is the whole trick.",
    tiers: {
      napkin:
        "With N replicas, require W nodes to acknowledge a write and R nodes to answer a read. If R + W > N, reads and writes always overlap on at least one up-to-date node.",
      working:
        "Tuning R and W trades consistency, latency, and availability. W=N, R=1 gives fast reads, slow/fragile writes. W=1, R=N is the reverse. W=R=majority (e.g. 2 of 3) balances both and tolerates one node down.",
      deep: "Quorums are the heart of leaderless (Dynamo-style) systems. Sloppy quorums + hinted handoff keep writes available during partitions; read repair and anti-entropy (Merkle trees) reconcile stale replicas afterward.",
    },
    instrument: "TradeoffLab",
    tradeoff: {
      axis: "Read latency ↔ Write latency",
      left: "Low R (fast reads)",
      right: "Low W (fast writes)",
      consequence:
        "Requiring fewer nodes for reads (low R) makes reads fast but forces writes to hit more nodes to keep R+W>N. Balancing at majority R and W tolerates one failure while keeping reads and writes reasonably fast.",
    },
    recall: [
      {
        q: "With N=3, which R/W pair guarantees strong consistency AND tolerates one node failure?",
        options: ["R=1, W=1", "R=2, W=2", "R=1, W=3", "R=3, W=1"],
        answer: 1,
        explain: "R=2, W=2 satisfies R+W>N (4>3) and both can be met with any 2 of 3 nodes up.",
      },
    ],
    memory: {
      analogy: "If two of three witnesses must sign every update and two must be asked to confirm it, at least one asked witness always signed.",
      mnemonic: "R + W > N ⇒ read and write sets overlap.",
      why: "Because without a single leader, overlapping quorums are how leaderless systems guarantee a read sees the latest write.",
    },
    tags: ["quorum", "consistency", "distributed", "replication"],
    interactive: true,
  },
  {
    id: "distributed-ids",
    code: "2.11",
    beltId: "data-at-scale",
    title: "Distributed unique IDs",
    tagline: "Unique, sortable, no central bottleneck.",
    hook: "A hundred servers each create records every millisecond. How do they all mint unique IDs without asking one central counter (and creating a bottleneck)?",
    tiers: {
      napkin:
        "Distributed ID schemes generate unique identifiers across many machines without coordination.",
      working:
        "UUIDv4 is random and collision-safe but unsortable and index-unfriendly. Snowflake IDs pack timestamp + machine id + sequence into 64 bits — unique, roughly time-sortable, and index-friendly. ULID/KSUID are similar, lexicographically sortable.",
      deep: "Snowflake needs synced clocks and unique machine ids; clock skew or reuse causes collisions or out-of-order ids. Time-sortable ids improve B-tree locality but can create hot shards (see partitioning).",
    },
    instrument: "TradeoffLab",
    tradeoff: {
      axis: "Randomness ↔ Sortability",
      left: "UUIDv4 (random)",
      right: "Snowflake (time-sortable)",
      consequence:
        "Random UUIDs need no coordination and spread evenly across shards but hurt index locality and aren't sortable. Snowflake ids sort by time and index well but need clock sync and can create hot shards.",
    },
    recall: [
      {
        q: "Snowflake IDs are roughly time-sortable because they…",
        options: [
          "Are fully random",
          "Put a timestamp in the high bits",
          "Use a central counter",
          "Are hashed",
        ],
        answer: 1,
        explain: "The leading timestamp bits make ids increase over time, enabling rough sort order.",
      },
    ],
    memory: {
      analogy: "Ticket numbers stamped with the time + which machine printed them, so they never clash and sort by when.",
      why: "Because a single global counter is a bottleneck and a single point of failure at scale.",
    },
    tags: ["ids", "distributed", "snowflake"],
    interactive: true,
  },
];
