import { getMetaUpgradeBonus, normalizeMetaUpgrades } from "../../meta";
import type { PlayerEntity } from "../../types";

export function createPlayer(metaUpgrades?: Parameters<typeof normalizeMetaUpgrades>[0]): PlayerEntity {
  const normalizedMeta = normalizeMetaUpgrades(metaUpgrades);
  const player: PlayerEntity = {
    id: "player",
    type: "player",
    x: 0,
    y: 0,
    vx: 0,
    vy: 0,
    radius: 28,
    hp: 120,
    maxHp: 120,
    alive: true,
    contactTimer: 0,
    attackTimer: 0,
    autoAttackTimer: 0,
    facingAngle: 0,
    aimAngle: 0,
    stats: {
      moveSpeed: 292,
      projectileDamage: 26,
      attackCooldown: 0.68,
      projectileCount: 1,
      projectilePierce: 0,
      pickupRadius: 120,
      projectileSpeed: 620,
      autoTurretCount: 0,
      autoTurretCooldown: 1.44,
      orbitalCount: 0,
      orbitalDamage: 22,
      orbitalRespawn: 1.15,
      orbitalDistance: 92,
      orbitalSpeed: 3.7,
    },
  };

  const damageBonus = getMetaUpgradeBonus("baseDamage", normalizedMeta.baseDamage);
  const moveSpeedBonus = getMetaUpgradeBonus("baseMoveSpeed", normalizedMeta.baseMoveSpeed);
  const hpBonus = getMetaUpgradeBonus("baseMaxHp", normalizedMeta.baseMaxHp);

  player.stats.projectileDamage += damageBonus;
  player.stats.moveSpeed += moveSpeedBonus;
  player.maxHp += hpBonus;
  player.hp += hpBonus;

  return player;
}
