import type { ObstacleEntity } from "../../../game/types";

function toFixed(value: number): number {
  return Number(value.toFixed(1));
}

function ObstacleOutline({ radius }: { radius: number }) {
  return <circle r={toFixed(radius * 1.14)} fill="none" stroke="rgba(255, 54, 45, 0.92)" strokeWidth="4" strokeDasharray="10 7" vectorEffect="non-scaling-stroke" />;
}

export default function ObstacleSprite({ obstacle }: { obstacle: ObstacleEntity }) {
  if (obstacle.type === "deepWater") {
    return (
      <g transform={`translate(${toFixed(obstacle.x)} ${toFixed(obstacle.y)}) rotate(${toFixed(obstacle.rotation)}) scale(${toFixed(obstacle.scale)})`}>
        <ellipse cx="0" cy={toFixed(obstacle.radius * 0.62)} rx={toFixed(obstacle.radius * 1.22)} ry={toFixed(obstacle.radius * 0.4)} fill="rgba(0, 0, 0, 0.36)" />
        <ellipse rx={toFixed(obstacle.radius * 1.08)} ry={toFixed(obstacle.radius * 0.82)} fill="#071719" stroke="#4f6d62" strokeWidth="9" />
        <ellipse rx={toFixed(obstacle.radius * 0.82)} ry={toFixed(obstacle.radius * 0.56)} fill="#0d3032" />
        <path d={`M -${toFixed(obstacle.radius * 0.64)} -${toFixed(obstacle.radius * 0.08)} C -${toFixed(obstacle.radius * 0.28)} -${toFixed(obstacle.radius * 0.24)}, ${toFixed(obstacle.radius * 0.28)} -${toFixed(obstacle.radius * 0.2)}, ${toFixed(obstacle.radius * 0.62)} -${toFixed(obstacle.radius * 0.02)}`} stroke="#8fb4a1" strokeWidth="5" strokeLinecap="round" fill="none" opacity="0.5" />
        <path d={`M -${toFixed(obstacle.radius * 0.52)} ${toFixed(obstacle.radius * 0.22)} C -${toFixed(obstacle.radius * 0.12)} ${toFixed(obstacle.radius * 0.08)}, ${toFixed(obstacle.radius * 0.28)} ${toFixed(obstacle.radius * 0.18)}, ${toFixed(obstacle.radius * 0.54)} ${toFixed(obstacle.radius * 0.32)}`} stroke="#c49a5f" strokeWidth="4" strokeLinecap="round" fill="none" opacity="0.42" />
        <ObstacleOutline radius={obstacle.radius} />
      </g>
    );
  }

  if (obstacle.type === "pipe") {
    return (
      <g transform={`translate(${toFixed(obstacle.x)} ${toFixed(obstacle.y)}) rotate(${toFixed(obstacle.rotation)}) scale(${toFixed(obstacle.scale)})`}>
        <ellipse cx="0" cy={toFixed(obstacle.radius * 0.8)} rx={toFixed(obstacle.radius * 1.15)} ry={toFixed(obstacle.radius * 0.42)} fill="rgba(0, 0, 0, 0.28)" />
        <circle r={toFixed(obstacle.radius)} fill="#314f55" stroke="#16242a" strokeWidth="8" />
        <circle r={toFixed(obstacle.radius * 0.6)} fill="#4b7580" stroke="#9bc3cf" strokeWidth="4" />
        <path d={`M -${toFixed(obstacle.radius * 0.66)} 0 H ${toFixed(obstacle.radius * 0.66)}`} stroke="#9bc3cf" strokeWidth="6" strokeLinecap="round" />
        <ObstacleOutline radius={obstacle.radius} />
      </g>
    );
  }

  if (obstacle.type === "barrel") {
    return (
      <g transform={`translate(${toFixed(obstacle.x)} ${toFixed(obstacle.y)}) rotate(${toFixed(obstacle.rotation)}) scale(${toFixed(obstacle.scale)})`}>
        <ellipse cx="0" cy={toFixed(obstacle.radius * 0.8)} rx={toFixed(obstacle.radius * 1.1)} ry={toFixed(obstacle.radius * 0.38)} fill="rgba(0, 0, 0, 0.28)" />
        <rect x={toFixed(-obstacle.radius * 0.78)} y={toFixed(-obstacle.radius * 0.94)} width={toFixed(obstacle.radius * 1.56)} height={toFixed(obstacle.radius * 1.9)} rx={toFixed(obstacle.radius * 0.3)} fill="#7f5a34" stroke="#352315" strokeWidth="7" />
        <path d={`M -${toFixed(obstacle.radius * 0.76)} -${toFixed(obstacle.radius * 0.34)} H ${toFixed(obstacle.radius * 0.76)}`} stroke="#d8b27b" strokeWidth="5" />
        <path d={`M -${toFixed(obstacle.radius * 0.76)} ${toFixed(obstacle.radius * 0.42)} H ${toFixed(obstacle.radius * 0.76)}`} stroke="#d8b27b" strokeWidth="5" />
        <ObstacleOutline radius={obstacle.radius} />
      </g>
    );
  }

  if (obstacle.type === "can") {
    return (
      <g transform={`translate(${toFixed(obstacle.x)} ${toFixed(obstacle.y)}) rotate(${toFixed(obstacle.rotation)}) scale(${toFixed(obstacle.scale)})`}>
        <ellipse cx="0" cy={toFixed(obstacle.radius * 0.62)} rx={toFixed(obstacle.radius * 1.1)} ry={toFixed(obstacle.radius * 0.34)} fill="rgba(0, 0, 0, 0.32)" />
        <rect x={toFixed(-obstacle.radius * 0.95)} y={toFixed(-obstacle.radius * 0.44)} width={toFixed(obstacle.radius * 1.9)} height={toFixed(obstacle.radius * 0.88)} rx={toFixed(obstacle.radius * 0.22)} fill="#8f2830" stroke="#2d1512" strokeWidth="6" />
        <ellipse cx={toFixed(-obstacle.radius * 0.82)} rx={toFixed(obstacle.radius * 0.22)} ry={toFixed(obstacle.radius * 0.44)} fill="#c7b083" stroke="#3b3125" strokeWidth="4" />
        <path d={`M -${toFixed(obstacle.radius * 0.38)} -${toFixed(obstacle.radius * 0.42)} L ${toFixed(obstacle.radius * 0.22)} ${toFixed(obstacle.radius * 0.38)} M ${toFixed(obstacle.radius * 0.18)} -${toFixed(obstacle.radius * 0.34)} L ${toFixed(obstacle.radius * 0.62)} ${toFixed(obstacle.radius * 0.28)}`} stroke="#d9bd80" strokeWidth="4" strokeLinecap="round" opacity="0.72" />
        <ObstacleOutline radius={obstacle.radius} />
      </g>
    );
  }

  if (obstacle.type === "cigarette") {
    return (
      <g transform={`translate(${toFixed(obstacle.x)} ${toFixed(obstacle.y)}) rotate(${toFixed(obstacle.rotation)}) scale(${toFixed(obstacle.scale)})`}>
        <ellipse cx="0" cy={toFixed(obstacle.radius * 0.52)} rx={toFixed(obstacle.radius * 1.28)} ry={toFixed(obstacle.radius * 0.26)} fill="rgba(0, 0, 0, 0.3)" />
        <rect x={toFixed(-obstacle.radius * 1.32)} y={toFixed(-obstacle.radius * 0.28)} width={toFixed(obstacle.radius * 2.26)} height={toFixed(obstacle.radius * 0.56)} rx={toFixed(obstacle.radius * 0.22)} fill="#ded0a8" stroke="#35251a" strokeWidth="5" />
        <rect x={toFixed(obstacle.radius * 0.46)} y={toFixed(-obstacle.radius * 0.28)} width={toFixed(obstacle.radius * 0.64)} height={toFixed(obstacle.radius * 0.56)} rx={toFixed(obstacle.radius * 0.12)} fill="#9b6b33" />
        <path d={`M -${toFixed(obstacle.radius * 1.16)} 0 H ${toFixed(obstacle.radius * 0.86)}`} stroke="rgba(255, 255, 255, 0.32)" strokeWidth="3" strokeLinecap="round" />
        <ObstacleOutline radius={obstacle.radius} />
      </g>
    );
  }

  if (obstacle.type === "dropping") {
    return (
      <g transform={`translate(${toFixed(obstacle.x)} ${toFixed(obstacle.y)}) rotate(${toFixed(obstacle.rotation)}) scale(${toFixed(obstacle.scale)})`}>
        <ellipse cx="0" cy={toFixed(obstacle.radius * 0.78)} rx={toFixed(obstacle.radius * 1.14)} ry={toFixed(obstacle.radius * 0.42)} fill="rgba(0, 0, 0, 0.34)" />
        <ellipse cx={toFixed(-obstacle.radius * 0.28)} cy={toFixed(obstacle.radius * 0.12)} rx={toFixed(obstacle.radius * 0.58)} ry={toFixed(obstacle.radius * 0.44)} fill="#4b2d19" stroke="#21140e" strokeWidth="5" />
        <ellipse cx={toFixed(obstacle.radius * 0.2)} cy={toFixed(-obstacle.radius * 0.1)} rx={toFixed(obstacle.radius * 0.64)} ry={toFixed(obstacle.radius * 0.48)} fill="#654023" stroke="#21140e" strokeWidth="5" />
        <ellipse cx={toFixed(obstacle.radius * 0.05)} cy={toFixed(-obstacle.radius * 0.3)} rx={toFixed(obstacle.radius * 0.32)} ry={toFixed(obstacle.radius * 0.22)} fill="#8a6136" opacity="0.72" />
        <ObstacleOutline radius={obstacle.radius} />
      </g>
    );
  }

  return (
    <g transform={`translate(${toFixed(obstacle.x)} ${toFixed(obstacle.y)}) rotate(${toFixed(obstacle.rotation)}) scale(${toFixed(obstacle.scale)})`}>
      <ellipse cx="0" cy={toFixed(obstacle.radius * 0.78)} rx={toFixed(obstacle.radius * 1.18)} ry={toFixed(obstacle.radius * 0.44)} fill="rgba(0, 0, 0, 0.3)" />
      <ellipse rx={toFixed(obstacle.radius * 1.12)} ry={toFixed(obstacle.radius * 0.9)} fill="#594134" stroke="#251713" strokeWidth="7" />
      <ellipse rx={toFixed(obstacle.radius * 0.7)} ry={toFixed(obstacle.radius * 0.54)} fill="#8f6b4e" />
      <circle cx={toFixed(-obstacle.radius * 0.28)} cy={toFixed(-obstacle.radius * 0.08)} r={toFixed(obstacle.radius * 0.14)} fill="#2c1c16" />
      <circle cx={toFixed(obstacle.radius * 0.18)} cy={toFixed(obstacle.radius * 0.1)} r={toFixed(obstacle.radius * 0.12)} fill="#2c1c16" />
      <ObstacleOutline radius={obstacle.radius} />
    </g>
  );
}
