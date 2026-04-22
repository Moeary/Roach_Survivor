import { FINAL_BOSS_TIME, STAGE_THREE_START_TIME, STAGE_TWO_START_TIME } from "../../stages";
import type { EnemyTypeDefinition, EnemyTypeId } from "../../types";

type SpawnWeight = {
  id: EnemyTypeId;
  weight: number;
};

export const ENEMY_APPEAR_AT: Record<Exclude<EnemyTypeId, "boss">, number> = {
  nymph: 0,
  adult: 0,
  guard: 0,
  spitter: 0,
  skitter: STAGE_TWO_START_TIME,
  brute: STAGE_TWO_START_TIME,
  stinger: STAGE_TWO_START_TIME,
  hunter: STAGE_TWO_START_TIME,
  splitter: STAGE_TWO_START_TIME,
  sludge: STAGE_TWO_START_TIME,
  razor: STAGE_THREE_START_TIME,
  carrier: STAGE_THREE_START_TIME,
  behemoth: STAGE_THREE_START_TIME,
  phantom: STAGE_THREE_START_TIME,
  artillery: STAGE_THREE_START_TIME,
  shade: STAGE_THREE_START_TIME,
};

export const ENEMY_TYPES: Record<EnemyTypeId, EnemyTypeDefinition> = {
  nymph: {
    id: "nymph",
    name: "幼体",
    radius: 18,
    hp: 24,
    speed: 124,
    damage: 5,
    xp: 1,
    tint: "#d6bf80",
    bloodTint: "#b9c455",
  },
  adult: {
    id: "adult",
    name: "成虫",
    radius: 24,
    hp: 48,
    speed: 96,
    damage: 8,
    xp: 2,
    tint: "#a75e34",
    bloodTint: "#d07a32",
  },
  guard: {
    id: "guard",
    name: "厚壳卫兵",
    radius: 34,
    hp: 102,
    speed: 66,
    damage: 12,
    xp: 4,
    tint: "#54372c",
    bloodTint: "#c67444",
  },
  skitter: {
    id: "skitter",
    name: "裂足快袭体",
    radius: 16,
    hp: 32,
    speed: 154,
    damage: 6,
    xp: 3,
    tint: "#c89064",
    bloodTint: "#e09a52",
  },
  brute: {
    id: "brute",
    name: "重壳蛮兵",
    radius: 42,
    hp: 168,
    speed: 54,
    damage: 18,
    xp: 6,
    tint: "#7b4c3a",
    bloodTint: "#c66e40",
  },
  stinger: {
    id: "stinger",
    name: "针颚猎手",
    radius: 23,
    hp: 76,
    speed: 118,
    damage: 12,
    xp: 5,
    tint: "#90462b",
    bloodTint: "#d27030",
  },
  razor: {
    id: "razor",
    name: "镰足收割体",
    radius: 20,
    hp: 92,
    speed: 138,
    damage: 10,
    xp: 7,
    tint: "#662420",
    bloodTint: "#a82f26",
  },
  carrier: {
    id: "carrier",
    name: "孵化载体",
    radius: 30,
    hp: 172,
    speed: 82,
    damage: 16,
    xp: 8,
    tint: "#66713a",
    bloodTint: "#a0b048",
  },
  behemoth: {
    id: "behemoth",
    name: "肿壳巨甲体",
    radius: 46,
    hp: 280,
    speed: 48,
    damage: 25,
    xp: 11,
    tint: "#3b4038",
    bloodTint: "#7a8c55",
  },
  phantom: {
    id: "phantom",
    name: "灰背魅影",
    radius: 17,
    hp: 86,
    speed: 166,
    damage: 10,
    xp: 7,
    tint: "#7e8998",
    bloodTint: "#c3b5e3",
  },
  spitter: {
    id: "spitter",
    name: "喷射虫",
    radius: 22,
    hp: 60,
    speed: 54,
    damage: 4,
    xp: 5,
    tint: "#7a9a4a",
    bloodTint: "#b5dc50",
    ranged: {
      damage: 10,
      cooldown: 2.2,
      range: 420,
      stopDistance: 340,
      projectileSpeed: 260,
      projectileLife: 2,
      projectileRadius: 11,
      projectileTint: "#c2e060",
    },
  },
  hunter: {
    id: "hunter",
    name: "弩尾猎手",
    radius: 21,
    hp: 110,
    speed: 78,
    damage: 6,
    xp: 7,
    tint: "#8b5a9c",
    bloodTint: "#c27ce2",
    ranged: {
      damage: 14,
      cooldown: 1.6,
      range: 480,
      stopDistance: 260,
      projectileSpeed: 310,
      projectileLife: 1.8,
      projectileRadius: 9,
      projectileTint: "#d79ef2",
      moveWhileFiring: true,
    },
  },
  artillery: {
    id: "artillery",
    name: "爆孢炮手",
    radius: 32,
    hp: 210,
    speed: 42,
    damage: 10,
    xp: 12,
    tint: "#8d2e3c",
    bloodTint: "#d34a5a",
    ranged: {
      damage: 22,
      cooldown: 2.8,
      range: 560,
      stopDistance: 460,
      projectileSpeed: 220,
      projectileLife: 3,
      projectileRadius: 15,
      projectileTint: "#ff7a5c",
    },
  },
  splitter: {
    id: "splitter",
    name: "裂囊孵化体",
    radius: 27,
    hp: 86,
    speed: 82,
    damage: 10,
    xp: 6,
    tint: "#8f9a4a",
    bloodTint: "#c8df60",
  },
  shade: {
    id: "shade",
    name: "黑须潜伏者",
    radius: 19,
    hp: 94,
    speed: 118,
    damage: 13,
    xp: 9,
    tint: "#5f6f82",
    bloodTint: "#9fb8e7",
  },
  sludge: {
    id: "sludge",
    name: "腐浆拖行者",
    radius: 31,
    hp: 150,
    speed: 58,
    damage: 9,
    xp: 8,
    tint: "#5d7f38",
    bloodTint: "#91da58",
  },
  boss: {
    id: "boss",
    name: "母巢女王",
    radius: 72,
    hp: 1800,
    speed: 62,
    damage: 24,
    xp: 0,
    tint: "#7d2035",
    bloodTint: "#e74a5a",
  },
};

