import { hasUnlockedAllAchievements, isAchievementTierComplete, mergeAchievementUnlocks, normalizeAchievementUnlocks } from "../achievements";
import type { AchievementId, AchievementUnlocks, MetaProfile, MetaUpgradeId, MetaUpgradeLevels, PlayerSkinId } from "../types";

export interface MetaUpgradeDefinition {
  id: MetaUpgradeId;
  name: string;
  shortName: string;
  description: string;
  bonusStep: number;
  bonusUnit: string;
  maxLevel: number;
  costBase?: number;
  costStep?: number;
  costs?: number[];
}

export interface PlayerSkinDefinition {
  id: PlayerSkinId;
  name: string;
  shortName: string;
  description: string;
  flavor: string;
  cost: number;
  unlockType?: "default" | "purchase" | "achievement";
  rewardDescription?: string;
}

export const BASE_LEVEL_UP_HEAL = 20;
export const AUTO_REGEN_INTERVAL_SECONDS = 3;
export const DEFAULT_PLAYER_SKIN_ID: PlayerSkinId = "labStandard";

export const EMPTY_META_UPGRADES: MetaUpgradeLevels = {
  baseDamage: 0,
  baseMoveSpeed: 0,
  baseMaxHp: 0,
  buffRefresh: 0,
  autoRegen: 0,
  basePickupRadius: 0,
  contactArmor: 0,
  levelUpHeal: 0,
};

export const PLAYER_SKIN_DEFS: PlayerSkinDefinition[] = [
  {
    id: "labStandard",
    name: "实验室基础体",
    shortName: "基础体",
    description: "默认蟑螂皮肤，圆脸、硬壳、看起来像刚从培养皿里爬出来的吉祥物。",
    flavor: "广东人的神必实验室最稳定的一号样本。",
    cost: 0,
    unlockType: "default",
  },
  {
    id: "pickleReporter",
    name: "腌黄瓜战地记者",
    shortName: "黄瓜记者",
    description: "受图五启发的改造型皮肤，黄瓜本体配临时拼装义肢和拍摄装备，气质非常神必。",
    flavor: "别问实验报告，问就是外勤拍到了素材。",
    cost: 128,
    unlockType: "purchase",
  },
  {
    id: "roachGirl",
    name: "蟑螂娘",
    shortName: "蟑螂娘",
    description: "参考图二做成的长发拟人外观，黑色长发像一整片虫翼披风。",
    flavor: "看起来很乖，实际是下水道里最会刷经验的那位。",
    cost: 188,
    unlockType: "purchase",
  },
  {
    id: "sewerKnight",
    name: "下水道罐甲骑士",
    shortName: "罐甲",
    description: "用易拉罐和旧管线拼出来的重甲皮肤，移动时像金属标本在散步。",
    flavor: "护甲没有数值加成，但心理防御非常高。",
    cost: 88,
    unlockType: "purchase",
  },
  {
    id: "neonScout",
    name: "霓虹触须斥候",
    shortName: "霓虹",
    description: "发光触须和荧光背甲，适合在高压虫潮里把自己变成移动路标。",
    flavor: "怕黑，所以决定比黑暗更亮。",
    cost: 118,
    unlockType: "purchase",
  },
  {
    id: "northernMini",
    name: "北方迷你蟑螂",
    shortName: "迷你",
    description: "完成北方迷你蟑螂档案后解锁，小小一只但走位非常倔。",
    flavor: "小不是缺点，是碰撞盒美学。",
    cost: 0,
    unlockType: "achievement",
    rewardDescription: "完成北方迷你蟑螂档案",
  },
  {
    id: "americanMantis",
    name: "美洲大镰",
    shortName: "大镰",
    description: "完成美洲大镰档案后解锁，镰足夸张、冲阵感更强。",
    flavor: "负责把普通难度切成两半。",
    cost: 0,
    unlockType: "achievement",
    rewardDescription: "完成美洲大镰档案",
  },
  {
    id: "cantonTwinTail",
    name: "广东双马尾",
    shortName: "双马尾",
    description: "完成广东双马尾档案后解锁，触须扎成双马尾，困难局专用气场。",
    flavor: "广东人的神必实验室说这是稳定型偶像样本。",
    cost: 0,
    unlockType: "achievement",
    rewardDescription: "完成广东双马尾档案",
  },
  {
    id: "terraChampion",
    name: "火星异种",
    shortName: "火星体",
    description: "参考图一做成的黑壳肌肉型最终皮肤，完成所有成就后自动解锁。",
    flavor: "所有离谱成就都打完，才轮到它从培养舱里站起来。",
    cost: 0,
    unlockType: "achievement",
    rewardDescription: "完成所有成就",
  },
];

