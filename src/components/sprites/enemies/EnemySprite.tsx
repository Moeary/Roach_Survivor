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
};

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function toFixed(value: number): number {
  return Number(value.toFixed(1));
}

function renderBoss(enemy: EnemyEntity, hpRatio: number, transform: string) {
  const bossWave = enemy.bossWave ?? 1;

  if (bossWave === 2) {
    return (
      <g transform={transform}>
        <ellipse cx="0" cy="18" rx="110" ry="34" fill="rgba(0, 0, 0, 0.26)" />
        <g stroke="#4a1d1b" strokeWidth="8" strokeLinecap="round">
          <path d="M -54 -6 L -152 -58" />
          <path d="M -62 18 L -164 6" />
          <path d="M -48 38 L -144 88" />
          <path d="M 54 -6 L 152 -58" />
          <path d="M 62 18 L 164 6" />
          <path d="M 48 38 L 144 88" />
        </g>
        <path d="M -22 -44 L 8 -88 L 22 -40" fill="#ff8f4a" opacity="0.95" />
        <ellipse cx="34" cy="0" rx="68" ry="42" fill="#d14f33" />
        <ellipse cx="-22" cy="0" rx="86" ry="48" fill="#842828" />
        <ellipse cx="-54" cy="0" rx="44" ry="28" fill="#53181f" />
        <path d="M -20 -10 C 8 -30, 42 -34, 72 -16" stroke="#ffb36d" strokeWidth="8" fill="none" opacity="0.9" />
        <circle cx="-70" cy="-8" r="11" fill="#fff0c4" />
        <circle cx="-70" cy="-8" r="4" fill="#2a160f" />
        <rect x="-92" y="-92" width="184" height="12" rx="6" fill="rgba(0, 0, 0, 0.38)" />
        <rect x="-92" y="-92" width={toFixed(184 * hpRatio)} height="12" rx="6" fill="#ff7044" />
      </g>
    );
  }

  if (bossWave === 3) {
    return (
      <g transform={transform}>
        <ellipse cx="0" cy="28" rx="138" ry="50" fill="rgba(0, 0, 0, 0.28)" />
        <g stroke="#291019" strokeWidth="11" strokeLinecap="round">
          <path d="M -76 6 L -168 -56" />
          <path d="M -92 34 L -186 8" />
          <path d="M -76 62 L -162 134" />
          <path d="M 76 6 L 168 -56" />
          <path d="M 92 34 L 186 8" />
          <path d="M 76 62 L 162 134" />
        </g>
        <ellipse cx="42" cy="8" rx="82" ry="58" fill="#7d2338" />
        <ellipse cx="-24" cy="8" rx="102" ry="72" fill="#4a1827" />
        <ellipse cx="-56" cy="6" rx="54" ry="38" fill="#30131f" />
        <ellipse cx="24" cy="22" rx="18" ry="24" fill="#d96a52" opacity="0.8" />
        <ellipse cx="58" cy="18" rx="15" ry="21" fill="#d96a52" opacity="0.72" />
        <ellipse cx="4" cy="20" rx="14" ry="19" fill="#d96a52" opacity="0.76" />
        <path d="M -16 -26 C 28 -46, 68 -42, 108 -10" stroke="#c54c58" strokeWidth="10" fill="none" />
        <path d="M -10 42 C 24 58, 56 64, 96 52" stroke="#742537" strokeWidth="8" fill="none" opacity="0.85" />
        <circle cx="-82" cy="-10" r="12" fill="#ffeab8" />
        <circle cx="-82" cy="-10" r="4.5" fill="#33160d" />
        <path d="M -104 -18 C -144 -46, -162 -52, -182 -34" stroke="#8f4151" strokeWidth="7" fill="none" />
        <path d="M -104 18 C -144 54, -162 60, -182 42" stroke="#8f4151" strokeWidth="7" fill="none" />
        <rect x="-110" y="-112" width="220" height="14" rx="7" fill="rgba(0, 0, 0, 0.42)" />
        <rect x="-110" y="-112" width={toFixed(220 * hpRatio)} height="14" rx="7" fill="#df4d66" />
      </g>
    );
  }

  return (
    <g transform={transform}>
      <ellipse cx="0" cy="18" rx="98" ry="40" fill="rgba(0, 0, 0, 0.24)" />
      <g stroke="#2f1218" strokeWidth="10" strokeLinecap="round">
        <path d="M -58 8 L -126 -44" />
        <path d="M -72 26 L -138 0" />
        <path d="M -58 46 L -126 94" />
        <path d="M 58 8 L 126 -44" />
        <path d="M 72 26 L 138 0" />
        <path d="M 58 46 L 126 94" />
      </g>
      <ellipse cx="32" cy="0" rx="62" ry="48" fill="#8f2741" />
      <ellipse cx="-18" cy="0" rx="76" ry="58" fill="#642131" />
      <ellipse cx="-40" cy="0" rx="42" ry="32" fill="#47222b" />
      <circle cx="-62" cy="-10" r="10" fill="#ffe7be" />
      <circle cx="-62" cy="-10" r="4" fill="#34180c" />
      <path d="M -90 -12 C -124 -34, -132 -42, -146 -36" stroke="#8d4550" strokeWidth="6" fill="none" />
      <path d="M -90 14 C -124 40, -132 48, -146 42" stroke="#8d4550" strokeWidth="6" fill="none" />
      <rect x="-84" y="-94" width="168" height="10" rx="5" fill="rgba(0, 0, 0, 0.35)" />
      <rect x="-84" y="-94" width={toFixed(168 * hpRatio)} height="10" rx="5" fill="#e74a5a" />
    </g>
  );
}

export default function EnemySprite({ enemy }: { enemy: EnemyEntity }) {
  const angle = (Math.atan2(enemy.vy, enemy.vx) * 180) / Math.PI;
  const pulseScale = 1 + Math.sin(enemy.pulse || 0) * 0.04;
  const hpRatio = clamp(enemy.hp / enemy.maxHp, 0, 1);
  const transform = `translate(${toFixed(enemy.x)} ${toFixed(enemy.y)}) rotate(${toFixed(angle)}) scale(${toFixed(pulseScale)})`;

  if (enemy.type === "boss") {
    return renderBoss(enemy, hpRatio, transform);
  }

  const style = ENEMY_VISUALS[enemy.type];
  const shellStripeWidth = enemy.radius * style.shellWidth * 1.4;

  return (
    <g transform={transform}>
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
    </g>
  );
}
