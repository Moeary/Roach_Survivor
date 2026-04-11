import { applyUpgrade, pickUpgradeChoices } from "./upgrades";
import { ENEMY_TYPES, pickEnemyTypeForTime } from "./entities/enemies";
import { createPlayer } from "./entities/player";
import { getDifficultyConfig, normalizeRunSetup } from "./run/config";
import type {
  Decoration,
  DecorationType,
  EffectEntity,
  EnemyEntity,
  EnemyTypeId,
  GameState,
  InputState,
  ObstacleEntity,
  ObstacleType,
  OrbitalEntity,
  PickupEntity,
  PickupType,
  PlayerEntity,
  ProjectileEntity,
  ProjectileVariant,
  RunSetup,
  UpgradeId,
} from "./types";

const VIEWPORT_WIDTH = 1280;
const VIEWPORT_HEIGHT = 720;
const MAP_RENDER_WIDTH = VIEWPORT_WIDTH * 3;
const MAP_RENDER_HEIGHT = VIEWPORT_HEIGHT * 3;
const CHUNK_SIZE = 680;
const WORLD_GENERATION_RADIUS = 2;
const CONTACT_COOLDOWN = 0.62;
const PLAYER_SAFE_RADIUS = 210;
const OBSTACLE_PADDING = 8;
const GOLD_EGG_DROP_CHANCES = {
  nymph: 0.0001,
  adult: 0.0002,
  guard: 0.0003,
} as const;


function distance(aX: number, aY: number, bX: number, bY: number): number {
  return Math.hypot(bX - aX, bY - aY);
}

function normalize(x: number, y: number): { x: number; y: number } {
  const length = Math.hypot(x, y) || 1;
  return { x: x / length, y: y / length };
}

