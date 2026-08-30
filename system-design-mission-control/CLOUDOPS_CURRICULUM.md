# Ground Control — Cloud, DevOps & LLMOps (Certification Division)

> A new division inside Mission Control: master **DevOps** and **LLMOps** across
> **AWS · Azure · GCP**, mapped to the **expert-level cloud certifications** — taught the
> same way as the rest of the platform (watch it move → drive it → trade-offs → recall),
> plus real exam-prep tooling (blueprint coverage, timed mock exams, cross-cloud cheat-sheets).

**Status:** 🟡 Planning — awaiting approval before build.

If Mission Control's existing division is about **designing** systems, this new **Ground
Control** division is about **operating** them in production, at scale, on real clouds — up
to the hardest professional certifications.

---

## 1. Theme & how it fits the platform

- Reuses the exact content model + 5-beat lesson format + instrument toolkit already built.
- Themed to match "Mission Control": **Ground Control** = operations; each cloud is a
  **launch platform**; each certification is a **flight rating** you earn.
- The Mission Map gains a **Division switch** (Systems ⟷ Ground Control) so the two bodies
  of knowledge stay navigable without one giant list.

### Ranks (tracks) in this division
| Code | Rank (theme) | Track | Certifications targeted |
|---|---|---|---|
| G0 | Operations Cadet | **DevOps Core** (cloud-agnostic) | Shared body of knowledge behind every DevOps cert |
| G1 | Ops Specialist · LLMOps | **LLMOps** (cloud-agnostic + GenAI services) | AI/GenAI operations; feeds cloud AI certs |
| A | Flight Rating: AWS | **AWS track** | AWS DevOps Engineer – Professional (**DOP-C02**); touches SA Pro & AI/ML |
| Z | Flight Rating: Azure | **Azure track** | Azure DevOps Engineer Expert (**AZ-400**) + Solutions Architect Expert (**AZ-305**) |
| C | Flight Rating: GCP | **GCP track** | Google **Professional Cloud DevOps Engineer** (+ Cloud Architect) |

> ⚠️ Cert blueprints change. Exact domain names/weights and service features will be
> **validated against the current official exam guides at build time** for each track.

---

## 2. Track G0 — DevOps Core (cloud-agnostic)
*The concepts every DevOps cert assumes. Learn once, apply on any cloud.*

1. What is DevOps & SRE — culture (CALMS), **DORA metrics** (lead time, deploy freq, MTTR, change-fail rate)
2. Version control & branching — Git internals, trunk-based vs GitFlow, PR/review flow
3. Continuous Integration — build/test automation, pipeline design, caching, matrix builds
4. Continuous Delivery/Deployment — release strategies (blue-green, canary, rolling, feature flags)
5. Infrastructure as Code — declarative vs imperative, **Terraform** (state, modules, drift, plan/apply)
6. Configuration management — Ansible, idempotency, mutable vs **immutable infrastructure**
7. Containers — Docker images, layers, multi-stage builds, registries, image security/scanning
8. Kubernetes I — pods, deployments, services, ingress, config/secrets, namespaces
9. Kubernetes II — scaling (HPA/VPA/cluster autoscaler), operators/CRDs, Helm, rollouts
10. GitOps — pull-based delivery (Argo CD / Flux), drift reconciliation
11. Observability — the 3 pillars, **SLI/SLO/error budgets**, Prometheus/Grafana/OpenTelemetry
12. Incident management & on-call — runbooks, sev levels, blameless **postmortems**, MTTR
13. DevSecOps — shift-left, SAST/DAST, **software supply chain** (SBOM, SLSA), secrets management
14. Artifact & dependency management — registries, versioning, provenance
15. FinOps & cost — tagging, budgets, rightsizing, spot/committed use
16. Reliability engineering — capacity planning, autoscaling, chaos, DR (RTO/RPO)

---

## 3. Track G1 — LLMOps
*Operating LLM/GenAI systems in production — the newest, most in-demand ops discipline.*

