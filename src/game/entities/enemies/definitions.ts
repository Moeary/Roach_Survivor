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
  skitter: STAGE_TWO_START_TIME,
  brute: STAGE_TWO_START_TIME,
  stinger: STAGE_TWO_START_TIME,
  razor: STAGE_THREE_START_TIME,
  carrier: STAGE_THREE_START_TIME,
  behemoth: STAGE_THREE_START_TIME,
  phantom: STAGE_THREE_START_TIME,
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
      { id: "nymph", weight: 58 - intensity * 18 },
      { id: "adult", weight: 28 + intensity * 10 },
      { id: "guard", weight: 14 + intensity * 8 },
    ]);
  }

  if (timer < STAGE_THREE_START_TIME) {
    const intensity = Math.max(0, Math.min(1, (timer - STAGE_TWO_START_TIME) / (STAGE_THREE_START_TIME - STAGE_TWO_START_TIME)));
    return rollWeightedEnemy([
      { id: "nymph", weight: 16 - intensity * 6 },
      { id: "adult", weight: 20 - intensity * 5 },
      { id: "guard", weight: 16 + intensity * 4 },
      { id: "skitter", weight: 16 + intensity * 6 },
      { id: "brute", weight: 12 + intensity * 4 },
      { id: "stinger", weight: 20 + intensity * 5 },
    ]);
  }

  const intensity = Math.max(0, Math.min(1, (timer - STAGE_THREE_START_TIME) / Math.max(1, FINAL_BOSS_TIME - STAGE_THREE_START_TIME)));
  return rollWeightedEnemy([
    { id: "nymph", weight: 7 - intensity * 4 },
    { id: "adult", weight: 8 - intensity * 3 },
    { id: "guard", weight: 10 },
    { id: "skitter", weight: 10 },
    { id: "brute", weight: 10 },
    { id: "stinger", weight: 13 },
    { id: "razor", weight: 13 + intensity * 5 },
    { id: "carrier", weight: 10 + intensity * 4 },
    { id: "behemoth", weight: 7 + intensity * 5 },
    { id: "phantom", weight: 12 + intensity * 4 },
  ]);
}
