import type { EffectEntity } from "../../../game/types";

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function toFixed(value: number): number {
  return Number(value.toFixed(1));
}

function seededRandom(seed: number, salt: number): number {
  const value = Math.sin((seed + salt) * 12.9898) * 43758.5453;
  return value - Math.floor(value);
}

export default function EffectSprite({ effect }: { effect: EffectEntity }) {
  const progress = effect.age / effect.duration;
  const opacity = clamp(1 - progress, 0, 1);

  if (effect.type === "blood-pool") {
    const seed = effect.seed ?? 0.5;
    const fadeStart = 0.78;
    const poolOpacity = progress < fadeStart ? 0.62 : clamp(0.62 * (1 - (progress - fadeStart) / (1 - fadeStart)), 0, 0.62);
    const grow = clamp(progress * 4, 0.4, 1);
    const mainRx = effect.radius * grow;
    const mainRy = effect.radius * grow * 0.78;

    const splats = [0, 1, 2, 3].map((i) => {
      const angle = seededRandom(seed, i) * Math.PI * 2;
      const dist = effect.radius * (0.42 + seededRandom(seed, i + 10) * 0.5);
      const rx = effect.radius * (0.28 + seededRandom(seed, i + 20) * 0.26);
      const ry = rx * (0.7 + seededRandom(seed, i + 30) * 0.3);
      return {
        key: i,
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist * 0.7,
        rx,
        ry,
        rot: seededRandom(seed, i + 40) * 360,
      };
    });

    return (
      <g transform={`translate(${toFixed(effect.x)} ${toFixed(effect.y)})`} opacity={toFixed(poolOpacity)}>
        <ellipse rx={toFixed(mainRx * 1.1)} ry={toFixed(mainRy * 1.1)} fill={effect.tint} opacity="0.22" />
        <ellipse rx={toFixed(mainRx)} ry={toFixed(mainRy)} fill={effect.tint} opacity="0.78" />
        {splats.map((splat) => (
          <ellipse
            key={splat.key}
            cx={toFixed(splat.x)}
            cy={toFixed(splat.y)}
            rx={toFixed(splat.rx)}
            ry={toFixed(splat.ry)}
            fill={effect.tint}
            opacity="0.68"
            transform={`rotate(${toFixed(splat.rot)} ${toFixed(splat.x)} ${toFixed(splat.y)})`}
          />
        ))}
        <ellipse rx={toFixed(mainRx * 0.46)} ry={toFixed(mainRy * 0.46)} fill="rgba(0, 0, 0, 0.35)" />
      </g>
    );
  }

  if (effect.type === "splatter") {
    const seed = effect.seed ?? 0.5;
    const angle = effect.angle ?? 0;
    const spread = effect.radius * (0.8 + progress * 2.6);
    const flashScale = clamp(1 - progress * 2.4, 0, 1);
    const droplets = [0, 1, 2, 3, 4].map((i) => {
      const spreadAngle = (seededRandom(seed, i) - 0.5) * 1.1;
      const dropDist = spread * (0.55 + seededRandom(seed, i + 50) * 0.9);
      const size = effect.radius * (0.24 + seededRandom(seed, i + 60) * 0.28);
      const dx = Math.cos(angle + spreadAngle) * dropDist;
      const dy = Math.sin(angle + spreadAngle) * dropDist;
      return { key: i, dx, dy, size };
    });

    return (
      <g transform={`translate(${toFixed(effect.x)} ${toFixed(effect.y)})`} opacity={toFixed(opacity)}>
        <circle r={toFixed(effect.radius * (1 + progress * 1.4))} fill={effect.tint} opacity="0.18" />
        {droplets.map((drop) => (
          <ellipse
            key={drop.key}
            cx={toFixed(drop.dx)}
            cy={toFixed(drop.dy)}
            rx={toFixed(drop.size)}
            ry={toFixed(drop.size * 0.72)}
            fill={effect.tint}
          />
        ))}
        <circle r={toFixed(effect.radius * 0.48)} fill={effect.tint} opacity="0.82" />
        <circle r={toFixed(effect.radius * 0.34 * flashScale)} fill="#fff7e4" opacity={toFixed(flashScale * 0.95)} />
      </g>
    );
  }

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

  const radius = effect.radius * (0.5 + progress * 1.2);

  return (
    <g transform={`translate(${toFixed(effect.x)} ${toFixed(effect.y)})`} opacity={toFixed(opacity)}>
      <circle r={toFixed(radius)} fill={effect.tint} opacity="0.26" />
      <circle r={toFixed(radius * 0.5)} fill={effect.tint} opacity="0.5" />
    </g>
  );
}