1. LLMOps lifecycle & maturity — how it differs from MLOps/DevOps
2. Prompt engineering & **prompt management/versioning** (prompts as versioned artifacts)
3. RAG in production — ingestion, chunking, embeddings, **vector DB ops**, retrieval eval, freshness
4. Fine-tuning & adaptation pipelines — LoRA/PEFT, data curation, when to fine-tune vs RAG
5. Model & artifact registry — versioning models, prompts, datasets, eval sets; lineage
6. Inference serving & scaling — batching, **GPU autoscaling**, quantization, KV-cache, cold starts
7. LLM observability — tracing, **token/cost metrics**, latency, quality/feedback capture
8. Evaluation in production — offline eval sets, **LLM-as-judge**, online A/B, canary for models
9. Guardrails & safety — prompt injection, PII redaction, content filters, jailbreak defense
10. Cost & performance optimization — model routing, prompt/response caching, **GenAI FinOps**
11. CI/CD for LLM apps — prompt/eval **regression gates**, dataset versioning, promotion flow
12. Agentic systems in production — tools, memory, orchestration, reliability, cost control
13. Data pipelines for GenAI — collection, labeling, PII handling, feedback loops
14. Governance & responsible AI — audit, model cards, **EU AI Act**, compliance, red-teaming
15. Per-cloud GenAI platforms (bridges into the cloud tracks):
    - **AWS Bedrock** (+ SageMaker JumpStart, Agents, Knowledge Bases, Guardrails)
    - **Azure OpenAI / AI Foundry** (+ Azure ML, Prompt Flow, content safety)
    - **GCP Vertex AI** (Model Garden, Gemini, Pipelines, Agent Builder)

---

## 4. Track A — AWS (DevOps Engineer – Professional, DOP-C02)
*Organized by the exam's domains so coverage maps 1:1 to the blueprint.*

- **Foundations you need first:** IAM (roles/policies/STS), VPC & networking, EC2, S3, RDS/DynamoDB, regions/AZs
- **Domain 1 · SDLC automation:** CodePipeline, CodeBuild, CodeDeploy, CodeArtifact, CodeCommit/Git; testing & artifact promotion
- **Domain 2 · Config mgmt & IaC:** CloudFormation, CDK, SAM, Systems Manager, AppConfig, Elastic Beanstalk/OpsWorks
- **Domain 3 · Resilient cloud solutions:** Auto Scaling, ELB, Route 53, multi-AZ/region, backup & DR
- **Domain 4 · Monitoring & logging:** CloudWatch (metrics/alarms/logs), X-Ray, CloudTrail, EventBridge
- **Domain 5 · Incident & event response:** automated remediation (SSM, Lambda, EventBridge), operational events
- **Domain 6 · Security & compliance:** IAM advanced, KMS, Secrets Manager, Config, GuardDuty, Security Hub, Inspector
- **Containers & serverless:** ECS, EKS, Fargate, Lambda, ECR
- **AWS for LLMOps:** Bedrock, SageMaker, Bedrock Guardrails/Agents/Knowledge Bases

