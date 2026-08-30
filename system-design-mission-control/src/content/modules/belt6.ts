import type { ModuleContent } from "@/types/content";

export const belt6: ModuleContent[] = [
  {
    id: "ml-lifecycle",
    code: "6.1",
    beltId: "ai-systems",
    title: "The ML system lifecycle",
    tagline: "Data → train → eval → deploy → monitor → repeat.",
    hook: "The model is 5% of the system. The other 95% — data pipelines, serving, monitoring, retraining — is what actually keeps AI working in production.",
    tiers: {
      napkin:
        "An ML system is a loop: collect data, train a model, evaluate it, deploy it, monitor it in production, and retrain as the world drifts.",
      working:
        "Each stage is infrastructure: data pipelines, feature computation, training jobs, an eval/registry gate, a serving layer, and monitoring for drift. The model artifact is small; the surrounding system is the hard part.",
      deep: "Production ML fails from data issues far more than model quality: training/serving skew, feature drift, and stale labels. MLOps automates the loop with versioning (data, features, models) and continuous evaluation.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "The closed loop of a production ML system.",
      nodes: [
        { id: "d", label: "Data", x: 8, y: 50, kind: "db" },
        { id: "t", label: "Train", x: 32, y: 30, kind: "app" },
        { id: "e", label: "Eval", x: 56, y: 55, kind: "app" },
        { id: "s", label: "Serve", x: 80, y: 30, kind: "app" },
        { id: "m", label: "Monitor", x: 92, y: 65, kind: "cache" },
      ],
      edges: [
        { from: "d", to: "t" },
        { from: "t", to: "e" },
        { from: "e", to: "s" },
        { from: "s", to: "m" },
        { from: "m", to: "d" },
      ],
    },
    tradeoff: {
      axis: "Model quality ↔ System reliability",
      left: "Chase model accuracy",
      right: "Invest in the pipeline",
      consequence:
        "Optimizing the model raises benchmark accuracy but a fragile pipeline still fails in production. Investing in data/serving/monitoring makes a good-enough model reliably valuable.",
    },
    recall: [
      {
        q: "The most common cause of production ML failure is…",
        options: [
          "The model architecture",
          "Data problems: drift, skew, stale labels",
          "Slow GPUs",
          "Too much monitoring",
        ],
        answer: 1,
        explain: "Data and pipeline issues, especially training/serving skew and drift, dominate real-world ML failures.",
      },
    ],
    memory: {
      analogy: "The model is the engine; the lifecycle is the whole car, fuel system, and maintenance schedule.",
      why: "Because a great model with no pipeline, monitoring, or retraining silently rots in production.",
    },
    tags: ["ml", "mlops", "lifecycle"],
    interactive: true,
  },
  {
    id: "batch-vs-online-inference",
    code: "6.2",
    beltId: "ai-systems",
    title: "Batch vs online inference",
    tagline: "Precompute predictions, or compute on request.",
    hook: "Should you predict every user's recommendations overnight, or the instant they open the app? Freshness, cost, and latency pull in different directions.",
    tiers: {
      napkin:
        "Batch inference precomputes predictions on a schedule and stores them. Online inference computes them live per request.",
      working:
        "Batch is cheap, high-throughput, and simple but stale (predictions age until the next run). Online is fresh and reactive but needs low-latency serving infrastructure and costs more per prediction. Hybrid: precompute candidates, rank online.",
      deep: "Choose by how fast inputs change and how fresh the output must be. Batch suits stable preferences; online suits context-dependent decisions (fraud, search). Near-line (streaming) sits between.",
    },
    instrument: "TradeoffLab",
    tradeoff: {
      axis: "Freshness ↔ Cost/latency",
      left: "Online inference",
      right: "Batch inference",
      consequence:
        "Online predictions use the latest context but need low-latency infra and cost more per call. Batch is cheap and simple but serves predictions that may be hours stale.",
    },
    recall: [
      {
        q: "Fraud detection at checkout should use…",
        options: [
          "Nightly batch inference",
          "Online inference (fresh, per-transaction context)",
          "No inference",
          "Weekly retraining only",
        ],
        answer: 1,
        explain: "Fraud depends on the live transaction context, demanding low-latency online inference.",
      },
    ],
    memory: {
      analogy: "Batch = a bakery baking bread each morning; online = a chef cooking each dish to order.",
      why: "Because some predictions can be precomputed cheaply while others must reflect the current moment.",
    },
    tags: ["ml", "inference", "serving"],
    interactive: true,
  },
  {
    id: "feature-stores",
    code: "6.3",
    beltId: "ai-systems",
    title: "Feature stores & training/serving skew",
    tagline: "Compute a feature once, use it everywhere.",
    hook: "Your model was 95% accurate in training and 70% in production. The features were computed slightly differently in each place. That gap has a name: skew.",
    tiers: {
      napkin:
        "A feature store centralizes feature computation and storage so training and serving use the exact same feature values.",
      working:
        "It has an offline store (for training, historical, point-in-time correct) and an online store (low-latency, for serving). Sharing definitions eliminates training/serving skew — the #1 silent ML killer.",
      deep: "Point-in-time correctness prevents label leakage in training. The online store (Redis/DynamoDB) serves features in milliseconds. Streaming features need freshness SLAs; consistency between offline and online stores is the hard part.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "One definition feeds both training and serving.",
      nodes: [
        { id: "src", label: "Raw Data", x: 8, y: 50, kind: "db" },
        { id: "fs", label: "Feature Store", x: 40, y: 50, kind: "cache" },
        { id: "tr", label: "Training", x: 80, y: 26, kind: "app" },
        { id: "sv", label: "Serving", x: 80, y: 74, kind: "app" },
      ],
      edges: [
        { from: "src", to: "fs" },
        { from: "fs", to: "tr" },
        { from: "fs", to: "sv" },
      ],
    },
    tradeoff: {
      axis: "Freshness ↔ Consistency",
      left: "Recompute per request",
      right: "Shared precomputed store",
      consequence:
        "Recomputing features live is fresh but risks differing from training logic (skew). A shared store guarantees consistency but features may be slightly stale between updates.",
    },
    recall: [
      {
        q: "Training/serving skew happens when…",
        options: [
          "The model is too big",
          "Features are computed differently in training vs production",
          "The GPU is slow",
          "There are too many features",
        ],
        answer: 1,
        explain: "Divergent feature logic makes production inputs differ from training inputs, tanking accuracy.",
      },
    ],
    memory: {
      analogy: "A shared recipe book so the test kitchen and every restaurant cook the dish identically.",
      why: "Because if training and serving compute features differently, the model sees a different world in production.",
    },
    tags: ["ml", "features", "mlops"],
    interactive: true,
  },
  {
    id: "training-pipelines",
    code: "6.4",
    beltId: "ai-systems",
    title: "Data & training pipelines",
    tagline: "Reproducible, checkpointed, backfillable.",
    hook: "Your 3-day training run crashes at hour 60. Do you start over — or resume from a checkpoint? The pipeline's design decides.",
    tiers: {
      napkin:
        "A training pipeline turns raw data into a validated model through repeatable, versioned stages.",
      working:
        "Stages: ingest → validate → transform → train → evaluate → register. Checkpointing survives crashes; data/version tracking makes runs reproducible; backfills reprocess history when logic changes.",
      deep: "Orchestrators (Airflow, Kubeflow) manage DAGs, retries, and lineage. Data validation gates catch bad inputs early. Reproducibility requires pinning data snapshots, code, and hyperparameters together.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "A DAG with checkpoints and an eval gate.",
      nodes: [
        { id: "i", label: "Ingest", x: 6, y: 50, kind: "db" },
        { id: "v", label: "Validate", x: 30, y: 50, kind: "app" },
        { id: "t", label: "Train", x: 54, y: 30, kind: "app" },
        { id: "e", label: "Eval Gate", x: 78, y: 55, kind: "net" },
        { id: "r", label: "Registry", x: 94, y: 30, kind: "cache" },
      ],
      edges: [
        { from: "i", to: "v" },
        { from: "v", to: "t" },
        { from: "t", to: "e" },
        { from: "e", to: "r" },
      ],
    },
    tradeoff: {
      axis: "Reproducibility ↔ Iteration speed",
      left: "Fully versioned/pinned",
      right: "Fast & loose",
      consequence:
        "Pinning data, code, and params makes every run reproducible and auditable but slows experimentation. Moving fast without versioning speeds iteration but makes results impossible to reproduce or trust.",
    },
    recall: [
      {
        q: "Checkpointing during training exists to…",
        options: [
          "Improve accuracy",
          "Resume after failures without restarting from scratch",
          "Encrypt the model",
          "Reduce dataset size",
        ],
        answer: 1,
        explain: "Periodic checkpoints let a long run resume near where it crashed.",
      },
    ],
    memory: {
      analogy: "Saving your game at every level so a crash doesn't send you back to the start.",
      why: "Because training is long and expensive, and un-reproducible models can't be trusted or debugged.",
    },
    tags: ["ml", "pipelines", "mlops"],
    interactive: true,
  },
  {
    id: "model-serving-batching",
    code: "6.5",
    beltId: "ai-systems",
    title: "Model serving & dynamic batching",
    tagline: "Trade a little latency for a lot of throughput.",
    hook: "A GPU sitting idle between requests is money burning. Batch several requests together and throughput soars — but each request waits a beat. Turn the dial and watch.",
    tiers: {
      napkin:
        "Serving runs a trained model behind an API. Dynamic batching groups incoming requests to use the GPU efficiently.",
      working:
        "GPUs are far more efficient on batches than single inputs. A serving layer waits a few milliseconds to collect a batch, then runs them together — big throughput gain for a small latency cost. Add autoscaling, model versioning, and warm pools.",
      deep: "Tune max batch size and max wait time against your latency SLO. Continuous/in-flight batching (for LLMs) adds requests mid-batch. Also: quantization, GPU sharing, and request prioritization. Batching is the key throughput lever.",
    },
    instrument: "MetricStrip",
    instrumentConfig: { mode: "batching" },
    tradeoff: {
      axis: "Throughput ↔ Latency",
      left: "Large batches",
      right: "Small / no batching",
      consequence:
        "Large batches maximize GPU utilization and throughput (lower cost per request) but each request waits longer to fill the batch. Small batches minimize latency but waste expensive GPU cycles.",
    },
    recall: [
      {
        q: "Dynamic batching improves GPU serving by…",
        options: [
          "Reducing model accuracy",
          "Grouping requests so the GPU processes many at once",
          "Encrypting inputs",
          "Removing the model",
        ],
        answer: 1,
        explain: "GPUs are far more efficient per-item on batches; batching trades a little latency for large throughput gains.",
      },
    ],
    memory: {
      analogy: "An elevator waiting a few seconds to fill up instead of running for each person — far more efficient.",
      mnemonic: "Batch bigger = cheaper per request, but everyone waits for the elevator.",
      why: "Because GPUs are expensive and idle cycles between single requests waste most of their capacity.",
    },
    tags: ["ml", "serving", "gpu", "batching"],
    interactive: true,
  },
  {
    id: "gpu-economics",
    code: "6.6",
    beltId: "ai-systems",
    title: "GPU economics & optimization",
    tagline: "Quantize, distill, and fit in memory.",
    hook: "The model needs 80GB of GPU memory you don't have. Do you buy a bigger GPU — or shrink the model to fit, nearly for free?",
    tiers: {
      napkin:
        "GPUs are scarce and expensive, so we optimize models to run faster and fit in less memory: quantization, distillation, pruning.",
      working:
        "Quantization stores weights in fewer bits (FP16/INT8/INT4) — smaller, faster, minor accuracy loss. Distillation trains a small model to mimic a big one. Pruning removes redundant weights. Together they slash cost/latency.",
      deep: "Memory, not FLOPs, is often the binding constraint (weights + KV cache + activations). Bandwidth-bound vs compute-bound regimes change the right optimization. Track cost per token/request, not just accuracy.",
    },
    instrument: "TradeoffLab",
    tradeoff: {
      axis: "Accuracy ↔ Cost/speed",
      left: "Full-precision large model",
      right: "Quantized / distilled",
      consequence:
        "Full-precision large models are most accurate but expensive and slow. Quantized/distilled models cost far less and run faster with a small, often acceptable, accuracy drop.",
    },
    recall: [
      {
        q: "Quantization reduces model cost primarily by…",
        options: [
          "Adding more layers",
          "Storing weights in fewer bits (less memory, faster)",
          "Encrypting weights",
          "Increasing batch size",
        ],
        answer: 1,
        explain: "Lower-precision weights shrink memory and speed up compute, usually with minor accuracy loss.",
      },
    ],
    memory: {
      analogy: "Compressing a huge photo to a smaller file that still looks almost the same.",
      why: "Because GPU memory and cost are the real ceilings on deploying large models.",
    },
    tags: ["ml", "gpu", "quantization", "optimization"],
    interactive: true,
  },
  {
    id: "distributed-training",
    code: "6.7",
    beltId: "ai-systems",
    title: "Distributed training",
    tagline: "Data, model, pipeline & tensor parallelism.",
    hook: "The model doesn't fit on one GPU, and training on one would take a year. Split the work across a thousand GPUs — but split what, exactly?",
    tiers: {
      napkin:
        "When a model or dataset is too big for one GPU, we split training across many GPUs in different ways.",
      working:
        "Data parallelism: each GPU has a full model copy, processes different data, and syncs gradients (all-reduce). Model/tensor parallelism: split the model's layers/tensors across GPUs (for models too big to fit). Pipeline parallelism: split by stage.",
      deep: "Communication is the bottleneck: gradient sync (all-reduce) and activation passing cost bandwidth. Techniques: ZeRO/sharded optimizers, gradient accumulation, mixed precision, overlapping compute and comms. 3D parallelism combines all three.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "Data-parallel: replicas sync gradients (all-reduce).",
      nodes: [
        { id: "g1", label: "GPU 1", x: 16, y: 30, kind: "app" },
        { id: "g2", label: "GPU 2", x: 16, y: 70, kind: "app" },
        { id: "ar", label: "All-Reduce", x: 52, y: 50, kind: "net" },
        { id: "g3", label: "GPU 3", x: 86, y: 30, kind: "app" },
        { id: "g4", label: "GPU 4", x: 86, y: 70, kind: "app" },
      ],
      edges: [
        { from: "g1", to: "ar" },
        { from: "g2", to: "ar" },
        { from: "ar", to: "g3" },
        { from: "ar", to: "g4" },
      ],
    },
    tradeoff: {
      axis: "Parallelism: data ↔ model",
      left: "Data parallel",
      right: "Model/tensor parallel",
      consequence:
        "Data parallelism is simple and scales throughput but needs the full model on each GPU. Model/tensor parallelism fits models too big for one GPU but adds heavy inter-GPU communication and complexity.",
    },
    recall: [
      {
        q: "You'd use MODEL/tensor parallelism (not just data parallelism) when…",
        options: [
          "The dataset is small",
          "The model itself is too large to fit on one GPU",
          "You have one GPU",
          "Latency doesn't matter",
        ],
        answer: 1,
        explain: "Model parallelism splits a model across GPUs precisely because it won't fit on a single one.",
      },
    ],
    memory: {
      analogy: "Data-parallel = many chefs each cook a full meal from different orders; model-parallel = an assembly line where each chef does one step of every dish.",
      why: "Because frontier models exceed single-GPU memory and single-device training time by orders of magnitude.",
    },
    tags: ["ml", "training", "gpu", "parallelism", "distributed"],
    interactive: true,
  },
  {
    id: "vector-databases",
    code: "6.8",
    beltId: "ai-systems",
    deepDive: [
      "HNSW: a multi-layer navigable small-world graph → ~O(log n) search; tune M and efSearch for recall vs speed.",
      "IVF partitions vectors into clusters and probes only nprobe cells; PQ compresses vectors to fit in memory.",
      "Recall vs latency vs memory is a 3-way trade — always measure recall@k against exact search.",
      "Filtered ANN (metadata + vector) is hard: pre-filtering vs post-filtering changes both recall and cost.",
    ],
    title: "Vector databases & ANN search",
    tagline: "Find the nearest meaning, fast.",
    hook: "You have 100 million embeddings and a query vector. Comparing against all 100M is too slow. How do you find the closest few in milliseconds?",
    tiers: {
      napkin:
        "A vector database stores embeddings and finds the nearest ones to a query using approximate nearest-neighbor (ANN) search.",
      working:
        "Exact nearest-neighbor is O(N) — too slow. ANN indexes (HNSW graphs, IVF partitions, PQ compression) trade a little recall for massive speed. This powers semantic search, RAG retrieval, and recommendations.",
      deep: "HNSW builds a navigable small-world graph for logarithmic search; IVF clusters vectors and probes a few cells; PQ compresses vectors to fit memory. Tune recall vs latency vs memory. Filtering + ANN (hybrid) is a real challenge.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "Query embedding → ANN index → nearest neighbors.",
      nodes: [
        { id: "q", label: "Query Vec", x: 8, y: 50, kind: "client" },
        { id: "idx", label: "HNSW Index", x: 44, y: 50, kind: "cache" },
        { id: "store", label: "Vector Store", x: 84, y: 50, kind: "db" },
      ],
      edges: [
        { from: "q", to: "idx" },
        { from: "idx", to: "store" },
      ],
    },
    tradeoff: {
      axis: "Recall ↔ Latency/memory",
      left: "Exact search",
      right: "Approximate (ANN)",
      consequence:
        "Exact search always finds the true nearest neighbors but is O(N) and too slow at scale. ANN is orders of magnitude faster but may miss a few true neighbors (lower recall).",
    },
    recall: [
      {
        q: "ANN indexes like HNSW trade away a little ___ for huge speed.",
        options: ["Storage", "Recall (accuracy of neighbors found)", "Encryption", "Bandwidth"],
        answer: 1,
        explain: "Approximate search may miss some true neighbors (recall) in exchange for sub-linear query time.",
      },
    ],
    memory: {
      analogy: "Instead of asking everyone in the city their opinion, you ask a smartly-chosen few who are probably closest.",
      why: "Because semantic search over millions of embeddings needs sub-linear proximity search, not brute force.",
    },
    tags: ["ml", "vectors", "ann", "rag", "search"],
    interactive: true,
  },
  {
    id: "llm-serving",
    code: "6.9",
    beltId: "ai-systems",
    deepDive: [
      "KV-cache memory ≈ 2 × layers × heads × head_dim × seq_len × dtype per request — usually the binding limit.",
      "PagedAttention pages the KV cache like OS virtual memory, cutting fragmentation so more requests fit per GPU.",
      "Continuous batching adds/removes sequences every decode step, keeping the GPU near full utilization.",
      "Speculative decoding: a small draft model proposes k tokens the big model verifies in one pass (~2–3× speedup).",
    ],
    title: "LLM serving internals",
    tagline: "KV cache, continuous batching, PagedAttention.",
    hook: "An LLM generates one token at a time, re-reading everything before it. Naively, that's quadratic waste. The tricks that make it fast are pure systems design.",
    tiers: {
      napkin:
        "LLMs generate tokens sequentially. Serving them fast means reusing past computation (KV cache) and keeping the GPU busy (continuous batching).",
      working:
        "The KV cache stores attention keys/values so each new token doesn't recompute the whole sequence. Continuous (in-flight) batching adds/removes requests mid-generation to keep GPUs full. Streaming returns tokens as they're produced.",
      deep: "The KV cache dominates memory and fragments it; PagedAttention (vLLM) pages it like virtual memory to cut waste. Speculative decoding uses a small draft model to propose tokens the big model verifies in parallel. Prefill vs decode phases have different bottlenecks.",
    },
    instrument: "MetricStrip",
    instrumentConfig: { mode: "llm" },
    tradeoff: {
      axis: "Throughput ↔ Per-request latency",
      left: "Continuous batching (packed)",
      right: "One request at a time",
      consequence:
        "Continuous batching packs many concurrent generations for high GPU utilization and throughput but individual requests contend for compute. Serving one at a time gives lowest latency but wastes most of the GPU.",
    },
    recall: [
      {
        q: "The KV cache in LLM serving exists to…",
        options: [
          "Encrypt tokens",
          "Avoid recomputing attention over past tokens each step",
          "Store user data",
          "Reduce model size",
        ],
        answer: 1,
        explain: "Caching past keys/values means each new token only computes against them, not from scratch.",
      },
      {
        q: "PagedAttention (vLLM) improves serving by…",
        options: [
          "Making the model smaller",
          "Managing KV-cache memory in pages to reduce fragmentation/waste",
          "Skipping attention",
          "Using UDP",
        ],
        answer: 1,
        explain: "It pages the KV cache like OS virtual memory, packing more concurrent requests per GPU.",
      },
    ],
    memory: {
      analogy: "KV cache = keeping your notes so you don't re-read the whole book for each new sentence; PagedAttention = filing those notes in uniform pages so no shelf space is wasted.",
      why: "Because token-by-token generation is memory-bound, and these tricks are what make LLM serving affordable.",
    },
    tags: ["llm", "serving", "kv-cache", "vllm", "gpu"],
    interactive: true,
  },
  {
    id: "rag-architecture",
    code: "6.10",
    beltId: "ai-systems",
    title: "RAG architecture",
    tagline: "Ground the model in your data.",
    hook: "An LLM confidently invents a policy your company never had. RAG fixes hallucination by handing the model the real documents before it answers.",
    tiers: {
      napkin:
        "Retrieval-Augmented Generation retrieves relevant documents and feeds them to the LLM as context, so answers are grounded in real data.",
      working:
        "Pipeline: chunk documents → embed → store in a vector DB. At query time: embed the query → retrieve top-k chunks → stuff them into the prompt → generate. Cite sources; re-rank retrieved chunks for quality.",
      deep: "Quality hinges on chunking strategy, retrieval recall, and re-ranking. Advanced: hybrid (keyword + vector) search, query rewriting, and agentic/iterative retrieval. Watch context-window limits, retrieval latency, and stale indexes.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "Query → retrieve chunks → augment prompt → generate.",
      nodes: [
        { id: "q", label: "Query", x: 6, y: 50, kind: "client" },
        { id: "emb", label: "Embed", x: 28, y: 50, kind: "app" },
        { id: "vdb", label: "Vector DB", x: 52, y: 28, kind: "db" },
        { id: "llm", label: "LLM", x: 78, y: 55, kind: "app" },
        { id: "a", label: "Answer", x: 95, y: 40, kind: "client" },
      ],
      edges: [
        { from: "q", to: "emb" },
        { from: "emb", to: "vdb" },
        { from: "vdb", to: "llm" },
        { from: "llm", to: "a" },
      ],
    },
    tradeoff: {
      axis: "Context richness ↔ Cost/latency",
      left: "Retrieve many chunks",
      right: "Retrieve few chunks",
      consequence:
        "Retrieving more chunks improves the chance of grounding the answer but bloats the prompt (cost, latency) and can dilute focus. Fewer chunks are cheap and fast but risk missing key context.",
    },
    recall: [
      {
        q: "RAG primarily reduces which LLM problem?",
        options: [
          "Slow token generation",
          "Hallucination / lack of up-to-date, private knowledge",
          "GPU memory use",
          "Tokenization errors",
        ],
        answer: 1,
        explain: "By grounding generation in retrieved real documents, RAG curbs made-up answers and adds fresh/private knowledge.",
      },
    ],
    memory: {
      analogy: "An open-book exam: instead of relying on memory, the model is handed the relevant pages first.",
      why: "Because LLMs don't know your private/current data and will confidently make things up without grounding.",
    },
    tags: ["llm", "rag", "vectors", "retrieval"],
    interactive: true,
  },
  {
    id: "recommendation-systems",
    code: "6.11",
    beltId: "ai-systems",
    title: "Recommendation systems",
    tagline: "Candidate generation → ranking.",
    hook: "Netflix has 15,000 titles and 200ms to pick the perfect few for you. You can't deeply score all 15,000 — so you filter fast, then rank slow.",
    tiers: {
      napkin:
        "Recommenders work in two stages: cheaply narrow millions of items to a few hundred candidates, then expensively rank those.",
      working:
        "Candidate generation (retrieval) uses cheap methods (embeddings/ANN, collaborative filtering) to get hundreds from millions. Ranking uses a heavy model on those few hundred with rich features. Sometimes a final re-ranking for diversity/business rules.",
      deep: "Two-tower models power retrieval; gradient-boosted trees or deep models rank. Serve embeddings from a vector store, features from a feature store. Handle cold start, feedback loops, and freshness; log for training.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "Millions → hundreds (retrieve) → ranked few.",
      nodes: [
        { id: "u", label: "User", x: 8, y: 50, kind: "client" },
        { id: "cg", label: "Candidate Gen", x: 38, y: 50, kind: "cache" },
        { id: "rk", label: "Ranker", x: 70, y: 50, kind: "app" },
        { id: "out", label: "Top-N", x: 93, y: 50, kind: "client" },
      ],
      edges: [
        { from: "u", to: "cg" },
        { from: "cg", to: "rk" },
        { from: "rk", to: "out" },
      ],
    },
    tradeoff: {
      axis: "Candidate breadth ↔ Ranking cost",
      left: "Retrieve many candidates",
      right: "Retrieve few candidates",
      consequence:
        "More candidates increase the chance the best item is in the set but make ranking more expensive. Fewer candidates make ranking cheap/fast but may exclude great items before they're ever scored.",
    },
    recall: [
      {
        q: "Why do recommenders split into candidate generation + ranking?",
        options: [
          "For encryption",
          "You can't run a heavy ranking model over millions of items in real time",
          "To reduce storage",
          "To avoid embeddings",
        ],
        answer: 1,
        explain: "Cheap retrieval narrows the field so the expensive ranker only scores a few hundred items.",
      },
    ],
    memory: {
      analogy: "A hiring funnel: a quick résumé screen (retrieval) then deep interviews (ranking) for the shortlist.",
      why: "Because scoring every item with a rich model at request time is computationally impossible at scale.",
    },
    tags: ["ml", "recsys", "ranking", "retrieval"],
    interactive: true,
  },
  {
    id: "agentic-architectures",
    code: "6.12",
    beltId: "ai-systems",
    title: "Agentic architectures",
    tagline: "Plan, use tools, remember, loop.",
    hook: "One LLM call answers a question. But booking a trip needs many steps, tools, and decisions. An agent turns a model into a system that acts.",
    tiers: {
      napkin:
        "An agent uses an LLM in a loop: decide an action, use a tool, observe the result, and repeat until the goal is met.",
      working:
        "Core parts: a planner/reasoner (the LLM), tools (APIs, search, code), memory (short-term context + long-term store), and an orchestration loop. Multi-agent systems split roles (planner, worker, critic) and coordinate.",
      deep: "Challenges: error accumulation over steps, tool reliability, context-window limits (needs memory/summarization), cost/latency of many calls, and guardrails on actions. Determinism and observability are hard; add step limits, verification, and human-in-the-loop for risky actions.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "Reason → act (tool) → observe → loop.",
      nodes: [
        { id: "llm", label: "Reasoner", x: 14, y: 50, kind: "app" },
        { id: "tool", label: "Tools", x: 50, y: 26, kind: "net" },
        { id: "mem", label: "Memory", x: 50, y: 74, kind: "cache" },
        { id: "obs", label: "Observe", x: 84, y: 50, kind: "app" },
      ],
      edges: [
        { from: "llm", to: "tool" },
        { from: "tool", to: "obs" },
        { from: "obs", to: "llm" },
        { from: "llm", to: "mem" },
      ],
    },
    tradeoff: {
      axis: "Autonomy ↔ Reliability/cost",
      left: "Many autonomous steps",
      right: "Constrained / few steps",
      consequence:
        "More autonomous steps handle complex tasks but accumulate errors and cost, and are harder to control. Constraining steps (or adding human checks) is reliable and cheap but limits what the agent can accomplish.",
    },
    recall: [
      {
        q: "The defining feature of an agent (vs a single LLM call) is…",
        options: [
          "A bigger model",
          "A loop of reasoning + tool use + observation toward a goal",
          "More GPUs",
          "Encryption",
        ],
        answer: 1,
        explain: "Agents iterate: choose actions, use tools, observe results, and continue until done.",
      },
    ],
    memory: {
      analogy: "A capable assistant who makes calls, checks results, takes notes, and keeps going until the task is done.",
      why: "Because many real tasks need multiple steps, tools, and memory — beyond a single prompt-and-response.",
    },
    tags: ["llm", "agents", "tools", "orchestration"],
    interactive: true,
  },
  {
    id: "model-routing-moe",
    code: "6.13",
    beltId: "ai-systems",
    title: "Model routing, MoE & cascades",
    tagline: "Send easy work to cheap models.",
    hook: "Most queries are easy; a few are hard. Why pay frontier-model prices for 'what's 2+2'? Route each query to the cheapest model that can handle it.",
    tiers: {
      napkin:
        "Instead of one big model for everything, route each request to the right-sized model (or expert) to cut cost and latency.",
      working:
        "Model routing/cascades: try a cheap model first, escalate to a bigger one only if needed (or classify difficulty upfront). Mixture-of-Experts (MoE): one model with many expert subnetworks; a router activates only a few per token.",
      deep: "Cascades need a good confidence/verification signal to decide escalation. MoE gives large capacity at low active-compute but complicates serving (expert load balancing, memory for all experts). Both trade routing accuracy for efficiency.",
    },
    instrument: "TradeoffLab",
    tradeoff: {
      axis: "Cost/latency ↔ Quality",
      left: "Route to small model",
      right: "Always use large model",
      consequence:
        "Routing easy queries to a small model slashes cost and latency but a mis-route gives a worse answer. Always using the large model maximizes quality but is expensive and slow for trivial queries.",
    },
    recall: [
      {
        q: "In a Mixture-of-Experts model, per token the router…",
        options: [
          "Runs all experts",
          "Activates only a few experts",
          "Skips the model",
          "Retrains the model",
        ],
        answer: 1,
        explain: "MoE activates a small subset of experts per token, giving high capacity at low active compute.",
      },
    ],
    memory: {
      analogy: "A help desk: a general agent handles simple tickets and escalates only the tough ones to specialists.",
      why: "Because using max capability for every request wastes money and time when most requests are easy.",
    },
    tags: ["llm", "routing", "moe", "cost"],
    interactive: true,
  },
  {
    id: "llm-guardrails-evals",
    code: "6.14",
    beltId: "ai-systems",
    title: "LLM guardrails & evals",
    tagline: "Keep it safe; measure if it's good.",
    hook: "Your chatbot just leaked a prompt injection payload and gave harmful advice. In LLM systems, guardrails and evaluation aren't optional add-ons — they're core infrastructure.",
    tiers: {
      napkin:
        "Guardrails filter inputs and outputs for safety/policy; evals measure output quality systematically instead of by vibes.",
      working:
        "Input guardrails catch prompt injection, PII, and disallowed requests; output guardrails check for harmful/off-policy/hallucinated content. Evals use test sets, LLM-as-judge, and human review to score quality and catch regressions.",
      deep: "Evals are the CI/CD of LLM apps: version prompts/models and gate releases on eval scores. Watch judge bias, dataset drift, and adversarial inputs. Layer guardrails (classifier + rules + human) by risk; log everything for audit.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "Input guard → model → output guard.",
      nodes: [
        { id: "in", label: "Input", x: 8, y: 50, kind: "client" },
        { id: "g1", label: "Input Guard", x: 34, y: 50, kind: "net" },
        { id: "m", label: "LLM", x: 62, y: 50, kind: "app" },
        { id: "g2", label: "Output Guard", x: 90, y: 50, kind: "net" },
      ],
      edges: [
        { from: "in", to: "g1" },
        { from: "g1", to: "m" },
        { from: "m", to: "g2" },
      ],
    },
    tradeoff: {
      axis: "Safety ↔ Helpfulness/latency",
      left: "Strict guardrails",
      right: "Permissive",
      consequence:
        "Strict guardrails block harmful outputs but add latency and can over-refuse legitimate requests. Permissive settings are fast and helpful but risk unsafe or off-policy responses.",
    },
    recall: [
      {
        q: "Evals function as the ___ of LLM applications.",
        options: ["encryption", "CI/CD / regression tests", "load balancer", "cache"],
        answer: 1,
        explain: "Systematic evals gate releases and catch quality regressions, like tests in software CI/CD.",
      },
    ],
    memory: {
      analogy: "Guardrails are the safety rails on a bridge; evals are the inspection that certifies it before opening.",
      why: "Because LLM outputs are probabilistic and adversaries probe them — you must filter and measure continuously.",
    },
    tags: ["llm", "safety", "evals", "guardrails"],
    interactive: true,
  },
  {
    id: "prompt-response-caching",
    code: "6.15",
    beltId: "ai-systems",
    title: "Prompt & response caching",
    tagline: "Don't pay twice for the same tokens.",
    hook: "Every request resends the same 2,000-token system prompt, and you pay to process it every single time. What if the model could remember it?",
    tiers: {
      napkin:
        "Caching avoids recomputing or regenerating repeated LLM work — either exact responses or the expensive prompt prefix.",
      working:
        "Exact/semantic response caching returns a stored answer for identical/similar queries. Prompt (prefix) caching reuses the computed KV-cache for a shared prompt prefix across requests, cutting cost and latency dramatically.",
      deep: "Semantic caching uses embedding similarity (watch false hits). Prefix caching needs identical leading tokens; structure prompts with static content first. Combine with routing for big cost wins. Track hit rate and staleness.",
    },
    instrument: "TradeoffLab",
    tradeoff: {
      axis: "Cost savings ↔ Freshness/correctness",
      left: "Aggressive semantic cache",
      right: "Always regenerate",
      consequence:
        "Aggressive caching (especially semantic) slashes cost and latency but can return a near-match that's subtly wrong or stale. Always regenerating is always correct/fresh but pays full cost every time.",
    },
    recall: [
      {
        q: "Prompt (prefix) caching saves cost by…",
        options: [
          "Compressing the model",
          "Reusing the computed KV-cache for a shared prompt prefix",
          "Skipping the model",
          "Using a smaller GPU",
        ],
        answer: 1,
        explain: "A repeated static prefix doesn't need reprocessing — its KV-cache is reused across requests.",
      },
    ],
    memory: {
      analogy: "Keeping a boilerplate letter typed up so you only ever write the new paragraph.",
      why: "Because LLM tokens cost money and latency, and much of the prompt is repeated across requests.",
    },
    tags: ["llm", "caching", "cost", "kv-cache"],
    interactive: true,
  },
];
