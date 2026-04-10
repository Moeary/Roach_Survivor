export type RunState = "running" | "paused" | "levelup" | "won" | "lost";
export type DifficultyId = "easy" | "normal" | "hard";
export type EnemyTypeId = "nymph" | "adult" | "guard" | "boss";
export type DecorationType = "puddle" | "crumb" | "cap" | "drain" | "stain";
export type ObstacleType = "pipe" | "barrel" | "trash";
export type PickupType = "xp" | "goldEgg";
export type ProjectileVariant = "manual" | "auto";
export type MetaUpgradeId = "baseDamage" | "baseMoveSpeed" | "baseMaxHp" | "buffRefresh";
export type GameEventType = "playerShot" | "enemyDie" | "goldEggGain" | "playerHurt" | "xpGain" | "levelUp" | "buffReroll";
export type UpgradeId =
  | "damage"
  | "attackSpeed"
  | "volley"
  | "pierce"
  | "moveSpeed"
  | "pickupRadius"
  | "autoTurret"
  | "orbitals";

export interface InputState {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
  aimActive: boolean;
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
  autoTurretCooldown: number;
  orbitalCount: number;
  orbitalDamage: number;
  orbitalRespawn: number;
  orbitalDistance: number;
  orbitalSpeed: number;
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
  facingAngle: number;
  aimAngle: number;
  stats: PlayerStats;
}

export interface EnemyEntity extends EntityBase {
  type: EnemyTypeId;
  maxHp: number;
  speed: number;
  damage: number;
  xp: number;
  tint: string;
  pulse: number;
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
  type: "burst";
  x: number;
  y: number;
  radius: number;
  tint: string;
  alive: boolean;
  age: number;
  duration: number;
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
}

export interface MetaUpgradeLevels {
  baseDamage: number;
  baseMoveSpeed: number;
  baseMaxHp: number;
  buffRefresh: number;
}

export interface MetaProfile {
  goldenEggs: number;
  metaUpgrades: MetaUpgradeLevels;
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
}

export interface SessionStats {
  kills: number;
}
