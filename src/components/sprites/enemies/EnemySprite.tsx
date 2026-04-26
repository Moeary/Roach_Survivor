import type { EnemyEntity, EnemyTypeId } from "../../../game/types";

type GroundEnemyType = Exclude<EnemyTypeId, "boss">;

type EnemyVisual = {
  bodyFill: string;
  shellFill: string;
  eyeFill: string;
  stroke: string;
  strokeWidth: number;
  legReach: number;
  legDrop: number;
  bodyWidth: number;
  bodyHeight: number;
  shellWidth: number;
  shellHeight: number;
  headFill: string;
  stripeFill: string;
};

const ENEMY_VISUALS: Record<GroundEnemyType, EnemyVisual> = {
  nymph: {
    bodyFill: "#dcc488",
    shellFill: "#a69867",
    eyeFill: "#fff4cb",
    stroke: "#83754e",
    strokeWidth: 4,
    legReach: 1.7,
    legDrop: 1,
    bodyWidth: 0.98,
    bodyHeight: 0.78,
    shellWidth: 0.92,
    shellHeight: 0.72,
    headFill: "#2e201a",
    stripeFill: "#efe0a5",
  },
  adult: {
    bodyFill: "#9a5a36",
    shellFill: "#6f3d25",
    eyeFill: "#fff0c4",
    stroke: "#4f2d1f",
    strokeWidth: 4.5,
    legReach: 1.8,
    legDrop: 1.08,
    bodyWidth: 1,
    bodyHeight: 0.78,
    shellWidth: 0.94,
    shellHeight: 0.74,
    headFill: "#342019",
    stripeFill: "#c58354",
  },
  guard: {
    bodyFill: "#5a4035",
    shellFill: "#2c2220",
    eyeFill: "#ff934e",
    stroke: "#231915",
    strokeWidth: 6,
    legReach: 1.92,
    legDrop: 1.14,
    bodyWidth: 1.06,
    bodyHeight: 0.84,
    shellWidth: 1.01,
    shellHeight: 0.79,
    headFill: "#1e1613",
    stripeFill: "#7d655c",
  },
  skitter: {
    bodyFill: "#d5a786",
    shellFill: "#89543e",
    eyeFill: "#fff1a6",
    stroke: "#5f3728",
    strokeWidth: 3.5,
    legReach: 2.15,
    legDrop: 0.88,
    bodyWidth: 0.92,
    bodyHeight: 0.62,
    shellWidth: 0.88,
    shellHeight: 0.58,
    headFill: "#3d241b",
    stripeFill: "#f2c58b",
  },
  brute: {
    bodyFill: "#84513d",
    shellFill: "#5b362b",
    eyeFill: "#ffc27c",
    stroke: "#3e241d",
    strokeWidth: 6.5,
    legReach: 1.72,
    legDrop: 1.2,
    bodyWidth: 1.14,
    bodyHeight: 0.9,
    shellWidth: 1.08,
    shellHeight: 0.84,
    headFill: "#271814",
    stripeFill: "#ac745e",
  },
  stinger: {
    bodyFill: "#a85b34",
    shellFill: "#6d311f",
    eyeFill: "#ffe7b0",
    stroke: "#4d2418",
    strokeWidth: 4.8,
    legReach: 1.95,
    legDrop: 1,
    bodyWidth: 0.98,
    bodyHeight: 0.72,
    shellWidth: 0.9,
    shellHeight: 0.66,
    headFill: "#301a12",
    stripeFill: "#df8c51",
  },
  razor: {
    bodyFill: "#7d302b",
    shellFill: "#481c1e",
    eyeFill: "#ffd09c",
    stroke: "#311416",
    strokeWidth: 4.2,
    legReach: 2.08,
    legDrop: 0.96,
    bodyWidth: 0.96,
    bodyHeight: 0.68,
    shellWidth: 0.9,
    shellHeight: 0.62,
    headFill: "#241111",
    stripeFill: "#b64842",
  },
  carrier: {
    bodyFill: "#7b8651",
    shellFill: "#4e5630",
    eyeFill: "#ffe39a",
    stroke: "#36401f",
    strokeWidth: 5.5,
    legReach: 1.8,
    legDrop: 1.08,
    bodyWidth: 1.04,
    bodyHeight: 0.8,
    shellWidth: 0.96,
    shellHeight: 0.76,
    headFill: "#263018",
    stripeFill: "#adb56a",
  },
  behemoth: {
    bodyFill: "#566058",
    shellFill: "#2d332d",
    eyeFill: "#f4dca0",
    stroke: "#1d221d",
    strokeWidth: 7,
    legReach: 1.74,
    legDrop: 1.22,
    bodyWidth: 1.18,
    bodyHeight: 0.9,
    shellWidth: 1.1,
    shellHeight: 0.84,
    headFill: "#171a17",
    stripeFill: "#879089",
  },
  phantom: {
    bodyFill: "#a6adbb",
    shellFill: "#687180",
    eyeFill: "#fff3d1",
    stroke: "#4a5260",
    strokeWidth: 3.8,
    legReach: 2.2,
    legDrop: 0.86,
    bodyWidth: 0.9,
    bodyHeight: 0.64,
    shellWidth: 0.84,
    shellHeight: 0.58,
    headFill: "#424854",
    stripeFill: "#d7dbe1",
  },
  spitter: {
    bodyFill: "#8fb55a",
    shellFill: "#5a7a32",
    eyeFill: "#f4ffb6",
    stroke: "#3e5722",
    strokeWidth: 4.2,
    legReach: 1.76,
    legDrop: 1.04,
    bodyWidth: 1.02,
    bodyHeight: 0.82,
    shellWidth: 0.96,
    shellHeight: 0.76,
    headFill: "#24341a",
    stripeFill: "#c2e060",
  },
  hunter: {
    bodyFill: "#a576b8",
    shellFill: "#6e3f86",
    eyeFill: "#f7d9ff",
    stroke: "#452759",
    strokeWidth: 4,
    legReach: 2,
    legDrop: 0.94,
    bodyWidth: 0.94,
    bodyHeight: 0.7,
    shellWidth: 0.88,
    shellHeight: 0.64,
    headFill: "#2a1636",
    stripeFill: "#d79ef2",
  },
  artillery: {
    bodyFill: "#8d2e3c",
    shellFill: "#511622",
    eyeFill: "#ffcbb0",
    stroke: "#2a0d14",
    strokeWidth: 7,
    legReach: 1.68,
    legDrop: 1.24,
    bodyWidth: 1.22,
    bodyHeight: 0.94,
    shellWidth: 1.14,
    shellHeight: 0.88,
    headFill: "#170709",
    stripeFill: "#ff7a5c",
  },
  splitter: {
    bodyFill: "#9cab52",
    shellFill: "#5f6f2e",
    eyeFill: "#f7ffba",
    stroke: "#3c481f",
    strokeWidth: 5.2,
    legReach: 1.88,
    legDrop: 1.08,
    bodyWidth: 1.04,
    bodyHeight: 0.82,
    shellWidth: 0.98,
    shellHeight: 0.74,
    headFill: "#253017",
    stripeFill: "#d6ee72",
  },
  shade: {
    bodyFill: "#75869c",
    shellFill: "#374458",
    eyeFill: "#e5f0ff",
    stroke: "#232b3a",
    strokeWidth: 3.7,
    legReach: 2.26,
    legDrop: 0.84,
    bodyWidth: 0.88,
    bodyHeight: 0.62,
    shellWidth: 0.82,
    shellHeight: 0.56,
    headFill: "#1d2431",
    stripeFill: "#b9cfff",
  },
  sludge: {
    bodyFill: "#6f9140",
    shellFill: "#405821",
    eyeFill: "#efffb1",
    stroke: "#293719",
    strokeWidth: 5.8,
    legReach: 1.64,
    legDrop: 1.16,
    bodyWidth: 1.1,
    bodyHeight: 0.88,
    shellWidth: 1,
    shellHeight: 0.78,
    headFill: "#1e2a14",
    stripeFill: "#9fe65b",
  },
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function toFixed(value: number): number {
  return Number(value.toFixed(1));
}

type BossSpriteAsset = {
  href: string;
  x: number;
  y: number;
  width: number;
  height: number;
  shadowRx: number;
  shadowRy: number;
  shadowCy: number;
  healthX: number;
  healthY: number;
  healthWidth: number;
  healthHeight: number;
  healthFill: string;
};

const BOSS_SPRITE_ASSETS: Record<number, BossSpriteAsset> = {
  1: {
    href: "/sprites/bosses/boss-1-hive-queen.png?v=alpha2",
    x: -154,
    y: -96,
    width: 308,
    height: 205,
    shadowRx: 98,
    shadowRy: 40,
    shadowCy: 24,
    healthX: -84,
    healthY: -108,
    healthWidth: 168,
    healthHeight: 10,
    healthFill: "#e74a5a",
  },
  2: {
    href: "/sprites/bosses/boss-2-split-leg-tyrant.png?v=alpha2",
    x: -174,
    y: -112,
    width: 348,
    height: 232,
    shadowRx: 110,
    shadowRy: 34,
    shadowCy: 24,
    healthX: -92,
    healthY: -122,
    healthWidth: 184,
    healthHeight: 12,
    healthFill: "#ff7044",
  },
  3: {
    href: "/sprites/bosses/boss-3-brood-nest.png?v=alpha2",
    x: -210,
    y: -130,
    width: 420,
    height: 280,
    shadowRx: 138,
    shadowRy: 50,
    shadowCy: 38,
    healthX: -110,
    healthY: -146,
    healthWidth: 220,
    healthHeight: 14,
    healthFill: "#df4d66",
  },
};

function getBossSpriteAsset(bossWave: number): BossSpriteAsset {
  return BOSS_SPRITE_ASSETS[bossWave] ?? BOSS_SPRITE_ASSETS[1]!;
}

function renderBossHealthBar(asset: BossSpriteAsset, hpRatio: number) {
  return (
    <>
      <rect
        x={asset.healthX}
        y={asset.healthY}
        width={asset.healthWidth}
        height={asset.healthHeight}
        rx={asset.healthHeight / 2}
        fill="rgba(0, 0, 0, 0.42)"
      />
      <rect
        x={asset.healthX}
        y={asset.healthY}
        width={toFixed(asset.healthWidth * hpRatio)}
        height={asset.healthHeight}
        rx={asset.healthHeight / 2}
        fill={asset.healthFill}
      />
    </>
  );
}

function renderBoss(enemy: EnemyEntity, hpRatio: number, transform: string) {
  const bossWave = enemy.bossWave ?? 1;
  const asset = getBossSpriteAsset(bossWave);
  const phase = enemy.bossPhase ?? 1;
  const auraFill = phase >= 3 ? "rgba(255, 64, 93, 0.18)" : phase >= 2 ? "rgba(255, 178, 92, 0.14)" : "rgba(0, 0, 0, 0)";

  return (
    <g transform={transform}>
      <ellipse cx="0" cy={asset.shadowCy} rx={asset.shadowRx} ry={asset.shadowRy} fill="rgba(0, 0, 0, 0.28)" />
      {bossWave === 3 && phase >= 2 ? <ellipse cx="4" cy="16" rx={phase >= 3 ? 164 : 142} ry={phase >= 3 ? 88 : 76} fill={auraFill} /> : null}
      <image
        href={asset.href}
        x={asset.x}
        y={asset.y}
        width={asset.width}
        height={asset.height}
        preserveAspectRatio="xMidYMid meet"
      />
      {renderBossHealthBar(asset, hpRatio)}
    </g>
  );
}

function StatusOverlay({ enemy }: { enemy: EnemyEntity }) {
  const hasSlow = enemy.statusEffects.some((fx) => fx.type === "slow");
  const hasPoison = enemy.statusEffects.some((fx) => fx.type === "poison");

  if (!hasSlow && !hasPoison) {
    return null;
  }

  const r = enemy.radius;

  return (
    <g>
      {hasSlow ? (
        <ellipse cx="0" cy="0" rx={toFixed(r * 1.1)} ry={toFixed(r * 0.85)} fill="none" stroke="rgba(120, 200, 255, 0.6)" strokeWidth="3" strokeDasharray="6 4" />
      ) : null}
      {hasPoison ? (
        <ellipse cx="0" cy="0" rx={toFixed(r * 0.9)} ry={toFixed(r * 0.68)} fill="rgba(80, 220, 60, 0.12)" stroke="rgba(80, 220, 60, 0.5)" strokeWidth="2" />
      ) : null}
    </g>
  );
}

export default function EnemySprite({ enemy }: { enemy: EnemyEntity }) {
  const angle = (Math.atan2(enemy.vy, enemy.vx) * 180) / Math.PI;
  const spriteAngle = enemy.type === "boss" ? angle + 180 : angle;
  const pulseScale = 1 + Math.sin(enemy.pulse || 0) * 0.04;
  const hpRatio = clamp(enemy.hp / enemy.maxHp, 0, 1);
  const transform = `translate(${toFixed(enemy.x)} ${toFixed(enemy.y)}) rotate(${toFixed(spriteAngle)}) scale(${toFixed(pulseScale)})`;

  if (enemy.type === "boss") {
    return renderBoss(enemy, hpRatio, transform);
  }

  const style = ENEMY_VISUALS[enemy.type];
  const shellStripeWidth = enemy.radius * style.shellWidth * 1.4;
  const isStealthed = enemy.type === "shade" && enemy.specialState === "stealth";

  return (
    <g transform={transform} opacity={isStealthed ? 0.48 : 1}>
      {isStealthed ? <circle r={toFixed(enemy.radius * 1.7)} fill="rgba(185, 207, 255, 0.12)" stroke="rgba(185, 207, 255, 0.42)" strokeWidth="2" strokeDasharray="8 6" /> : null}
      <ellipse cx="0" cy={toFixed(enemy.radius * 0.72)} rx={toFixed(enemy.radius * 1.22)} ry={toFixed(enemy.radius * 0.46)} fill="rgba(0, 0, 0, 0.24)" />
      <g stroke={style.stroke} strokeWidth={style.strokeWidth} strokeLinecap="round">
        <path d={`M -${enemy.radius} 4 L -${enemy.radius * style.legReach} -${enemy.radius * 0.9}`} />
        <path d={`M -${enemy.radius * 1.1} ${enemy.radius * 0.36} L -${enemy.radius * (style.legReach + 0.12)} ${enemy.radius * (style.legDrop - 0.26)}`} />
        <path d={`M -${enemy.radius} ${enemy.radius * 0.98} L -${enemy.radius * style.legReach} ${enemy.radius * (style.legDrop + 0.24)}`} />
        <path d={`M ${enemy.radius} 4 L ${enemy.radius * style.legReach} -${enemy.radius * 0.9}`} />
        <path d={`M ${enemy.radius * 1.1} ${enemy.radius * 0.36} L ${enemy.radius * (style.legReach + 0.12)} ${enemy.radius * (style.legDrop - 0.26)}`} />
        <path d={`M ${enemy.radius} ${enemy.radius * 0.98} L ${enemy.radius * style.legReach} ${enemy.radius * (style.legDrop + 0.24)}`} />
      </g>
      <ellipse cx={toFixed(enemy.radius * 0.24)} cy={toFixed(enemy.type === "skitter" || enemy.type === "phantom" ? 1 : 0)} rx={toFixed(enemy.radius * style.bodyWidth)} ry={toFixed(enemy.radius * style.bodyHeight)} fill={style.bodyFill} />
      <ellipse cx={-toFixed(enemy.radius * 0.24)} cy="0" rx={toFixed(enemy.radius * style.shellWidth)} ry={toFixed(enemy.radius * style.shellHeight)} fill={style.shellFill} />
      <path d={`M -${toFixed(shellStripeWidth * 0.34)} -${toFixed(enemy.radius * 0.16)} L ${toFixed(shellStripeWidth * 0.34)} -${toFixed(enemy.radius * 0.05)}`} stroke={style.stripeFill} strokeWidth={Math.max(2, style.strokeWidth - 1)} strokeLinecap="round" opacity="0.76" />
      <ellipse cx={-toFixed(enemy.radius * 0.7)} cy={-toFixed(enemy.radius * 0.16)} rx={toFixed(enemy.radius * 0.38)} ry={toFixed(enemy.radius * 0.3)} fill={style.headFill} />
      <circle cx={-toFixed(enemy.radius * 0.74)} cy={-toFixed(enemy.radius * 0.24)} r={toFixed(Math.max(3, enemy.radius * 0.14))} fill={style.eyeFill} />
      <circle cx={-toFixed(enemy.radius * 0.74)} cy={-toFixed(enemy.radius * 0.24)} r={toFixed(Math.max(1.8, enemy.radius * 0.06))} fill="#23140f" />
      <StatusOverlay enemy={enemy} />
    </g>
  );
}
