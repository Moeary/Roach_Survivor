import type { ObstacleEntity } from "../../../game/types";

function toFixed(value: number): number {
  return Number(value.toFixed(1));
}

export default function ObstacleSprite({ obstacle }: { obstacle: ObstacleEntity }) {
  if (obstacle.type === "pipe") {
    return (
      <g transform={`translate(${toFixed(obstacle.x)} ${toFixed(obstacle.y)}) rotate(${toFixed(obstacle.rotation)}) scale(${toFixed(obstacle.scale)})`}>
        <ellipse cx="0" cy={toFixed(obstacle.radius * 0.8)} rx={toFixed(obstacle.radius * 1.15)} ry={toFixed(obstacle.radius * 0.42)} fill="rgba(0, 0, 0, 0.28)" />
        <circle r={toFixed(obstacle.radius)} fill="#314f55" stroke="#16242a" strokeWidth="8" />
        <circle r={toFixed(obstacle.radius * 0.6)} fill="#4b7580" stroke="#9bc3cf" strokeWidth="4" />
        <path d={`M -${toFixed(obstacle.radius * 0.66)} 0 H ${toFixed(obstacle.radius * 0.66)}`} stroke="#9bc3cf" strokeWidth="6" strokeLinecap="round" />
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
    </g>
  );
}
