import type { GameState, UpgradeChoice, UpgradeId, UpgradeSummaryItem } from "./types";

interface UpgradeDefinition {
  id: UpgradeId;
  name: string;
  shortName: string;
  description: string;
  apply: (state: GameState) => void;
}

const UPGRADE_DEFS: UpgradeDefinition[] = [
  {
    id: "damage",
    name: "硬壳弹性卵",
    shortName: "伤害",
    description: "手动发射的卵鞘伤害提升 22%，一发更疼。",
    apply(state) {
      state.player.stats.projectileDamage *= 1.22;
    },
  },
  {
    id: "attackSpeed",
    name: "密集孵化",
    shortName: "攻速",
    description: "主武器发射间隔缩短 15%，朝鼠标方向喷得更快。",
    apply(state) {
      state.player.stats.attackCooldown = Math.max(0.24, state.player.stats.attackCooldown * 0.85);
    },
  },
  {
    id: "volley",
    name: "双囊齐发",
    shortName: "弹体数量",
    description: "每次朝瞄准方向额外发射 1 枚卵鞘，形成扇形扩散。",
    apply(state) {
      state.player.stats.projectileCount += 1;
    },
  },
  {
    id: "pierce",
    name: "裂壳钻刺",
    shortName: "穿透",
    description: "主武器卵鞘额外穿透 1 个敌人。",
    apply(state) {
      state.player.stats.projectilePierce += 1;
    },
  },
  {
    id: "moveSpeed",
    name: "惊吓疾跑",
    shortName: "移速",
    description: "移动速度提升 12%，走位更稳。",
    apply(state) {
      state.player.stats.moveSpeed *= 1.12;
    },
  },
  {
    id: "pickupRadius",
    name: "胡须感应",
    shortName: "拾取范围",
    description: "经验吸附半径扩大 24%。",
    apply(state) {
      state.player.stats.pickupRadius *= 1.24;
    },
  },
  {
    id: "autoTurret",
    name: "自律喷腺",
    shortName: "自动副炮",
    description: "额外长出自动喷腺，定期朝最近敌人补射辅助卵鞘。",
    apply(state) {
      state.player.stats.autoTurretCount += 1;
      state.player.stats.autoTurretCooldown = Math.max(0.46, state.player.stats.autoTurretCooldown * 0.9);
    },
  },
  {
    id: "orbitals",
    name: "护卵环",
    shortName: "环绕弹",
    description: "身边补 1 枚环绕卵鞘，撞到敌人会碎裂并自动补充。",
    apply(state) {
      state.player.stats.orbitalCount += 1;
      state.player.stats.orbitalDamage *= state.player.stats.orbitalCount === 1 ? 1 : 1.12;
      state.player.stats.orbitalRespawn = Math.max(0.42, state.player.stats.orbitalRespawn * 0.92);
    },
  },
];

const UPGRADE_MAP = new Map<UpgradeId, UpgradeDefinition>(UPGRADE_DEFS.map((upgrade) => [upgrade.id, upgrade]));

function shuffle<T>(input: T[]): T[] {
  const array = input.slice();

  for (let index = array.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const temp = array[index];
    array[index] = array[swapIndex]!;
    array[swapIndex] = temp!;
  }

  return array;
}

export function pickUpgradeChoices(state: GameState, count = 3): UpgradeChoice[] {
  return shuffle(UPGRADE_DEFS)
    .slice(0, Math.min(count, UPGRADE_DEFS.length))
    .map((upgrade) => ({
      id: upgrade.id,
      name: upgrade.name,
      shortName: upgrade.shortName,
      description: upgrade.description,
      currentRank: state.upgradeLevels[upgrade.id] ?? 0,
      nextRank: (state.upgradeLevels[upgrade.id] ?? 0) + 1,
    }));
}

export function applyUpgrade(state: GameState, upgradeId: UpgradeId): boolean {
  const upgrade = UPGRADE_MAP.get(upgradeId);

  if (!upgrade) {
    return false;
  }

  upgrade.apply(state);
  state.upgradeLevels[upgradeId] = (state.upgradeLevels[upgradeId] ?? 0) + 1;
  state.upgradesTaken.push(upgradeId);
  state.lastUpgradeName = upgrade.name;
  return true;
}

export function summarizeUpgrades(state: GameState): UpgradeSummaryItem[] {
  return UPGRADE_DEFS.map((upgrade) => ({
    id: upgrade.id,
    name: upgrade.name,
    shortName: upgrade.shortName,
    rank: state.upgradeLevels[upgrade.id] ?? 0,
  })).filter((entry) => entry.rank > 0);
}