export const DEFAULT_META_PROFILE: MetaProfile = {
  goldenEggs: 0,
  metaUpgrades: { ...EMPTY_META_UPGRADES },
  achievements: {},
  unlockedSkinIds: [DEFAULT_PLAYER_SKIN_ID],
  selectedSkinId: DEFAULT_PLAYER_SKIN_ID,
};

export const META_UPGRADE_DEFS: MetaUpgradeDefinition[] = [
  {
    id: "baseDamage",
    name: "初始攻击",
    shortName: "攻击",
    description: "提高开局卵鞘伤害，让前几分钟更稳。",
    bonusStep: 2,
    bonusUnit: "伤害",
    maxLevel: 10,
    costBase: 2,
    costStep: 2,
  },
  {
    id: "baseMoveSpeed",
    name: "初始速度",
    shortName: "速度",
    description: "提高开局移动速度，更容易拉扯和吃经验。",
    bonusStep: 6,
    bonusUnit: "移速",
    maxLevel: 10,
    costBase: 2,
    costStep: 2,
  },
  {
    id: "baseMaxHp",
    name: "初始血量",
    shortName: "血量",
    description: "提高开局生命上限，前期容错更高。",
    bonusStep: 10,
    bonusUnit: "生命",
    maxLevel: 10,
    costBase: 2,
    costStep: 2,
  },
  {
    id: "buffRefresh",
    name: "变异刷新",
    shortName: "刷新",
    description: "每局多带 1 次词条刷新机会，可在升级弹窗里点击重刷增益。",
    bonusStep: 1,
    bonusUnit: "次刷新",
    maxLevel: 3,
    costs: [10, 15, 20],
  },
  {
    id: "autoRegen",
    name: "自动回血",
    shortName: "回血",
    description: "每 3 秒触发一次回血。每级多回 1 点，强度更克制但依旧稳定。",
    bonusStep: 1,
    bonusUnit: "点/3 秒",
    maxLevel: 3,
    costs: [10, 20, 30],
  },
  {
    id: "basePickupRadius",
    name: "触须磁场",
    shortName: "吸附",
    description: "扩大开局经验吸附范围，更容易滚起前期节奏。",
    bonusStep: 24,
    bonusUnit: "拾取范围",
    maxLevel: 5,
    costs: [4, 7, 10, 13, 16],
  },
  {
    id: "contactArmor",
    name: "硬壳镀层",
    shortName: "减伤",
    description: "减少受到的接触伤害，方便在虫潮里强行挤位。",
    bonusStep: 6,
    bonusUnit: "% 接触减伤",
    maxLevel: 5,
    costs: [5, 9, 13, 17, 21],
  },
  {
    id: "levelUpHeal",
    name: "蜕壳回补",
    shortName: "升级治疗",
    description: "默认升级就会回血，继续投资后每次升级回复会越来越高，满级达到 100 点。",
    bonusStep: 16,
    bonusUnit: "升级回血",
    maxLevel: 5,
    costs: [4, 8, 12, 16, 20],
  },
];

const META_UPGRADE_MAP = new Map<MetaUpgradeId, MetaUpgradeDefinition>(META_UPGRADE_DEFS.map((upgrade) => [upgrade.id, upgrade]));
const PLAYER_SKIN_MAP = new Map<PlayerSkinId, PlayerSkinDefinition>(PLAYER_SKIN_DEFS.map((skin) => [skin.id, skin]));
const PLAYER_SKIN_ID_SET = new Set<PlayerSkinId>(PLAYER_SKIN_DEFS.map((skin) => skin.id));

