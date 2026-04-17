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

  return (
    <g transform={`translate(${toFixed(projectile.x)} ${toFixed(projectile.y)}) rotate(${toFixed(angle)})`}>
      <ellipse cx="-8" cy="0" rx="16" ry="7" fill="rgba(198, 255, 92, 0.16)" />
      <ellipse rx={projectile.variant === "auto" ? "12" : "15"} ry={projectile.variant === "auto" ? "6" : "8"} fill={projectile.tint} />
      <ellipse cx="4" rx={projectile.variant === "auto" ? "6" : "8"} ry={projectile.variant === "auto" ? "4" : "5"} fill="rgba(116, 86, 58, 0.55)" />
    </g>
  );
}
