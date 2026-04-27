import type { PlayerEntity, PlayerSkinId } from "../../../game/types";
import { RoachMascot } from "./RoachMascot";

function toFixed(value: number): number {
  return Number(value.toFixed(1));
}

function getWorldSkinScale(skinId: PlayerSkinId): number {
  if (skinId === "pickleReporter") {
    return 0.41;
  }

  if (skinId === "terraChampion") {
    return 0.46;
  }

  if (skinId === "americanMantis") {
    return 0.4;
  }

  if (skinId === "northernMini") {
    return 0.56;
  }

  if (skinId === "roachGirl" || skinId === "cantonTwinTail") {
    return 0.43;
  }

  return 0.5;
}

export default function PlayerSprite({ player, skinId = "labStandard" }: { player: PlayerEntity; skinId?: PlayerSkinId }) {
  const isBlinking = player.contactTimer > 0 && Math.floor(player.contactTimer * 18) % 2 === 0;
  const spriteScale = getWorldSkinScale(skinId);

  return (
    <g transform={`translate(${toFixed(player.x)} ${toFixed(player.y)})`}>
      <circle r={toFixed(player.stats.pickupRadius + 72)} fill="url(#slimeGlow)" opacity="0.08" filter="url(#softGlow)" />
      <circle r={toFixed(player.stats.pickupRadius)} fill="none" stroke="rgba(198, 255, 92, 0.14)" strokeWidth="2" strokeDasharray="10 14" />
      <g opacity={isBlinking ? 0.55 : 1}>
        <RoachMascot scale={spriteScale} blink={isBlinking} variant={skinId} />
      </g>
    </g>
  );
}
