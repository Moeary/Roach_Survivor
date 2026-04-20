export type RunState = "running" | "paused" | "levelup" | "relicChoice" | "won" | "lost";
export type DifficultyId = "easy" | "normal" | "hard";
export type EnemyTypeId =
  | "nymph"
  | "adult"
  | "guard"
  | "skitter"
  | "brute"
  | "stinger"
  | "razor"
  | "carrier"
  | "behemoth"
  | "phantom"
  | "spitter"
  | "hunter"
  | "artillery"
  | "boss";
export type BossRole = "wave" | "summon";
export type BossActionState = "chase" | "teleport-windup" | "teleport-recover" | "dash-windup" | "dash-active";
export type DecorationType = "puddle" | "crumb" | "cap" | "drain" | "stain";
export type ObstacleType = "pipe" | "barrel" | "trash";
export type PickupType = "xp" | "goldEgg";
export type ProjectileVariant = "manual" | "auto" | "enemyRanged";
export type MetaUpgradeId =
  | "baseDamage"
  | "baseMoveSpeed"
  | "baseMaxHp"
  | "buffRefresh"
  | "autoRegen"
  | "basePickupRadius"
  | "contactArmor"
  | "levelUpHeal";
export type PlayerSkinId = "labStandard" | "pickleReporter";
export type GameEventType =
  | "playerShot"
  | "enemyDie"
  | "enemyDieHit"
  | "enemyDieExplode"
  | "enemyDieShock"
  | "goldEggGain"
  | "playerHurt"
  | "xpGain"
  | "levelUp"
  | "buffReroll"
  | "bossSpawn"
  | "bossDie"
  | "bossSkillCharge"
  | "bossSkillCast"
  | "bossSummon"
  | "lightningStrike"
  | "playerDefeat"
  | "statusApplied"
  | "relicGained";

export type StatusEffectType = "slow" | "poison";

export interface StatusEffect {
  type: StatusEffectType;
  remaining: number;
  magnitude: number;
  tickTimer?: number;
}
export type RelicId =
  | "ricochet"
  | "critGland"
  | "chainSpore"
  | "frenzyGland"
  | "bloodthirst"
  | "thickSkin"
  | "stressDodge"
  | "magnetTendril"
  | "speedPheromone"
  | "doubleHatch"
  | "glassCannon"
  | "deathRage";

export interface RelicChoice {
  id: RelicId;
  name: string;
  description: string;
  category: string;
}

export type UpgradeId =
  | "damage"
  | "attackSpeed"
  | "volley"
  | "pierce"
  | "moveSpeed"
  | "pickupRadius"
  | "autoTurret"
  | "orbitals"
  | "lightningStrike"
  | "burstShell"
  | "frostEgg"
  | "corrosiveGland";

export interface InputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  aimActive: boolean;
  autoAim: boolean;
  pointerScreenX: number;
  pointerScreenY: number;
}

export interface PlayerStats {
  moveSpeed: number;
  projectileDamage: number;
  attackCooldown: number;
  projectileCount: number;
  projectilePierce: number;
  pickupRadius: number;
  projectileSpeed: number;
  autoTurretCount: number;
  autoTurretDamage: number;
  autoTurretCooldown: number;
  orbitalCount: number;
  orbitalDamage: number;
  orbitalRespawn: number;
  orbitalDistance: number;
  orbitalSpeed: number;
  hpRegenAmount: number;
  contactDamageMultiplier: number;
  levelUpHeal: number;
  lightningDamage: number;
  lightningRadius: number;
  lightningCooldown: number;
  lightningTargetRange: number;
  explosionRadius: number;
  explosionDamageRatio: number;
  slowAmount: number;
  slowDuration: number;
  poisonDps: number;
  poisonDuration: number;
}

export interface EntityBase {
  id: string;
  type: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  hp: number;
  alive: boolean;
}

export interface PlayerEntity extends EntityBase {
  type: "player";
  maxHp: number;
  contactTimer: number;
  attackTimer: number;
  autoAttackTimer: number;
  regenTickTimer: number;
  lightningTimer: number;
  facingAngle: number;
  aimAngle: number;
  speedBuffTimer: number;
  stats: PlayerStats;
}

export interface RangedEnemyConfig {
  damage: number;
  cooldown: number;
  range: number;
  stopDistance: number;
  projectileSpeed: number;
  projectileLife: number;
  projectileRadius: number;
  projectileTint: string;
  moveWhileFiring?: boolean;
}

export interface EnemyEntity extends EntityBase {
  type: EnemyTypeId;
  name: string;
  maxHp: number;
  speed: number;
  damage: number;
  xp: number;
  tint: string;
  pulse: number;
  bossWave?: number;
  bossRole?: BossRole;
  bossAction?: BossActionState;
  bossActionTimer?: number;
  bossActionCooldown?: number;
  bossTargetX?: number;
  bossTargetY?: number;
  bossDashDirectionX?: number;
  bossDashDirectionY?: number;
  ignoresObstacles?: boolean;
  summonCooldown?: number;
  summonTimer?: number;
  summonBurst?: number;
  summonPool?: EnemyTypeId[];
  rangedTimer?: number;
  statusEffects: StatusEffect[];
}

