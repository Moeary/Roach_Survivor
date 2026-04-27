import type { ProjectileEntity } from "../../../game/types";

function toFixed(value: number): number {
  return Number(value.toFixed(1));
}

export default function ProjectileSprite({ projectile }: { projectile: ProjectileEntity }) {
  const angle = (projectile.angle * 180) / Math.PI;

  if (projectile.variant === "enemyRanged") {
    const rx = toFixed(projectile.radius);
    const ry = toFixed(projectile.radius * 0.66);

    return (
      <g transform={`translate(${toFixed(projectile.x)} ${toFixed(projectile.y)}) rotate(${toFixed(angle)})`}>
        <ellipse cx={toFixed(-projectile.radius * 0.9)} cy="0" rx={toFixed(projectile.radius * 1.4)} ry={toFixed(projectile.radius * 0.5)} fill={projectile.tint} opacity="0.22" />
        <ellipse rx={rx} ry={ry} fill={projectile.tint} />
        <ellipse cx={toFixed(projectile.radius * 0.3)} rx={toFixed(projectile.radius * 0.54)} ry={toFixed(projectile.radius * 0.36)} fill="rgba(255, 255, 255, 0.35)" />
        <circle r={toFixed(projectile.radius * 0.3)} fill="rgba(40, 14, 18, 0.6)" />
      </g>
    );
  }

  const shellRx = projectile.variant === "auto" ? projectile.radius * 1.15 : projectile.radius * 1.34;
  const shellRy = projectile.variant === "auto" ? projectile.radius * 0.62 : projectile.radius * 0.74;
  const ridgeCount = projectile.variant === "auto" ? 3 : 4;

  return (
    <g transform={`translate(${toFixed(projectile.x)} ${toFixed(projectile.y)}) rotate(${toFixed(angle)})`}>
      <ellipse cx={toFixed(-projectile.radius * 0.42)} cy={toFixed(projectile.radius * 0.42)} rx={toFixed(shellRx * 1.08)} ry={toFixed(shellRy * 0.58)} fill="rgba(0, 0, 0, 0.34)" />
      <ellipse rx={toFixed(shellRx)} ry={toFixed(shellRy)} fill="url(#eggcaseGradient)" stroke="#22070a" strokeWidth="3" />
      <ellipse cx={toFixed(shellRx * 0.26)} cy={toFixed(-shellRy * 0.22)} rx={toFixed(shellRx * 0.32)} ry={toFixed(shellRy * 0.24)} fill="#c35a45" opacity="0.44" />
      {Array.from({ length: ridgeCount }, (_, index) => {
        const x = -shellRx * 0.48 + index * (shellRx * 0.32);
        return (
          <path
            key={`ridge-${projectile.id}-${index}`}
            d={`M ${toFixed(x)} ${toFixed(-shellRy * 0.72)} C ${toFixed(x - shellRx * 0.08)} ${toFixed(-shellRy * 0.26)}, ${toFixed(x - shellRx * 0.06)} ${toFixed(shellRy * 0.22)}, ${toFixed(x + shellRx * 0.02)} ${toFixed(shellRy * 0.68)}`}
            stroke="#160507"
            strokeWidth="2.4"
            strokeLinecap="round"
            opacity="0.62"
            fill="none"
          />
        );
      })}
    </g>
  );
}
