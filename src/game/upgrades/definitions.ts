import type { GameState, UpgradeId } from "../types";

export interface UpgradeDefinition {
  id: UpgradeId;
  name: string;
  shortName: string;
  description: string;
  apply: (state: GameState, currentRank: number) => void;
}

export const UPGRADE_DEFS: UpgradeDefinition[] = [
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
    description: "移动速度提升 25%，走位和转场都会更轻松。",
    apply(state) {
      state.player.stats.moveSpeed *= 1.25;
    },
  },
  {
    id: "pickupRadius",
    name: "胡须感应",
    shortName: "拾取范围",
    description: "经验吸附半径每级直接扩大 50%，滚雪球会明显快很多。",
    apply(state) {
      state.player.stats.pickupRadius *= 1.5;
    },
  },
  {
    id: "autoTurret",
    name: "自律喷腺",
    shortName: "自动副炮",
    description: "首点解锁 1 门自动喷腺，后续每级额外 +2 发副炮齐射，并继续缩短循环时间。",
    apply(state, currentRank) {
      state.player.stats.autoTurretCount += currentRank === 0 ? 1 : 2;
      state.player.stats.autoTurretCooldown = Math.max(0.46, state.player.stats.autoTurretCooldown * 0.9);
    },
  },
  {
    id: "orbitals",
    name: "护卵环",
    shortName: "环绕弹",
    description: "每级直接补 3 枚环绕卵鞘，并略微提高环绕伤害与补充速度。",
    apply(state) {
      state.player.stats.orbitalCount += 3;
      state.player.stats.orbitalDamage *= 1.08;
      state.player.stats.orbitalRespawn = Math.max(0.36, state.player.stats.orbitalRespawn * 0.9);
    },
  },
  {
    id: "lightningStrike",
    name: "静电巢雷",
    shortName: "雷击",
    description: "首点开始自动劈落范围雷击，后续每级继续扩大范围、提高伤害并缩短冷却。",
    apply(state, currentRank) {
      if (currentRank === 0) {
        state.player.stats.lightningDamage = 34;
        state.player.stats.lightningRadius = 96;
        state.player.stats.lightningCooldown = 2.6;
        state.player.stats.lightningTargetRange = 520;
        state.player.lightningTimer = 0;
        return;
      }

      state.player.stats.lightningDamage += 11;
      state.player.stats.lightningRadius += 28;
      state.player.stats.lightningCooldown = Math.max(1.05, state.player.stats.lightningCooldown * 0.9);
      state.player.stats.lightningTargetRange += 48;
    },
  },
  {
    id: "burstShell",
    name: "爆裂卵腔",
    shortName: "爆裂",
    description: "卵鞘命中或碎裂时引发小范围爆炸。后续每级继续扩大半径并提高溅射比例。",
    apply(state, currentRank) {
      if (currentRank === 0) {
        state.player.stats.explosionRadius = 48;
        state.player.stats.explosionDamageRatio = 0.55;
        return;
      }

      state.player.stats.explosionRadius += 16;
      state.player.stats.explosionDamageRatio = Math.min(1.25, state.player.stats.explosionDamageRatio + 0.12);
    },
  },
  {
    id: "frostEgg",
    name: "寒霜卵液",
    shortName: "冰缓",
    description: "卵鞘命中后使敌人减速 30%，持续 2 秒。后续每级额外 +5% 减速、+0.5 秒持续。",
    apply(state, currentRank) {
      if (currentRank === 0) {
        state.player.stats.slowAmount = 0.3;
        state.player.stats.slowDuration = 2;
        return;
      }

      state.player.stats.slowAmount = Math.min(0.7, state.player.stats.slowAmount + 0.05);
      state.player.stats.slowDuration += 0.5;
    },
  },
  {
    id: "corrosiveGland",
    name: "腐蚀腺液",
    shortName: "腐蚀",
    description: "卵鞘命中后附加腐蚀效果，每秒造成 4 点持续伤害，持续 3 秒。后续每级 +2 DPS、+0.5 秒。",
    apply(state, currentRank) {
      if (currentRank === 0) {
        state.player.stats.poisonDps = 4;
        state.player.stats.poisonDuration = 3;
        return;
      }

      state.player.stats.poisonDps += 2;
      state.player.stats.poisonDuration += 0.5;
    },
  },
];