## 5. Track Z — Azure (DevOps Engineer Expert AZ-400 + Architect AZ-305)
- **Foundations:** Entra ID (RBAC/identities), resource groups/subscriptions, VNets, Storage, Azure SQL/Cosmos DB
- **Dev process & source control:** Azure Repos + GitHub, branching, PR policies
- **Build & release pipelines:** Azure Pipelines + GitHub Actions, environments, approvals/gates
- **IaC:** ARM/**Bicep**, Terraform on Azure, deployment stacks
- **Compute & containers:** App Service, **AKS**, Container Apps, Functions, ACR
- **Config & release safety:** deployment slots, **App Configuration** feature flags, release gates
- **Observability:** Azure Monitor, **Application Insights**, Log Analytics (**KQL**)
- **Security & governance:** Key Vault, Managed Identities, **Defender for Cloud**, Azure Policy, Blueprints
- **Reliability/architecture (AZ-305):** availability zones, Front Door/Traffic Manager, backup/ASR, Well-Architected
- **Azure for LLMOps:** Azure OpenAI, AI Foundry, Prompt Flow, Azure ML, Content Safety

## 6. Track C — GCP (Professional Cloud DevOps Engineer + Architect)
- **Foundations:** IAM & org/projects, VPC, Compute Engine, Cloud Storage, Cloud SQL/Firestore/Spanner
- **SRE culture (Google's origin):** SLOs/error budgets, toil reduction, incident response
- **CI/CD:** Cloud Build, **Artifact Registry**, Cloud Deploy, Skaffold
- **IaC:** Terraform, Config Connector, Infrastructure Manager
- **Compute & containers:** **GKE** (Autopilot/Standard), Cloud Run, Cloud Functions
- **Observability (Cloud Operations suite):** Cloud Monitoring, Logging, Trace, Profiler, Error Reporting
- **Security:** IAM, KMS, Secret Manager, **Binary Authorization**, Security Command Center
- **Reliability & performance:** autoscaling, multi-region, load balancing, troubleshooting
- **GCP for LLMOps:** **Vertex AI** (Model Garden, Gemini, Pipelines, Model Registry, Agent Builder)

---

## 7. Cross-cloud tools (shared, high value)
- **Rosetta Stone** — an interactive equivalents table: *S3 ↔ Blob Storage ↔ Cloud Storage*,
  *EKS ↔ AKS ↔ GKE*, *CloudFormation ↔ Bicep/ARM ↔ Deployment Manager*, *CloudWatch ↔
  Azure Monitor ↔ Cloud Monitoring*, *Bedrock ↔ Azure OpenAI ↔ Vertex AI*, etc.
- **Service decision guides** — "pick a workload → recommended service" per cloud
  (compute: VM vs containers vs serverless; data store selection; etc.).
- **Cheat-sheets** — the numbers/limits/CLI that certs love, per cloud.

## 8. Exam-prep features (new, for the cert tracks)
- **Blueprint coverage map** per cert — every exam domain with its weight, showing which
  modules cover it and your readiness %.
- **Timed mock-exam simulator** — domain-weighted multiple-choice, exam-length, scored with a
  per-domain breakdown and "review weak areas" links. (Reuses/extends the quiz + SRS engine.)
- **Spaced-repetition deck** (already built) auto-loaded with cert facts (services, limits).
- **"Exam-style" question mode** — scenario questions (the hard kind), not just definitions.

---

## 9. What we build (engineering)

### Content-model additions (small, backward-compatible)
- `division?: "systems" | "ground-control"` on belts, to power the division switch.
- Cert metadata on modules: `examDomain?`, `domainWeight?`, `cloud?: "aws"|"azure"|"gcp"|"multi"`, `serviceTags?`.
- A `certs` registry: each cert's domains + weights + which modules map to them.
- Optional `examQuestions` bank (scenario MCQs) for the mock-exam simulator.

### New instruments (reusing patterns we have)
- **PipelineFlow** — animated CI/CD pipeline (commit→build→test→deploy, gates, a failed stage & rollback). *(FlowStage/Timeline variant.)*
- **CloudCompare / RosettaTable** — interactive cross-cloud + decision tables. *(TradeoffLab/table variant.)*
- **ExamSim** — timed, domain-weighted mock exam with scoring. *(RecallCard/quiz engine extended.)*
- **BlueprintMap** — a cert's domains with coverage/readiness bars. *(MetricStrip/data-driven.)*
- Reuse as-is: FlowStage (cloud architectures), Timeline (deploys/incidents), TradeoffLab
  (service trade-offs), MetricStrip (SLOs/cost), EstimatorPad (cost/capacity).

### Pedagogy (same 5 beats, tuned for certs)
Hook (a real prod scenario) → Animate (the pipeline/architecture) → Sandbox (drive it) →
Trade-off (the exam's favorite "which service / which strategy") → Recall (exam-style Q +
flashcard). Deep-dive tier carries the exam-critical details (limits, gotchas, service picks).

---

## 10. Proposed roadmap (phased, reviewable)
- **Phase 0 — Scaffold the division:** division switch on the Mission Map, cert registry +
  blueprint map, content-model fields.
- **Phase 1 — DevOps Core (G0):** the cloud-agnostic foundation (~16 modules) + PipelineFlow.
- **Phase 2 — LLMOps (G1):** the differentiator (~15 modules).
- **Phase 3 — First cloud track (your pick)** end-to-end, cert-aligned, + mock-exam simulator + Rosetta Stone.
- **Phase 4 — Second & third clouds** (reuse the pattern; mostly authoring).
- **Phase 5 — Exam polish:** full mock exams per cert, readiness dashboards, scenario banks.

Each phase ends with something runnable in the browser.

---

## 11. Open questions (to finalize before building)
1. **Cloud scope / order:** build all three (AWS + Azure + GCP), or start with **one** first? Which?
2. **Cert focus:** DevOps-expert certs only, or also **Architect** (SA Pro / AZ-305 / PCA) and **AI/ML** certs (AWS ML Engineer, AI-102, Google PMLE)?
3. **Exam simulator:** include the **timed mock-exam** + blueprint readiness now, or defer to a later phase?
4. **Emphasis:** weight more toward **hands-on concepts** (pipelines, IaC, k8s) or toward **exam drilling** (question banks, memorization aids)? (Default: both, concepts first.)
