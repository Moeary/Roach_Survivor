import { useState } from "react";
import ChangelogModal from "./components/ChangelogModal";
import GameScreen from "./components/GameScreen";
import StartScreen from "./components/StartScreen";
import TutorialModal from "./components/TutorialModal";

export default function App() {
  const [screen, setScreen] = useState<"menu" | "game">("menu");
  const [changelogOpen, setChangelogOpen] = useState(false);
  const [tutorialOpen, setTutorialOpen] = useState(false);
  const [runKey, setRunKey] = useState(0);

  function startGame() {
    setRunKey((value) => value + 1);
    setScreen("game");
  }

  function returnToMenu() {
    setScreen("menu");
  }

  return (
    <div className="app-shell">
      {screen === "menu" ? (
        <>
          <StartScreen
            onOpenChangelog={() => setChangelogOpen(true)}
            onOpenTutorial={() => setTutorialOpen(true)}
            onStart={startGame}
          />
          <ChangelogModal isOpen={changelogOpen} onClose={() => setChangelogOpen(false)} />
          <TutorialModal isOpen={tutorialOpen} onClose={() => setTutorialOpen(false)} />
        </>
      ) : (
        <GameScreen key={runKey} onReturnToMenu={returnToMenu} />
      )}
    </div>
  );
}
