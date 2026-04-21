import { DEFAULT_PLAYER_SKIN_ID, EMPTY_META_UPGRADES, PLAYER_SKIN_DEFS, normalizeMetaUpgrades } from "../meta";
import { getRunDurationForBossWaves } from "../stages";
import { UPGRADE_DEFS } from "../upgrades";
import type { DifficultyConfig, DifficultyId, PlayerSkinId, RunSetup, UpgradeId } from "../types";

export const DIFFICULTY_ORDER: DifficultyId[] = ["easy", "normal", "hard"];

export const DIFFICULTY_CONFIGS: Record<DifficultyId, DifficultyConfig> = {
  easy: {
    id: "easy",
    label: "简单",
    runDuration: getRunDurationForBossWaves(1),
    bossWaves: 1,
    description: "4 分钟，1 波 Boss，敌人维持基础强度。",
    hpMultiplier: 1,
    damageMultiplier: 1,
    speedMultiplier: 1,
    goldenEggDropChance: 0.002,
  },
  normal: {
    id: "normal",
    label: "普通",
    runDuration: getRunDurationForBossWaves(2),
    bossWaves: 2,
    description: "7 分钟，2 波 Boss，怪物生命和伤害 1.5 倍，速度 1.1 倍。",
    hpMultiplier: 1.5,
    damageMultiplier: 1.5,
    speedMultiplier: 1.1,
    goldenEggDropChance: 0.002,
  },
  hard: {
    id: "hard",
    label: "困难",
    runDuration: getRunDurationForBossWaves(3),
    bossWaves: 3,
    description: "10 分钟，3 波 Boss，怪物生命和伤害 2 倍，速度 1.2 倍。",
    hpMultiplier: 2,
    damageMultiplier: 2,
    speedMultiplier: 1.2,
    goldenEggDropChance: 0.002,
  },
};

export const ALL_UPGRADE_IDS: UpgradeId[] = UPGRADE_DEFS.map((upgrade) => upgrade.id);

export const DEFAULT_RUN_SETUP: RunSetup = {
  difficultyId: "easy",
  enabledUpgrades: ALL_UPGRADE_IDS,
  metaUpgrades: EMPTY_META_UPGRADES,
  selectedSkinId: DEFAULT_PLAYER_SKIN_ID,
};

function isPlayerSkinId(value: unknown): value is PlayerSkinId {
  return typeof value === "string" && PLAYER_SKIN_DEFS.some((skin) => skin.id === value);
}

export function getDifficultyConfig(difficultyId: DifficultyId): DifficultyConfig {
  return DIFFICULTY_CONFIGS[difficultyId];
}

export function normalizeRunSetup(setup?: Partial<RunSetup>): RunSetup {
  const selected = setup?.enabledUpgrades?.filter((upgradeId, index, array) => array.indexOf(upgradeId) === index) ?? ALL_UPGRADE_IDS;
  return {
    difficultyId: setup?.difficultyId ?? DEFAULT_RUN_SETUP.difficultyId,
    enabledUpgrades: selected.length >= 3 ? selected : ALL_UPGRADE_IDS,
    metaUpgrades: normalizeMetaUpgrades(setup?.metaUpgrades),
    selectedSkinId: isPlayerSkinId(setup?.selectedSkinId) ? setup.selectedSkinId : DEFAULT_RUN_SETUP.selectedSkinId,
  };
}
