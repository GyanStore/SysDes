import type { ModuleContent } from "@/types/content";
import FlowStage from "./FlowStage";
import NodeRing from "./NodeRing";
import LoadDial from "./LoadDial";
import CacheGrid from "./CacheGrid";
import Timeline from "./Timeline";
import TradeoffLab from "./TradeoffLab";
import LatencyLadder from "./LatencyLadder";
import EstimatorPad from "./EstimatorPad";
import MetricStrip from "./MetricStrip";
import BloomFilter from "./BloomFilter";
import PipelineFlow from "./PipelineFlow";
import Placeholder from "./Placeholder";

export default function InstrumentMount({ module, accent }: { module: ModuleContent; accent: string }) {
  const cfg = module.instrumentConfig as never;
  switch (module.instrument) {
    case "FlowStage":
      return <FlowStage config={cfg} accent={accent} />;
    case "NodeRing":
      return <NodeRing />;
    case "LoadDial":
      return <LoadDial config={cfg} accent={accent} />;
    case "CacheGrid":
      return <CacheGrid accent={accent} />;
    case "Timeline":
      return <Timeline config={cfg} accent={accent} />;
    case "TradeoffLab":
      return <TradeoffLab tradeoff={module.tradeoff} accent={accent} />;
    case "LatencyLadder":
      return <LatencyLadder accent={accent} />;
    case "EstimatorPad":
      return <EstimatorPad config={cfg} accent={accent} />;
    case "MetricStrip":
      return <MetricStrip config={cfg} accent={accent} />;
    case "BloomFilter":
      return <BloomFilter accent={accent} />;
    case "PipelineFlow":
      return <PipelineFlow config={cfg} accent={accent} />;
    default:
      return <Placeholder config={cfg} />;
  }
}
