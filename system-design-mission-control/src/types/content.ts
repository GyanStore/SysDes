/**
 * Content model for Mission Control.
 *
 * A lesson ("module") is DATA + a chosen instrument. This keeps ~60 modules
 * authorable rather than hand-coded, and lets the same record feed the module
 * page, the map, search, the glossary, and the spaced-repetition deck.
 */

/** The instruments (reusable interactive widgets) a module can mount. */
export type InstrumentKind =
  | "FlowStage" // animated packets travelling an architecture graph
  | "NodeRing" // consistent-hashing ring
  | "LoadDial" // traffic knob driving a downstream widget
  | "CacheGrid" // fill / hit / miss / evict grid
  | "Timeline" // multi-actor ordering / lag / anomalies
  | "TradeoffLab" // interactive two-ended trade-off exploration
  | "LatencyLadder" // latency numbers scaled to human time
  | "EstimatorPad" // back-of-envelope calculator
  | "MetricStrip" // live p50/p99/throughput readouts
  | "BloomFilter" // interactive probabilistic membership
  | "PipelineFlow" // animated CI/CD pipeline with gates & rollback
  | "Placeholder"; // shell for not-yet-built signature interaction

export type Depth = "napkin" | "working" | "deep";

export interface DepthTiers {
  napkin: string; // the shape + the one idea
  working: string; // the moving parts + the main trade-off (default)
  deep: string; // the algorithm, failure modes, real numbers
}

/** Optional extra bullets surfaced only in the Deep-dive tier. */
export type DeepDive = string[];

export interface Tradeoff {
  left: string; // one end of the dial
  right: string; // the other end
  axis: string; // what the dial measures, e.g. "Consistency ↔ Availability"
  consequence: string; // what the choice means in practice
}

export interface RecallQuestion {
  q: string;
  /** Multiple-choice options; index `answer` is correct. */
  options: string[];
  answer: number;
  explain: string;
}

export interface MemoryHook {
  analogy: string; // real-world metaphor
  mnemonic?: string; // optional memory device
  why: string; // one-sentence "why this exists"
}

export interface ModuleContent {
  id: string; // stable slug, e.g. "consistent-hashing"
  code: string; // curriculum code, e.g. "2.5"
  beltId: string; // which track
  title: string;
  tagline: string; // one line shown on cards
  hook: string; // beat 1 — a problem with stakes
  tiers: DepthTiers; // beat 2/3 narrative at three depths
  deepDive?: DeepDive; // extra technical bullets shown only in Deep-dive tier
  instrument: InstrumentKind; // beat 3 signature interaction
  instrumentConfig?: Record<string, unknown>;
  tradeoff: Tradeoff; // beat 4
  recall: RecallQuestion[]; // beat 5
  memory: MemoryHook; // beat 5
  prereqs?: string[]; // module ids
  tags: string[];
  /** True when the signature instrument is fully built (not a Placeholder). */
  interactive?: boolean;
  /** Cloud-track metadata (Ground Control division). */
  cloud?: "aws" | "azure" | "gcp" | "multi";
  examDomain?: string; // e.g. "SDLC automation"
}

/** Which body of knowledge a track belongs to. Undefined = "systems" (legacy). */
export type Division = "systems" | "ground-control";

export interface Belt {
  id: string;
  code: string; // "0".."6", or "G0"/"A1"... for ground-control
  rank: string; // Mission Control rank name
  name: string;
  blurb: string;
  color: string; // CSS color for the track accent
  moduleIds: string[]; // ordered
  division?: Division; // defaults to "systems"
  cloud?: "aws" | "azure" | "gcp" | "multi";
}

export interface AlgorithmCard {
  id: string;
  name: string;
  gist: string;
  usedIn: string;
  instrument: InstrumentKind;
}

export interface GlossaryEntry {
  term: string;
  definition: string;
  analogy?: string;
}