export interface ProjectileEntity {
  id: string;
  type: "eggcase";
  variant: ProjectileVariant;
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  damage: number;
  hitsRemaining: number;
  life: number;
  angle: number;
  tint: string;
  alive: boolean;
  hitIds: Set<string>;
}

export interface OrbitalEntity {
  id: string;
  type: "orbital";
  x: number;
  y: number;
  angle: number;
  radius: number;
  distance: number;
  active: boolean;
  respawnTimer: number;
}

export interface PickupEntity {
  id: string;
  type: PickupType;
  x: number;
  y: number;
  radius: number;
  value: number;
  alive: boolean;
}

export interface EffectEntity {
  id: string;
  type: "burst" | "lightning" | "splatter" | "blood-pool";
  x: number;
  y: number;
  radius: number;
  tint: string;
  alive: boolean;
  age: number;
  duration: number;
  angle?: number;
  seed?: number;
}

export interface Decoration {
  id: string;
  type: DecorationType;
  x: number;
  y: number;
  scale: number;
  rotation: number;
}

export interface ObstacleEntity {
  id: string;
  type: ObstacleType;
  x: number;
  y: number;
  radius: number;
  scale: number;
  rotation: number;
}

export interface UpgradeChoice {
  id: UpgradeId;
  name: string;
  shortName: string;
  description: string;
  currentRank: number;
  nextRank: number;
}

export interface UpgradeSummaryItem {
  id: UpgradeId;
  name: string;
  shortName: string;
  rank: number;
}

export interface DifficultyConfig {
  id: DifficultyId;
  label: string;
  runDuration: number;
  bossWaves: number;
  description: string;
  hpMultiplier: number;
  damageMultiplier: number;
  speedMultiplier: number;
  goldenEggDropChance: number;
}

export interface MetaUpgradeLevels {
  baseDamage: number;
  baseMoveSpeed: number;
  baseMaxHp: number;
  buffRefresh: number;
  autoRegen: number;
  basePickupRadius: number;
  contactArmor: number;
  levelUpHeal: number;
}

export interface MetaProfile {
  goldenEggs: number;
  metaUpgrades: MetaUpgradeLevels;
  unlockedSkinIds: PlayerSkinId[];
  selectedSkinId: PlayerSkinId;
}

export interface GameEvent {
  id: number;
  type: GameEventType;
  amount?: number;
}

export interface RunSetup {
  difficultyId: DifficultyId;
  enabledUpgrades: UpgradeId[];
  metaUpgrades: MetaUpgradeLevels;
  selectedSkinId: PlayerSkinId;
}

export interface EnemyTypeDefinition {
  id: EnemyTypeId;
  name: string;
  radius: number;
  hp: number;
  speed: number;
  damage: number;
  xp: number;
  tint: string;
  bloodTint: string;
  ranged?: RangedEnemyConfig;
}

export interface GameState {
  viewport: {
    width: number;
    height: number;
  };
  map: {
    width: number;
    height: number;
    chunkSize: number;
    infinite: boolean;
  };
  difficulty: DifficultyConfig;
  enabledUpgrades: UpgradeId[];
  runDuration: number;
  runState: RunState;
  timer: number;
  player: PlayerEntity;
  enemies: EnemyEntity[];
  projectiles: ProjectileEntity[];
  orbitals: OrbitalEntity[];
  pickups: PickupEntity[];
  effects: EffectEntity[];
  decorations: Decoration[];
  obstacles: ObstacleEntity[];
  generatedChunks: Set<string>;
  level: number;
  xp: number;
  xpToNext: number;
  upgradeChoices: UpgradeChoice[];
  upgradeLevels: Partial<Record<UpgradeId, number>>;
  upgradesTaken: UpgradeId[];
  lastUpgradeName: string;
  upgradeRefreshesRemaining: number;
  runGoldenEggsCollected: number;
  bossSpawned: boolean;
  bossDefeated: boolean;
  bossWavesSpawned: number;
  bossWavesDefeated: number;
  gameEvents: GameEvent[];
  spawnTimer: number;
  nextGameEventId: number;
  nextEnemyId: number;
  nextProjectileId: number;
  nextOrbitalId: number;
  nextPickupId: number;
  nextEffectId: number;
  sessionStats: SessionStats;
  relics: RelicId[];
  relicChoices: RelicChoice[];
}

export interface SessionStats {
  kills: number;
  damageDealt: number;
  damageTaken: number;
  projectilesFired: number;
  bossesDefeated: number;
  peakLevel: number;
}
