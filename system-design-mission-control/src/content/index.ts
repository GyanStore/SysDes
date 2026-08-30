import type { ModuleContent } from "@/types/content";
import { BELTS } from "./belts";
import { belt0 } from "./modules/belt0";
import { belt1 } from "./modules/belt1";
import { belt2 } from "./modules/belt2";
import { belt3 } from "./modules/belt3";
import { belt4 } from "./modules/belt4";
import { belt5 } from "./modules/belt5";
import { belt6 } from "./modules/belt6";
import { belt7 } from "./modules/belt7";
import { belt8 } from "./modules/belt8";
import { extCore } from "./modules/ext_core";
import { extData } from "./modules/ext_data";
import { extPatternsCases } from "./modules/ext_patterns_cases";
import { extAi } from "./modules/ext_ai";

export const ALL_MODULES: ModuleContent[] = [
  ...belt0,
  ...belt1,
  ...belt2,
  ...belt3,
  ...belt4,
  ...belt5,
  ...belt6,
  ...belt7,
  ...belt8,
  ...extCore,
  ...extData,
  ...extPatternsCases,
  ...extAi,
];

const MODULE_BY_ID = new Map(ALL_MODULES.map((m) => [m.id, m]));

export function getModule(id: string): ModuleContent | undefined {
  return MODULE_BY_ID.get(id);
}

export function modulesForBelt(beltId: string): ModuleContent[] {
  const belt = BELTS.find((b) => b.id === beltId);
  if (!belt) return [];
  return belt.moduleIds.map((id) => MODULE_BY_ID.get(id)).filter((m): m is ModuleContent => !!m);
}

/** Flat ordered list following belt order — used for prev/next navigation. */
export const ORDERED_MODULES: ModuleContent[] = BELTS.flatMap((b) =>
  b.moduleIds.map((id) => MODULE_BY_ID.get(id)).filter((m): m is ModuleContent => !!m),
);

export function neighbors(id: string): { prev?: ModuleContent; next?: ModuleContent } {
  const i = ORDERED_MODULES.findIndex((m) => m.id === id);
  if (i === -1) return {};
  return {
    prev: i > 0 ? ORDERED_MODULES[i - 1] : undefined,
    next: i < ORDERED_MODULES.length - 1 ? ORDERED_MODULES[i + 1] : undefined,
  };
}

export const TOTAL_MODULES = ORDERED_MODULES.length;

export { BELTS, BELT_BY_ID } from "./belts";
