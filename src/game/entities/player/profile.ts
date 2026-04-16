import { BASE_LEVEL_UP_HEAL, getMetaUpgradeBonus, normalizeMetaUpgrades } from "../../meta";
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
    regenTickTimer: 3,
    lightningTimer: 0,
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
      autoTurretDamage: 18,
      autoTurretCooldown: 1.44,
      orbitalCount: 0,
      orbitalDamage: 22,
      orbitalRespawn: 1.15,
      orbitalDistance: 92,
      orbitalSpeed: 3.7,
      hpRegenAmount: 0,
      contactDamageMultiplier: 1,
      levelUpHeal: BASE_LEVEL_UP_HEAL,
      lightningDamage: 0,
      lightningRadius: 0,
      lightningCooldown: 0,
      lightningTargetRange: 0,
      explosionRadius: 0,
      explosionDamageRatio: 0,
    },
  };

  const damageBonus = getMetaUpgradeBonus("baseDamage", normalizedMeta.baseDamage);
  const moveSpeedBonus = getMetaUpgradeBonus("baseMoveSpeed", normalizedMeta.baseMoveSpeed);
  const hpBonus = getMetaUpgradeBonus("baseMaxHp", normalizedMeta.baseMaxHp);
  const regenBonus = getMetaUpgradeBonus("autoRegen", normalizedMeta.autoRegen);
  const pickupBonus = getMetaUpgradeBonus("basePickupRadius", normalizedMeta.basePickupRadius);
  const armorBonus = getMetaUpgradeBonus("contactArmor", normalizedMeta.contactArmor);
  const levelUpHealBonus = getMetaUpgradeBonus("levelUpHeal", normalizedMeta.levelUpHeal);

  player.stats.projectileDamage += damageBonus;
  player.stats.moveSpeed += moveSpeedBonus;
  player.maxHp += hpBonus;
  player.hp += hpBonus;
  player.stats.hpRegenAmount += regenBonus;
  player.stats.pickupRadius += pickupBonus;
  player.stats.contactDamageMultiplier *= Math.max(0.55, 1 - armorBonus / 100);
  player.stats.levelUpHeal += levelUpHealBonus;

  return player;
}