function clampLevel(level: number | undefined): number {
  return Math.max(0, Math.floor(level ?? 0));
}

function isPlayerSkinId(value: unknown): value is PlayerSkinId {
  return typeof value === "string" && PLAYER_SKIN_ID_SET.has(value as PlayerSkinId);
}

export function getAchievementRewardSkinIds(achievements?: AchievementUnlocks): PlayerSkinId[] {
  const rewardSkinIds: PlayerSkinId[] = [];

  if (isAchievementTierComplete(achievements, "northernMini")) {
    rewardSkinIds.push("northernMini");
  }

  if (isAchievementTierComplete(achievements, "americanMantis")) {
    rewardSkinIds.push("americanMantis");
  }

  if (isAchievementTierComplete(achievements, "cantonTwinTail")) {
    rewardSkinIds.push("cantonTwinTail");
  }

  if (hasUnlockedAllAchievements(achievements)) {
    rewardSkinIds.push("terraChampion");
  }

  return rewardSkinIds;
}

function normalizeUnlockedSkinIds(skinIds?: PlayerSkinId[], achievements?: AchievementUnlocks): PlayerSkinId[] {
  const ownedSkinIds = new Set<PlayerSkinId>([DEFAULT_PLAYER_SKIN_ID]);

  skinIds?.forEach((skinId) => {
    if (isPlayerSkinId(skinId)) {
      ownedSkinIds.add(skinId);
    }
  });

  getAchievementRewardSkinIds(achievements).forEach((skinId) => {
    ownedSkinIds.add(skinId);
  });

  return PLAYER_SKIN_DEFS.map((skin) => skin.id).filter((skinId) => ownedSkinIds.has(skinId));
}

export function normalizeMetaUpgrades(metaUpgrades?: Partial<MetaUpgradeLevels>): MetaUpgradeLevels {
  return {
    baseDamage: Math.min(META_UPGRADE_MAP.get("baseDamage")!.maxLevel, clampLevel(metaUpgrades?.baseDamage)),
    baseMoveSpeed: Math.min(META_UPGRADE_MAP.get("baseMoveSpeed")!.maxLevel, clampLevel(metaUpgrades?.baseMoveSpeed)),
    baseMaxHp: Math.min(META_UPGRADE_MAP.get("baseMaxHp")!.maxLevel, clampLevel(metaUpgrades?.baseMaxHp)),
    buffRefresh: Math.min(META_UPGRADE_MAP.get("buffRefresh")!.maxLevel, clampLevel(metaUpgrades?.buffRefresh)),
    autoRegen: Math.min(META_UPGRADE_MAP.get("autoRegen")!.maxLevel, clampLevel(metaUpgrades?.autoRegen)),
    basePickupRadius: Math.min(META_UPGRADE_MAP.get("basePickupRadius")!.maxLevel, clampLevel(metaUpgrades?.basePickupRadius)),
    contactArmor: Math.min(META_UPGRADE_MAP.get("contactArmor")!.maxLevel, clampLevel(metaUpgrades?.contactArmor)),
    levelUpHeal: Math.min(META_UPGRADE_MAP.get("levelUpHeal")!.maxLevel, clampLevel(metaUpgrades?.levelUpHeal)),
  };
}

export function normalizeMetaProfile(profile?: Partial<MetaProfile>): MetaProfile {
  const achievements = normalizeAchievementUnlocks(profile?.achievements);
  const unlockedSkinIds = normalizeUnlockedSkinIds(profile?.unlockedSkinIds, achievements);
  const selectedSkinId = isPlayerSkinId(profile?.selectedSkinId) ? profile.selectedSkinId : DEFAULT_PLAYER_SKIN_ID;

  return {
    goldenEggs: Math.max(0, Math.floor(profile?.goldenEggs ?? 0)),
    metaUpgrades: normalizeMetaUpgrades(profile?.metaUpgrades),
    achievements,
    unlockedSkinIds,
    selectedSkinId: unlockedSkinIds.includes(selectedSkinId) ? selectedSkinId : DEFAULT_PLAYER_SKIN_ID,
  };
}

