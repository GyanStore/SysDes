# Application Plan — Mission Control

> **Decisions locked (with the user):** full React scaffold · all 7 ranks in scope ·
> **Mission Control** theme (clearance ranks instead of belts). The tech recommendation
> below (Vite + React + TS + Tailwind) was the one chosen and built. "Dojo/belts" wording
> that remains in this doc maps 1:1 to "Mission Control/ranks."


How we turn the [curriculum](./CURRICULUM.md) into a website that people **enjoy** and
**remember**. Three parts: (1) the learning design, (2) the interaction & animation
toolkit, (3) the app architecture, tech, and roadmap.

---

## Part 1 — Learning design (how memory actually happens)

We lean on four evidence-backed mechanisms and bake each into the product.

| Mechanism | What it means | How the Dojo uses it |
|---|---|---|
| **Active recall** | Retrieving beats re-reading | No module is "done" by scrolling; you must rebuild a diagram, answer, or explain |
| **Spaced repetition** | Reviewing at growing intervals | A lightweight SRS resurfaces flashcards for concepts you've seen (localStorage) |
| **Dual coding** | Words + visuals together | Every concept pairs a one-line definition with a live animation + an analogy |
| **Desirable difficulty** | Struggle → retention | "Break-it" mode and predict-then-reveal moments make you commit before seeing the answer |

### The 5-beat module template
Every lesson — junior or principal — follows the same rhythm so the app feels coherent
and the brain knows what to expect:

1. **🪝 Hook (10s).** A problem with stakes and a number. *"You have 1 server and 50M
   requests just arrived. Watch it die."* — then it actually dies on screen.
2. **🎬 Animate.** The concept plays out visually, narrated in 3–5 captioned steps. The
   user controls play/pause/step; nothing auto-scrolls past them.
3. **🎮 Sandbox.** The user grabs the controls — sliders (QPS, nodes, replication factor),
   toggles (kill a server, flip consistency), dials (R/W/N). The system **reacts live**.
4. **⚖️ Trade-off.** The lesson lands on a decision, not a definition: *"You just chose
   availability over consistency. Here's who sees stale data and why that's OK for a feed
   but not a bank."* Shown as a two-ended slider.
5. **🧠 Recall.** A 2–3 question active-recall check + one flashcard added to the user's
   spaced-repetition deck. A **memory hook** (analogy + mnemonic) is pinned at the end.

### Memory hooks are first-class content, not decoration
For each concept we author: a **real-world analogy** (consistent hashing = seating guests
around a round table so adding a table only reshuffles a few), a **mnemonic** where useful
(CAP: "Pick 2, but during a Partition you really pick 1"), and a **one-sentence "why it
exists."** These are stored as structured data so they can power flashcards, search, and
the glossary.

### Progressive depth (serves 0 → 20+ yrs)
Each module has three depth tiers the reader toggles:
- **Napkin** — the shape and the one idea (a new grad or a PM gets it).
- **Working** — the moving parts and the main trade-off (the default).
- **Deep dive** — the algorithm, the failure modes, the real-world numbers (staff+).

### Gentle gamification (motivation, not manipulation)
Belts & progress on a **skill-tree map**, XP for completing beats, streaks for daily
recall, and **badges** for finishing tracks or "surviving" a chaos scenario. No dark
patterns, no lock-in, no pay-to-win — progress is the reward. All state is local.

---

## Part 2 — The interaction & animation toolkit

A shared set of reusable "instruments" so we build modules fast and they feel consistent.
This is the actual engineering leverage — most modules are compositions of these.

| Instrument | What it does | Used by |
|---|---|---|
| **FlowStage** | An architecture diagram where animated "packets" travel along edges; nodes can pulse, fail (turn red), and recover | Request lifecycle, microservices, tracing, RAG |
| **LoadDial** | A traffic knob (req/s) that drives whatever's on screen | Rate limiting, load balancing, autoscaling |
| **NodeRing** | The hash ring: add/remove nodes, drop keys, watch rebalancing | Consistent hashing, sharding, caches |
| **Timeline** | Two+ client/replica timelines showing ordering, lag, and anomalies | Consistency models, replication, vector clocks |
| **Simulator core** | A tiny deterministic discrete-event loop (tick-based) so animations are reproducible, pausable, and testable | Everything with dynamics |
| **CacheGrid** | A grid of cache slots that fills, hits, misses, and evicts | Caching, eviction algorithms |
| **TradeoffSlider** | A labeled two-ended slider that updates a live consequence readout | Every module's beat 4 |
| **BuildCanvas** | Drag components from a palette onto a canvas, connect them, get automated feedback | Case studies / interview simulator |
| **RecallCard** | Flashcard flip + spaced-repetition scheduling | Every module's beat 5 |
| **MetricStrip** | Live little charts (latency p50/p99, throughput, cost) that respond to the sandbox | Reliability, serving, cost |