function rollWeightedEnemy(weights: SpawnWeight[]): EnemyTypeId {
  const totalWeight = weights.reduce((sum, entry) => sum + entry.weight, 0);
  let roll = Math.random() * totalWeight;

  for (const entry of weights) {
    roll -= entry.weight;

    if (roll <= 0) {
      return entry.id;
    }
  }

  return weights[weights.length - 1]!.id;
}

export function pickEnemyTypeForTime(timer: number): EnemyTypeId {
  if (timer < STAGE_TWO_START_TIME) {
    const intensity = Math.max(0, Math.min(1, timer / STAGE_TWO_START_TIME));
    return rollWeightedEnemy([
      { id: "nymph", weight: 54 - intensity * 18 },
      { id: "adult", weight: 26 + intensity * 10 },
      { id: "guard", weight: 13 + intensity * 7 },
      { id: "spitter", weight: 7 + intensity * 3 },
    ]);
  }

  if (timer < STAGE_THREE_START_TIME) {
    const intensity = Math.max(0, Math.min(1, (timer - STAGE_TWO_START_TIME) / (STAGE_THREE_START_TIME - STAGE_TWO_START_TIME)));
    return rollWeightedEnemy([
      { id: "nymph", weight: 14 - intensity * 5 },
      { id: "adult", weight: 18 - intensity * 4 },
      { id: "guard", weight: 14 + intensity * 3 },
      { id: "spitter", weight: 8 },
      { id: "skitter", weight: 14 + intensity * 6 },
      { id: "brute", weight: 11 + intensity * 4 },
      { id: "stinger", weight: 18 + intensity * 5 },
      { id: "hunter", weight: 6 + intensity * 4 },
      { id: "splitter", weight: 7 + intensity * 4 },
      { id: "sludge", weight: 5 + intensity * 3 },
    ]);
  }

  const intensity = Math.max(0, Math.min(1, (timer - STAGE_THREE_START_TIME) / Math.max(1, FINAL_BOSS_TIME - STAGE_THREE_START_TIME)));
  return rollWeightedEnemy([
    { id: "nymph", weight: 6 - intensity * 3 },
    { id: "adult", weight: 7 - intensity * 2 },
    { id: "guard", weight: 9 },
    { id: "spitter", weight: 6 },
    { id: "skitter", weight: 9 },
    { id: "brute", weight: 9 },
    { id: "stinger", weight: 11 },
    { id: "hunter", weight: 8 + intensity * 2 },
    { id: "razor", weight: 12 + intensity * 4 },
    { id: "carrier", weight: 9 + intensity * 4 },
    { id: "behemoth", weight: 6 + intensity * 4 },
    { id: "phantom", weight: 11 + intensity * 4 },
    { id: "artillery", weight: 5 + intensity * 4 },
    { id: "splitter", weight: 7 },
    { id: "sludge", weight: 7 + intensity * 3 },
    { id: "shade", weight: 8 + intensity * 4 },
  ]);
}
