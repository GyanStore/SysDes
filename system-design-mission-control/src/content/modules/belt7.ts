import type { ModuleContent } from "@/types/content";

export const belt7: ModuleContent[] = [
  {
    id: "consensus-raft",
    code: "7.1",
    beltId: "algorithms",
    deepDive: [
      "Safety rests on overlapping majority quorums — any two majorities of N share at least one node.",
      "A candidate must have an up-to-date log (last term/index) to win, which prevents losing committed entries.",
      "Randomized election timeouts (e.g., 150–300ms) make split votes rare.",
      "Linearizable reads need care: serve from the leader with a lease or a read-index, or you risk stale reads.",
    ],
    title: "Consensus & Raft",
    tagline: "How a cluster agrees on one truth.",
    hook: "Five servers must agree on the order of writes — even as some crash and messages arrive late. How do they never disagree?",
    tiers: {
      napkin:
        "Consensus lets a group of nodes agree on a single value/log despite failures. Raft does it by electing one leader that orders all writes.",
      working:
        "Raft splits into leader election and log replication. Nodes have terms; a candidate wins if it gets votes from a majority. The leader appends entries and commits once a majority has replicated them. If the leader dies, a new election picks another.",
      deep: "Safety comes from majority quorums (any two majorities overlap) and the election restriction that a candidate must have an up-to-date log. Raft trades some availability during elections for understandable, provably-safe agreement. It underpins etcd, Consul, and CockroachDB.",
    },
    instrument: "Timeline",
    instrumentConfig: {
      actors: ["Leader", "Follower 1", "Follower 2"],
      caption: "Leader replicates an entry; commits on majority ack.",
      events: [
        { t: 0, from: 0, to: 1, label: "AppendEntries" },
        { t: 0, from: 0, to: 2, label: "AppendEntries" },
        { t: 1, from: 1, to: 0, label: "ack" },
        { t: 2, from: 0, to: 0, label: "committed (majority)" },
      ],
    },
    tradeoff: {
      axis: "Consistency ↔ Availability",
      left: "Require majority",
      right: "Accept any node",
      consequence:
        "Requiring a majority to commit guarantees one consistent log but blocks writes if a majority is unreachable. Accepting any node would stay available but could split into conflicting histories.",
    },
    recall: [
      {
        q: "In Raft, an entry is committed once it's replicated to…",
        options: ["Any one follower", "A majority (quorum) of nodes", "All nodes", "The client"],
        answer: 1,
        explain: "Majority quorums overlap, so a committed entry survives any minority failure.",
      },
      {
        q: "The main role of the Raft leader is to…",
        options: ["Encrypt data", "Order and replicate all log entries", "Shard the data", "Cache reads"],
        answer: 1,
        explain: "A single elected leader serializes writes, giving every node the same ordered log.",
      },
    ],
    memory: {
      analogy: "A meeting where one elected chair records every motion; a decision counts once most members have written it down.",
      mnemonic: "Elect a leader → replicate to a majority → commit.",
      why: "Because independent nodes with crashes and delays will otherwise disagree about what happened and in what order.",
    },
    tags: ["consensus", "raft", "distributed", "algorithms"],
    interactive: true,
  },
  {
    id: "paxos-basics",
    code: "7.2",
    beltId: "algorithms",
    title: "Paxos (the idea)",
    tagline: "The original consensus algorithm.",
    hook: "Before Raft, there was Paxos — famously correct, famously hard to understand. What is it actually doing?",
    tiers: {
      napkin:
        "Paxos reaches agreement on a single value among nodes using proposers, acceptors, and majority promises — even with failures.",
      working:
        "A proposer picks a ballot number and asks acceptors to 'promise' not to accept lower ballots (prepare phase), then asks them to 'accept' its value (accept phase). A value is chosen once a majority accepts it. Multi-Paxos adds a stable leader to run many instances efficiently.",
      deep: "Paxos guarantees safety (never two different chosen values) but liveness can stall with dueling proposers. Its correctness proof is elegant but the protocol is notoriously subtle — which is exactly why Raft was designed to be more understandable while offering the same guarantees.",
    },
    instrument: "TradeoffLab",
    tradeoff: {
      axis: "Understandability ↔ Minimalism",
      left: "Raft (structured)",
      right: "Paxos (minimal)",
      consequence:
        "Raft adds structure (strong leader, terms) to be teachable and implementable. Paxos is more minimal and general but so subtle that real implementations routinely get it wrong.",
    },
    recall: [
      {
        q: "A value is 'chosen' in Paxos when…",
        options: ["One acceptor accepts it", "A majority of acceptors accept it", "The proposer decides", "All nodes vote"],
        answer: 1,
        explain: "Majority acceptance guarantees any future majority intersects it, ensuring a single chosen value.",
      },
    ],
    memory: {
      analogy: "Booking a shared resource by first getting most people to promise to hold your slot, then confirming it.",
      why: "Because it's the foundational proof that fault-tolerant agreement is possible — everything else (Raft, Zab) descends from it.",
    },
    tags: ["consensus", "paxos", "distributed", "algorithms"],
    interactive: true,
  },
  {
    id: "gossip-protocol",
    code: "7.3",
    beltId: "algorithms",
    title: "Gossip & epidemic protocols",
    tagline: "Spread state like a rumor.",
    hook: "10,000 nodes need to know which peers are alive. Asking a central registry doesn't scale. So they gossip — and the truth spreads like a virus.",
    tiers: {
      napkin:
        "In gossip, each node periodically shares what it knows with a few random peers; information spreads exponentially across the cluster.",
      working:
        "Used for membership/failure detection (SWIM), anti-entropy, and config propagation. Each round, a node picks random peers and exchanges state; convergence is O(log N) rounds. It's decentralized, robust to failures, and needs no coordinator.",
      deep: "Trade-offs: eventual (not instant) consistency and redundant messages. SWIM separates failure detection (ping/ping-req) from dissemination for scalability. Tuning fan-out and interval balances speed vs network load. Powers Cassandra, Consul, and Serf.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "State spreads node-to-node, exponentially.",
      nodes: [
        { id: "a", label: "A", x: 12, y: 50, kind: "app" },
        { id: "b", label: "B", x: 40, y: 25, kind: "app" },
        { id: "c", label: "C", x: 40, y: 75, kind: "app" },
        { id: "d", label: "D", x: 70, y: 40, kind: "app" },
        { id: "e", label: "E", x: 88, y: 65, kind: "app" },
      ],
      edges: [
        { from: "a", to: "b" },
        { from: "a", to: "c" },
        { from: "b", to: "d" },
        { from: "c", to: "e" },
      ],
    },
    tradeoff: {
      axis: "Convergence speed ↔ Network load",
      left: "High fan-out",
      right: "Low fan-out",
      consequence:
        "Gossiping to many peers per round converges fast but floods the network with redundant messages. Low fan-out is efficient but spreads information more slowly.",
    },
    recall: [
      {
        q: "Gossip protocols spread information in roughly how many rounds across N nodes?",
        options: ["O(N)", "O(log N)", "O(1)", "O(N²)"],
        answer: 1,
        explain: "Exponential spread (each round multiplies informed nodes) gives logarithmic convergence.",
      },
    ],
    memory: {
      analogy: "Office gossip: tell a couple of people, they each tell a couple more, and soon everyone knows.",
      why: "Because centralized membership doesn't scale to huge, churny clusters — decentralized spread does.",
    },
    tags: ["gossip", "membership", "distributed", "algorithms"],
    interactive: true,
  },
  {
    id: "logical-clocks",
    code: "7.4",
    beltId: "algorithms",
    title: "Logical & vector clocks",
    tagline: "Order events without a shared clock.",
    hook: "Two servers' wall clocks disagree by 50ms. So which event really happened first? Physical time can't tell you — but logical clocks can.",
    tiers: {
      napkin:
        "Lamport clocks give every event a counter that respects causality. Vector clocks track a counter per node, so you can detect truly concurrent events.",
      working:
        "Lamport: increment on each event; on receive, set to max(local, received)+1 — guarantees cause < effect, but not the reverse. Vector clocks hold one counter per node; comparing vectors tells you if events are ordered or concurrent (and thus conflicting).",
      deep: "Wall clocks drift and skew, so they can't order distributed events. Vector clocks detect conflicts in leaderless/multi-leader systems (Dynamo) but grow with node count. Hybrid Logical Clocks (HLC) combine physical + logical time for compact, causally-consistent timestamps.",
    },
    instrument: "Timeline",
    instrumentConfig: {
      actors: ["Node A", "Node B"],
      caption: "A message carries the clock; receiver takes the max + 1.",
      events: [
        { t: 0, from: 0, to: 0, label: "A: event (1)" },
        { t: 1, from: 0, to: 1, label: "send ts=1" },
        { t: 2, from: 1, to: 1, label: "B: recv → max(0,1)+1 = 2" },
      ],
    },
    tradeoff: {
      axis: "Causality detail ↔ Size",
      left: "Vector clocks",
      right: "Lamport clock",
      consequence:
        "Vector clocks detect concurrency/conflicts precisely but grow with the number of nodes. A single Lamport counter is tiny but can't tell concurrent events from ordered ones.",
    },
    recall: [
      {
        q: "What can VECTOR clocks do that a single Lamport clock cannot?",
        options: [
          "Encrypt events",
          "Detect whether two events are concurrent (unordered)",
          "Run faster",
          "Use wall-clock time",
        ],
        answer: 1,
        explain: "Per-node counters let you see when neither event causally precedes the other — a conflict.",
      },
    ],
    memory: {
      analogy: "Numbering emails in a thread so replies always come after what they reply to, even if timestamps lie.",
      mnemonic: "On receive: take the max, then add one.",
      why: "Because distributed nodes have no shared, trustworthy clock, yet causality must still be respected.",
    },
    tags: ["clocks", "causality", "distributed", "algorithms"],
    interactive: true,
  },
  {
    id: "crdts",
    code: "7.5",
    beltId: "algorithms",
    title: "CRDTs",
    tagline: "Merge conflicting edits automatically.",
    hook: "Two people edit the same doc offline, then reconnect. How do their changes merge with zero conflicts and no central server?",
    tiers: {
      napkin:
        "Conflict-free Replicated Data Types are data structures whose concurrent updates always merge to the same result, regardless of order.",
      working:
        "They rely on merges that are commutative, associative, and idempotent (a mathematical join). Examples: G-Counter (grow-only counter), OR-Set (add/remove set), LWW-Register (last-writer-wins). Every replica converges without coordination.",
      deep: "State-based CRDTs ship whole state and merge; op-based ship operations (needing reliable delivery). Costs: metadata growth (tombstones) and semantics that may surprise users (e.g., concurrent add/remove resolution). Power collaborative editors, Redis CRDTs, and offline-first apps.",
    },
    instrument: "Timeline",
    instrumentConfig: {
      actors: ["Replica A", "Replica B"],
      caption: "Concurrent edits merge to the same state.",
      events: [
        { t: 0, from: 0, to: 0, label: "A: +x" },
        { t: 0, from: 1, to: 1, label: "B: +y" },
        { t: 1, from: 0, to: 1, label: "sync" },
        { t: 2, from: 1, to: 1, label: "both = {x,y}" },
      ],
    },
    tradeoff: {
      axis: "Automatic merge ↔ Metadata cost",
      left: "CRDTs (auto-merge)",
      right: "Central coordination",
      consequence:
        "CRDTs merge concurrent edits with no coordination and work offline, but carry extra metadata (tombstones, per-replica state) and can encode surprising conflict semantics. Central coordination is simpler to reason about but needs everyone online.",
    },
    recall: [
      {
        q: "CRDT merges must be commutative, associative, and…",
        options: ["Encrypted", "Idempotent", "Sequential", "Centralized"],
        answer: 1,
        explain: "Order- and duplicate-independence is exactly what guarantees all replicas converge.",
      },
    ],
    memory: {
      analogy: "Two shopping lists that, when combined in any order, always produce the same final list.",
      why: "Because offline/multi-leader edits must reconcile automatically without a referee.",
    },
    tags: ["crdt", "consistency", "collaboration", "algorithms"],
    interactive: true,
  },
  {
    id: "merkle-trees",
    code: "7.6",
    beltId: "algorithms",
    title: "Merkle trees",
    tagline: "Find what differs without comparing everything.",
    hook: "Two replicas hold a billion records each. Which ones differ? Comparing all billion is madness — a tree of hashes finds the diff in log time.",
    tiers: {
      napkin:
        "A Merkle tree hashes data in leaves, then hashes pairs up to a single root. If two roots match, the data is identical; if not, you descend only the differing branches.",
      working:
        "To sync replicas (anti-entropy), compare roots; equal means done. Otherwise recurse into children whose hashes differ, pinpointing changed leaves in O(log n) comparisons instead of O(n).",
      deep: "Used for Dynamo/Cassandra anti-entropy repair, Git commits, blockchain blocks, and content verification. The cost is maintaining the tree on writes; the win is cheap difference detection and tamper-evidence (any change alters the root).",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "Compare roots; descend only differing branches.",
      nodes: [
        { id: "root", label: "root hash", x: 50, y: 15, kind: "net" },
        { id: "h1", label: "H(1,2)", x: 28, y: 50, kind: "cache" },
        { id: "h2", label: "H(3,4)", x: 72, y: 50, kind: "cache" },
        { id: "l1", label: "blk1", x: 16, y: 85, kind: "db" },
        { id: "l2", label: "blk2", x: 40, y: 85, kind: "db" },
        { id: "l3", label: "blk3", x: 60, y: 85, kind: "db" },
        { id: "l4", label: "blk4", x: 84, y: 85, kind: "db" },
      ],
      edges: [
        { from: "root", to: "h1" },
        { from: "root", to: "h2" },
        { from: "h1", to: "l1" },
        { from: "h1", to: "l2" },
        { from: "h2", to: "l3" },
        { from: "h2", to: "l4" },
      ],
    },
    tradeoff: {
      axis: "Sync cost ↔ Write overhead",
      left: "Maintain a Merkle tree",
      right: "Compare directly",
      consequence:
        "Maintaining the tree costs a little on every write but makes finding differences logarithmic. Comparing directly needs no upkeep but is O(n) to reconcile — infeasible at scale.",
    },
    recall: [
      {
        q: "If two Merkle roots are equal, you know…",
        options: [
          "Nothing",
          "The underlying data sets are identical",
          "Only the first block matches",
          "The data is encrypted",
        ],
        answer: 1,
        explain: "A matching root means every leaf hash (and thus all data) matches — no further comparison needed.",
      },
    ],
    memory: {
      analogy: "A family tree of fingerprints: if the top fingerprint matches, everyone below matches; if not, follow the mismatched branch down.",
      why: "Because verifying or syncing huge datasets by brute force is impossibly expensive.",
    },
    tags: ["merkle", "hashing", "replication", "algorithms"],
    interactive: true,
  },
  {
    id: "bloom-filters",
    code: "7.7",
    beltId: "algorithms",
    deepDive: [
      "False-positive rate ≈ (1 − e^(−kn/m))^k; the optimal number of hashes is k = (m/n)·ln 2.",
      "~10 bits per item with k=7 gives roughly a 1% false-positive rate — and never any false negatives.",
      "You can't delete from a plain Bloom filter (use a counting Bloom filter) or list its members.",
      "LSM-trees keep a Bloom filter per SSTable to skip disk reads for keys that are absent.",
    ],
    title: "Bloom filters",
    tagline: "\"Definitely no\" or \"probably yes\" in tiny space.",
    hook: "You want to check if a URL was already crawled — across billions of URLs — using a few megabytes. A Bloom filter says 'never seen it' with certainty, and 'maybe' the rest of the time.",
    tiers: {
      napkin:
        "A Bloom filter is a bit array plus k hash functions. Adding an item sets k bits; a query is 'maybe present' only if all k bits are set. Misses are always correct; hits can be false positives.",
      working:
        "It trades a small false-positive rate for huge space savings and O(k) lookups — no item is ever stored. You can't delete (without counting variants) and can't enumerate. Sizing m (bits) and k (hashes) sets the false-positive rate.",
      deep: "FP rate ≈ (1−e^(−kn/m))^k; optimal k ≈ (m/n)·ln2. Used in LSM-trees (skip disk reads for absent keys), CDNs, caches, and crawlers. Variants: counting Bloom (deletes), cuckoo filters (deletes + better locality).",
    },
    instrument: "BloomFilter",
    tradeoff: {
      axis: "Space ↔ False-positive rate",
      left: "Smaller filter",
      right: "Larger filter",
      consequence:
        "A smaller bit array saves memory but fills up fast, raising false positives. A larger array keeps false positives low but costs more space. You pick the point that fits your error budget.",
    },
    recall: [
      {
        q: "A Bloom filter query can return a false…",
        options: ["negative", "positive", "both", "neither"],
        answer: 1,
        explain: "If all k bits happen to be set by other items, it says 'maybe' for an absent item — a false positive. Negatives are always correct.",
      },
    ],
    memory: {
      analogy: "A guest list checked by a few quick stamps: if any stamp is missing, they're definitely not on it; if all present, they're probably on it.",
      mnemonic: "No false negatives; yes to (some) false positives.",
      why: "Because exact membership over billions of items is too big to store, but 'definitely not' is often all you need.",
    },
    tags: ["bloom-filter", "probabilistic", "algorithms"],
    interactive: true,
  },
  {
    id: "hyperloglog",
    code: "7.8",
    beltId: "algorithms",
    title: "HyperLogLog",
    tagline: "Count millions of uniques in kilobytes.",
    hook: "How many unique visitors did the site get today? Storing every id to dedupe costs gigabytes. HyperLogLog estimates it within ~2% using a few kilobytes.",
    tiers: {
      napkin:
        "HyperLogLog estimates the number of distinct items (cardinality) using the statistics of hash values — no need to store the items.",
      working:
        "It hashes each item and tracks the longest run of leading zeros seen (a rare long run implies many distinct items). Splitting into many registers and averaging (harmonic mean) tightens the estimate to a small, fixed memory footprint.",
      deep: "Standard error ≈ 1.04/√m for m registers; ~12KB gives ~2% error over billions of items. It's mergeable (union of registers), enabling distributed counting. Used in Redis PFCOUNT, analytics, and databases for APPROX_COUNT_DISTINCT.",
    },
    instrument: "TradeoffLab",
    tradeoff: {
      axis: "Accuracy ↔ Memory",
      left: "Exact count (a set)",
      right: "HyperLogLog estimate",
      consequence:
        "An exact set is perfectly accurate but grows with the number of unique items (gigabytes). HyperLogLog uses tiny fixed memory but returns an estimate with a small error.",
    },
    recall: [
      {
        q: "HyperLogLog estimates which quantity?",
        options: ["Frequency of one item", "Number of DISTINCT items (cardinality)", "The median", "Total count"],
        answer: 1,
        explain: "It approximates how many unique values a stream contains, using hash-bit statistics.",
      },
    ],
    memory: {
      analogy: "Guessing how many people are in a stadium from the rarest birthday you can find — rare coincidences imply a big crowd.",
      why: "Because exact distinct-counts require storing every id, which is prohibitively large at scale.",
    },
    tags: ["hyperloglog", "cardinality", "probabilistic", "algorithms"],
    interactive: true,
  },
  {
    id: "count-min-sketch",
    code: "7.9",
    beltId: "algorithms",
    title: "Count-Min Sketch",
    tagline: "Approximate frequencies, tiny memory.",
    hook: "Which search terms are trending right now, out of billions of queries? Counting each exactly won't fit in memory — a Count-Min Sketch estimates the hot ones cheaply.",
    tiers: {
      napkin:
        "A Count-Min Sketch estimates how often each item appears using a small 2D array of counters and several hash functions.",
      working:
        "Each item increments one counter per hash row; a query returns the minimum across its rows (min reduces collision overcounting). It never underestimates, and overestimates are bounded — perfect for finding heavy hitters in streams.",
      deep: "Error is bounded by ε·N with probability 1−δ, set by width and depth. It's mergeable and update-fast (O(d)). Used for trending topics, network traffic monitoring, and rate/anomaly detection. Pair with a heap to track top-K.",
    },
    instrument: "TradeoffLab",
    tradeoff: {
      axis: "Accuracy ↔ Memory",
      left: "Exact counters",
      right: "Count-Min Sketch",
      consequence:
        "Exact per-item counters are precise but need memory proportional to the number of distinct items. The sketch uses fixed small memory but can overestimate rare items due to hash collisions.",
    },
    recall: [
      {
        q: "A Count-Min Sketch's error is always in which direction?",
        options: ["It can under-count", "It can only over-count (never under)", "It's exact", "Random"],
        answer: 1,
        explain: "Collisions can only add to counters; taking the min across rows bounds the overestimate — it never undercounts.",
      },
    ],
    memory: {
      analogy: "Tallying votes into a few shared buckets by name-hash; the smallest bucket a name lands in is your best guess for its count.",
      why: "Because tracking exact frequencies for billions of distinct keys won't fit in memory.",
    },
    tags: ["count-min-sketch", "frequency", "probabilistic", "algorithms"],
    interactive: true,
  },
  {
    id: "skip-lists",
    code: "7.10",
    beltId: "algorithms",
    title: "Skip lists",
    tagline: "Sorted, searchable, lock-friendly.",
    hook: "You need a sorted structure with fast search and easy concurrent inserts — without the rebalancing headaches of a tree. Enter the skip list.",
    tiers: {
      napkin:
        "A skip list is a linked list with extra 'express lane' levels that let you skip ahead, giving O(log n) search, insert, and delete on average.",
      working:
        "Each node is promoted to higher levels with decreasing probability, forming a probabilistic balanced structure. Searches start high and drop down. It's simpler to implement and to make concurrent than balanced trees.",
      deep: "Expected O(log n) with high probability; no rotations needed. Redis sorted sets and many in-memory/LSM memtables use skip lists precisely because concurrent inserts avoid the global rebalancing that trees require.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "Express lanes let a search skip ahead, then drop down.",
      nodes: [
        { id: "h", label: "head", x: 8, y: 30, kind: "net" },
        { id: "a", label: "10", x: 30, y: 60, kind: "app" },
        { id: "b", label: "30", x: 55, y: 30, kind: "app" },
        { id: "c", label: "50", x: 78, y: 60, kind: "app" },
        { id: "d", label: "70", x: 94, y: 30, kind: "app" },
      ],
      edges: [
        { from: "h", to: "b" },
        { from: "b", to: "d" },
        { from: "h", to: "a" },
        { from: "a", to: "b" },
        { from: "b", to: "c" },
        { from: "c", to: "d" },
      ],
    },
    tradeoff: {
      axis: "Simplicity ↔ Worst-case guarantee",
      left: "Skip list (probabilistic)",
      right: "Balanced tree (guaranteed)",
      consequence:
        "Skip lists are simple and concurrency-friendly with expected O(log n), but their balance is probabilistic (rare bad cases). Balanced trees guarantee O(log n) but need complex rebalancing that hurts concurrent writes.",
    },
    recall: [
      {
        q: "Why do systems like Redis use skip lists over balanced trees?",
        options: [
          "They use less code AND are easier to make concurrent",
          "They are always faster",
          "They need no memory",
          "They guarantee O(1) search",
        ],
        answer: 0,
        explain: "Probabilistic levels avoid rotations, making implementation and concurrent inserts far simpler.",
      },
    ],
    memory: {
      analogy: "Express and local subway lines: ride the express to get close, then switch to the local for the exact stop.",
      why: "Because sorted, concurrent, log-time structures shouldn't require the complexity of tree rebalancing.",
    },
    tags: ["skip-list", "data-structures", "algorithms"],
    interactive: true,
  },
  {
    id: "trie",
    code: "7.11",
    beltId: "algorithms",
    title: "Tries (prefix trees)",
    tagline: "Prefix lookups in constant-ish time.",
    hook: "Autocomplete must find every word starting with 'sys' the instant you type it — across millions of terms. A trie makes that a walk down a few nodes.",
    tiers: {
      napkin:
        "A trie stores strings by shared prefixes: each node is a character, and a path from the root spells a word. Prefix lookup is O(length of prefix).",
      working:
        "Great for autocomplete, routing tables, and dictionaries. Caching the top-K completions at each node makes suggestions instant. Memory can be high, mitigated by compression (radix/Patricia tries).",
      deep: "Radix tries merge single-child chains to save space; used in IP routing (longest-prefix match) and databases. Trade memory for lookup speed and prefix operations that hashes can't do.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "Walk the path s → y → s to reach completions.",
      nodes: [
        { id: "r", label: "•", x: 8, y: 50, kind: "net" },
        { id: "s", label: "s", x: 30, y: 50, kind: "app" },
        { id: "y", label: "y", x: 52, y: 50, kind: "app" },
        { id: "s2", label: "s", x: 74, y: 35, kind: "app" },
        { id: "t", label: "t", x: 74, y: 65, kind: "app" },
        { id: "w", label: "…system", x: 94, y: 50, kind: "cache" },
      ],
      edges: [
        { from: "r", to: "s" },
        { from: "s", to: "y" },
        { from: "y", to: "s2" },
        { from: "y", to: "t" },
        { from: "t", to: "w" },
      ],
    },
    tradeoff: {
      axis: "Prefix speed ↔ Memory",
      left: "Trie",
      right: "Hash map",
      consequence:
        "A trie gives instant prefix/range queries and ordered traversal but uses more memory per node. A hash map is compact and O(1) for exact keys but can't do prefix search at all.",
    },
    recall: [
      {
        q: "A trie is the natural choice when you need…",
        options: ["Exact-key lookup only", "Prefix / autocomplete queries", "To count uniques", "To hash IDs"],
        answer: 1,
        explain: "Shared-prefix paths make 'all words starting with X' a cheap subtree walk.",
      },
    ],
    memory: {
      analogy: "A dictionary organized by spelling: flip to 'sy' and every word under it is right there.",
      why: "Because prefix and autocomplete queries are impossible with a plain hash map.",
    },
    tags: ["trie", "data-structures", "search", "algorithms"],
    interactive: true,
  },
  {
    id: "geospatial-index",
    code: "7.12",
    beltId: "algorithms",
    title: "Geospatial indexing",
    tagline: "Geohash, quadtree, R-tree.",
    hook: "'Show me drivers within 2km' over hundreds of thousands of moving points — in milliseconds. Brute force is out. Space itself becomes the index.",
    tiers: {
      napkin:
        "Geospatial indexes map 2D locations to searchable keys or trees so 'near me' queries touch only nearby data.",
      working:
        "Geohash encodes lat/long into a string where shared prefixes mean physical proximity (great for sharding). Quadtrees recursively split space into quadrants, adapting to density. R-trees group nearby objects into bounding boxes for range/overlap queries.",
      deep: "Geohash is simple and shardable but has edge-of-cell artifacts (query neighbors too). Quadtrees adapt to hotspots (fine in cities, coarse in deserts). R-trees suit rectangles/polygons. Choice depends on data distribution and query shape.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "Recursively split space; search only nearby cells.",
      nodes: [
        { id: "root", label: "region", x: 10, y: 50, kind: "net" },
        { id: "q1", label: "NW", x: 40, y: 25, kind: "cache" },
        { id: "q2", label: "NE (dense)", x: 45, y: 72, kind: "cache" },
        { id: "c1", label: "cell", x: 78, y: 55, kind: "db" },
        { id: "c2", label: "cell", x: 78, y: 88, kind: "db" },
      ],
      edges: [
        { from: "root", to: "q1" },
        { from: "root", to: "q2" },
        { from: "q2", to: "c1" },
        { from: "q2", to: "c2" },
      ],
    },
    tradeoff: {
      axis: "Uniform ↔ Adaptive",
      left: "Geohash (uniform grid)",
      right: "Quadtree (adaptive)",
      consequence:
        "A uniform geohash grid is simple and shard-friendly but wastes cells in sparse areas and overloads dense ones. A quadtree adapts to density but is more complex to maintain as points move.",
    },
    recall: [
      {
        q: "Two geohashes sharing a long common prefix are…",
        options: ["Random", "Physically close together", "Always identical", "In different countries"],
        answer: 1,
        explain: "Geohash prefixes encode nested spatial cells, so shared prefixes mean nearby locations.",
      },
    ],
    memory: {
      analogy: "Postal codes: the more leading digits two addresses share, the closer they are.",
      why: "Because proximity search over many moving points needs spatial structure, not full scans.",
    },
    tags: ["geospatial", "geohash", "quadtree", "algorithms"],
    interactive: true,
  },
  {
    id: "mapreduce",
    code: "7.13",
    beltId: "algorithms",
    title: "MapReduce & shuffle",
    tagline: "Divide, compute, combine — at petabyte scale.",
    hook: "Count word frequencies across a petabyte of text. No single machine can hold it — so you split the work across a thousand, then combine.",
    tiers: {
      napkin:
        "MapReduce processes huge data in two phases: map (transform each chunk into key-value pairs in parallel) and reduce (aggregate all values per key).",
      working:
        "Between them, a shuffle groups all values by key across the cluster. Map tasks run near their data (data locality); the framework handles retries and stragglers. It's the model behind Hadoop and the ancestor of Spark.",
      deep: "The shuffle is the expensive part (network + disk). Spark generalizes this with in-memory RDDs and DAGs, avoiding writing to disk between stages. Skewed keys cause reducer hotspots — mitigate with combiners and salting.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "map → shuffle (group by key) → reduce.",
      nodes: [
        { id: "d", label: "data", x: 6, y: 50, kind: "db" },
        { id: "m1", label: "map", x: 30, y: 30, kind: "app" },
        { id: "m2", label: "map", x: 30, y: 70, kind: "app" },
        { id: "s", label: "shuffle", x: 55, y: 50, kind: "net" },
        { id: "r1", label: "reduce", x: 82, y: 35, kind: "app" },
        { id: "r2", label: "reduce", x: 82, y: 70, kind: "app" },
      ],
      edges: [
        { from: "d", to: "m1" },
        { from: "d", to: "m2" },
        { from: "m1", to: "s" },
        { from: "m2", to: "s" },
        { from: "s", to: "r1" },
        { from: "s", to: "r2" },
      ],
    },
    tradeoff: {
      axis: "Simplicity ↔ Speed",
      left: "MapReduce (disk)",
      right: "Spark (in-memory)",
      consequence:
        "Classic MapReduce writes between stages to disk — robust and simple but slow for iterative jobs. In-memory engines like Spark are far faster but use more memory and add complexity.",
    },
    recall: [
      {
        q: "The most network- and disk-intensive phase of MapReduce is…",
        options: ["Map", "The shuffle (grouping by key)", "Reduce", "Reading input"],
        answer: 1,
        explain: "Shuffling moves all intermediate values across the cluster to group them by key.",
      },
    ],
    memory: {
      analogy: "Many clerks each tally their own stack (map), papers get sorted into per-topic piles (shuffle), then one clerk per topic totals it (reduce).",
      why: "Because petabyte datasets exceed any one machine, forcing parallel divide-and-combine.",
    },
    tags: ["mapreduce", "big-data", "spark", "algorithms"],
    interactive: true,
  },
  {
    id: "chain-replication",
    code: "7.14",
    beltId: "algorithms",
    title: "Chain replication",
    tagline: "Strong consistency with clean roles.",
    hook: "You want strongly-consistent replicas AND high read throughput. Chain replication lines the nodes up so writes flow one way and reads come from the end.",
    tiers: {
      napkin:
        "Nodes form a chain: writes enter at the head and propagate down; the tail acknowledges and serves all reads. Reading only the tail guarantees you see committed data.",
      working:
        "Because a write is acknowledged only after reaching the tail, tail reads are always consistent. Reads don't burden the write path. Failures are handled by removing a node and re-linking the chain (often coordinated by a master).",
      deep: "Variants (CRAQ) let any node serve reads while preserving consistency via versioning, boosting read throughput. Chain replication gives strong consistency with simpler reasoning than quorums, at the cost of higher write latency (must traverse the whole chain).",
    },
    instrument: "Timeline",
    instrumentConfig: {
      actors: ["Head", "Middle", "Tail"],
      caption: "Write flows head→tail; tail acks & serves reads.",
      events: [
        { t: 0, from: 0, to: 1, label: "write" },
        { t: 1, from: 1, to: 2, label: "write" },
        { t: 2, from: 2, to: 2, label: "commit + serve reads" },
      ],
    },
    tradeoff: {
      axis: "Read throughput ↔ Write latency",
      left: "Chain replication",
      right: "Leader + quorum",
      consequence:
        "Chain replication gives consistent reads from the tail and clean roles but writes must traverse the whole chain (higher latency). Leader+quorum commits faster (a majority) but read consistency needs extra care.",
    },
    recall: [
      {
        q: "In chain replication, consistent reads are served by the…",
        options: ["Head", "Any node", "Tail", "Client"],
        answer: 2,
        explain: "A write is committed only when it reaches the tail, so tail reads always reflect committed state.",
      },
    ],
    memory: {
      analogy: "An assembly line: work enters at one end, and the finished, inspected product is only handed out from the far end.",
      why: "Because it offers strong consistency with simpler roles than quorum voting.",
    },
    tags: ["replication", "consistency", "distributed", "algorithms"],
    interactive: true,
  },
];