function randomRange(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function getChunkCoord(value: number): number {
  return Math.floor(value / CHUNK_SIZE);
}

function isObstacleBlocking(state: GameState, x: number, y: number, radius: number, padding = 0): boolean {
  return state.obstacles.some((obstacle) => distance(x, y, obstacle.x, obstacle.y) < radius + obstacle.radius + padding);
}

function resolveAgainstObstacles(
  state: GameState,
  entity: Pick<PlayerEntity, "x" | "y" | "vx" | "vy" | "radius"> | Pick<EnemyEntity, "x" | "y" | "vx" | "vy" | "radius">,
  padding = OBSTACLE_PADDING,
): void {
  for (let iteration = 0; iteration < 3; iteration += 1) {
    let resolved = false;

    state.obstacles.forEach((obstacle) => {
      const deltaX = entity.x - obstacle.x;
      const deltaY = entity.y - obstacle.y;
      const actualDistance = Math.hypot(deltaX, deltaY);
      const minimumDistance = entity.radius + obstacle.radius + padding;

      if (actualDistance >= minimumDistance) {
        return;
      }

      const fallback = normalize(entity.vx || 1, entity.vy);
      const normal =
        actualDistance > 0.0001
          ? {
              x: deltaX / actualDistance,
              y: deltaY / actualDistance,
            }
          : fallback;

      entity.x = obstacle.x + normal.x * minimumDistance;
      entity.y = obstacle.y + normal.y * minimumDistance;
      resolved = true;
    });

    if (!resolved) {
      break;
    }
  }
}

function generateDecoration(state: GameState, chunkX: number, chunkY: number, index: number): void {
  const propTypes: DecorationType[] = ["puddle", "crumb", "cap", "drain", "stain"];
  const baseX = chunkX * CHUNK_SIZE;
  const baseY = chunkY * CHUNK_SIZE;

  state.decorations.push({
    id: `prop-${chunkX}-${chunkY}-${index}`,
    type: propTypes[(index + chunkX + chunkY + propTypes.length * 10) % propTypes.length]!,
    x: baseX + randomRange(48, CHUNK_SIZE - 48),
    y: baseY + randomRange(48, CHUNK_SIZE - 48),
    scale: randomRange(0.72, 1.84),
    rotation: randomRange(0, 360),
  });
}

function createObstacle(state: GameState, chunkX: number, chunkY: number, type: ObstacleType, index: number): void {
  const baseX = chunkX * CHUNK_SIZE;
  const baseY = chunkY * CHUNK_SIZE;
  const radius = type === "pipe" ? randomRange(32, 52) : type === "barrel" ? randomRange(28, 40) : randomRange(42, 58);

  for (let attempt = 0; attempt < 14; attempt += 1) {
    const x = baseX + randomRange(96, CHUNK_SIZE - 96);
    const y = baseY + randomRange(96, CHUNK_SIZE - 96);

    if (distance(x, y, state.player.x, state.player.y) < PLAYER_SAFE_RADIUS + radius) {
      continue;
    }

    if (isObstacleBlocking(state, x, y, radius, 34)) {
      continue;
    }

    state.obstacles.push({
      id: `obstacle-${chunkX}-${chunkY}-${index}`,
      type,
      x,
      y,
      radius,
      scale: randomRange(0.88, 1.18),
      rotation: randomRange(0, 360),
    });
    return;
  }
}

function generateChunk(state: GameState, chunkX: number, chunkY: number): void {
  const key = `${chunkX}:${chunkY}`;

  if (state.generatedChunks.has(key)) {
    return;
  }

  state.generatedChunks.add(key);

  const decorationCount = 4 + Math.floor(randomRange(0, 5));
  for (let index = 0; index < decorationCount; index += 1) {
    generateDecoration(state, chunkX, chunkY, index);
  }

  const obstacleTypes: ObstacleType[] = ["pipe", "barrel", "trash"];
  const obstacleCount = Math.random() < 0.68 ? 1 + Math.floor(randomRange(0, 2.8)) : 0;

  for (let index = 0; index < obstacleCount; index += 1) {
    createObstacle(state, chunkX, chunkY, obstacleTypes[Math.floor(randomRange(0, obstacleTypes.length))]!, index);
  }
}

function ensureWorldAroundPlayer(state: GameState): void {
  const centerChunkX = getChunkCoord(state.player.x);
  const centerChunkY = getChunkCoord(state.player.y);

  for (let chunkY = centerChunkY - WORLD_GENERATION_RADIUS; chunkY <= centerChunkY + WORLD_GENERATION_RADIUS; chunkY += 1) {
    for (let chunkX = centerChunkX - WORLD_GENERATION_RADIUS; chunkX <= centerChunkX + WORLD_GENERATION_RADIUS; chunkX += 1) {
      generateChunk(state, chunkX, chunkY);
    }
  }
}

function queueGameEvent(state: GameState, type: GameState["gameEvents"][number]["type"], amount?: number): void {
  state.gameEvents.push({
    id: state.nextGameEventId,
    type,
    amount,
  });
  state.nextGameEventId += 1;
}

export function drainGameEvents(state: GameState) {
  return state.gameEvents.splice(0, state.gameEvents.length);
}

export function createInputState(): InputState {
  return {
    up: false,
    down: false,
    left: false,
    right: false,
    aimActive: false,
    pointerScreenX: VIEWPORT_WIDTH / 2,
    pointerScreenY: VIEWPORT_HEIGHT / 2,
  };
}

export function resetInputState(input: InputState): void {
  input.up = false;
  input.down = false;
  input.left = false;
  input.right = false;
  input.aimActive = false;
  input.pointerScreenX = VIEWPORT_WIDTH / 2;
  input.pointerScreenY = VIEWPORT_HEIGHT / 2;
}

function getBossWaveInterval(state: GameState): number {
  return state.runDuration / state.difficulty.bossWaves;
}

export function createGameState(setup?: RunSetup): GameState {
  const normalizedSetup = normalizeRunSetup(setup);
  const difficulty = getDifficultyConfig(normalizedSetup.difficultyId);
  const state: GameState = {
    viewport: {
      width: VIEWPORT_WIDTH,
      height: VIEWPORT_HEIGHT,
    },
    map: {
      width: MAP_RENDER_WIDTH,
      height: MAP_RENDER_HEIGHT,
      chunkSize: CHUNK_SIZE,
      infinite: true,
    },
    difficulty,
    enabledUpgrades: normalizedSetup.enabledUpgrades.slice(),
    runDuration: difficulty.runDuration,
    runState: "running",
    timer: 0,
    player: createPlayer(normalizedSetup.metaUpgrades),
    enemies: [],
    projectiles: [],
    orbitals: [],
    pickups: [],
    effects: [],
    decorations: [],
    obstacles: [],
    generatedChunks: new Set<string>(),
    level: 1,
    xp: 0,
    xpToNext: 8,
    upgradeChoices: [],
    upgradeLevels: {},
    upgradesTaken: [],
    lastUpgradeName: "",
    upgradeRefreshesRemaining: normalizedSetup.metaUpgrades.buffRefresh,
    runGoldenEggsCollected: 0,
    bossSpawned: false,
    bossDefeated: false,
    bossWavesSpawned: 0,
    bossWavesDefeated: 0,
    gameEvents: [],
    spawnTimer: 0.45,
    nextGameEventId: 0,
    nextEnemyId: 0,
    nextProjectileId: 0,
    nextOrbitalId: 0,
    nextPickupId: 0,
    nextEffectId: 0,
  };

  ensureWorldAroundPlayer(state);

  for (let index = 0; index < 4; index += 1) {
    spawnEnemy(state, "nymph");
  }

  spawnEnemy(state, "adult");
  return state;
}

export function getPhaseLabel(state: GameState): string {
  if (state.bossSpawned && !state.bossDefeated) {
    return `母巢清算 ${state.bossWavesSpawned}/${state.difficulty.bossWaves}`;
  }

  const progress = state.timer / state.runDuration;

  if (progress < 0.2) {
    return "孵化期";
  }

  if (progress < 0.68) {
    return "泛滥期";
  }

  return "硬壳围城";
}

export function getStatusLabel(state: GameState): string {
  if (state.runState === "paused") {
    return "已暂停";
  }

  if (state.runState === "levelup") {
    return "变异选择";
  }

  if (state.runState === "won") {
    return "巢穴清空";
  }

  if (state.runState === "lost") {
    return "壳碎了";
  }

  if (state.bossSpawned && !state.bossDefeated) {
    return `Boss 战 ${state.bossWavesSpawned}/${state.difficulty.bossWaves}`;
  }

  return "生存中";
}

export function getBoss(state: GameState): EnemyEntity | null {
  return state.enemies.find((enemy) => enemy.type === "boss" && enemy.alive) ?? null;
}

function getNearestEnemy(state: GameState, x: number, y: number, maxDistance?: number): EnemyEntity | null {
  let bestEnemy: EnemyEntity | null = null;
  let bestDistance = maxDistance ?? Number.POSITIVE_INFINITY;

  state.enemies.forEach((enemy) => {
    if (!enemy.alive) {
      return;
    }

    const enemyDistance = distance(x, y, enemy.x, enemy.y);

    if (enemyDistance < bestDistance) {
      bestDistance = enemyDistance;
      bestEnemy = enemy;
    }
  });

  return bestEnemy;
}

function createEffect(
  state: GameState,
  effect: Pick<EffectEntity, "x" | "y" | "radius" | "tint"> & Partial<Pick<EffectEntity, "duration">>,
): void {
  state.effects.push({
    id: "fx-" + state.nextEffectId,
    alive: true,
    age: 0,
    duration: effect.duration ?? 0.32,
    x: effect.x,
    y: effect.y,
    radius: effect.radius,
    tint: effect.tint,
    type: "burst",
  });
  state.nextEffectId += 1;
}

function gainXp(state: GameState, amount: number): void {
  state.xp += amount;
  queueGameEvent(state, "xpGain", amount);
}

function collectGoldenEggs(state: GameState, amount: number, x: number, y: number): void {
  state.runGoldenEggsCollected += amount;
  queueGameEvent(state, "goldEggGain", amount);
  createEffect(state, {
    x,
    y,
    radius: 18 + amount * 2.4,
    tint: "#f7d872",
    duration: 0.3,
  });
}

function spawnPickup(state: GameState, x: number, y: number, value: number, type: PickupType = "xp"): void {
  state.pickups.push({
    id: "pickup-" + state.nextPickupId,
    type,
    x,
    y,
    radius: type === "goldEgg" ? 13 + Math.min(16, value * 1.1) : 11 + value * 1.5,
    value,
    alive: true,
  });
  state.nextPickupId += 1;
}

function getBossGoldenEggReward(state: GameState, bossWave: number): number {
  if (bossWave === 1) {
    return state.difficulty.id === "easy" ? 5 : state.difficulty.id === "normal" ? 7 : 9;
  }

  if (bossWave === 2) {
    return state.difficulty.id === "normal" ? 10 : 13;
  }

  return 20;
}

function maybeDropGoldenEgg(state: GameState, enemy: EnemyEntity): void {
  if (enemy.type === "boss") {
    return;
  }

  const chance = GOLD_EGG_DROP_CHANCES[enemy.type];

  if (!chance || Math.random() >= chance) {
    return;
  }

  spawnPickup(state, enemy.x, enemy.y, 1, "goldEgg");
}

function autoCollectGoldenEggs(state: GameState): void {
  state.pickups.forEach((pickup) => {
    if (!pickup.alive || pickup.type !== "goldEgg") {
      return;
    }

    pickup.alive = false;
    collectGoldenEggs(state, pickup.value, pickup.x, pickup.y);
  });
}

function defeatEnemy(state: GameState, enemy: EnemyEntity): void {
  enemy.alive = false;
  queueGameEvent(state, "enemyDie");
  createEffect(state, {
    x: enemy.x,
    y: enemy.y,
    radius: enemy.radius * 1.5,
    tint: enemy.type === "boss" ? "#e74a5a" : "#d98a3e",
    duration: enemy.type === "boss" ? 0.7 : 0.36,
  });

  if (enemy.type === "boss") {
    state.bossSpawned = false;
    state.bossWavesDefeated += 1;
    const reward = getBossGoldenEggReward(state, state.bossWavesDefeated);

    if (state.bossWavesDefeated >= state.difficulty.bossWaves) {
      collectGoldenEggs(state, reward, enemy.x, enemy.y);
      state.bossDefeated = true;
      state.runState = "won";
      autoCollectGoldenEggs(state);
    } else {
      spawnPickup(state, enemy.x, enemy.y, reward, "goldEgg");
    }

    return;
  }

  const orbCount = enemy.type === "guard" ? 2 : 1;

  for (let index = 0; index < orbCount; index += 1) {
    spawnPickup(
      state,
      enemy.x + randomRange(-12, 12),
      enemy.y + randomRange(-12, 12),
      Math.max(1, Math.round(enemy.xp / orbCount)),
    );
  }

  maybeDropGoldenEgg(state, enemy);
}

function findSpawnPosition(state: GameState, radius: number, minDistance = 560, maxDistance = 760): { x: number; y: number } {
  const { player } = state;

  for (let attempt = 0; attempt < 18; attempt += 1) {
    const angle = randomRange(0, Math.PI * 2);
    const length = randomRange(minDistance, maxDistance);
    const x = player.x + Math.cos(angle) * length;
    const y = player.y + Math.sin(angle) * length;

    if (distance(x, y, player.x, player.y) < minDistance * 0.72) {
      continue;
    }

    if (isObstacleBlocking(state, x, y, radius, 18)) {
      continue;
    }

    return { x, y };
  }

  const fallbackDirection = normalize(randomRange(-1, 1), randomRange(-1, 1));
  return {
    x: player.x + fallbackDirection.x * minDistance,
    y: player.y + fallbackDirection.y * minDistance,
  };
}

function spawnEnemy(state: GameState, enemyTypeId: EnemyTypeId, position?: { x: number; y: number }): EnemyEntity {
  const template = ENEMY_TYPES[enemyTypeId];
  const spawnPoint = position ?? findSpawnPosition(state, template.radius);
  const enemy: EnemyEntity = {
    id: "enemy-" + state.nextEnemyId,
    type: template.id,
    x: spawnPoint.x,
    y: spawnPoint.y,
    vx: 0,
    vy: 0,
    radius: template.radius,
    hp: template.hp,
    maxHp: template.hp,
    speed: template.speed,
    damage: template.damage,
    xp: template.xp,
    tint: template.tint,
    alive: true,
    pulse: randomRange(0, Math.PI * 2),
  };

  resolveAgainstObstacles(state, enemy, 10);
  state.nextEnemyId += 1;
  state.enemies.push(enemy);
  return enemy;
}


function spawnBoss(state: GameState): void {
  if (state.bossSpawned || state.bossWavesSpawned >= state.difficulty.bossWaves) {
    return;
  }

  const bossWave = state.bossWavesSpawned + 1;
  state.bossSpawned = true;
  const position = findSpawnPosition(state, ENEMY_TYPES.boss.radius, 720, 860);
  const boss = spawnEnemy(state, "boss", position);
  const waveMultiplier = 1 + (bossWave - 1) * 0.35;
  boss.maxHp = Math.round(boss.maxHp * waveMultiplier);
  boss.hp = boss.maxHp;
  boss.damage = Math.round(boss.damage * (1 + (bossWave - 1) * 0.18));
  boss.speed *= 1 + (bossWave - 1) * 0.06;
  boss.radius += (bossWave - 1) * 4;
  state.bossWavesSpawned = bossWave;
  createEffect(state, {
    x: position.x,
    y: position.y,
    radius: 160,
    tint: "#f04d5d",
    duration: 0.82,
  });
}

function updateSpawning(state: GameState, dt: number): void {
  if (state.bossSpawned) {
    return;
  }

  state.spawnTimer -= dt;
  const enemyCap = Math.min(96, 18 + Math.floor(state.timer / 18) * 3);
  const livingEnemies = state.enemies.reduce((count, enemy) => count + (enemy.alive ? 1 : 0), 0);

  if (livingEnemies >= enemyCap || state.spawnTimer > 0) {
    return;
  }

  const waveSize = Math.min(5, 1 + Math.floor(state.timer / 65));

  for (let index = 0; index < waveSize; index += 1) {
    spawnEnemy(state, pickEnemyTypeForTime(state.timer));
  }

  state.spawnTimer = Math.max(0.34, 1.28 - state.timer * 0.0022);
}

function updatePlayerMovement(state: GameState, input: InputState, dt: number): void {
  const player = state.player;
  const axisX = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  const axisY = (input.down ? 1 : 0) - (input.up ? 1 : 0);
  let direction = { x: 0, y: 0 };

  if (axisX || axisY) {
    direction = normalize(axisX, axisY);
  }

  player.vx = direction.x * player.stats.moveSpeed;
  player.vy = direction.y * player.stats.moveSpeed;
  player.x += player.vx * dt;
  player.y += player.vy * dt;
  resolveAgainstObstacles(state, player);

  if (player.contactTimer > 0) {
    player.contactTimer = Math.max(0, player.contactTimer - dt);
  }

  if (input.aimActive) {
    const aimDeltaX = input.pointerScreenX - state.viewport.width / 2;
    const aimDeltaY = input.pointerScreenY - state.viewport.height / 2;

    if (Math.abs(aimDeltaX) > 1 || Math.abs(aimDeltaY) > 1) {
      player.aimAngle = Math.atan2(aimDeltaY, aimDeltaX);
      player.facingAngle = player.aimAngle;
    }
  } else if (axisX || axisY) {
    player.aimAngle = Math.atan2(direction.y, direction.x);
    player.facingAngle = player.aimAngle;
  }
}

function updateEnemies(state: GameState, dt: number): void {
  const { player } = state;
  const livingEnemies: EnemyEntity[] = [];

  state.enemies.forEach((enemy) => {
    if (!enemy.alive) {
      return;
    }

    const direction = normalize(player.x - enemy.x, player.y - enemy.y);
    const aggression = enemy.type === "boss" ? 1 : 1 + Math.min(0.35, state.timer * 0.0011);

    enemy.vx = direction.x * enemy.speed * aggression;
    enemy.vy = direction.y * enemy.speed * aggression;
    enemy.x += enemy.vx * dt;
    enemy.y += enemy.vy * dt;
    resolveAgainstObstacles(state, enemy, 12);
    enemy.pulse += dt * 5;
    livingEnemies.push(enemy);

    if (distance(enemy.x, enemy.y, player.x, player.y) <= enemy.radius + player.radius - 3 && player.contactTimer <= 0) {
      const knockbackX = direction.x * 28;
      const knockbackY = direction.y * 28;

      player.hp = Math.max(0, player.hp - enemy.damage);
      player.contactTimer = CONTACT_COOLDOWN;
      queueGameEvent(state, "playerHurt", enemy.damage);
      player.x += knockbackX;
      player.y += knockbackY;
      enemy.x -= knockbackX * 0.7;
      enemy.y -= knockbackY * 0.7;
      resolveAgainstObstacles(state, player);
      resolveAgainstObstacles(state, enemy, 12);

      createEffect(state, {
        x: player.x,
        y: player.y,
        radius: player.radius * 1.2,
        tint: "#ff9c47",
        duration: 0.25,
      });
    }
  });

  for (let firstIndex = 0; firstIndex < livingEnemies.length; firstIndex += 1) {
    for (let secondIndex = firstIndex + 1; secondIndex < livingEnemies.length; secondIndex += 1) {
      const firstEnemy = livingEnemies[firstIndex]!;
      const secondEnemy = livingEnemies[secondIndex]!;
      const deltaX = secondEnemy.x - firstEnemy.x;
      const deltaY = secondEnemy.y - firstEnemy.y;
      const minimumDistance = firstEnemy.radius + secondEnemy.radius - 6;
      const actualDistance = Math.hypot(deltaX, deltaY) || 1;

      if (actualDistance >= minimumDistance) {
        continue;
      }

      const push = (minimumDistance - actualDistance) * 0.5;
      const normalX = deltaX / actualDistance;
      const normalY = deltaY / actualDistance;

      firstEnemy.x -= normalX * push;
      firstEnemy.y -= normalY * push;
      secondEnemy.x += normalX * push;
      secondEnemy.y += normalY * push;
      resolveAgainstObstacles(state, firstEnemy, 12);
      resolveAgainstObstacles(state, secondEnemy, 12);
    }
  }
}

function spawnProjectile(
  state: GameState,
  angle: number,
  options: {
    variant: ProjectileVariant;
    damage: number;
    hitsRemaining: number;
    life: number;
    radius: number;
    speed: number;
    tint: string;
  },
): void {
  const player = state.player;
  const spawnDistance = player.radius + 16;
  const projectile: ProjectileEntity = {
    id: "projectile-" + state.nextProjectileId,
    type: "eggcase",
    variant: options.variant,
    x: player.x + Math.cos(angle) * spawnDistance,
    y: player.y + Math.sin(angle) * spawnDistance,
    vx: Math.cos(angle) * options.speed,
    vy: Math.sin(angle) * options.speed,
    radius: options.radius,
    damage: options.damage,
    hitsRemaining: options.hitsRemaining,
    life: options.life,
    angle,
    tint: options.tint,
    alive: true,
    hitIds: new Set<string>(),
  };

  state.projectiles.push(projectile);
  state.nextProjectileId += 1;
}

function fireSpread(
  state: GameState,
  angle: number,
  count: number,
  options: {
    variant: ProjectileVariant;
    damage: number;
    hitsRemaining: number;
    life: number;
    radius: number;
    speed: number;
    tint: string;
    spreadCap?: number;
  },
): void {
  const spreadStep = count > 1 ? Math.min(options.spreadCap ?? 0.28, 0.08 + count * 0.018) : 0;

  for (let index = 0; index < count; index += 1) {
    const offset = (index - (count - 1) / 2) * spreadStep;
    spawnProjectile(state, angle + offset, options);
  }
}

function updateManualFire(state: GameState, input: InputState, dt: number): void {
  const { player } = state;
  player.attackTimer -= dt;

  if (!input.aimActive && Math.abs(player.vx) < 0.01 && Math.abs(player.vy) < 0.01) {
    player.attackTimer = 0;
    return;
  }

  while (player.attackTimer <= 0) {
    fireSpread(state, player.aimAngle, player.stats.projectileCount, {
      variant: "manual",
      damage: player.stats.projectileDamage,
      hitsRemaining: 1 + player.stats.projectilePierce,
      life: 1.5,
      radius: 12,
      speed: player.stats.projectileSpeed,
      tint: "#f4f0d2",
    });

    createEffect(state, {
      x: player.x + Math.cos(player.aimAngle) * (player.radius + 8),
      y: player.y + Math.sin(player.aimAngle) * (player.radius + 8),
      radius: 14,
      tint: "#ecf4bf",
      duration: 0.18,
    });
    queueGameEvent(state, "playerShot");

    player.attackTimer += player.stats.attackCooldown;
  }
}

function updateAutoTurrets(state: GameState, dt: number): void {
  const { player } = state;

  if (player.stats.autoTurretCount <= 0) {
    return;
  }

  player.autoAttackTimer -= dt;

  while (player.autoAttackTimer <= 0) {
    const target = getNearestEnemy(state, player.x, player.y, 940);

    if (!target) {
      player.autoAttackTimer = 0;
      return;
    }

    const angle = Math.atan2(target.y - player.y, target.x - player.x);

    fireSpread(state, angle, player.stats.autoTurretCount, {
      variant: "auto",
      damage: player.stats.projectileDamage * 0.68,
      hitsRemaining: 1,
      life: 1.2,
      radius: 10,
      speed: player.stats.projectileSpeed * 0.92,
      tint: "#dff6a8",
      spreadCap: 0.22,
    });

    createEffect(state, {
      x: player.x + Math.cos(angle) * (player.radius + 2),
      y: player.y + Math.sin(angle) * (player.radius + 2),
      radius: 12,
      tint: "#c8ff96",
      duration: 0.16,
    });
    queueGameEvent(state, "playerShot");

    player.autoAttackTimer += player.stats.autoTurretCooldown;
  }
}

function syncOrbitals(state: GameState): void {
  const desired = state.player.stats.orbitalCount;

  if (desired <= 0) {
    state.orbitals = [];
    return;
  }

  if (state.orbitals.length === desired) {
    return;
  }

  const nextOrbitals: OrbitalEntity[] = [];

  for (let index = 0; index < desired; index += 1) {
    const existing = state.orbitals[index];
    nextOrbitals.push(
      existing ?? {
        id: "orbital-" + state.nextOrbitalId,
        type: "orbital",
        x: state.player.x,
        y: state.player.y,
        angle: (Math.PI * 2 * index) / desired,
        radius: 14,
        distance: state.player.stats.orbitalDistance,
        active: true,
        respawnTimer: 0,
      },
    );

    if (!existing) {
      state.nextOrbitalId += 1;
    }
  }

  nextOrbitals.forEach((orbital, index) => {
    if (!state.orbitals.includes(orbital)) {
      orbital.angle = (Math.PI * 2 * index) / desired;
    }
  });

  state.orbitals = nextOrbitals;
}

function updateOrbitals(state: GameState, dt: number): void {
  syncOrbitals(state);

  state.orbitals.forEach((orbital, index) => {
    orbital.radius = 14;
    orbital.distance = state.player.stats.orbitalDistance + (index % 2) * 6;
    orbital.angle += state.player.stats.orbitalSpeed * dt;
    orbital.x = state.player.x + Math.cos(orbital.angle) * orbital.distance;
    orbital.y = state.player.y + Math.sin(orbital.angle) * orbital.distance;

    if (!orbital.active) {
      orbital.respawnTimer -= dt;

      if (orbital.respawnTimer <= 0) {
        orbital.active = true;
        orbital.respawnTimer = 0;
        createEffect(state, {
          x: orbital.x,
          y: orbital.y,
          radius: 14,
          tint: "#d9f5a4",
          duration: 0.2,
        });
      }

      return;
    }

    for (const enemy of state.enemies) {
      if (!enemy.alive) {
        continue;
      }

      if (distance(orbital.x, orbital.y, enemy.x, enemy.y) > orbital.radius + enemy.radius) {
        continue;
      }

      enemy.hp -= state.player.stats.orbitalDamage;
      orbital.active = false;
      orbital.respawnTimer = state.player.stats.orbitalRespawn;

      createEffect(state, {
        x: orbital.x,
        y: orbital.y,
        radius: 20,
        tint: enemy.type === "boss" ? "#ff8b9d" : "#f4e89d",
        duration: 0.2,
      });

      if (enemy.hp <= 0) {
        defeatEnemy(state, enemy);
      }

      break;
    }
  });
}

function projectileHitsObstacle(projectile: ProjectileEntity, obstacles: ObstacleEntity[]): boolean {
  return obstacles.some((obstacle) => distance(projectile.x, projectile.y, obstacle.x, obstacle.y) <= projectile.radius + obstacle.radius * 0.86);
}

function updateProjectiles(state: GameState, dt: number): void {
  state.projectiles.forEach((projectile) => {
    if (!projectile.alive) {
      return;
    }

    projectile.x += projectile.vx * dt;
    projectile.y += projectile.vy * dt;
    projectile.life -= dt;

    if (projectile.life <= 0) {
      projectile.alive = false;
      return;
    }

    if (projectileHitsObstacle(projectile, state.obstacles)) {
      projectile.alive = false;
      createEffect(state, {
        x: projectile.x,
        y: projectile.y,
        radius: 14,
        tint: "#7f8e92",
        duration: 0.18,
      });
      return;
    }

    for (const enemy of state.enemies) {
      if (!enemy.alive || projectile.hitIds.has(enemy.id)) {
        continue;
      }

      if (distance(projectile.x, projectile.y, enemy.x, enemy.y) > projectile.radius + enemy.radius) {
        continue;
      }

      projectile.hitIds.add(enemy.id);
      enemy.hp -= projectile.damage;
      projectile.hitsRemaining -= 1;

      createEffect(state, {
        x: projectile.x,
        y: projectile.y,
        radius: 16,
        tint: enemy.type === "boss" ? "#ff6f7e" : "#f2db83",
        duration: 0.18,
      });

      if (enemy.hp <= 0) {
        defeatEnemy(state, enemy);
      }

      if (projectile.hitsRemaining <= 0) {
        projectile.alive = false;
        break;
      }
    }
  });
}

function updatePickups(state: GameState, dt: number): void {
  const { player } = state;

  state.pickups.forEach((pickup) => {
    if (!pickup.alive) {
      return;
    }

    const deltaX = player.x - pickup.x;
    const deltaY = player.y - pickup.y;
    const orbDistance = Math.hypot(deltaX, deltaY) || 1;
    const attractDistance = player.stats.pickupRadius + 86;

    if (orbDistance <= attractDistance) {
      const direction = normalize(deltaX, deltaY);
      const speed = 170 + (attractDistance - orbDistance) * 2.8;
      pickup.x += direction.x * speed * dt;
      pickup.y += direction.y * speed * dt;
    }

    if (orbDistance <= player.radius + pickup.radius) {
      if (pickup.type === "xp") {
        gainXp(state, pickup.value);
      } else {
        collectGoldenEggs(state, pickup.value, pickup.x, pickup.y);
      }

      pickup.alive = false;

      if (pickup.type === "xp") {
        createEffect(state, {
          x: pickup.x,
          y: pickup.y,
          radius: pickup.radius * 1.4,
          tint: "#d7f06d",
          duration: 0.24,
        });
      }
    }
  });
}

function updateEffects(state: GameState, dt: number): void {
  state.effects.forEach((effect) => {
    effect.age += dt;

    if (effect.age >= effect.duration) {
      effect.alive = false;
    }
  });
}

function checkLevelUp(state: GameState): void {
  if (state.runState !== "running" || state.xp < state.xpToNext) {
    return;
  }

  state.xp -= state.xpToNext;
  state.level += 1;
  state.xpToNext = Math.floor(state.xpToNext * 1.24 + 4);
  state.upgradeChoices = pickUpgradeChoices(state, 3);
  queueGameEvent(state, "levelUp");
  state.runState = "levelup";
}

export function refreshUpgradeChoices(state: GameState): boolean {
  if (state.runState !== "levelup" || state.upgradeRefreshesRemaining <= 0) {
    return false;
  }

  const currentIds = state.upgradeChoices.map((choice) => choice.id).sort().join("|");

  for (let attempt = 0; attempt < 6; attempt += 1) {
    const nextChoices = pickUpgradeChoices(state, 3);
    const nextIds = nextChoices.map((choice) => choice.id).sort().join("|");

    state.upgradeChoices = nextChoices;

    if (nextIds !== currentIds || attempt === 5) {
      break;
    }
  }

  state.upgradeRefreshesRemaining -= 1;
  queueGameEvent(state, "buffReroll");
  return true;
}

function cleanupEntities(state: GameState): void {
  state.enemies = state.enemies.filter((enemy) => enemy.alive);
  state.projectiles = state.projectiles.filter((projectile) => projectile.alive);
  state.pickups = state.pickups.filter((pickup) => pickup.alive);
  state.effects = state.effects.filter((effect) => effect.alive);
}

export function updateGame(state: GameState, input: InputState, deltaSeconds: number): GameState {
  if (state.runState !== "running") {
    return state;
  }

  const dt = Math.min(0.05, deltaSeconds);
  const bossInterval = getBossWaveInterval(state);

  if (state.bossSpawned) {
    state.timer = Math.min(state.runDuration, bossInterval * state.bossWavesSpawned);
  } else {
    state.timer = Math.min(state.runDuration, state.timer + dt);
  }

  ensureWorldAroundPlayer(state);

  if (state.timer >= bossInterval * (state.bossWavesSpawned + 1)) {
    spawnBoss(state);
  }

  updatePlayerMovement(state, input, dt);
  ensureWorldAroundPlayer(state);
  updateSpawning(state, dt);
  updateEnemies(state, dt);
  updateManualFire(state, input, dt);
  updateAutoTurrets(state, dt);
  updateOrbitals(state, dt);
  updateProjectiles(state, dt);
  updatePickups(state, dt);
  updateEffects(state, dt);
  cleanupEntities(state);

  if (state.player.hp <= 0) {
    state.player.alive = false;
    state.runState = "lost";
    autoCollectGoldenEggs(state);
  }

  if (state.runState === "running") {
    checkLevelUp(state);
  }

  return state;
}

export function chooseUpgrade(state: GameState, upgradeId: UpgradeId): boolean {
  if (state.runState !== "levelup") {
    return false;
  }

  const applied = applyUpgrade(state, upgradeId);

  if (!applied) {
    return false;
  }

  state.upgradeChoices = [];
  state.player.hp = Math.min(state.player.maxHp, state.player.hp + 18);
  state.runState = "running";
  return true;
}

export function togglePause(state: GameState): boolean {
  if (state.runState === "running") {
    state.runState = "paused";
    return true;
  }

  if (state.runState === "paused") {
    state.runState = "running";
    return true;
  }

  return false;
}

export function getCamera(state: GameState): { x: number; y: number } {
  return {
    x: state.player.x,
    y: state.player.y,
  };
}

export function formatTime(seconds: number): string {
  const wholeSeconds = Math.max(0, Math.floor(seconds));
  const minutes = String(Math.floor(wholeSeconds / 60)).padStart(2, "0");
  const remainder = String(wholeSeconds % 60).padStart(2, "0");
  return minutes + ":" + remainder;
}


