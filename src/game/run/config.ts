import { EMPTY_META_UPGRADES, normalizeMetaUpgrades } from "../meta";
import { UPGRADE_DEFS } from "../upgrades";
import type { DifficultyConfig, DifficultyId, RunSetup, UpgradeId } from "../types";

export const DIFFICULTY_ORDER: DifficultyId[] = ["easy", "normal", "hard"];

export const DIFFICULTY_CONFIGS: Record<DifficultyId, DifficultyConfig> = {
  easy: {
    id: "easy",
    label: "简单",
    runDuration: 300,
    bossWaves: 1,
    description: "5 分钟，1 波 Boss，适合先看手感。",
  },
  normal: {
    id: "normal",
    label: "普通",
    runDuration: 600,
    bossWaves: 2,
    description: "10 分钟，2 波 Boss，长线拉扯更明显。",
  },
  hard: {
    id: "hard",
    label: "困难",
    runDuration: 900,
    bossWaves: 3,
    description: "15 分钟，3 波 Boss，后期压力会非常高。",
  },
};

export const ALL_UPGRADE_IDS: UpgradeId[] = UPGRADE_DEFS.map((upgrade) => upgrade.id);

export const DEFAULT_RUN_SETUP: RunSetup = {
  difficultyId: "easy",
  enabledUpgrades: ALL_UPGRADE_IDS,
  metaUpgrades: EMPTY_META_UPGRADES,
};

export function getDifficultyConfig(difficultyId: DifficultyId): DifficultyConfig {
  return DIFFICULTY_CONFIGS[difficultyId];
}

export function normalizeRunSetup(setup?: Partial<RunSetup>): RunSetup {
  const selected = setup?.enabledUpgrades?.filter((upgradeId, index, array) => array.indexOf(upgradeId) === index) ?? ALL_UPGRADE_IDS;
  return {
    difficultyId: setup?.difficultyId ?? DEFAULT_RUN_SETUP.difficultyId,
    enabledUpgrades: selected.length >= 3 ? selected : ALL_UPGRADE_IDS,
    metaUpgrades: normalizeMetaUpgrades(setup?.metaUpgrades),
  };
}
