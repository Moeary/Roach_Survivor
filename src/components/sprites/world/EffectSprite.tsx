import type { EffectEntity } from "../../../game/types";

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function toFixed(value: number): number {
  return Number(value.toFixed(1));
}

export default function EffectSprite({ effect }: { effect: EffectEntity }) {
  const progress = effect.age / effect.duration;
  const radius = effect.radius * (0.5 + progress * 1.2);
  const opacity = clamp(1 - progress, 0, 1);

  return (
    <g transform={`translate(${toFixed(effect.x)} ${toFixed(effect.y)})`} opacity={toFixed(opacity)}>
      <circle r={toFixed(radius)} fill={effect.tint} opacity="0.26" />
      <circle r={toFixed(radius * 0.5)} fill={effect.tint} opacity="0.5" />
    </g>
  );
}
