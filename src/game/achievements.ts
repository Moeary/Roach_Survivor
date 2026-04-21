import type { AchievementId, AchievementTierId, AchievementUnlocks, GameState, MetaUpgradeLevels, RunSetup } from "./types";

export interface AchievementTierDefinition {
  id: AchievementTierId;
  label: string;
  description: string;
  order: number;
}

export interface AchievementDefinition {
  id: AchievementId;
  tier: AchievementTierId;
  name: string;
  shortName: string;
  description: string;
}

export interface AchievementRunResult {
  difficultyId: string;
  won: boolean;
  timer: number;
  bossWavesDefeated: number;
  damageTaken: number;
  kills: number;
  peakLevel: number;
  projectilesFired: number;
  runGoldenEggsCollected: number;
  relicCount: number;
  upgradeCount: number;
  usedMovementKeys: boolean;
  usedCheat: boolean;
  metaUpgradeLevelTotal: number;
}

export const ACHIEVEMENT_TIERS: AchievementTierDefinition[] = [
  {
    id: "terraFormars",
    label: "火星异种",
    description: "最高级离谱挑战，只认困难三 Boss 的极限通关。",
    order: 4,
  },
  {
    id: "cantonTwinTail",
    label: "广东双马尾",
    description: "困难难度的稳定毕业线，要求输出、保命和资源都在线。",
    order: 3,
  },
  {
    id: "americanMantis",
    label: "美洲大镰",
    description: "中阶挑战，开始要求完整构筑和连续 Boss 处理。",
    order: 2,
  },
  {
    id: "northernMini",
    label: "北方迷你蟑螂",
    description: "入门档案，确认你已经跑通战斗、成长和收集循环。",
    order: 1,
  },
];

export const ACHIEVEMENT_DEFS: AchievementDefinition[] = [
  {
    id: "firstMolting",
    tier: "northernMini",
    name: "第一次蜕壳",
    shortName: "蜕壳",
    description: "单局达到 Lv.5。",
  },
  {
    id: "hundredKills",
    tier: "northernMini",
    name: "下水道清洁工",
    shortName: "百杀",
    description: "单局击杀至少 100 个敌人。",
  },
  {
    id: "firstClear",
    tier: "northernMini",
    name: "活着回菜单",
    shortName: "首通",
    description: "任意难度通关一次。",
  },
  {
    id: "eggPocket",
    tier: "northernMini",
    name: "金卵小口袋",
    shortName: "小金库",
    description: "单局带回至少 12 枚金色卵鞘。",
  },
  {
    id: "normalClear",
    tier: "americanMantis",
    name: "普通下水道毕业",
    shortName: "普通通关",
    description: "普通或困难难度通关。",
  },
  {
    id: "twoBosses",
    tier: "americanMantis",
    name: "双王剪除",
    shortName: "双 Boss",
    description: "单局击败至少 2 波 Boss。",
  },
  {
    id: "relicCollector",
    tier: "americanMantis",
    name: "遗物背包客",
    shortName: "三遗物",
    description: "单局持有至少 3 件遗物。",
  },
  {
    id: "mutationStack",
    tier: "americanMantis",
    name: "腺体过载",
    shortName: "十变异",
    description: "单局拿到至少 10 次本局 Buff。",
  },
  {
    id: "hardClear",
    tier: "cantonTwinTail",
    name: "困难母巢打穿",
    shortName: "困难通关",
    description: "困难难度通关并击败 3 波 Boss。",
  },
  {
    id: "hardCollector",
    tier: "cantonTwinTail",
    name: "金卵大搬运",
    shortName: "硬核收集",
    description: "困难单局带回至少 45 枚金色卵鞘。",
  },
  {
    id: "lowDamageHard",
    tier: "cantonTwinTail",
    name: "双马尾闪避课",
    shortName: "低伤困难",
    description: "困难通关且承受伤害不超过 200。",
  },
  {
    id: "bossHunter",
    tier: "cantonTwinTail",
    name: "高压蜕壳课",
    shortName: "Lv.25",
    description: "单局达到 Lv.25。",
  },
  {
    id: "hardFlawless",
    tier: "terraFormars",
    name: "无伤火星体",
    shortName: "无伤困难",
    description: "困难通关，击败 3 波 Boss，且承受伤害为 0。",
  },
  {
    id: "hardStillness",
    tier: "terraFormars",
    name: "不动如蟑螂",
    shortName: "不动困难",
    description: "困难通关，击败 3 波 Boss，且本局没有按过 WASD 或方向键。",
  },
  {
    id: "hardNoMeta",
    tier: "terraFormars",
    name: "裸壳实验体",
    shortName: "零局外",
    description: "不投入任何局外升级的情况下困难通关。",
  },
  {
    id: "hardOverkill",
    tier: "terraFormars",
    name: "母巢灭绝报告",
    shortName: "灭绝",
    description: "困难通关且单局击杀至少 1500 个敌人，要求配装能在怪物刚冒头时迅速清理。",
  },
];

