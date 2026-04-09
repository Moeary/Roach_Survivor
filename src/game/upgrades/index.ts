import type { GameState, UpgradeChoice, UpgradeId, UpgradeSummaryItem } from "../types";
import { UPGRADE_DEFS } from "./definitions";

const UPGRADE_MAP = new Map<UpgradeId, (typeof UPGRADE_DEFS)[number]>(UPGRADE_DEFS.map((upgrade) => [upgrade.id, upgrade]));

function getActiveUpgradeDefs(state: GameState) {
  return UPGRADE_DEFS.filter((upgrade) => state.enabledUpgrades.includes(upgrade.id));
}

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
  const activeUpgrades = getActiveUpgradeDefs(state);

  return shuffle(activeUpgrades)
    .slice(0, Math.min(count, activeUpgrades.length))
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
  return getActiveUpgradeDefs(state)
    .map((upgrade) => ({
      id: upgrade.id,
      name: upgrade.name,
      shortName: upgrade.shortName,
      rank: state.upgradeLevels[upgrade.id] ?? 0,
    }))
    .filter((entry) => entry.rank > 0);
}

export { UPGRADE_DEFS } from "./definitions";
