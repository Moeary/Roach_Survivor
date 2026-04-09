import type { OrbitalEntity } from "../../../game/types";

function toFixed(value: number): number {
  return Number(value.toFixed(1));
}

export default function OrbitalSprite({ orbital }: { orbital: OrbitalEntity }) {
  return (
    <g transform={`translate(${toFixed(orbital.x)} ${toFixed(orbital.y)})`} opacity={orbital.active ? 1 : 0.3}>
      <circle r={toFixed(orbital.radius + 8)} fill="url(#slimeGlow)" opacity={orbital.active ? 0.24 : 0.12} />
      <ellipse rx={toFixed(orbital.radius + 2)} ry={toFixed(orbital.radius * 0.7)} fill={orbital.active ? "#f4f0d2" : "rgba(244, 240, 210, 0.35)"} />
      <ellipse cx="4" rx={toFixed(orbital.radius * 0.48)} ry={toFixed(orbital.radius * 0.34)} fill={orbital.active ? "#d8c89d" : "rgba(216, 200, 157, 0.25)"} />
    </g>
  );
}
