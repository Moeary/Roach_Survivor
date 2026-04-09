import type { EnemyEntity } from "../../../game/types";

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function toFixed(value: number): number {
  return Number(value.toFixed(1));
}

export default function EnemySprite({ enemy }: { enemy: EnemyEntity }) {
  const angle = (Math.atan2(enemy.vy, enemy.vx) * 180) / Math.PI;
  const pulseScale = 1 + Math.sin(enemy.pulse || 0) * 0.04;
  const hpRatio = clamp(enemy.hp / enemy.maxHp, 0, 1);

  if (enemy.type === "boss") {
    return (
      <g transform={`translate(${toFixed(enemy.x)} ${toFixed(enemy.y)}) rotate(${toFixed(angle)}) scale(${toFixed(pulseScale)})`}>
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

  const bodyFill = enemy.type === "guard" ? "#5a4035" : enemy.type === "adult" ? "#9a5a36" : "#dcc488";
  const shellFill = enemy.type === "guard" ? "#2c2220" : enemy.type === "adult" ? "#6f3d25" : "#a69867";
  const eyeFill = enemy.type === "guard" ? "#ff934e" : "#fff4cb";

  return (
    <g transform={`translate(${toFixed(enemy.x)} ${toFixed(enemy.y)}) rotate(${toFixed(angle)}) scale(${toFixed(pulseScale)})`}>
      <ellipse cx="0" cy={toFixed(enemy.radius * 0.7)} rx={toFixed(enemy.radius * 1.18)} ry={toFixed(enemy.radius * 0.5)} fill="rgba(0, 0, 0, 0.24)" />
      <g stroke={shellFill} strokeWidth={enemy.type === "guard" ? 6 : 4} strokeLinecap="round">
        <path d={`M -${enemy.radius} 4 L -${enemy.radius * 1.7} -${enemy.radius * 0.9}`} />
        <path d={`M -${enemy.radius * 1.1} ${enemy.radius * 0.4} L -${enemy.radius * 1.8} 0`} />
        <path d={`M -${enemy.radius} ${enemy.radius} L -${enemy.radius * 1.7} ${enemy.radius * 1.3}`} />
        <path d={`M ${enemy.radius} 4 L ${enemy.radius * 1.7} -${enemy.radius * 0.9}`} />
        <path d={`M ${enemy.radius * 1.1} ${enemy.radius * 0.4} L ${enemy.radius * 1.8} 0`} />
        <path d={`M ${enemy.radius} ${enemy.radius} L ${enemy.radius * 1.7} ${enemy.radius * 1.3}`} />
      </g>
      <ellipse cx={toFixed(enemy.radius * 0.22)} cy="0" rx={toFixed(enemy.radius * 0.98)} ry={toFixed(enemy.radius * 0.78)} fill={bodyFill} />
      <ellipse cx={-toFixed(enemy.radius * 0.25)} cy="0" rx={toFixed(enemy.radius * 0.92)} ry={toFixed(enemy.radius * 0.72)} fill={shellFill} />
      <ellipse cx={-toFixed(enemy.radius * 0.68)} cy={-toFixed(enemy.radius * 0.16)} rx={toFixed(enemy.radius * 0.38)} ry={toFixed(enemy.radius * 0.3)} fill="#2e201a" />
      <circle cx={-toFixed(enemy.radius * 0.72)} cy={-toFixed(enemy.radius * 0.26)} r={toFixed(Math.max(3, enemy.radius * 0.14))} fill={eyeFill} />
      <circle cx={-toFixed(enemy.radius * 0.72)} cy={-toFixed(enemy.radius * 0.26)} r={toFixed(Math.max(1.8, enemy.radius * 0.06))} fill="#23140f" />
    </g>
  );
}
