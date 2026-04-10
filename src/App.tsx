import { useEffect, useState } from "react";
import BuffSetupModal from "./components/BuffSetupModal";
import ChangelogModal from "./components/ChangelogModal";
import GameScreen from "./components/GameScreen";
import MetaUpgradeModal from "./components/MetaUpgradeModal";
import StartScreen from "./components/StartScreen";
import TutorialModal from "./components/TutorialModal";
import { addGoldenEggs, loadMetaProfile, purchaseMetaUpgrade, saveMetaProfile } from "./game/meta";
import { ALL_UPGRADE_IDS, DEFAULT_RUN_SETUP } from "./game/run/config";
import type { DifficultyId, MetaUpgradeId, UpgradeId } from "./game/types";

export default function App() {
  const [profile, setProfile] = useState(() => loadMetaProfile());
  const [screen, setScreen] = useState<"menu" | "game">("menu");
  const [buffSetupOpen, setBuffSetupOpen] = useState(false);
  const [changelogOpen, setChangelogOpen] = useState(false);
  const [metaUpgradeOpen, setMetaUpgradeOpen] = useState(false);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [menuDifficultyId, setMenuDifficultyId] = useState<DifficultyId>(DEFAULT_RUN_SETUP.difficultyId);
  const [menuEnabledUpgrades, setMenuEnabledUpgrades] = useState<UpgradeId[]>(DEFAULT_RUN_SETUP.enabledUpgrades);
  const [runSetup, setRunSetup] = useState(DEFAULT_RUN_SETUP);
  const [runKey, setRunKey] = useState(0);

  useEffect(() => {
    saveMetaProfile(profile);
  }, [profile]);

  function startGame() {
    setRunSetup({
      difficultyId: menuDifficultyId,
      enabledUpgrades: menuEnabledUpgrades,
      metaUpgrades: profile.metaUpgrades,
    });
    setRunKey((value) => value + 1);
    setScreen("game");
  }

  function toggleUpgrade(upgradeId: UpgradeId) {
    setMenuEnabledUpgrades((current) => {
      if (current.includes(upgradeId)) {
        return current.length <= 3 ? current : current.filter((id) => id !== upgradeId);
      }

      return [...current, upgradeId];
    });
  }

  function returnToMenu() {
    setScreen("menu");
  }

  function awardGoldenEggs(amount: number) {
    setProfile((current) => addGoldenEggs(current, amount));
  }

  function upgradeMetaStat(upgradeId: MetaUpgradeId) {
    setProfile((current) => purchaseMetaUpgrade(current, upgradeId) ?? current);
  }

  return (
    <div className="app-shell">
      {screen === "menu" ? (
        <>
          <StartScreen
            difficultyId={menuDifficultyId}
            enabledBuffCount={menuEnabledUpgrades.length}
            goldenEggs={profile.goldenEggs}
            totalBuffCount={ALL_UPGRADE_IDS.length}
            onOpenBuffSetup={() => setBuffSetupOpen(true)}
            onOpenChangelog={() => setChangelogOpen(true)}
            onOpenMetaUpgrade={() => setMetaUpgradeOpen(true)}
            onOpenTutorial={() => setTutorialOpen(true)}
            onCheatGoldenEggs={() => awardGoldenEggs(100)}
            onSelectDifficulty={setMenuDifficultyId}
            onStart={startGame}
          />
          <BuffSetupModal
            isOpen={buffSetupOpen}
            onClose={() => setBuffSetupOpen(false)}
            onReset={() => setMenuEnabledUpgrades(ALL_UPGRADE_IDS)}
            onToggleUpgrade={toggleUpgrade}
            selectedUpgrades={menuEnabledUpgrades}
          />
          <ChangelogModal isOpen={changelogOpen} onClose={() => setChangelogOpen(false)} />
          <MetaUpgradeModal
            goldenEggs={profile.goldenEggs}
            isOpen={metaUpgradeOpen}
            metaUpgrades={profile.metaUpgrades}
            onClose={() => setMetaUpgradeOpen(false)}
            onPurchase={upgradeMetaStat}
          />
          <TutorialModal isOpen={tutorialOpen} onClose={() => setTutorialOpen(false)} />
        </>
      ) : (
        <GameScreen key={runKey} onAwardGoldenEggs={awardGoldenEggs} onReturnToMenu={returnToMenu} setup={runSetup} />
      )}
    </div>
  );
}
