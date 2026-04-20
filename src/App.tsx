import { useEffect, useState } from "react";
import { Analytics } from "@vercel/analytics/react";
import { GameAudioController, loadAudioSettings, normalizeAudioSettings, saveAudioSettings, type AudioSettings } from "./audio/gameAudio";
import BuffSetupModal from "./components/BuffSetupModal";
import ChangelogModal from "./components/ChangelogModal";
import EnemyCompendiumModal from "./components/EnemyCompendiumModal";
import GameScreen from "./components/GameScreen";
import MetaUpgradeModal from "./components/MetaUpgradeModal";
import SkinLabModal from "./components/SkinLabModal";
import StartScreen from "./components/StartScreen";
import TutorialModal from "./components/TutorialModal";
import VolumeSettingsModal from "./components/VolumeSettingsModal";
import { addGoldenEggs, loadMetaProfile, PLAYER_SKIN_DEFS, purchaseMetaUpgrade, purchasePlayerSkin, resetMetaUpgrades, saveMetaProfile, selectPlayerSkin } from "./game/meta";
import { ALL_UPGRADE_IDS, DEFAULT_RUN_SETUP } from "./game/run/config";
import type { DifficultyId, MetaUpgradeId, PlayerSkinId, UpgradeId } from "./game/types";

function shouldEnableAnalytics() {
  if (typeof window === "undefined") {
    return false;
  }

  if (window.location.protocol === "file:") {
    return false;
  }

  return !window.navigator.userAgent.toLowerCase().includes("electron");
}

