import type { ModuleContent } from "@/types/content";

/** Extensions to Belt 2 (Data at Scale). */
export const extData: ModuleContent[] = [
  {
    id: "oltp-vs-olap",
    code: "2.12",
    beltId: "data-at-scale",
    title: "OLTP vs OLAP",
    tagline: "Transactions vs analytics; rows vs columns.",
    hook: "The same database that takes orders all day chokes when finance runs a 'total revenue by region for 3 years' query. They're two different jobs.",
    tiers: {
      napkin:
        "OLTP handles many small, fast transactions (your app's live database). OLAP handles big analytical scans over history (the data warehouse).",
      working:
        "OLTP databases are row-oriented, normalized, optimized for point reads/writes. OLAP systems are column-oriented, denormalized, optimized for scanning huge aggregates. Running analytics on your OLTP DB slows the app — so you separate them.",
      deep: "Columnar storage reads only needed columns and compresses well (great for aggregates). Data flows OLTP → ETL/ELT → warehouse/lakehouse (Snowflake, BigQuery). HTAP systems try to do both; usually you keep them separate and sync via CDC.",
    },
    instrument: "TradeoffLab",
    tradeoff: {
      axis: "Transactions ↔ Analytics",
      left: "OLTP (row store)",
      right: "OLAP (column store)",
      consequence:
        "Row-oriented OLTP is fast for reading/writing whole records but slow for wide aggregates. Column-oriented OLAP scans and compresses aggregate queries brilliantly but is poor at single-row transactional updates.",
    },
    recall: [
      {
        q: "Why is columnar storage great for analytics?",
        options: [
          "It's encrypted",
          "It reads only the needed columns and compresses them well",
          "It has no schema",
          "It's row-oriented",
        ],
        answer: 1,
        explain: "Aggregates touch few columns over many rows — columnar avoids reading irrelevant data and compresses similar values.",
      },
    ],
    memory: {
      analogy: "OLTP is a cash register (fast single sales); OLAP is the accountant analyzing a year of receipts.",
      why: "Because live transactions and heavy analytics have opposite access patterns and fight for the same resources.",
    },
    tags: ["oltp", "olap", "columnar", "databases"],
    interactive: true,
  },
  {
    id: "write-ahead-log",
    code: "2.13",
    beltId: "data-at-scale",
    title: "Write-ahead log (WAL)",
    tagline: "Durability by logging before doing.",
    hook: "The database crashes mid-write. On restart, how does it know what it was doing and finish the job without corrupting your data?",
    tiers: {
      napkin:
        "A write-ahead log records every change to an append-only log *before* applying it to the actual data. On crash, replay the log to recover.",
      working:
        "Appending sequentially to a log is fast and durable (an fsync'd write survives crashes). The DB applies changes to data pages later. On restart, it replays committed log entries and discards incomplete ones — this is how ACID durability is achieved.",
      deep: "The WAL is also the source for replication (ship log entries to followers) and CDC (stream changes out). Checkpoints bound replay time. The 'D' in ACID and much of replication both fall out of one append-only log.",
    },
    instrument: "Timeline",
    instrumentConfig: {
      actors: ["Client", "WAL", "Data"],
      caption: "Log first, apply later; replay on crash.",
      events: [
        { t: 0, from: 0, to: 1, label: "append change" },
        { t: 1, from: 1, to: 0, label: "ack (durable)" },
        { t: 2, from: 1, to: 2, label: "apply to data" },
      ],
    },
    tradeoff: {
      axis: "Durability ↔ Write latency",
      left: "fsync every commit",
      right: "Batch/async flush",
      consequence:
        "Fsync-ing the WAL on every commit guarantees no data loss but each write waits on disk. Batching or async flushing is faster but a crash can lose the last few 'committed' writes.",
    },
    recall: [
      {
        q: "The WAL provides durability by…",
        options: [
          "Caching reads",
          "Recording changes to an append-only log before applying them",
          "Sharding the data",
          "Compressing pages",
        ],
        answer: 1,
        explain: "A durable log written before the change lets the DB recover (replay) after a crash.",
      },
    ],
    memory: {
      analogy: "Writing your intentions in a permanent ledger before acting, so if you faint mid-task, someone can finish exactly where you left off.",
      why: "Because crashes happen mid-write, and durability requires a recoverable record of intent.",
    },
    tags: ["wal", "durability", "databases", "recovery"],
    interactive: true,
  },
  {
    id: "mvcc",
    code: "2.14",
    beltId: "data-at-scale",
    title: "MVCC (multi-version concurrency)",
    tagline: "Readers don't block writers.",
    hook: "A long analytics read runs while thousands of writes pour in. Neither waits for the other, and the reader sees a perfectly consistent snapshot. How?",
    tiers: {
      napkin:
        "MVCC keeps multiple versions of each row. Readers see a consistent snapshot as of when they started; writers create new versions instead of overwriting.",
      working:
        "Each transaction sees the version valid at its start time, so reads never block writes and vice versa (snapshot isolation). Old versions are kept until no transaction needs them, then garbage-collected (vacuum).",
      deep: "Powers Postgres, MySQL/InnoDB, Oracle. Trade-offs: version bloat and vacuum overhead; write-write conflicts still need detection (serializable snapshot isolation). It's why modern databases give high concurrency without heavy read locks.",
    },
    instrument: "Timeline",
    instrumentConfig: {
      actors: ["Reader (snapshot)", "Writer"],
      caption: "Reader keeps its snapshot while the writer makes a new version.",
      events: [
        { t: 0, from: 0, to: 0, label: "begin: snapshot v1" },
        { t: 1, from: 1, to: 1, label: "write → v2" },
        { t: 2, from: 0, to: 0, label: "still reads v1 (consistent)" },
      ],
    },
    tradeoff: {
      axis: "Concurrency ↔ Storage/GC cost",
      left: "MVCC (versions)",
      right: "Lock-based",
      consequence:
        "MVCC lets readers and writers proceed concurrently with consistent snapshots, but keeps old versions around (bloat) and needs garbage collection. Lock-based concurrency avoids versions but makes readers and writers block each other.",
    },
    recall: [
      {
        q: "The key benefit of MVCC is that…",
        options: [
          "Writes are faster than reads",
          "Readers get a consistent snapshot without blocking writers",
          "It removes the need for a WAL",
          "It shards data",
        ],
        answer: 1,
        explain: "Multiple versions let each reader see a stable snapshot while writers add new versions concurrently.",
      },
    ],
    memory: {
      analogy: "A document's edit history: you keep reading the version you opened while someone else saves a new one.",
      why: "Because high concurrency dies if every read blocks writes; versioning lets both proceed.",
    },
    tags: ["mvcc", "concurrency", "isolation", "databases"],
    interactive: true,
  },
  {
    id: "change-data-capture",
    code: "2.15",
    beltId: "data-at-scale",
    title: "Change data capture (CDC)",
    tagline: "Stream every DB change downstream.",
    hook: "Your search index, cache, and analytics all need to know when a row changes — without hammering the database with polling. So the database tells them.",
    tiers: {
      napkin:
        "CDC captures row-level changes from a database (usually by reading its log) and streams them to other systems in near real time.",
      working:
        "Instead of dual-writing (app writes DB + index, risking inconsistency), CDC tails the DB's WAL/binlog and publishes an ordered change stream (e.g., via Kafka/Debezium). Consumers update caches, search indexes, and warehouses reliably.",
      deep: "CDC gives an exactly-ordered, low-impact change feed and enables the outbox pattern, cache invalidation, and event-driven pipelines. Watch schema changes, ordering per key, and initial snapshot + catch-up. It turns the database log into an event source.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "DB log → change stream → many consumers.",
      nodes: [
        { id: "db", label: "Database", x: 8, y: 50, kind: "db" },
        { id: "cdc", label: "CDC (log tail)", x: 36, y: 50, kind: "net" },
        { id: "search", label: "Search Index", x: 76, y: 22, kind: "cache" },
        { id: "cache", label: "Cache", x: 80, y: 50, kind: "cache" },
        { id: "wh", label: "Warehouse", x: 76, y: 78, kind: "db" },
      ],
      edges: [
        { from: "db", to: "cdc" },
        { from: "cdc", to: "search" },
        { from: "cdc", to: "cache" },
        { from: "cdc", to: "wh" },
      ],
    },
    tradeoff: {
      axis: "Consistency ↔ Coupling",
      left: "CDC (log-based)",
      right: "Dual writes",
      consequence:
        "CDC derives all downstream updates from the DB's own log, so they can't drift from the source of truth, but it adds a streaming pipeline to operate. Dual-writing from the app is simpler but easily leaves the DB and index inconsistent on partial failure.",
    },
    recall: [
      {
        q: "CDC avoids which common bug?",
        options: [
          "Slow queries",
          "Inconsistency between the DB and derived stores from dual writes",
          "Cache eviction",
          "TLS errors",
        ],
        answer: 1,
        explain: "Deriving updates from the DB log guarantees downstream stores reflect exactly what was committed.",
      },
    ],
    memory: {
      analogy: "A newswire that broadcasts every official change as it's recorded, so everyone stays in sync from one source.",
      why: "Because keeping caches, indexes, and warehouses in sync via app-level dual writes is fragile and drifts.",
    },
    tags: ["cdc", "streaming", "kafka", "databases"],
    interactive: true,
  },
  {
    id: "object-storage",
    code: "2.16",
    beltId: "data-at-scale",
    title: "Object storage (S3-style)",
    tagline: "Infinite, cheap, durable blobs.",
    hook: "Where do you put a billion user photos, videos, and backups? Not in your database — in object storage built to hold effectively unlimited bytes.",
    tiers: {
      napkin:
        "Object storage stores files ('objects') by key in flat buckets, accessed over HTTP. It's massively scalable, durable, and cheap — but not a filesystem or database.",
      working:
        "Objects are immutable blobs with metadata; you GET/PUT by key. It offers extreme durability (many replicas across zones) and scales to exabytes, but no in-place edits, no fast listing/queries, and higher per-request latency than a disk.",
      deep: "Serve via CDN for reads; use lifecycle policies to tier to cold storage; store only pointers (keys) in your DB. Consistency is now strong for reads-after-write on major providers. Ideal for media, backups, data lakes, and static assets.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "DB holds the key; bytes live in object storage + CDN.",
      nodes: [
        { id: "app", label: "App", x: 10, y: 50, kind: "app" },
        { id: "db", label: "DB (keys)", x: 40, y: 25, kind: "db" },
        { id: "s3", label: "Object Store", x: 65, y: 65, kind: "db" },
        { id: "cdn", label: "CDN", x: 90, y: 40, kind: "cache" },
      ],
      edges: [
        { from: "app", to: "db" },
        { from: "app", to: "s3" },
        { from: "s3", to: "cdn" },
      ],
    },
    tradeoff: {
      axis: "Scale/cost ↔ Latency/queryability",
      left: "Object storage",
      right: "Database/filesystem",
      consequence:
        "Object storage is nearly infinite, durable, and cheap but has higher per-request latency and can't query or edit-in-place. A database/filesystem is fast and queryable but expensive and limited for huge blobs.",
    },
    recall: [
      {
        q: "You should store large user uploads (videos) in…",
        options: [
          "The relational database as blobs",
          "Object storage, keeping only the key in the DB",
          "The app server's memory",
          "A message queue",
        ],
        answer: 1,
        explain: "Object storage is built for cheap, durable, huge blobs; the DB just holds the reference.",
      },
    ],
    memory: {
      analogy: "A giant valet warehouse: hand over any item, get a ticket (key); the DB keeps the tickets, the warehouse keeps the stuff.",
      why: "Because databases are the wrong (expensive) place for huge binary files.",
    },
    tags: ["object-storage", "s3", "storage", "blob"],
    interactive: true,
  },
  {
    id: "search-inverted-index",
    code: "2.17",
    beltId: "data-at-scale",
    title: "Search & the inverted index",
    tagline: "Full-text search that scales.",
    hook: "'Find every document containing quantum AND computing' across 100 million docs — in 20ms. You can't scan them all, so you flip the problem inside out.",
    tiers: {
      napkin:
        "An inverted index maps each term to the list of documents containing it. Searching becomes intersecting these lists instead of scanning documents.",
      working:
        "Text is tokenized, normalized (stemming, lowercasing), and each term points to a posting list of doc ids. Queries intersect/union posting lists and rank results (TF-IDF/BM25). Engines like Elasticsearch shard the index across nodes.",
      deep: "Relevance ranking (BM25), fuzzy/typo tolerance, and near-real-time indexing are the hard parts. Combine with vector search for semantic queries (hybrid search). Trade indexing cost and storage for fast reads; updates are batched/segment-merged.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "term → posting list of docs; intersect for AND queries.",
      nodes: [
        { id: "q", label: "query", x: 8, y: 50, kind: "client" },
        { id: "tok", label: "tokenize", x: 30, y: 50, kind: "app" },
        { id: "idx", label: "inverted index", x: 58, y: 50, kind: "cache" },
        { id: "rank", label: "rank (BM25)", x: 86, y: 50, kind: "app" },
      ],
      edges: [
        { from: "q", to: "tok" },
        { from: "tok", to: "idx" },
        { from: "idx", to: "rank" },
      ],
    },
    tradeoff: {
      axis: "Query speed ↔ Index cost",
      left: "Rich inverted index",
      right: "Scan documents",
      consequence:
        "A precomputed inverted index makes full-text search near-instant but costs storage and indexing time and lags on fresh writes. Scanning documents needs no index but is impossibly slow at scale.",
    },
    recall: [
      {
        q: "An inverted index maps…",
        options: [
          "Documents → their words",
          "Each term → the documents containing it",
          "Users → sessions",
          "Keys → nodes",
        ],
        answer: 1,
        explain: "That inversion turns search into fast posting-list intersection instead of full scans.",
      },
    ],
    memory: {
      analogy: "The index at the back of a textbook: look up a word and jump straight to every page it appears on.",
      why: "Because scanning every document per query is hopeless at scale.",
    },
    tags: ["search", "inverted-index", "elasticsearch", "databases"],
    interactive: true,
  },
  {
    id: "time-series-databases",
    code: "2.18",
    beltId: "data-at-scale",
    title: "Time-series databases",
    tagline: "Built for metrics and events over time.",
    hook: "You ingest a million sensor readings per second and mostly query 'the last hour.' A general database buckles; a time-series database is built exactly for this shape.",
    tiers: {
      napkin:
        "Time-series databases (TSDBs) are optimized for timestamped, append-heavy data: metrics, logs, IoT, financial ticks — with fast time-range queries and downsampling.",
      working:
        "They exploit that data is append-only and time-ordered: columnar/compressed storage, time-based partitioning, and retention/downsampling policies (keep raw for a day, rollups for a year). Examples: Prometheus, InfluxDB, TimescaleDB.",
      deep: "Delta-of-delta and XOR compression shrink timestamps/values dramatically. High cardinality (many unique tag combinations) is the killer problem. Continuous aggregates precompute rollups. Ingest is write-optimized (LSM-like); old data is aged out automatically.",
    },
    instrument: "TradeoffLab",
    tradeoff: {
      axis: "Resolution ↔ Retention cost",
      left: "Keep raw data",
      right: "Downsample/rollup",
      consequence:
        "Keeping full-resolution data lets you drill into any past moment but storage grows enormously. Downsampling (rollups) keeps costs bounded but you lose fine detail on old data.",
    },
    recall: [
      {
        q: "A defining optimization of time-series databases is…",
        options: [
          "Random-access updates",
          "Time-partitioning + heavy compression of append-only, ordered data",
          "Strong multi-row transactions",
          "Graph traversal",
        ],
        answer: 1,
        explain: "TSDBs assume append-only, time-ordered data and compress/partition by time for fast range queries.",
      },
    ],
    memory: {
      analogy: "A flight recorder: constantly appends timestamped readings and is optimized to replay any time window.",
      why: "Because metric/IoT workloads are write-heavy, time-ordered, and queried by range — a different shape from OLTP.",
    },
    tags: ["time-series", "metrics", "databases", "iot"],
    interactive: true,
  },
  {
    id: "graph-databases",
    code: "2.19",
    beltId: "data-at-scale",
    title: "Graph databases",
    tagline: "When relationships are the data.",
    hook: "'Friends of friends who like hiking within 2 hops' — in SQL that's a nightmare of joins. In a graph database, it's a walk.",
    tiers: {
      napkin:
        "Graph databases store nodes and edges as first-class citizens, making relationship traversal fast and natural.",
      working:
        "Instead of expensive multi-way JOINs, graphs store direct pointers between connected records (index-free adjacency), so multi-hop queries stay fast. Great for social networks, recommendations, fraud rings, and knowledge graphs.",
      deep: "Query languages like Cypher/Gremlin express traversals declaratively. Scaling graphs horizontally is hard (edges cross shards), so many stay single-node or use specialized partitioning. Use them when connections and paths — not just records — are the core query.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "Traverse relationships directly, hop by hop.",
      nodes: [
        { id: "u", label: "You", x: 12, y: 50, kind: "client" },
        { id: "f1", label: "Friend", x: 42, y: 28, kind: "app" },
        { id: "f2", label: "Friend", x: 42, y: 72, kind: "app" },
        { id: "fof", label: "Friend-of-friend", x: 80, y: 50, kind: "app" },
      ],
      edges: [
        { from: "u", to: "f1" },
        { from: "u", to: "f2" },
        { from: "f1", to: "fof" },
        { from: "f2", to: "fof" },
      ],
    },
    tradeoff: {
      axis: "Relationship queries ↔ General-purpose",
      left: "Graph database",
      right: "Relational database",
      consequence:
        "Graph databases make deep multi-hop relationship queries fast and expressive but are niche and hard to scale horizontally. Relational databases are general and mature but bog down on many-hop joins.",
    },
    recall: [
      {
        q: "Graph databases outperform relational DBs specifically for…",
        options: [
          "Simple key lookups",
          "Deep, multi-hop relationship traversals",
          "Large aggregate scans",
          "Blob storage",
        ],
        answer: 1,
        explain: "Index-free adjacency makes following chains of relationships cheap, unlike repeated SQL joins.",
      },
    ],
    memory: {
      analogy: "A social map where you literally walk from person to person, instead of cross-referencing giant tables.",
      why: "Because some domains are defined by connections, and join-heavy SQL degrades badly with each hop.",
    },
    tags: ["graph", "databases", "relationships"],
    interactive: true,
  },
];
