import type { EnemyTypeDefinition, EnemyTypeId } from "../../types";

export const ENEMY_TYPES: Record<EnemyTypeId, EnemyTypeDefinition> = {
  nymph: {
    id: "nymph",
    name: "幼体",
    radius: 18,
    hp: 24,
    speed: 124,
    damage: 6,
    xp: 1,
    tint: "#d6bf80",
  },
  adult: {
    id: "adult",
    name: "成虫",
    radius: 24,
    hp: 46,
    speed: 94,
    damage: 10,
    xp: 2,
    tint: "#a75e34",
  },
  guard: {
    id: "guard",
    name: "厚壳卫兵",
    radius: 34,
    hp: 98,
    speed: 66,
    damage: 15,
    xp: 4,
    tint: "#54372c",
  },
  boss: {
    id: "boss",
    name: "母巢女王",
    radius: 72,
    hp: 1400,
    speed: 62,
    damage: 24,
    xp: 0,
    tint: "#7d2035",
  },
};

export function pickEnemyTypeForTime(timer: number): EnemyTypeId {
  const roll = Math.random();

  if (timer < 45) {
    return roll < 0.78 ? "nymph" : "adult";
  }

  if (timer < 120) {
    if (roll < 0.48) {
      return "nymph";
    }

    if (roll < 0.9) {
      return "adult";
    }

    return "guard";
  }

  if (timer < 220) {
    if (roll < 0.2) {
      return "nymph";
    }

    if (roll < 0.72) {
      return "adult";
    }

    return "guard";
  }

  return roll < 0.15 ? "adult" : "guard";
}
