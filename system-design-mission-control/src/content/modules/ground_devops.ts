import type { ModuleContent } from "@/types/content";

export const groundDevops: ModuleContent[] = [
  {
    id: "devops-sre-culture",
    code: "G0.1",
    beltId: "devops-core",
    title: "DevOps & SRE culture",
    tagline: "CALMS, DORA metrics, error budgets.",
    hook: "Two teams ship the same app. One deploys 50×/day with fewer outages; the other deploys monthly and firefights constantly. The difference isn't tools — it's how they work.",
    tiers: {
      napkin:
        "DevOps unites dev and ops to ship faster and more safely. SRE is Google's engineering approach to reliability, using error budgets.",
      working:
        "CALMS = Culture, Automation, Lean, Measurement, Sharing. The four DORA metrics — deploy frequency, lead time, change-fail rate, MTTR — predict performance. SRE sets SLOs and spends an error budget to balance velocity vs reliability.",
      deep: "Elite performers deploy on-demand, with <1hr lead time, <5% change-fail, <1hr MTTR. Error budgets turn 'how reliable?' into a shared, spendable number: burn it fast → freeze features and stabilize. Toil (manual, repetitive work) is measured and automated away.",
    },
    instrument: "TradeoffLab",
    tradeoff: {
      axis: "Velocity ↔ Reliability",
      left: "Ship fast",
      right: "Stay stable",
      consequence:
        "Shipping fast delights users and outpaces competitors but risks incidents. Chasing perfect stability starves the roadmap. An error budget lets you spend acceptable unreliability on speed — deliberately.",
    },
    recall: [
      {
        q: "Which are the four DORA metrics?",
        options: [
          "CPU, memory, disk, network",
          "Deploy frequency, lead time, change-fail rate, MTTR",
          "Uptime, latency, cost, headcount",
          "Commits, PRs, tickets, releases",
        ],
        answer: 1,
        explain: "DORA's four keys measure both throughput (deploy freq, lead time) and stability (change-fail, MTTR).",
      },
    ],
    memory: {
      analogy: "An error budget is like a monthly data allowance — spend it on speed, but when it's gone, you throttle back to reliability.",
      mnemonic: "CALMS: Culture, Automation, Lean, Measurement, Sharing.",
      why: "Because reliability and speed are a managed trade-off, not opposing camps.",
    },
    tags: ["devops", "sre", "dora", "culture"],
    interactive: true,
  },
  {
    id: "version-control-branching",
    code: "G0.2",
    beltId: "devops-core",
    title: "Version control & branching",
    tagline: "Trunk-based vs GitFlow.",
    hook: "Your team's feature branches live for weeks, then merge in a bloodbath of conflicts. There's a reason elite teams merge to one branch, many times a day.",
    tiers: {
      napkin:
        "Git tracks changes; a branching strategy decides how work is integrated. Trunk-based development merges small changes to main frequently.",
      working:
        "GitFlow has long-lived develop/release/feature branches — structured but slow, with painful merges. Trunk-based keeps main always releasable, with short-lived branches and feature flags to hide unfinished work. Short-lived branches = fewer conflicts + true CI.",
      deep: "Long-lived branches defer integration pain, which compounds. Trunk-based + feature flags decouples deploy from release. Protect main with required checks and reviews; use tags for releases. This is a prerequisite for high deploy frequency.",
    },
    instrument: "TradeoffLab",
    tradeoff: {
      axis: "Structure ↔ Integration speed",
      left: "GitFlow (structured)",
      right: "Trunk-based (fast)",
      consequence:
        "GitFlow's ceremony suits infrequent, versioned releases but delays integration and invites merge hell. Trunk-based integrates constantly (fewer conflicts, real CI) but demands discipline and feature flags.",
    },
    recall: [
      {
        q: "Trunk-based development hides unfinished features in production using…",
        options: ["Long-lived branches", "Feature flags", "Separate repos", "Manual QA"],
        answer: 1,
        explain: "Feature flags let incomplete code merge to main safely and be toggled on later — decoupling deploy from release.",
      },
    ],
    memory: {
      analogy: "Merging daily is like doing the dishes after each meal; long branches are letting them pile up for a month.",
      why: "Because integration pain grows non-linearly the longer branches diverge.",
    },
    tags: ["git", "branching", "devops"],
    interactive: true,
  },
  {
    id: "continuous-integration",
    code: "G0.3",
    beltId: "devops-core",
    title: "Continuous Integration",
    tagline: "Every commit, built and tested automatically.",
    hook: "A commit lands. Within minutes, it's compiled, unit-tested, linted, scanned, and either green or blocked — before a human even looks. That automated gate is CI.",
    tiers: {
      napkin:
        "CI automatically builds and tests every change, catching breakage early instead of at release.",
      working:
        "A pipeline runs on each push: install → build → test → lint/scan → produce an artifact. Fast feedback (minutes) keeps main releasable. Cache dependencies, parallelize/shard tests, and fail fast to keep it quick.",
      deep: "Flaky tests and slow pipelines are CI killers — quarantine flakes, budget pipeline time, and run heavy suites on a schedule. Required status checks block merges. The build artifact produced here is what CD later deploys (build once, promote everywhere).",
    },
    instrument: "PipelineFlow",
    instrumentConfig: {
      stages: ["Commit", "Build", "Test", "Scan", "Artifact"],
      failAt: 2,
      caption: "Each commit runs the gates automatically.",
    },
    tradeoff: {
      axis: "Thoroughness ↔ Feedback speed",
      left: "Run everything",
      right: "Fast subset",
      consequence:
        "Running the full test/scan suite on every commit maximizes confidence but slows feedback and frustrates developers. A fast subset keeps CI snappy but may let issues through to later stages.",
    },
    recall: [
      {
        q: "The 'build once, promote everywhere' principle means…",
        options: [
          "Rebuild for each environment",
          "Produce one artifact in CI and deploy that same artifact to every environment",
          "Only build in production",
          "Skip building",
        ],
        answer: 1,
        explain: "Deploying the identical artifact you tested avoids 'works in staging, breaks in prod' from rebuild drift.",
      },
    ],
    memory: {
      analogy: "A factory QA line that inspects every item as it's made, not just the final shipment.",
      why: "Because catching a break at commit time is minutes of work; catching it at release is a crisis.",
    },
    tags: ["ci", "pipelines", "testing", "devops"],
    interactive: true,
  },
  {
    id: "continuous-delivery",
    code: "G0.4",
    beltId: "devops-core",
    title: "Continuous Delivery & release strategies",
    tagline: "Blue-green, canary, rolling, flags.",
    hook: "Your artifact passed every test. Now push it to a million users — without downtime, and with an instant undo if it misbehaves.",
    tiers: {
      napkin:
        "Continuous Delivery keeps every build deployable and automates the path to production. Release strategies control how the new version reaches users.",
      working:
        "Rolling replaces instances gradually. Blue-green swaps between two environments (instant rollback). Canary sends a small % of traffic first and watches metrics. Feature flags decouple deploy from release and enable kill switches.",
      deep: "Continuous Deployment goes further — every green build auto-ships. Automate rollback on SLO burn; use expand/contract migrations so old and new code coexist. Progressive delivery (canary + automated analysis) is the modern default.",
    },
    instrument: "TradeoffLab",
    tradeoff: {
      axis: "Rollback speed ↔ Cost",
      left: "Blue-green (instant undo)",
      right: "Rolling (cheap)",
      consequence:
        "Blue-green gives instant rollback by keeping a full second environment — but doubles infra during deploys. Rolling updates are resource-efficient but roll back more slowly, exposing more users to a bad release.",
    },
    recall: [
      {
        q: "A canary release reduces risk by…",
        options: [
          "Deploying to everyone at once",
          "Routing a small % of traffic to the new version and watching metrics first",
          "Skipping tests",
          "Rebuilding the artifact",
        ],
        answer: 1,
        explain: "Validating on a small live slice catches regressions before they reach the whole user base.",
      },
    ],
    memory: {
      analogy: "Blue-green is two identical stages — perform on one, flip the spotlight instantly if it flops.",
      why: "Because the risky moment isn't building software, it's exposing it to real users.",
    },
    tags: ["cd", "deployment", "canary", "devops"],
    interactive: true,
  },
  {
    id: "infrastructure-as-code",
    code: "G0.5",
    beltId: "devops-core",
    title: "Infrastructure as Code",
    tagline: "Terraform: plan, apply, state, drift.",
    hook: "'It works because Dave clicked some things in the console 8 months ago.' Nobody knows what, or how to rebuild it. IaC makes infrastructure a versioned, reviewable file.",
    tiers: {
      napkin:
        "Infrastructure as Code defines servers, networks, and services in declarative files you version, review, and apply repeatably.",
      working:
        "Declarative tools (Terraform) describe the desired end state; the tool computes a plan (diff) and applies it. State tracks what exists. Modules make infra reusable. No more manual console clicks or snowflake servers.",
      deep: "State is the source of truth and the main footgun — store it remotely with locking (S3+DynamoDB), never edit by hand. Drift = reality diverging from code; detect and reconcile it. Plan/review/apply in CI (GitOps for infra). Immutable > in-place changes.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "code → plan (diff) → apply → real cloud resources.",
      nodes: [
        { id: "code", label: "IaC code", x: 8, y: 50, kind: "client" },
        { id: "plan", label: "plan (diff)", x: 34, y: 50, kind: "app" },
        { id: "state", label: "state", x: 60, y: 26, kind: "db" },
        { id: "cloud", label: "cloud", x: 88, y: 55, kind: "net" },
      ],
      edges: [
        { from: "code", to: "plan" },
        { from: "plan", to: "state" },
        { from: "plan", to: "cloud" },
      ],
    },
    tradeoff: {
      axis: "Repeatability ↔ Flexibility",
      left: "Everything as code",
      right: "Manual tweaks",
      consequence:
        "Managing all infra as code makes it reproducible, reviewable, and disaster-recoverable but is rigid and upfront-heavy. Manual console tweaks are fast but create undocumented drift and unrepeatable 'snowflake' systems.",
    },
    recall: [
      {
        q: "In Terraform, 'drift' means…",
        options: [
          "The code is slow",
          "Real infrastructure has diverged from what the code/state describes",
          "The state file is encrypted",
          "A failed apply",
        ],
        answer: 1,
        explain: "Manual changes (or external events) make reality differ from code — detect and reconcile it.",
      },
    ],
    memory: {
      analogy: "A blueprint you can re-run to rebuild the whole house identically — vs remembering which walls you moved by hand.",
      why: "Because click-ops infrastructure is undocumented, unrepeatable, and impossible to recover after disaster.",
    },
    tags: ["iac", "terraform", "devops"],
    interactive: true,
  },
  {
    id: "configuration-management",
    code: "G0.6",
    beltId: "devops-core",
    title: "Config management & immutable infra",
    tagline: "Cattle, not pets.",
    hook: "One server has been patched, tweaked, and hand-fixed for years. Nobody dares reboot it. That's a 'pet' — and it's a liability.",
    tiers: {
      napkin:
        "Configuration management keeps servers in a known, consistent state. Immutable infrastructure replaces servers instead of modifying them.",
      working:
        "Tools like Ansible apply idempotent config (running twice = same result). Immutable infra bakes a golden image and deploys fresh instances per release — no in-place drift. 'Cattle not pets': servers are disposable and identical.",
      deep: "Mutable, long-lived servers accumulate config drift and become irreproducible. Immutable + IaC means every change is a new, tested image; rollback = redeploy the old image. Combine with autoscaling for self-healing fleets.",
    },
    instrument: "TradeoffLab",
    tradeoff: {
      axis: "In-place ↔ Replace",
      left: "Mutable (patch in place)",
      right: "Immutable (replace)",
      consequence:
        "Patching servers in place is quick and preserves local state but accumulates drift and 'works-on-that-box' bugs. Immutable replacement guarantees consistency and easy rollback but requires image pipelines and externalized state.",
    },
    recall: [
      {
        q: "'Cattle, not pets' captures which idea?",
        options: [
          "Name every server",
          "Treat servers as disposable and identical, not hand-maintained",
          "Use bigger machines",
          "Avoid automation",
        ],
        answer: 1,
        explain: "Disposable, reproducible instances replace lovingly hand-tuned, irreplaceable servers.",
      },
    ],
    memory: {
      analogy: "Pets you nurse back to health; cattle you replace. Servers should be cattle.",
      why: "Because hand-maintained servers drift into unique, unrecoverable states.",
    },
    tags: ["config", "ansible", "immutable", "devops"],
    interactive: true,
  },
  {
    id: "containers-docker",
    code: "G0.7",
    beltId: "devops-core",
    title: "Containers & Docker",
    tagline: "Ship the app with its whole environment.",
    hook: "'Works on my machine' dies the day you ship the machine with the app. That's a container.",
    tiers: {
      napkin:
        "A container packages an app with its dependencies into a portable image that runs identically anywhere.",
      working:
        "A Dockerfile builds layered images (cached per instruction); images live in a registry; containers are running instances sharing the host kernel (lighter than VMs). Multi-stage builds keep images small; scan them for vulnerabilities.",
      deep: "Layers are content-addressed and cached — order Dockerfile steps least-to-most-changing. Run as non-root, use minimal base images (distroless/alpine), pin versions, and scan (Trivy). Images are immutable artifacts — the unit CD deploys.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "Dockerfile → image (layers) → registry → running container.",
      nodes: [
        { id: "df", label: "Dockerfile", x: 8, y: 50, kind: "client" },
        { id: "img", label: "image", x: 36, y: 50, kind: "cache" },
        { id: "reg", label: "registry", x: 64, y: 28, kind: "db" },
        { id: "run", label: "container", x: 90, y: 55, kind: "app" },
      ],
      edges: [
        { from: "df", to: "img" },
        { from: "img", to: "reg" },
        { from: "reg", to: "run" },
      ],
    },
    tradeoff: {
      axis: "Image size ↔ Convenience",
      left: "Minimal (distroless)",
      right: "Full base image",
      consequence:
        "Minimal base images are fast to pull and have a tiny attack surface but lack shells/tools for debugging. Full images are convenient and debuggable but bigger, slower, and expose more vulnerabilities.",
    },
    recall: [
      {
        q: "Containers are lighter than VMs mainly because they…",
        options: [
          "Use less code",
          "Share the host OS kernel instead of running a full guest OS",
          "Have no dependencies",
          "Run only on Linux",
        ],
        answer: 1,
        explain: "Containers virtualize at the OS level (shared kernel), avoiding a full guest OS per instance.",
      },
    ],
    memory: {
      analogy: "A shipping container: standardized on the outside, your exact cargo inside, moves on any ship or truck.",
      why: "Because environment differences ('works on my machine') are a top source of deploy failures.",
    },
    tags: ["docker", "containers", "devops"],
    interactive: true,
  },
  {
    id: "kubernetes-core",
    code: "G0.8",
    beltId: "devops-core",
    title: "Kubernetes: the core objects",
    tagline: "Pods, deployments, services, ingress.",
    hook: "You have 200 containers across 30 machines. When one dies, something must notice and replace it; when traffic spikes, something must add more. That orchestrator is Kubernetes.",
    tiers: {
      napkin:
        "Kubernetes runs containers across a cluster, keeping the actual state matching your declared desired state.",
      working:
        "A Pod wraps container(s); a Deployment manages a replica set and rolling updates; a Service gives stable networking/load-balancing to pods; Ingress routes external HTTP in. You declare desired state; controllers reconcile continuously.",
      deep: "The control loop (observe → diff → act) is the heart of k8s. ConfigMaps/Secrets inject config; namespaces isolate; probes (liveness/readiness) drive self-healing and safe rollouts. Everything is a declarative API object reconciled by controllers.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "Ingress → Service → Pods (managed by a Deployment).",
      nodes: [
        { id: "in", label: "Ingress", x: 8, y: 50, kind: "net" },
        { id: "svc", label: "Service", x: 36, y: 50, kind: "net" },
        { id: "p1", label: "Pod", x: 72, y: 26, kind: "app" },
        { id: "p2", label: "Pod", x: 76, y: 55, kind: "app" },
        { id: "p3", label: "Pod", x: 72, y: 84, kind: "app" },
      ],
      edges: [
        { from: "in", to: "svc" },
        { from: "svc", to: "p1" },
        { from: "svc", to: "p2" },
        { from: "svc", to: "p3" },
      ],
    },
    tradeoff: {
      axis: "Power ↔ Complexity",
      left: "Kubernetes",
      right: "Simpler PaaS/serverless",
      consequence:
        "Kubernetes gives portable, powerful orchestration and self-healing but is complex to operate and easy to misconfigure. A managed PaaS/serverless is far simpler but less flexible and can lock you in.",
    },
    recall: [
      {
        q: "The Kubernetes control loop continuously…",
        options: [
          "Encrypts traffic",
          "Reconciles actual state toward declared desired state",
          "Builds images",
          "Rotates secrets",
        ],
        answer: 1,
        explain: "Controllers observe actual vs desired and act to close the gap — the essence of k8s.",
      },
    ],
    memory: {
      analogy: "A thermostat for your fleet: you set the target, it constantly adjusts to hit it.",
      why: "Because manually keeping hundreds of containers healthy across machines is impossible.",
    },
    tags: ["kubernetes", "orchestration", "containers", "devops"],
    interactive: true,
  },
  {
    id: "kubernetes-scaling",
    code: "G0.9",
    beltId: "devops-core",
    title: "Kubernetes: scaling & self-healing",
    tagline: "HPA, cluster autoscaler, rollouts.",
    hook: "Traffic triples at 8pm. Pods should multiply automatically; if there aren't enough machines, more should appear — then vanish when the rush ends.",
    tiers: {
      napkin:
        "Kubernetes scales pods (Horizontal Pod Autoscaler) based on load, and adds/removes nodes (Cluster Autoscaler) to fit them.",
      working:
        "HPA scales replicas on CPU/memory/custom metrics; VPA right-sizes requests; the Cluster Autoscaler grows/shrinks the node pool. Readiness probes gate traffic during rollouts; failed rollouts auto-halt.",
      deep: "Set sensible resource requests/limits or scaling misbehaves. Scale on the metric that reflects real load (often custom/queue depth, not CPU). Combine with PodDisruptionBudgets for safe maintenance and rolling updates for zero-downtime deploys.",
    },
    instrument: "LoadDial",
    instrumentConfig: { mode: "balance" },
    tradeoff: {
      axis: "Responsiveness ↔ Cost/stability",
      left: "Aggressive autoscaling",
      right: "Fixed capacity",
      consequence:
        "Aggressive autoscaling tracks demand closely and saves cost at idle but can thrash and cold-start under spikes. Fixed over-provisioned capacity is stable and instant but wastes money most of the time.",
    },
    recall: [
      {
        q: "The Horizontal Pod Autoscaler adjusts…",
        options: ["Node size", "The number of pod replicas based on metrics", "The container image", "The namespace"],
        answer: 1,
        explain: "HPA changes replica count to match load; the Cluster Autoscaler then adjusts nodes to fit the pods.",
      },
    ],
    memory: {
      analogy: "Opening more checkout lanes as the queue grows, and closing them when it shrinks.",
      why: "Because demand is spiky, and matching capacity to it automatically saves money and prevents overload.",
    },
    tags: ["kubernetes", "autoscaling", "devops"],
    interactive: true,
  },
  {
    id: "gitops",
    code: "G0.10",
    beltId: "devops-core",
    title: "GitOps",
    tagline: "Git is the source of truth; the cluster syncs to it.",
    hook: "What if your production state was always exactly what's in a Git repo — and any manual change was automatically reverted?",
    tiers: {
      napkin:
        "GitOps declares desired infra/app state in Git; an agent in the cluster continuously syncs reality to match.",
      working:
        "Instead of a pipeline pushing to the cluster, an in-cluster operator (Argo CD/Flux) pulls the Git state and reconciles. Deploys = merge a PR; rollbacks = revert a commit. Drift is auto-corrected. Git is the audit log.",
      deep: "Pull-based deploys keep cluster credentials inside the cluster (more secure than pushing). You get a full audit trail, easy rollback, and drift detection for free. Separate config repos from app repos; use environments as folders/branches.",
    },
    instrument: "FlowStage",
    instrumentConfig: {
      caption: "Git (desired) → operator pulls → reconciles cluster.",
      nodes: [
        { id: "git", label: "Git repo", x: 8, y: 50, kind: "db" },
        { id: "op", label: "GitOps operator", x: 42, y: 50, kind: "net" },
        { id: "cl", label: "Cluster", x: 82, y: 50, kind: "app" },
      ],
      edges: [
        { from: "git", to: "op" },
        { from: "op", to: "cl" },
        { from: "cl", to: "op" },
      ],
    },
    tradeoff: {
      axis: "Control ↔ Setup cost",
      left: "GitOps (pull)",
      right: "Push pipelines",
      consequence:
        "GitOps gives auditability, auto-rollback, and drift correction with in-cluster credentials, but adds an operator and repo structure to manage. Push pipelines are simpler to start but scatter credentials and lack automatic drift correction.",
    },
    recall: [
      {
        q: "In GitOps, how do you roll back a bad deploy?",
        options: ["SSH into servers", "Revert the Git commit", "Delete the cluster", "Edit the database"],
        answer: 1,
        explain: "Git is the source of truth, so reverting the commit makes the operator reconcile back to the good state.",
      },
    ],
    memory: {
      analogy: "A thermostat that reads its target from a shared, version-controlled note — change the note, the room follows.",
      why: "Because Git-as-truth gives you audit, rollback, and drift correction almost for free.",
    },
    tags: ["gitops", "argocd", "kubernetes", "devops"],
    interactive: true,
  },
  {
    id: "observability-slo",
    code: "G0.11",
    beltId: "devops-core",
    title: "Observability & SLOs",
    tagline: "Measure reliability; spend an error budget.",
    hook: "Your dashboard is all green, but users are complaining. You're monitoring the wrong things. Observability + SLOs fix what you measure and how you act on it.",
    tiers: {
      napkin:
        "Observability = logs, metrics, and traces to understand production. An SLO is a target for a user-facing metric (an SLI); the gap to 100% is your error budget.",
      working:
        "Pick SLIs users feel (latency, availability, error rate), set SLOs (e.g., 99.9%), and alert on error-budget burn — not raw CPU. OpenTelemetry standardizes instrumentation; Prometheus/Grafana store and visualize.",
      deep: "Alert on symptoms (SLO burn rate), not causes, to cut noise. A fast burn rate = page now; slow burn = ticket. Error budget policy: burn it → freeze features and fix reliability. High-cardinality data is costly — sample traces, aggregate metrics.",
    },
    instrument: "EstimatorPad",
    instrumentConfig: { mode: "nines" },
    tradeoff: {
      axis: "Alert sensitivity ↔ Noise",
      left: "Alert on everything",
      right: "Alert on SLO burn only",
      consequence:
        "Alerting on every metric spike catches issues early but drowns on-call in noise and causes fatigue. Alerting only on error-budget burn is quiet and user-focused but may miss slow-brewing internal problems.",
    },
    recall: [
      {
        q: "You should alert primarily on…",
        options: [
          "CPU usage",
          "Symptoms users feel (SLO/error-budget burn)",
          "Number of pods",
          "Disk temperature",
        ],
        answer: 1,
        explain: "Symptom-based alerting on SLO burn reduces noise and pages only when users are actually affected.",
      },
    ],
    memory: {
      analogy: "Watch the patient's vital signs (what they feel), not just the hospital's electricity meter.",
      why: "Because internal metrics can look fine while users suffer — measure the experience.",
    },
    tags: ["observability", "slo", "monitoring", "devops"],
    interactive: true,
  },
  {
    id: "incident-management",
    code: "G0.12",
    beltId: "devops-core",
    title: "Incident management & postmortems",
    tagline: "Detect, mitigate, learn — blamelessly.",
    hook: "It's 2am, prod is down, and three people are typing over each other in Slack. A good incident process turns chaos into a calm, fast recovery.",
    tiers: {
      napkin:
        "Incident management is the process to detect, coordinate, mitigate, and learn from outages, minimizing MTTR.",
      working:
        "Clear roles (incident commander, comms, ops), severity levels, runbooks, and a status page. Mitigate first (roll back, failover) — root-cause later. Afterward, a blameless postmortem finds systemic causes and action items.",
      deep: "Blameless culture surfaces the truth (humans err; systems should be resilient). Track MTTR/MTTD; automate detection and common remediations. Action items must be owned and closed, or the same incident recurs. Practice with game days.",
    },
    instrument: "Timeline",
    instrumentConfig: {
      actors: ["Monitoring", "On-call", "System"],
      caption: "Detect → page → mitigate → recover → postmortem.",
      events: [
        { t: 0, from: 0, to: 1, label: "alert (SLO burn)" },
        { t: 1, from: 1, to: 2, label: "mitigate (roll back)" },
        { t: 2, from: 2, to: 1, label: "recovered" },
        { t: 3, from: 1, to: 1, label: "blameless postmortem" },
      ],
    },
    tradeoff: {
      axis: "Mitigate now ↔ Diagnose first",
      left: "Restore service fast",
      right: "Find root cause first",
      consequence:
        "Mitigating first (rollback/failover) restores users fastest but may hide the root cause temporarily. Diagnosing before acting nails the cause but prolongs the outage — usually the wrong call during a live incident.",
    },
    recall: [
      {
        q: "A blameless postmortem focuses on…",
        options: [
          "Who caused it",
          "Systemic causes and preventive action items",
          "Punishment",
          "Hiding the incident",
        ],
        answer: 1,
        explain: "Removing blame surfaces honest detail and drives fixes to the system, not the person.",
      },
    ],
    memory: {
      analogy: "Aviation crash investigations: no blame, just relentless learning so it never happens again.",
      why: "Because fear hides the truth, and outages recur unless the system (not the person) is fixed.",
    },
    tags: ["incident", "postmortem", "sre", "devops"],
    interactive: true,
  },
  {
    id: "devsecops-supply-chain",
    code: "G0.13",
    beltId: "devops-core",
    title: "DevSecOps & supply chain",
    tagline: "Shift security left; secure the pipeline.",
    hook: "A popular npm package gets hijacked overnight, and thousands of builds ship malware. Your CI/CD pipeline is now an attack surface — so secure it like one.",
    tiers: {
      napkin:
        "DevSecOps builds security into the pipeline: scan code and dependencies early ('shift left') and secure the software supply chain.",
      working:
        "SAST scans source, DAST tests running apps, dependency/container scanning catches known CVEs, and secret scanning stops leaked keys. An SBOM lists every component; signing/provenance (SLSA, Sigstore) proves what you shipped is what you built.",
      deep: "Supply-chain attacks target dependencies and build systems — pin versions, verify signatures, use least-privilege CI runners, and generate/verify SBOMs. Fail the build on critical CVEs and leaked secrets. Security is a pipeline gate, not a final audit.",
    },
    instrument: "PipelineFlow",
    instrumentConfig: {
      stages: ["Commit", "SAST", "Dep scan", "Build", "Sign+SBOM", "Deploy"],
      failAt: 2,
      caption: "Security gates run inside the pipeline.",
    },
    tradeoff: {
      axis: "Security ↔ Build speed",
      left: "Block on any finding",
      right: "Warn only",
      consequence:
        "Failing the build on any vulnerability is safest but slows delivery and can block on false positives. Warning-only keeps velocity but lets real risks ship — tune gates by severity.",
    },
    recall: [
      {
        q: "An SBOM (software bill of materials) is used to…",
        options: [
          "Speed up builds",
          "Inventory every component so you can find/patch vulnerable ones fast",
          "Encrypt the pipeline",
          "Replace testing",
        ],
        answer: 1,
        explain: "When the next Log4j hits, an SBOM tells you instantly whether and where you're affected.",
      },
    ],
    memory: {
      analogy: "An ingredients label on your software — so when a recipe is recalled, you know if your dish is affected.",
      why: "Because modern apps are 80%+ third-party code, and the build pipeline is a prime target.",
    },
    tags: ["devsecops", "security", "supply-chain", "devops"],
    interactive: true,
  },
  {
    id: "finops-cost",
    code: "G0.14",
    beltId: "devops-core",
    title: "FinOps & cost optimization",
    tagline: "Make cost a first-class metric.",
    hook: "The cloud bill doubled and nobody knows why. In the cloud, every architecture decision is also a spending decision.",
    tiers: {
      napkin:
        "FinOps brings financial accountability to cloud spend: tag resources, set budgets, and right-size continuously.",
      working:
        "Tag everything for cost attribution; alert on budget anomalies; right-size over-provisioned resources; use spot/preemptible for fault-tolerant work and committed-use/reserved discounts for steady load; delete idle resources.",
      deep: "The biggest wins: kill idle/zombie resources, right-size, and pick the correct pricing model (spot vs on-demand vs committed). Autoscaling and serverless align cost to demand. Make engineers see the cost of their choices (showback/chargeback).",
    },
    instrument: "TradeoffLab",
    tradeoff: {
      axis: "Cost ↔ Reliability/flexibility",
      left: "Spot / committed",
      right: "On-demand",
      consequence:
        "Spot instances and committed-use discounts slash cost but spot can be reclaimed anytime and commitments reduce flexibility. On-demand is reliable and flexible but the most expensive per hour.",
    },
    recall: [
      {
        q: "Spot / preemptible instances are best for…",
        options: [
          "Databases and stateful leaders",
          "Fault-tolerant, interruptible batch/stateless work",
          "The primary web server",
          "Payment processing",
        ],
        answer: 1,
        explain: "They're cheap but can be reclaimed anytime, so use them only where interruption is safe.",
      },
    ],
    memory: {
      analogy: "Cloud cost is a utility meter that runs whether or not anyone's home — turn off the lights.",
      why: "Because cloud spend scales with usage and sloppiness, and is invisible until the bill arrives.",
    },
    tags: ["finops", "cost", "devops"],
    interactive: true,
  },
  {
    id: "reliability-autoscaling-dr",
    code: "G0.15",
    beltId: "devops-core",
    title: "Reliability, autoscaling & DR",
    tagline: "Self-healing, elastic, disaster-ready.",
    hook: "A whole datacenter goes dark during your biggest sale. Do you lose everything — or does traffic quietly shift to another region while autoscaling absorbs the surge?",
    tiers: {
      napkin:
        "Reliable systems scale automatically with demand, heal from failures, and recover from disasters within defined objectives.",
      working:
        "Autoscaling matches capacity to load; health checks + redundancy give self-healing; multi-AZ/region + backups provide DR with targets (RTO = recovery time, RPO = data-loss window). Test failover regularly.",
      deep: "Combine horizontal autoscaling, load balancing, and health-based replacement for self-healing fleets. DR strategies range from backup-restore (cheap, slow) to active-active multi-region (fast, costly). Untested DR usually fails — run game days.",
    },
    instrument: "LoadDial",
    instrumentConfig: { mode: "scaling" },
    tradeoff: {
      axis: "Recovery speed ↔ Cost",
      left: "Active-active multi-region",
      right: "Backup & restore",
      consequence:
        "Active-active gives near-zero RTO/RPO but doubles infrastructure and adds cross-region consistency complexity. Backup-and-restore is cheap but means hours of downtime and lost recent data.",
    },
    recall: [
      {
        q: "RTO vs RPO: RPO measures…",
        options: [
          "How fast you recover",
          "How much recent data you can afford to lose",
          "The number of replicas",
          "The alert threshold",
        ],
        answer: 1,
        explain: "RPO = acceptable data-loss window (driven by backup/replication frequency); RTO = acceptable downtime.",
      },
    ],
    memory: {
      analogy: "A building with a backup generator (self-healing) and a second office across town (DR).",
      why: "Because failures and disasters are inevitable, so recovery must be designed and rehearsed.",
    },
    tags: ["reliability", "autoscaling", "dr", "devops"],
    interactive: true,
  },
];
