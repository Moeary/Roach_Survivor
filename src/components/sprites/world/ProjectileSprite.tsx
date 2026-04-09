import type { ProjectileEntity } from "../../../game/types";

function toFixed(value: number): number {
  return Number(value.toFixed(1));
}

export default function ProjectileSprite({ projectile }: { projectile: ProjectileEntity }) {
  const angle = (projectile.angle * 180) / Math.PI;

  return (
    <g transform={`translate(${toFixed(projectile.x)} ${toFixed(projectile.y)}) rotate(${toFixed(angle)})`}>
      <ellipse cx="-8" cy="0" rx="16" ry="7" fill="rgba(198, 255, 92, 0.16)" />
      <ellipse rx={projectile.variant === "auto" ? "12" : "15"} ry={projectile.variant === "auto" ? "6" : "8"} fill={projectile.tint} />
      <ellipse cx="4" rx={projectile.variant === "auto" ? "6" : "8"} ry={projectile.variant === "auto" ? "4" : "5"} fill="rgba(116, 86, 58, 0.55)" />
    </g>
  );
}
