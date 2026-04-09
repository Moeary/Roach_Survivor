import type { PlayerEntity } from "../../../game/types";
import { RoachMascot } from "./RoachMascot";

function toFixed(value: number): number {
  return Number(value.toFixed(1));
}

export default function PlayerSprite({ player }: { player: PlayerEntity }) {
  const aimAngle = (player.aimAngle * 180) / Math.PI;
  const isBlinking = player.contactTimer > 0 && Math.floor(player.contactTimer * 18) % 2 === 0;

  return (
    <g transform={`translate(${toFixed(player.x)} ${toFixed(player.y)}) rotate(${toFixed(aimAngle)})`}>
      <circle r={toFixed(player.stats.pickupRadius + 72)} fill="url(#slimeGlow)" opacity="0.08" filter="url(#softGlow)" />
      <circle r={toFixed(player.stats.pickupRadius)} fill="none" stroke="rgba(198, 255, 92, 0.14)" strokeWidth="2" strokeDasharray="10 14" />
      <g opacity={isBlinking ? 0.55 : 1}>
        <RoachMascot scale={0.5} blink={isBlinking} />
      </g>
    </g>
  );
}
