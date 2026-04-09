import type { GameState, UpgradeChoice, UpgradeId, UpgradeSummaryItem } from "../types";
import { UPGRADE_DEFS } from "./definitions";

const UPGRADE_MAP = new Map<UpgradeId, (typeof UPGRADE_DEFS)[number]>(UPGRADE_DEFS.map((upgrade) => [upgrade.id, upgrade]));

function shuffle<T>(input: T[]): T[] {
  const array = input.slice();

  for (let index = array.length - 1; index > 0; index -= 1) {
    const swapIndex = Math.floor(Math.random() * (index + 1));
    const temp = array[index];
    array[index] = array[swapIndex]!;
    array[swapIndex] = temp!;
  }

  return array;
}

export function pickUpgradeChoices(state: GameState, count = 3): UpgradeChoice[] {
  return shuffle(UPGRADE_DEFS)
    .slice(0, Math.min(count, UPGRADE_DEFS.length))
    .map((upgrade) => ({
      id: upgrade.id,
      name: upgrade.name,
      shortName: upgrade.shortName,
      description: upgrade.description,
      currentRank: state.upgradeLevels[upgrade.id] ?? 0,
      nextRank: (state.upgradeLevels[upgrade.id] ?? 0) + 1,
    }));
}

export function applyUpgrade(state: GameState, upgradeId: UpgradeId): boolean {
  const upgrade = UPGRADE_MAP.get(upgradeId);

  if (!upgrade) {
    return false;
  }

  upgrade.apply(state);
  state.upgradeLevels[upgradeId] = (state.upgradeLevels[upgradeId] ?? 0) + 1;
  state.upgradesTaken.push(upgradeId);
  state.lastUpgradeName = upgrade.name;
  return true;
}

export function summarizeUpgrades(state: GameState): UpgradeSummaryItem[] {
  return UPGRADE_DEFS.map((upgrade) => ({
    id: upgrade.id,
    name: upgrade.name,
    shortName: upgrade.shortName,
    rank: state.upgradeLevels[upgrade.id] ?? 0,
  })).filter((entry) => entry.rank > 0);
}

export { UPGRADE_DEFS } from "./definitions";