export const ACHIEVEMENT_IDS: AchievementId[] = ACHIEVEMENT_DEFS.map((achievement) => achievement.id);

const ACHIEVEMENT_ID_SET = new Set<AchievementId>(ACHIEVEMENT_IDS);

function getMetaUpgradeLevelTotal(metaUpgrades: MetaUpgradeLevels): number {
  return Object.values(metaUpgrades).reduce((total, level) => total + Math.max(0, Math.floor(level)), 0);
}

export function normalizeAchievementUnlocks(achievements?: AchievementUnlocks): AchievementUnlocks {
  const normalized: AchievementUnlocks = {};

  ACHIEVEMENT_IDS.forEach((achievementId) => {
    if (achievements?.[achievementId]) {
      normalized[achievementId] = true;
    }
  });

  return normalized;
}

export function getAchievementUnlockCount(achievements?: AchievementUnlocks): number {
  const normalized = normalizeAchievementUnlocks(achievements);
  return ACHIEVEMENT_IDS.reduce((total, achievementId) => total + (normalized[achievementId] ? 1 : 0), 0);
}

export function hasUnlockedAllAchievements(achievements?: AchievementUnlocks): boolean {
  return getAchievementUnlockCount(achievements) >= ACHIEVEMENT_IDS.length;
}

export function isAchievementTierComplete(achievements: AchievementUnlocks | undefined, tierId: AchievementTierId): boolean {
  const normalized = normalizeAchievementUnlocks(achievements);
  const tierAchievements = ACHIEVEMENT_DEFS.filter((achievement) => achievement.tier === tierId);
  return tierAchievements.length > 0 && tierAchievements.every((achievement) => normalized[achievement.id]);
}

export function buildAchievementRunResult(state: GameState, setup: RunSetup): AchievementRunResult {
  return {
    difficultyId: state.difficulty.id,
    won: state.runState === "won",
    timer: state.timer,
    bossWavesDefeated: state.sessionStats.bossesDefeated,
    damageTaken: state.sessionStats.damageTaken,
    kills: state.sessionStats.kills,
    peakLevel: state.sessionStats.peakLevel,
    projectilesFired: state.sessionStats.projectilesFired,
    runGoldenEggsCollected: state.runGoldenEggsCollected,
    relicCount: state.relics.length,
    upgradeCount: state.upgradesTaken.length,
    usedMovementKeys: state.sessionStats.usedMovementKeys,
    usedCheat: state.sessionStats.usedCheat,
    metaUpgradeLevelTotal: getMetaUpgradeLevelTotal(setup.metaUpgrades),
  };
}

export function getUnlockedAchievementIdsForRun(current: AchievementUnlocks | undefined, result: AchievementRunResult): AchievementId[] {
  if (result.usedCheat) {
    return [];
  }

  const unlocked = normalizeAchievementUnlocks(current);
  const nextIds: AchievementId[] = [];
  const hardWin = result.won && result.difficultyId === "hard" && result.bossWavesDefeated >= 3;
  const normalOrHardWin = result.won && (result.difficultyId === "normal" || result.difficultyId === "hard");
  const checks: Array<[AchievementId, boolean]> = [
    ["firstMolting", result.peakLevel >= 5],
    ["hundredKills", result.kills >= 100],
    ["firstClear", result.won],
    ["eggPocket", result.runGoldenEggsCollected >= 12],
    ["normalClear", normalOrHardWin],
    ["twoBosses", result.bossWavesDefeated >= 2],
    ["relicCollector", result.relicCount >= 3],
    ["mutationStack", result.upgradeCount >= 10],
    ["hardClear", hardWin],
    ["hardCollector", hardWin && result.runGoldenEggsCollected >= 45],
    ["lowDamageHard", hardWin && result.damageTaken <= 200],
    ["bossHunter", result.peakLevel >= 25],
    ["hardFlawless", hardWin && result.damageTaken <= 0],
    ["hardStillness", hardWin && !result.usedMovementKeys],
    ["hardNoMeta", hardWin && result.metaUpgradeLevelTotal <= 0],
    ["hardOverkill", hardWin && result.kills >= 1500],
  ];

  checks.forEach(([achievementId, passed]) => {
    if (passed && !unlocked[achievementId] && ACHIEVEMENT_ID_SET.has(achievementId)) {
      nextIds.push(achievementId);
    }
  });

  return nextIds;
}

export function mergeAchievementUnlocks(current: AchievementUnlocks | undefined, achievementIds: AchievementId[]): AchievementUnlocks {
  const next = normalizeAchievementUnlocks(current);

  achievementIds.forEach((achievementId) => {
    if (ACHIEVEMENT_ID_SET.has(achievementId)) {
      next[achievementId] = true;
    }
  });

  return next;
}
