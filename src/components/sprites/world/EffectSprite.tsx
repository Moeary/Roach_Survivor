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

  if (effect.type === "lightning") {
    const innerRadius = effect.radius * (0.22 + progress * 0.1);
    const outerRadius = effect.radius * (0.9 + progress * 0.18);
    const boltLength = effect.radius * (0.78 + progress * 0.12);

    return (
      <g transform={`translate(${toFixed(effect.x)} ${toFixed(effect.y)})`} opacity={toFixed(opacity)}>
        <circle r={toFixed(outerRadius)} fill={effect.tint} opacity="0.12" />
        <circle r={toFixed(innerRadius)} fill="#f7fdff" opacity="0.82" />
        <path d={`M 0 ${toFixed(-boltLength)} L ${toFixed(effect.radius * 0.18)} ${toFixed(-effect.radius * 0.14)} L ${toFixed(-effect.radius * 0.12)} ${toFixed(-effect.radius * 0.04)} L ${toFixed(effect.radius * 0.08)} ${toFixed(effect.radius * 0.26)} L ${toFixed(-effect.radius * 0.04)} ${toFixed(boltLength)}`} fill="none" stroke="#f6fdff" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
        <path d={`M ${toFixed(-effect.radius * 0.55)} ${toFixed(-effect.radius * 0.18)} L ${toFixed(effect.radius * 0.55)} ${toFixed(effect.radius * 0.18)}`} fill="none" stroke={effect.tint} strokeWidth="3" strokeLinecap="round" opacity="0.8" />
      </g>
    );
  }

  return (
    <g transform={`translate(${toFixed(effect.x)} ${toFixed(effect.y)})`} opacity={toFixed(opacity)}>
      <circle r={toFixed(radius)} fill={effect.tint} opacity="0.26" />
      <circle r={toFixed(radius * 0.5)} fill={effect.tint} opacity="0.5" />
    </g>
  );
}