export function getPlayerSkinDefinition(skinId: PlayerSkinId): PlayerSkinDefinition {
  return PLAYER_SKIN_MAP.get(skinId) ?? PLAYER_SKIN_MAP.get(DEFAULT_PLAYER_SKIN_ID)!;
}

export function isPlayerSkinOwned(profile: MetaProfile, skinId: PlayerSkinId): boolean {
  return normalizeMetaProfile(profile).unlockedSkinIds.includes(skinId);
}

export function getMetaUpgradeCost(upgradeId: MetaUpgradeId, currentLevel: number): number {
  const upgrade = META_UPGRADE_MAP.get(upgradeId);

  if (!upgrade) {
    return Number.POSITIVE_INFINITY;
  }

  const level = clampLevel(currentLevel);

  if (level >= upgrade.maxLevel) {
    return Number.POSITIVE_INFINITY;
  }

  if (upgrade.costs) {
    return upgrade.costs[level] ?? Number.POSITIVE_INFINITY;
  }

  return (upgrade.costBase ?? 0) + level * (upgrade.costStep ?? 0);
}

export function getMetaUpgradeBonus(upgradeId: MetaUpgradeId, level: number): number {
  const upgrade = META_UPGRADE_MAP.get(upgradeId);

  if (!upgrade) {
    return 0;
  }

  return upgrade.bonusStep * clampLevel(level);
}

export function getMetaUpgradeBonusLabel(upgradeId: MetaUpgradeId, level: number): string {
  const upgrade = META_UPGRADE_MAP.get(upgradeId);

  if (!upgrade) {
    return "+0";
  }

  const bonus = getMetaUpgradeBonus(upgradeId, level);

  if (upgradeId === "contactArmor") {
    return `-${bonus}% 接触伤害`;
  }

  if (upgradeId === "basePickupRadius") {
    return `+${bonus} 吸附范围`;
  }

  if (upgradeId === "levelUpHeal") {
    return `每次升级回血 ${BASE_LEVEL_UP_HEAL + bonus}`;
  }

  if (upgradeId === "autoRegen") {
    return `每 ${AUTO_REGEN_INTERVAL_SECONDS} 秒恢复 ${bonus}`;
  }

  return `+${bonus} ${upgrade.bonusUnit}`;
}

export function getMetaUpgradeBaseLabel(upgradeId: MetaUpgradeId): string | null {
  if (upgradeId === "levelUpHeal") {
    return `基础每次升级回血 ${BASE_LEVEL_UP_HEAL}`;
  }

  return null;
}

export function getMetaUpgradeMaxLevel(upgradeId: MetaUpgradeId): number {
  return META_UPGRADE_MAP.get(upgradeId)?.maxLevel ?? 0;
}

export function getMetaUpgradeSpentCost(upgradeId: MetaUpgradeId, level: number): number {
  let total = 0;

  for (let currentLevel = 0; currentLevel < clampLevel(level); currentLevel += 1) {
    total += getMetaUpgradeCost(upgradeId, currentLevel);
  }

  return Number.isFinite(total) ? total : 0;
}

export function getMetaResetRefund(profile: Pick<MetaProfile, "goldenEggs" | "metaUpgrades"> & Partial<MetaProfile>): number {
  const normalized = normalizeMetaProfile(profile);

  return META_UPGRADE_DEFS.reduce((total, upgrade) => total + getMetaUpgradeSpentCost(upgrade.id, normalized.metaUpgrades[upgrade.id]), 0);
}

