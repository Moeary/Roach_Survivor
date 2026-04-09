import type { PickupEntity } from "../../../game/types";

function toFixed(value: number): number {
  return Number(value.toFixed(1));
}

export default function PickupSprite({ pickup }: { pickup: PickupEntity }) {
  return (
    <g transform={`translate(${toFixed(pickup.x)} ${toFixed(pickup.y)})`}>
      <circle r={toFixed(pickup.radius + 8)} fill="url(#slimeGlow)" opacity="0.42" />
      <circle r={toFixed(pickup.radius)} fill="#d7f06d" />
      <circle r={toFixed(Math.max(4, pickup.radius * 0.42))} fill="#f7ffe0" />
    </g>
  );
}
