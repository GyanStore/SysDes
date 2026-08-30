import type { ModuleContent } from "@/types/content";

/** Extensions to Belt 6 (AI / ML Systems). */
export const extAi: ModuleContent[] = [
  {
    id: "embeddings-tokenization",
    code: "6.16",
    beltId: "ai-systems",
    title: "Tokenization & embeddings",
    tagline: "Turning text into numbers the model understands.",
    hook: "An LLM doesn't see words — it sees tokens, then vectors. Get tokenization wrong and your costs, context limits, and quality all suffer.",
    tiers: {
      napkin:
        "Tokenization splits text into subword tokens; embeddings map each token (or a whole passage) to a vector capturing meaning.",
      working:
        "LLMs price and limit by tokens (~4 chars each), so token count drives cost and context budget. Embeddings place similar meanings near each other in vector space, enabling semantic search, clustering, and RAG retrieval.",
      deep: "Subword tokenizers (BPE) handle rare words; non-English and code tokenize less efficiently (more tokens). Embedding quality depends on the model and dimensionality; normalize and pick a distance metric (cosine). Cache embeddings — recomputing them is a hidden cost.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "text → tokens → embedding vector.",
      nodes: [
        { id: "t", label: "text", x: 10, y: 50, kind: "client" },
        { id: "tok", label: "tokenizer", x: 40, y: 50, kind: "app" },
        { id: "emb", label: "embedding model", x: 70, y: 50, kind: "app" },
        { id: "v", label: "vector", x: 92, y: 50, kind: "cache" },
      ],
      edges: [
        { from: "t", to: "tok" },
        { from: "tok", to: "emb" },
        { from: "emb", to: "v" },
      ],
    },
    tradeoff: {
      axis: "Embedding dim: small ↔ large",
      left: "Low-dim embeddings",
      right: "High-dim embeddings",
      consequence:
        "Low-dimensional embeddings are cheap to store and fast to search but capture less nuance. High-dimensional embeddings capture richer meaning but cost more memory and slower similarity search.",
    },
    recall: [
      {
        q: "LLM cost and context limits are measured in…",
        options: ["Characters", "Tokens", "Words", "Sentences"],
        answer: 1,
        explain: "Models process and bill by tokens (~4 chars); token count drives both cost and how much fits in context.",
      },
    ],
    memory: {
      analogy: "Tokens are the LEGO bricks of text; embeddings are GPS coordinates placing each brick's meaning on a map.",
      why: "Because everything an LLM does — cost, context, retrieval — starts with tokens and vectors.",
    },
    tags: ["llm", "embeddings", "tokenization", "vectors"],
    interactive: true,
  },
  {
    id: "model-monitoring-drift",
    code: "6.17",
    beltId: "ai-systems",
    title: "Model monitoring & drift",
    tagline: "The model that was great is silently rotting.",
    hook: "Your fraud model was 95% accurate at launch. Six months later, fraud patterns changed — and nobody noticed the model quietly got worse.",
    tiers: {
      napkin:
        "Deployed models degrade as the world changes (drift). Monitoring watches inputs, predictions, and outcomes to catch it before it hurts.",
      working:
        "Data drift = input distributions shift; concept drift = the input→output relationship changes. Monitor feature distributions, prediction distributions, and (when labels arrive) live accuracy. Alert and trigger retraining when metrics degrade.",
      deep: "Labels are often delayed, so use proxy signals (drift detectors like PSI/KL divergence, confidence, business KPIs). Watch training/serving skew and data-quality breaks upstream. Close the loop: monitor → detect → retrain → validate → redeploy.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "Serve → log predictions/outcomes → detect drift → retrain.",
      nodes: [
        { id: "m", label: "Model", x: 10, y: 50, kind: "app" },
        { id: "log", label: "Predictions log", x: 40, y: 30, kind: "cache" },
        { id: "mon", label: "Drift monitor", x: 70, y: 55, kind: "net" },
        { id: "rt", label: "Retrain", x: 92, y: 30, kind: "app" },
      ],
      edges: [
        { from: "m", to: "log" },
        { from: "log", to: "mon" },
        { from: "mon", to: "rt" },
        { from: "rt", to: "m" },
      ],
    },
    tradeoff: {
      axis: "Freshness ↔ Retraining cost/risk",
      left: "Retrain often",
      right: "Retrain rarely",
      consequence:
        "Frequent retraining keeps up with drift but costs compute and risks shipping a regression each time. Rare retraining is cheap and stable but lets accuracy silently decay as the world moves.",
    },
    recall: [
      {
        q: "'Concept drift' means…",
        options: [
          "The server clock is wrong",
          "The relationship between inputs and the correct output has changed",
          "The GPU overheated",
          "The model file is corrupt",
        ],
        answer: 1,
        explain: "Even with the same inputs, the right answer changes over time — so the old model degrades.",
      },
    ],
    memory: {
      analogy: "A map of a city that slowly goes out of date as roads change — accurate at first, misleading later.",
      why: "Because models are trained on a snapshot of a world that keeps changing.",
    },
    tags: ["ml", "monitoring", "drift", "mlops"],
    interactive: true,
  },
  {
    id: "ab-testing-bandits",
    code: "6.18",
    beltId: "ai-systems",
    title: "A/B testing & multi-armed bandits",
    tagline: "Decide what actually works — fast.",
    hook: "You have two models (or two buttons). A/B testing splits traffic 50/50 and waits weeks. A bandit shifts traffic to the winner as it learns — earning more along the way.",
    tiers: {
      napkin:
        "A/B testing compares variants with fixed traffic splits and statistical significance. Multi-armed bandits dynamically send more traffic to better-performing variants as evidence accumulates.",
      working:
        "A/B tests give clean causal answers but 'waste' traffic on the losing variant for the whole test. Bandits (epsilon-greedy, Thompson sampling) balance exploration vs exploitation, reducing regret — great for many options or short-lived content.",
      deep: "A/B is best when you need a rigorous, one-time decision; bandits when you want to maximize reward continuously. Watch peeking/p-hacking in A/B, and non-stationarity in bandits. Contextual bandits personalize by user features — a bridge to RL.",
    },
    instrument: "TradeoffLab",
    tradeoff: {
      axis: "Exploration ↔ Exploitation",
      left: "A/B (fixed split)",
      right: "Bandit (adaptive)",
      consequence:
        "A fixed A/B split gives a clean statistical verdict but keeps sending traffic to the loser for the whole test. A bandit shifts traffic to winners early (less regret) but muddies clean causal attribution.",
    },
    recall: [
      {
        q: "A multi-armed bandit improves on a fixed A/B test by…",
        options: [
          "Being simpler to analyze",
          "Shifting traffic toward better variants as it learns (less regret)",
          "Needing no data",
          "Always finding the true winner faster with certainty",
        ],
        answer: 1,
        explain: "Bandits balance exploring options and exploiting the best-so-far, reducing lost reward during the test.",
      },
    ],
    memory: {
      analogy: "A/B testing tries both slot machines equally to the end; a bandit starts feeding the one that's paying out more.",
      why: "Because you often want to both learn what's best AND earn while learning.",
    },
    tags: ["ml", "ab-testing", "bandits", "experimentation"],
    interactive: true,
  },
  {
    id: "fine-tuning-vs-rag",
    code: "6.19",
    beltId: "ai-systems",
    title: "Prompting vs RAG vs fine-tuning",
    tagline: "Three ways to make an LLM fit your task.",
    hook: "Your LLM doesn't know your company's docs and uses the wrong tone. Do you write a better prompt, retrieve the docs, or retrain the weights? Each has a very different cost.",
    tiers: {
      napkin:
        "Prompting steers behavior with instructions/examples. RAG injects your data as context at query time. Fine-tuning updates the model's weights on your examples.",
      working:
        "Prompting is instant and cheap but limited by context and reasoning. RAG grounds answers in fresh/private data without retraining (best for knowledge). Fine-tuning bakes in style, format, or narrow skills but is costly, static, and needs curated data.",
      deep: "Rule of thumb: use RAG for knowledge (facts change), fine-tuning for behavior/format (style, structured output), and prompting first for everything. They combine (fine-tune + RAG). Fine-tuning doesn't reliably add facts and can go stale; RAG keeps knowledge live.",
    },
    instrument: "TradeoffLab",
    tradeoff: {
      axis: "Knowledge freshness ↔ Behavior control",
      left: "RAG (knowledge)",
      right: "Fine-tuning (behavior)",
      consequence:
        "RAG keeps knowledge fresh and auditable without retraining but adds retrieval latency and prompt size. Fine-tuning bakes in style/format and can be cheaper per call but is static, costly to update, and poor at adding facts.",
    },
    recall: [
      {
        q: "To give an LLM up-to-date knowledge of your private docs, prefer…",
        options: ["Fine-tuning", "RAG (retrieval)", "A bigger prompt only", "Quantization"],
        answer: 1,
        explain: "RAG injects current/private data at query time; fine-tuning is poor at adding facts and goes stale.",
      },
    ],
    memory: {
      analogy: "Prompting = giving instructions; RAG = handing over the reference binder; fine-tuning = sending the worker to a training course.",
      why: "Because 'the model is wrong for my task' has three very different fixes with very different costs.",
    },
    tags: ["llm", "rag", "fine-tuning", "prompting"],
    interactive: true,
  },
  {
    id: "mlops-cicd",
    code: "6.20",
    beltId: "ai-systems",
    title: "MLOps & CI/CD for ML",
    tagline: "Ship models like software — reproducibly.",
    hook: "'It worked in the notebook.' But which data? Which code? Which hyperparameters? Without MLOps, no one can reproduce or safely redeploy your model.",
    tiers: {
      napkin:
        "MLOps applies software engineering discipline to ML: versioning data/code/models, automated training/testing pipelines, and safe, monitored deployment.",
      working:
        "Version everything (data snapshots, features, code, model artifacts). A CI/CD pipeline retrains, evaluates against a gate, registers the model, and deploys with canary + monitoring. A model registry tracks lineage and enables rollback.",
      deep: "ML CI/CD adds data/model validation to normal CI. Eval gates prevent regressions; feature stores prevent skew; monitoring closes the loop to retraining. Reproducibility = pinned data + code + params. Treat models as versioned, testable, rollback-able artifacts.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "commit → train → eval gate → registry → canary deploy.",
      nodes: [
        { id: "c", label: "commit", x: 8, y: 50, kind: "client" },
        { id: "tr", label: "train", x: 32, y: 35, kind: "app" },
        { id: "e", label: "eval gate", x: 56, y: 55, kind: "net" },
        { id: "reg", label: "registry", x: 78, y: 32, kind: "cache" },
        { id: "dep", label: "canary", x: 94, y: 60, kind: "app" },
      ],
      edges: [
        { from: "c", to: "tr" },
        { from: "tr", to: "e" },
        { from: "e", to: "reg" },
        { from: "reg", to: "dep" },
      ],
    },
    tradeoff: {
      axis: "Rigor ↔ Iteration speed",
      left: "Full MLOps pipeline",
      right: "Manual / ad-hoc",
      consequence:
        "A full pipeline (versioning, eval gates, registry, canary) makes models reproducible and safe to ship but is heavy to build and slows quick experiments. Ad-hoc training iterates fast but produces unreproducible, risky deployments.",
    },
    recall: [
      {
        q: "Reproducibility in MLOps requires pinning…",
        options: [
          "Only the code",
          "Data snapshot + code + hyperparameters together",
          "Just the model file",
          "The GPU model",
        ],
        answer: 1,
        explain: "A model is only reproducible if the exact data, code, and parameters that produced it are all versioned.",
      },
    ],
    memory: {
      analogy: "A recipe that records the exact ingredients, brand, and oven settings — so anyone recreates the same dish.",
      why: "Because un-versioned, un-tested models can't be reproduced, trusted, or safely rolled back.",
    },
    tags: ["mlops", "cicd", "ml", "reproducibility"],
    interactive: true,
  },
  {
    id: "multimodal-systems",
    code: "6.21",
    beltId: "ai-systems",
    title: "Multimodal AI systems",
    tagline: "Text, images, audio — one system.",
    hook: "A user uploads a photo and asks a question about it by voice. The system must understand image, speech, and text together — and respond. How is that wired?",
    tiers: {
      napkin:
        "Multimodal systems process and combine multiple input types (text, image, audio, video), often by mapping each into a shared representation the model can reason over.",
      working:
        "Modality-specific encoders turn images/audio into embeddings aligned with text (e.g., CLIP-style). A model fuses them to answer, caption, or generate. Serving adds preprocessing pipelines, larger payloads, and per-modality latency/cost.",
      deep: "Challenges: aligning modalities, huge/varied payloads (stream large media), and cost (image/audio tokens are expensive). Route by modality, cache encodings, and handle partial failures (fall back to text). Cross-modal retrieval powers 'search images by text'.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "Each modality is encoded, then fused for reasoning.",
      nodes: [
        { id: "img", label: "Image", x: 8, y: 28, kind: "client" },
        { id: "aud", label: "Audio", x: 8, y: 72, kind: "client" },
        { id: "enc", label: "Encoders", x: 40, y: 50, kind: "app" },
        { id: "fuse", label: "Fusion model", x: 72, y: 50, kind: "app" },
        { id: "out", label: "Answer", x: 94, y: 50, kind: "client" },
      ],
      edges: [
        { from: "img", to: "enc" },
        { from: "aud", to: "enc" },
        { from: "enc", to: "fuse" },
        { from: "fuse", to: "out" },
      ],
    },
    tradeoff: {
      axis: "Capability ↔ Cost/latency",
      left: "Rich multimodal",
      right: "Text-only",
      consequence:
        "Handling images/audio/video unlocks powerful use cases but multiplies payload size, preprocessing, latency, and per-token cost. Text-only is cheap and fast but blind to everything that isn't text.",
    },
    recall: [
      {
        q: "Multimodal models typically combine inputs by…",
        options: [
          "Ignoring all but text",
          "Encoding each modality into aligned embeddings, then fusing them",
          "Converting everything to audio",
          "Storing them in a database",
        ],
        answer: 1,
        explain: "Modality-specific encoders produce compatible vectors the model can reason over together.",
      },
    ],
    memory: {
      analogy: "A person using eyes, ears, and reading together to understand a scene — each sense feeds one brain.",
      why: "Because real tasks mix media, and unifying them needs aligned representations and heavier pipelines.",
    },
    tags: ["ai", "multimodal", "embeddings", "llm"],
    interactive: true,
  },
];