export function addGoldenEggs(profile: MetaProfile, amount: number): MetaProfile {
  const normalized = normalizeMetaProfile(profile);
  return {
    goldenEggs: normalized.goldenEggs + Math.max(0, Math.floor(amount)),
    metaUpgrades: normalized.metaUpgrades,
    achievements: normalized.achievements,
    unlockedSkinIds: normalized.unlockedSkinIds,
    selectedSkinId: normalized.selectedSkinId,
  };
}

export function purchaseMetaUpgrade(profile: MetaProfile, upgradeId: MetaUpgradeId): MetaProfile | null {
  const normalized = normalizeMetaProfile(profile);
  const currentLevel = normalized.metaUpgrades[upgradeId];
  const maxLevel = getMetaUpgradeMaxLevel(upgradeId);

  if (currentLevel >= maxLevel) {
    return null;
  }

  const cost = getMetaUpgradeCost(upgradeId, currentLevel);

  if (normalized.goldenEggs < cost) {
    return null;
  }

  return {
    goldenEggs: normalized.goldenEggs - cost,
    metaUpgrades: {
      ...normalized.metaUpgrades,
      [upgradeId]: currentLevel + 1,
    },
    achievements: normalized.achievements,
    unlockedSkinIds: normalized.unlockedSkinIds,
    selectedSkinId: normalized.selectedSkinId,
  };
}

export function resetMetaUpgrades(profile: MetaProfile): MetaProfile | null {
  const normalized = normalizeMetaProfile(profile);
  const refund = getMetaResetRefund(normalized);

  if (refund <= 0 || normalized.goldenEggs < 1) {
    return null;
  }

  return {
    goldenEggs: normalized.goldenEggs - 1 + refund,
    metaUpgrades: { ...EMPTY_META_UPGRADES },
    achievements: normalized.achievements,
    unlockedSkinIds: normalized.unlockedSkinIds,
    selectedSkinId: normalized.selectedSkinId,
  };
}

export function purchasePlayerSkin(profile: MetaProfile, skinId: PlayerSkinId): MetaProfile | null {
  const normalized = normalizeMetaProfile(profile);
  const skin = PLAYER_SKIN_MAP.get(skinId);

  if (!skin) {
    return null;
  }

  if (normalized.unlockedSkinIds.includes(skinId)) {
    return normalized.selectedSkinId === skinId
      ? null
      : {
          goldenEggs: normalized.goldenEggs,
          metaUpgrades: normalized.metaUpgrades,
          achievements: normalized.achievements,
          unlockedSkinIds: normalized.unlockedSkinIds,
          selectedSkinId: skinId,
        };
  }

  if (skin.unlockType === "achievement") {
    return null;
  }

  if (normalized.goldenEggs < skin.cost) {
    return null;
  }

  return {
    goldenEggs: normalized.goldenEggs - skin.cost,
    metaUpgrades: normalized.metaUpgrades,
    achievements: normalized.achievements,
    unlockedSkinIds: [...normalized.unlockedSkinIds, skinId],
    selectedSkinId: skinId,
  };
}

export function selectPlayerSkin(profile: MetaProfile, skinId: PlayerSkinId): MetaProfile | null {
  const normalized = normalizeMetaProfile(profile);

  if (!normalized.unlockedSkinIds.includes(skinId) || normalized.selectedSkinId === skinId) {
    return null;
  }

  return {
    goldenEggs: normalized.goldenEggs,
    metaUpgrades: normalized.metaUpgrades,
    achievements: normalized.achievements,
    unlockedSkinIds: normalized.unlockedSkinIds,
    selectedSkinId: skinId,
  };
}

export function applyAchievementUnlocksToProfile(profile: MetaProfile, achievementIds: AchievementId[]): MetaProfile {
  const normalized = normalizeMetaProfile(profile);
  const achievements = mergeAchievementUnlocks(normalized.achievements, achievementIds);

  return normalizeMetaProfile({
    goldenEggs: normalized.goldenEggs,
    metaUpgrades: normalized.metaUpgrades,
    achievements,
    unlockedSkinIds: normalized.unlockedSkinIds,
    selectedSkinId: normalized.selectedSkinId,
  });
}
