import type { PickupEntity } from "../../../game/types";

function toFixed(value: number): number {
  return Number(value.toFixed(1));
}

export default function PickupSprite({ pickup }: { pickup: PickupEntity }) {
  if (pickup.type === "goldEgg") {
    return (
      <g transform={`translate(${toFixed(pickup.x)} ${toFixed(pickup.y)})`}>
        <ellipse rx={toFixed(pickup.radius + 10)} ry={toFixed(pickup.radius + 6)} fill="url(#slimeGlow)" opacity="0.34" />
        <ellipse rx={toFixed(pickup.radius * 0.8)} ry={toFixed(pickup.radius)} fill="#d39b2e" stroke="#f8d774" strokeWidth="3" />
        <path d={`M 0 -${toFixed(pickup.radius * 0.82)} C ${toFixed(pickup.radius * 0.18)} -${toFixed(pickup.radius * 0.46)}, ${toFixed(pickup.radius * 0.14)} ${toFixed(pickup.radius * 0.42)}, 0 ${toFixed(pickup.radius * 0.84)}`} stroke="#fff4bf" strokeWidth="3" strokeLinecap="round" fill="none" />
      </g>
    );
  }

  return (
    <g transform={`translate(${toFixed(pickup.x)} ${toFixed(pickup.y)})`}>
      <circle r={toFixed(pickup.radius + 8)} fill="url(#slimeGlow)" opacity="0.42" />
      <circle r={toFixed(pickup.radius)} fill="#d7f06d" />
      <circle r={toFixed(Math.max(4, pickup.radius * 0.42))} fill="#f7ffe0" />
    </g>
  );
}