export default function App() {
  const [profile, setProfile] = useState(() => loadMetaProfile());
  const [screen, setScreen] = useState<"menu" | "game">("menu");
  const [buffSetupOpen, setBuffSetupOpen] = useState(false);
  const [changelogOpen, setChangelogOpen] = useState(false);
  const [compendiumOpen, setCompendiumOpen] = useState(false);
  const [metaUpgradeOpen, setMetaUpgradeOpen] = useState(false);
  const [skinLabOpen, setSkinLabOpen] = useState(false);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [volumeSettingsOpen, setVolumeSettingsOpen] = useState(false);
  const [audioSettings, setAudioSettings] = useState<AudioSettings>(() => loadAudioSettings());
  const [menuDifficultyId, setMenuDifficultyId] = useState<DifficultyId>(DEFAULT_RUN_SETUP.difficultyId);
  const [menuEnabledUpgrades, setMenuEnabledUpgrades] = useState<UpgradeId[]>(DEFAULT_RUN_SETUP.enabledUpgrades);
  const [runSetup, setRunSetup] = useState(DEFAULT_RUN_SETUP);
  const [runKey, setRunKey] = useState(0);
  const [menuAudio] = useState(() => new GameAudioController(audioSettings));
  const analyticsEnabled = shouldEnableAnalytics();

  useEffect(() => {
    saveMetaProfile(profile);
  }, [profile]);

  useEffect(() => {
    saveAudioSettings(audioSettings);
    menuAudio.setSettings(audioSettings);
  }, [audioSettings, menuAudio]);

  function playMenuCue(cueId: Parameters<typeof menuAudio.playCue>[0]) {
    menuAudio.unlock();
    menuAudio.playCue(cueId);
  }

  useEffect(() => {
    if (screen === "menu") {
      menuAudio.syncBgm("menu");
    } else {
      menuAudio.syncBgm(null);
    }
  }, [menuAudio, screen]);

  useEffect(() => {
    function unlockMenuAudio() {
      menuAudio.unlock();
    }

    window.addEventListener("pointerdown", unlockMenuAudio);
    window.addEventListener("keydown", unlockMenuAudio);

    return () => {
      window.removeEventListener("pointerdown", unlockMenuAudio);
      window.removeEventListener("keydown", unlockMenuAudio);
      menuAudio.dispose();
    };
  }, [menuAudio]);

  function startGame() {
    playMenuCue("startGame");
    menuAudio.syncBgm(null);
    setRunSetup({
      difficultyId: menuDifficultyId,
      enabledUpgrades: menuEnabledUpgrades,
      metaUpgrades: profile.metaUpgrades,
      selectedSkinId: profile.selectedSkinId,
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
    setProfile((current) => {
      const next = purchaseMetaUpgrade(current, upgradeId);

      if (next) {
        playMenuCue("metaUpgrade");
      }

      return next ?? current;
    });
  }

  function resetAllMetaUpgrades() {
    setProfile((current) => {
      const next = resetMetaUpgrades(current);

      if (next) {
        playMenuCue("metaReset");
      }

      return next ?? current;
    });
  }

  function unlockPlayerSkin(skinId: PlayerSkinId) {
    setProfile((current) => {
      const next = purchasePlayerSkin(current, skinId);

      if (next) {
        playMenuCue("metaUpgrade");
      }

      return next ?? current;
    });
  }

  function equipPlayerSkin(skinId: PlayerSkinId) {
    setProfile((current) => {
      const next = selectPlayerSkin(current, skinId);

      if (next) {
        playMenuCue("uiOpen");
      }

      return next ?? current;
    });
  }

  function selectDifficulty(nextDifficultyId: DifficultyId) {
    setMenuDifficultyId((current) => {
      if (current !== nextDifficultyId) {
        playMenuCue("difficultySelect");
        return nextDifficultyId;
      }

      return current;
    });
  }

  function updateAudioSetting<K extends keyof AudioSettings>(key: K, value: AudioSettings[K]) {
    setAudioSettings((current) => normalizeAudioSettings({
      ...current,
      [key]: value,
    }));
  }

  return (
    <div className="app-shell">
      {screen === "menu" ? (
        <>
          <StartScreen
            difficultyId={menuDifficultyId}
            enabledBuffCount={menuEnabledUpgrades.length}
            goldenEggs={profile.goldenEggs}
            selectedSkinId={profile.selectedSkinId}
            totalBuffCount={ALL_UPGRADE_IDS.length}
            totalSkinCount={PLAYER_SKIN_DEFS.length}
            unlockedSkinCount={profile.unlockedSkinIds.length}
            onOpenBuffSetup={() => { playMenuCue("uiOpen"); setBuffSetupOpen(true); }}
            onOpenChangelog={() => { playMenuCue("uiOpen"); setChangelogOpen(true); }}
            onOpenCompendium={() => { playMenuCue("uiOpen"); setCompendiumOpen(true); }}
            onOpenMetaUpgrade={() => { playMenuCue("uiOpen"); setMetaUpgradeOpen(true); }}
            onOpenSkinLab={() => { playMenuCue("uiOpen"); setSkinLabOpen(true); }}
            onOpenTutorial={() => { playMenuCue("uiOpen"); setTutorialOpen(true); }}
            onOpenVolumeSettings={() => { playMenuCue("uiOpen"); setVolumeSettingsOpen(true); }}
            onCheatGoldenEggs={() => { playMenuCue("cheat"); awardGoldenEggs(100); }}
            onSelectDifficulty={selectDifficulty}
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
          <EnemyCompendiumModal isOpen={compendiumOpen} onClose={() => setCompendiumOpen(false)} />
          <MetaUpgradeModal
            goldenEggs={profile.goldenEggs}
            isOpen={metaUpgradeOpen}
            metaUpgrades={profile.metaUpgrades}
            onClose={() => setMetaUpgradeOpen(false)}
            onPurchase={upgradeMetaStat}
            onReset={resetAllMetaUpgrades}
          />
          <SkinLabModal
            goldenEggs={profile.goldenEggs}
            isOpen={skinLabOpen}
            onClose={() => setSkinLabOpen(false)}
            onPurchase={unlockPlayerSkin}
            onSelect={equipPlayerSkin}
            ownedSkinIds={profile.unlockedSkinIds}
            selectedSkinId={profile.selectedSkinId}
          />
          <TutorialModal isOpen={tutorialOpen} onClose={() => setTutorialOpen(false)} />
          <VolumeSettingsModal
            isOpen={volumeSettingsOpen}
            onChange={updateAudioSetting}
            onClose={() => setVolumeSettingsOpen(false)}
            onPreviewBgm={() => menuAudio.previewBgm("menu")}
            onPreviewSfx={() => menuAudio.previewCue("levelUp")}
            settings={audioSettings}
          />
        </>
      ) : (
        <GameScreen key={runKey} audioSettings={audioSettings} onAwardGoldenEggs={awardGoldenEggs} onReturnToMenu={returnToMenu} setup={runSetup} />
      )}
      {analyticsEnabled ? <Analytics mode={import.meta.env.DEV ? "development" : "production"} /> : null}
    </div>
  );
}
