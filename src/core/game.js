(function (global) {
  const NS = global.RoachSurvivor = global.RoachSurvivor || {};

  const VIEWPORT_WIDTH = 1280;
  const VIEWPORT_HEIGHT = 720;
  const MAP_WIDTH = 3600;
  const MAP_HEIGHT = 2400;
  const RUN_DURATION = 300;
  const CONTACT_COOLDOWN = 0.62;

  const ENEMY_TYPES = {
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

  function clamp(value, min, max) {
    return Math.max(min, Math.min(max, value));
  }

  function distance(aX, aY, bX, bY) {
    return Math.hypot(bX - aX, bY - aY);
  }

  function normalize(x, y) {
    const length = Math.hypot(x, y) || 1;
    return {
      x: x / length,
      y: y / length,
    };
  }

  function randomRange(min, max) {
    return min + Math.random() * (max - min);
  }

  function createInputState() {
    return {
      up: false,
      down: false,
      left: false,
      right: false,
    };
  }

  function resetInputState(input) {
    input.up = false;
    input.down = false;
    input.left = false;
    input.right = false;
  }

  function createPlayer() {
    return {
      id: "player",
      type: "player",
      x: MAP_WIDTH / 2,
      y: MAP_HEIGHT / 2,
      vx: 0,
      vy: 0,
      radius: 28,
      hp: 120,
      maxHp: 120,
      alive: true,
      contactTimer: 0,
      attackTimer: 0,
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
      },
    };
  }

  function createDecorations() {
    const props = [];
    const propTypes = ["puddle", "crumb", "cap", "drain", "stain"];

    for (let index = 0; index < 72; index += 1) {
      props.push({
        id: "prop-" + index,
        type: propTypes[index % propTypes.length],
        x: randomRange(120, MAP_WIDTH - 120),
        y: randomRange(120, MAP_HEIGHT - 120),
        scale: randomRange(0.8, 1.8),
        rotation: randomRange(0, 360),
      });
    }

    return props;
  }

  function createGameState() {
    const state = {
      viewport: {
        width: VIEWPORT_WIDTH,
        height: VIEWPORT_HEIGHT,
      },
      map: {
        width: MAP_WIDTH,
        height: MAP_HEIGHT,
      },
      runDuration: RUN_DURATION,
      runState: "running",
      timer: 0,
      player: createPlayer(),
      enemies: [],
      projectiles: [],
      pickups: [],
      effects: [],
      decorations: createDecorations(),
      level: 1,
      xp: 0,
      xpToNext: 8,
      upgradeChoices: [],
      upgradeLevels: {},
      upgradesTaken: [],
      lastUpgradeName: "",
      bossSpawned: false,
      bossDefeated: false,
      spawnTimer: 0.45,
      nextEnemyId: 0,
      nextProjectileId: 0,
      nextPickupId: 0,
      nextEffectId: 0,
    };

    for (let index = 0; index < 4; index += 1) {
      spawnEnemy(state, "nymph");
    }

    for (let index = 0; index < 1; index += 1) {
      spawnEnemy(state, "adult");
    }

    return state;
  }

  function getPhaseLabel(state) {
    if (state.bossSpawned && !state.bossDefeated) {
      return "母巢清算";
    }

    if (state.timer < 60) {
      return "孵化期";
    }

    if (state.timer < 180) {
      return "泛滥期";
    }

    return "硬壳围城";
  }

  function getStatusLabel(state) {
    if (state.runState === "paused") {
      return "已暂停";
    }

    if (state.runState === "levelup") {
      return "变异选择";
    }

    if (state.runState === "won") {
      return "女王粉碎";
    }

    if (state.runState === "lost") {
      return "壳碎了";
    }

    if (state.bossSpawned && !state.bossDefeated) {
      return "Boss 战";
    }

    return "生存中";
  }

  function getBoss(state) {
    return state.enemies.find((enemy) => enemy.type === "boss" && enemy.alive) || null;
  }

  function getNearestEnemy(state, x, y, maxDistance) {
    let bestEnemy = null;
    let bestDistance = typeof maxDistance === "number" ? maxDistance : Number.POSITIVE_INFINITY;

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

  function createEffect(state, effect) {
    state.effects.push({
      id: "fx-" + state.nextEffectId,
      alive: true,
      age: 0,
      duration: effect.duration || 0.32,
      x: effect.x,
      y: effect.y,
      radius: effect.radius || 16,
      tint: effect.tint || "#d7f06d",
      type: effect.type || "burst",
    });
    state.nextEffectId += 1;
  }

  function gainXp(state, amount) {
    state.xp += amount;
  }

  function spawnPickup(state, x, y, value) {
    state.pickups.push({
      id: "pickup-" + state.nextPickupId,
      type: "xp",
      x,
      y,
      radius: 11 + value * 1.5,
      value,
      alive: true,
    });
    state.nextPickupId += 1;
  }

  function defeatEnemy(state, enemy) {
    enemy.alive = false;
    createEffect(state, {
      x: enemy.x,
      y: enemy.y,
      radius: enemy.radius * 1.5,
      tint: enemy.type === "boss" ? "#e74a5a" : "#d98a3e",
      duration: enemy.type === "boss" ? 0.7 : 0.36,
    });

    if (enemy.type === "boss") {
      state.bossDefeated = true;
      state.runState = "won";
      return;
    }

    const orbCount = enemy.type === "guard" ? 2 : 1;

    for (let index = 0; index < orbCount; index += 1) {
      spawnPickup(
        state,
        enemy.x + randomRange(-12, 12),
        enemy.y + randomRange(-12, 12),
        Math.max(1, Math.round(enemy.xp / orbCount))
      );
    }
  }

  function findSpawnPosition(state, minDistance, maxDistance) {
    const player = state.player;
    const min = minDistance || 560;
    const max = maxDistance || 760;

    for (let attempt = 0; attempt < 12; attempt += 1) {
      const angle = randomRange(0, Math.PI * 2);
      const length = randomRange(min, max);
      const x = clamp(player.x + Math.cos(angle) * length, 80, state.map.width - 80);
      const y = clamp(player.y + Math.sin(angle) * length, 80, state.map.height - 80);

      if (distance(x, y, player.x, player.y) >= min * 0.7) {
        return { x, y };
      }
    }

    return {
      x: randomRange(80, state.map.width - 80),
      y: randomRange(80, state.map.height - 80),
    };
  }

  function spawnEnemy(state, enemyTypeId, options) {
    const enemyTemplate = ENEMY_TYPES[enemyTypeId];

    if (!enemyTemplate) {
      return null;
    }

    const spawnPoint = (options && options.position) || findSpawnPosition(state);
    const enemy = {
      id: "enemy-" + state.nextEnemyId,
      type: enemyTemplate.id,
      x: spawnPoint.x,
      y: spawnPoint.y,
      vx: 0,
      vy: 0,
      radius: enemyTemplate.radius,
      hp: enemyTemplate.hp,
      maxHp: enemyTemplate.hp,
      speed: enemyTemplate.speed,
      damage: enemyTemplate.damage,
      xp: enemyTemplate.xp,
      tint: enemyTemplate.tint,
      alive: true,
      pulse: randomRange(0, Math.PI * 2),
    };

    state.nextEnemyId += 1;
    state.enemies.push(enemy);
    return enemy;
  }

  function pickEnemyTypeForTime(timer) {
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

    if (roll < 0.15) {
      return "adult";
    }

    return "guard";
  }

  function spawnBoss(state) {
    if (state.bossSpawned) {
      return;
    }

    state.bossSpawned = true;
    const position = findSpawnPosition(state, 720, 840);
    spawnEnemy(state, "boss", { position });
    createEffect(state, {
      x: position.x,
      y: position.y,
      radius: 160,
      tint: "#f04d5d",
      duration: 0.82,
    });
  }

  function updateSpawning(state, dt) {
    if (state.bossSpawned) {
      return;
    }

    state.spawnTimer -= dt;

    const enemyCap = Math.min(92, 18 + Math.floor(state.timer / 18) * 3);

    if (state.enemies.length >= enemyCap || state.spawnTimer > 0) {
      return;
    }

    const waveSize = Math.min(5, 1 + Math.floor(state.timer / 65));

    for (let index = 0; index < waveSize; index += 1) {
      spawnEnemy(state, pickEnemyTypeForTime(state.timer));
    }

    state.spawnTimer = Math.max(0.34, 1.28 - state.timer * 0.0022);
  }

  function updatePlayerMovement(state, input, dt) {
    const player = state.player;
    const axisX = (input.right ? 1 : 0) - (input.left ? 1 : 0);
    const axisY = (input.down ? 1 : 0) - (input.up ? 1 : 0);
    let direction = { x: 0, y: 0 };

    if (axisX || axisY) {
      direction = normalize(axisX, axisY);
    }

    player.vx = direction.x * player.stats.moveSpeed;
    player.vy = direction.y * player.stats.moveSpeed;
    player.x = clamp(player.x + player.vx * dt, player.radius, state.map.width - player.radius);
    player.y = clamp(player.y + player.vy * dt, player.radius, state.map.height - player.radius);

    if (player.contactTimer > 0) {
      player.contactTimer = Math.max(0, player.contactTimer - dt);
    }

    const target = getNearestEnemy(state, player.x, player.y, 880);

    if (target) {
      player.aimAngle = Math.atan2(target.y - player.y, target.x - player.x);
    } else if (axisX || axisY) {
      player.aimAngle = Math.atan2(direction.y, direction.x);
    }

    if (axisX || axisY) {
      player.facingAngle = Math.atan2(direction.y, direction.x);
    }
  }

  function updateEnemies(state, dt) {
    const player = state.player;
    const livingEnemies = [];

    state.enemies.forEach((enemy) => {
      if (!enemy.alive) {
        return;
      }

      const direction = normalize(player.x - enemy.x, player.y - enemy.y);
      const aggression = enemy.type === "boss" ? 1 : 1 + Math.min(0.35, state.timer * 0.0011);

      enemy.vx = direction.x * enemy.speed * aggression;
      enemy.vy = direction.y * enemy.speed * aggression;
      enemy.x = clamp(enemy.x + enemy.vx * dt, enemy.radius, state.map.width - enemy.radius);
      enemy.y = clamp(enemy.y + enemy.vy * dt, enemy.radius, state.map.height - enemy.radius);
      enemy.pulse += dt * 5;
      livingEnemies.push(enemy);

      if (
        distance(enemy.x, enemy.y, player.x, player.y) <= enemy.radius + player.radius - 3 &&
        player.contactTimer <= 0
      ) {
        const knockbackX = direction.x * 28;
        const knockbackY = direction.y * 28;
        player.hp = Math.max(0, player.hp - enemy.damage);
        player.contactTimer = CONTACT_COOLDOWN;
        player.x = clamp(player.x + knockbackX, player.radius, state.map.width - player.radius);
        player.y = clamp(player.y + knockbackY, player.radius, state.map.height - player.radius);
        enemy.x = clamp(enemy.x - knockbackX * 0.7, enemy.radius, state.map.width - enemy.radius);
        enemy.y = clamp(enemy.y - knockbackY * 0.7, enemy.radius, state.map.height - enemy.radius);
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
        const firstEnemy = livingEnemies[firstIndex];
        const secondEnemy = livingEnemies[secondIndex];
        const deltaX = secondEnemy.x - firstEnemy.x;
        const deltaY = secondEnemy.y - firstEnemy.y;
        const minDistance = firstEnemy.radius + secondEnemy.radius - 6;
        const actualDistance = Math.hypot(deltaX, deltaY) || 1;

        if (actualDistance >= minDistance) {
          continue;
        }

        const push = (minDistance - actualDistance) * 0.5;
        const normalX = deltaX / actualDistance;
        const normalY = deltaY / actualDistance;

        firstEnemy.x = clamp(firstEnemy.x - normalX * push, firstEnemy.radius, state.map.width - firstEnemy.radius);
        firstEnemy.y = clamp(firstEnemy.y - normalY * push, firstEnemy.radius, state.map.height - firstEnemy.radius);
        secondEnemy.x = clamp(secondEnemy.x + normalX * push, secondEnemy.radius, state.map.width - secondEnemy.radius);
        secondEnemy.y = clamp(secondEnemy.y + normalY * push, secondEnemy.radius, state.map.height - secondEnemy.radius);
      }
    }
  }

  function spawnProjectile(state, angle) {
    const player = state.player;
    const spawnDistance = player.radius + 16;

    state.projectiles.push({
      id: "projectile-" + state.nextProjectileId,
      type: "eggcase",
      x: player.x + Math.cos(angle) * spawnDistance,
      y: player.y + Math.sin(angle) * spawnDistance,
      vx: Math.cos(angle) * player.stats.projectileSpeed,
      vy: Math.sin(angle) * player.stats.projectileSpeed,
      radius: 12,
      damage: player.stats.projectileDamage,
      hitsRemaining: 1 + player.stats.projectilePierce,
      life: 1.5,
      angle,
      alive: true,
      hitIds: new Set(),
    });
    state.nextProjectileId += 1;
  }

  function updateAutoFire(state, dt) {
    const player = state.player;
    player.attackTimer -= dt;

    while (player.attackTimer <= 0) {
      const target = getNearestEnemy(state, player.x, player.y, 960);

      if (!target) {
        player.attackTimer = 0;
        return;
      }

      const baseAngle = Math.atan2(target.y - player.y, target.x - player.x);
      const count = player.stats.projectileCount;
      const spreadStep = count > 1 ? Math.min(0.28, 0.08 + count * 0.018) : 0;

      for (let index = 0; index < count; index += 1) {
        const offset = (index - (count - 1) / 2) * spreadStep;
        spawnProjectile(state, baseAngle + offset);
      }

      player.aimAngle = baseAngle;
      createEffect(state, {
        x: player.x + Math.cos(baseAngle) * (player.radius + 8),
        y: player.y + Math.sin(baseAngle) * (player.radius + 8),
        radius: 14,
        tint: "#ecf4bf",
        duration: 0.18,
      });
      player.attackTimer += player.stats.attackCooldown;
    }
  }

  function updateProjectiles(state, dt) {
    state.projectiles.forEach((projectile) => {
      if (!projectile.alive) {
        return;
      }

      projectile.x += projectile.vx * dt;
      projectile.y += projectile.vy * dt;
      projectile.life -= dt;

      if (
        projectile.life <= 0 ||
        projectile.x < -80 ||
        projectile.y < -80 ||
        projectile.x > state.map.width + 80 ||
        projectile.y > state.map.height + 80
      ) {
        projectile.alive = false;
        return;
      }

      for (let index = 0; index < state.enemies.length; index += 1) {
        const enemy = state.enemies[index];

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

  function updatePickups(state, dt) {
    const player = state.player;

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
        gainXp(state, pickup.value);
        pickup.alive = false;
        createEffect(state, {
          x: pickup.x,
          y: pickup.y,
          radius: pickup.radius * 1.4,
          tint: "#d7f06d",
          duration: 0.24,
        });
      }
    });
  }

  function updateEffects(state, dt) {
    state.effects.forEach((effect) => {
      effect.age += dt;

      if (effect.age >= effect.duration) {
        effect.alive = false;
      }
    });
  }

  function checkLevelUp(state) {
    if (state.runState !== "running" || state.xp < state.xpToNext) {
      return;
    }

    state.xp -= state.xpToNext;
    state.level += 1;
    state.xpToNext = Math.floor(state.xpToNext * 1.24 + 4);
    state.upgradeChoices = NS.Upgrades.pickUpgradeChoices(state, 3);
    state.runState = "levelup";
  }

  function cleanupEntities(state) {
    state.enemies = state.enemies.filter((enemy) => enemy.alive);
    state.projectiles = state.projectiles.filter((projectile) => projectile.alive);
    state.pickups = state.pickups.filter((pickup) => pickup.alive);
    state.effects = state.effects.filter((effect) => effect.alive);
  }

  function updateGame(state, input, deltaSeconds) {
    if (state.runState !== "running") {
      return state;
    }

    const dt = Math.min(0.05, deltaSeconds);
    state.timer += dt;

    if (state.timer >= state.runDuration) {
      spawnBoss(state);
    }

    updatePlayerMovement(state, input, dt);
    updateSpawning(state, dt);
    updateEnemies(state, dt);
    updateAutoFire(state, dt);
    updateProjectiles(state, dt);
    updatePickups(state, dt);
    updateEffects(state, dt);
    cleanupEntities(state);

    if (state.player.hp <= 0) {
      state.player.alive = false;
      state.runState = "lost";
    }

    if (state.runState === "running") {
      checkLevelUp(state);
    }

    return state;
  }

  function chooseUpgrade(state, upgradeId) {
    if (state.runState !== "levelup") {
      return false;
    }

    const applied = NS.Upgrades.applyUpgrade(state, upgradeId);

    if (!applied) {
      return false;
    }

    state.upgradeChoices = [];
    state.player.hp = Math.min(state.player.maxHp, state.player.hp + 18);
    state.runState = "running";
    return true;
  }

  function togglePause(state) {
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

  function getCamera(state) {
    const halfWidth = state.viewport.width / 2;
    const halfHeight = state.viewport.height / 2;

    return {
      x: clamp(state.player.x, halfWidth, state.map.width - halfWidth),
      y: clamp(state.player.y, halfHeight, state.map.height - halfHeight),
    };
  }

  function formatTime(seconds) {
    const wholeSeconds = Math.max(0, Math.floor(seconds));
    const minutes = String(Math.floor(wholeSeconds / 60)).padStart(2, "0");
    const remainder = String(wholeSeconds % 60).padStart(2, "0");
    return minutes + ":" + remainder;
  }

  NS.Game = {
    ENEMY_TYPES,
    chooseUpgrade,
    createGameState,
    createInputState,
    formatTime,
    getBoss,
    getCamera,
    getPhaseLabel,
    getStatusLabel,
    resetInputState,
    togglePause,
    updateGame,
  };
})(window);