**Animation principles** (from the transformer explorer's feel):
- Motion is **meaningful** — a moving dot is a real packet/request, not eye-candy.
- **User owns the clock** — play / pause / step / scrub; respects `prefers-reduced-motion`
  (fall back to step-through static frames).
- **Calm palette, glowing data** — dark instrument-panel aesthetic; color encodes state
  (blue = normal, amber = warning, red = failure, green = recovered).
- **60fps or don't animate it** — prefer CSS transforms / SVG / lightweight canvas over
  heavy DOM.

---

## Part 3 — App architecture, tech & roadmap

### Content model
Lessons are **data + a chosen instrument config**, not bespoke pages. A module is a small
structured record:
```
{ id, belt, title, hook, depthTiers{napkin,working,deep},
  instrument: "NodeRing", instrumentConfig{...},
  tradeoff{left,right,consequence}, recall[Q&A], memoryHook{analogy,mnemonic,why},
  prereqs[], tags[] }
```
This means new lessons are mostly **authoring**, not coding — and the same content feeds
the module page, the search index, the glossary, and the flashcard deck.

### Tech stack — recommendation
> **Recommended: Vite + React + TypeScript + Tailwind, with Framer Motion for UI motion,
> and SVG/Canvas + a small custom simulator core for the instruments.** React Flow for
> node-graph diagrams (FlowStage/BuildCanvas); D3 scales/shapes for data-driven bits.
> Content authored in MDX/JSON. All client-side; deployable as a static site.

Why this stack:
- Component reuse is the whole strategy (the instrument toolkit) — React fits perfectly.
- Framer Motion + SVG covers 90% of animations; canvas only where we need many particles.
- Static-site output = fast, cheap/free hosting, works offline, no backend to secure.
- TypeScript keeps the content model and simulator honest as it grows.

**Alternatives considered** (happy to switch — this is a Part-1 decision for you):
- **Astro + React islands** — better if we want top-tier SEO/marketing pages and mostly
  static content with interactive "islands." Slightly more setup for a highly interactive
  app.
- **Vanilla single-file HTML per module** (like `transformer_explorer.html`) — zero build,
  ultra-portable, matches existing work. Great for *prototyping one flagship module fast*,
  but doesn't scale to ~60 modules + shared toolkit + progress/search without a lot of
  copy-paste. **Proposed use: build the flagship in this style first (see roadmap), then
  graduate to the React app.**

### Backend? Not at first.
v1 is **fully client-side** — progress, streaks, and the SRS deck live in `localStorage`.
No accounts, no server, no PII, nothing to breach. If/when we want cross-device sync,
leaderboards, or user-authored content, we add a thin backend then (and do it properly —
auth, rate limits, parameterized queries) via the Adobe security skills.

### Security & accessibility (non-negotiable, from day one)
- Carry over the explorer's hardening: **CSP** headers, user input via `textContent`/React
  escaping (never `innerHTML`/`dangerouslySetInnerHTML` on user text), no eval.
- When any web code is written, the **`adobe-security-client`** and
  **`adobe-security-foundations`** skills are invoked (per project rules).
- **Accessibility**: keyboard-drivable sandboxes, ARIA on controls, captions on every
  animation, `prefers-reduced-motion` fallbacks, WCAG-AA contrast.

### Site structure
```
/                 Landing — the pitch + the skill-tree map
/dojo             Belt map (progress overview)
/learn/:moduleId  A module (the 5-beat experience)
/algorithms/:id   Algorithm deep-dive pages
/practice         Case-study / interview simulator (BuildCanvas)
/deck             Your spaced-repetition flashcards due today
/reference        Numbers, trade-offs, glossary (searchable)
```

### Proposed build roadmap (phased, reviewable)
- **Phase 0 — Flagship prototype (fast, self-contained).** Build **one** signature module
  end-to-end as a single hardened HTML file in the explorer's style: **Consistent Hashing
  (2.5)** — the NodeRing instrument, all 5 beats. Goal: lock the *feel* and get your
  reaction before committing to the framework. *(~1 sitting.)*
- **Phase 1 — Scaffold + design system.** Vite/React/TS/Tailwind app, theme tokens, the
  landing page + belt map, the module page shell, the content-model schema, localStorage
  progress.
- **Phase 2 — Instrument toolkit v1.** FlowStage, NodeRing, LoadDial, Timeline, the
  simulator core, TradeoffSlider, RecallCard.
- **Phase 3 — Belts 0–1 content** (~14 modules) using the toolkit. Search + glossary +
  flashcard deck live.
- **Phase 4 — Belt 2 (Data at Scale) + algorithm deep-dives.** The distributed-systems core.
- **Phase 5 — Belts 3–4** (reliability + patterns), MetricStrip, chaos "break-it" mode.
- **Phase 6 — Belt 5 practice simulator** (BuildCanvas + guided case studies).
- **Phase 7 — Belt 6 AI/ML systems track** (the differentiator).
- **Phase 8 — Polish**: gamification, onboarding, mobile/responsive pass, a11y audit,
  performance pass, optional deploy.

Each phase ends with something you can open in the browser and react to.

### Open questions for you (before we build)
1. **Tech stack**: go with the recommended Vite + React app, or start vanilla single-file
   and decide later? (I recommend: **flagship vanilla → then React**.)
2. **Scope of v1**: everything, or ship Belts 0–2 + the AI track first?
3. **Audience framing**: pure self-study, or also usable as *interview prep* (adds the
   practice simulator earlier)?
4. **Branding**: keep the "Dojo / belts" theme, or a different metaphor (levels, a city
   you build, a spaceship you scale)?
