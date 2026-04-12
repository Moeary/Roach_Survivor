import type { MetaProfile, MetaUpgradeId, MetaUpgradeLevels } from "../types";

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

export const EMPTY_META_UPGRADES: MetaUpgradeLevels = {
  baseDamage: 0,
  baseMoveSpeed: 0,
  baseMaxHp: 0,
  buffRefresh: 0,
  autoRegen: 0,
};

export const DEFAULT_META_PROFILE: MetaProfile = {
  goldenEggs: 0,
  metaUpgrades: { ...EMPTY_META_UPGRADES },
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
    description: "战斗中持续自动恢复生命。每级 +1 点/秒，满级 3 点/秒。",
    bonusStep: 1,
    bonusUnit: "点/秒",
    maxLevel: 3,
    costs: [10, 20, 30],
  },
];

const META_UPGRADE_MAP = new Map<MetaUpgradeId, MetaUpgradeDefinition>(META_UPGRADE_DEFS.map((upgrade) => [upgrade.id, upgrade]));

function clampLevel(level: number | undefined): number {
  return Math.max(0, Math.floor(level ?? 0));
}

export function normalizeMetaUpgrades(metaUpgrades?: Partial<MetaUpgradeLevels>): MetaUpgradeLevels {
  return {
    baseDamage: Math.min(META_UPGRADE_MAP.get("baseDamage")!.maxLevel, clampLevel(metaUpgrades?.baseDamage)),
    baseMoveSpeed: Math.min(META_UPGRADE_MAP.get("baseMoveSpeed")!.maxLevel, clampLevel(metaUpgrades?.baseMoveSpeed)),
    baseMaxHp: Math.min(META_UPGRADE_MAP.get("baseMaxHp")!.maxLevel, clampLevel(metaUpgrades?.baseMaxHp)),
    buffRefresh: Math.min(META_UPGRADE_MAP.get("buffRefresh")!.maxLevel, clampLevel(metaUpgrades?.buffRefresh)),
    autoRegen: Math.min(META_UPGRADE_MAP.get("autoRegen")!.maxLevel, clampLevel(metaUpgrades?.autoRegen)),
  };
}

export function normalizeMetaProfile(profile?: Partial<MetaProfile>): MetaProfile {
  return {
    goldenEggs: Math.max(0, Math.floor(profile?.goldenEggs ?? 0)),
    metaUpgrades: normalizeMetaUpgrades(profile?.metaUpgrades),
  };
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

  return `+${getMetaUpgradeBonus(upgradeId, level)} ${upgrade.bonusUnit}`;
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

export function getMetaResetRefund(profile: MetaProfile): number {
  const normalized = normalizeMetaProfile(profile);

  return META_UPGRADE_DEFS.reduce((total, upgrade) => total + getMetaUpgradeSpentCost(upgrade.id, normalized.metaUpgrades[upgrade.id]), 0);
}

export function addGoldenEggs(profile: MetaProfile, amount: number): MetaProfile {
  const normalized = normalizeMetaProfile(profile);
  return {
    goldenEggs: normalized.goldenEggs + Math.max(0, Math.floor(amount)),
    metaUpgrades: normalized.metaUpgrades,
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
  };
}
