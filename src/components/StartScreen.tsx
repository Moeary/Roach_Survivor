import { DIFFICULTY_ORDER, getDifficultyConfig } from "../game/run/config";
import type { DifficultyId } from "../game/types";
import { RoachLogo } from "./sprites/player/RoachMascot";

interface StartScreenProps {
  difficultyId: DifficultyId;
  enabledBuffCount: number;
  totalBuffCount: number;
  onOpenBuffSetup: () => void;
  onOpenChangelog: () => void;
  onOpenTutorial: () => void;
  onSelectDifficulty: (difficultyId: DifficultyId) => void;
  onStart: () => void;
}

export default function StartScreen({
  difficultyId,
  enabledBuffCount,
  totalBuffCount,
  onOpenBuffSetup,
  onOpenChangelog,
  onOpenTutorial,
  onSelectDifficulty,
  onStart,
}: StartScreenProps) {
  const difficulty = getDifficultyConfig(difficultyId);

  return (
    <main className="menu-screen">
      <div className="menu-noise" aria-hidden="true" />
      <section className="hero-panel">
        <div className="hero-main">
          <div className="hero-copy-block">
            <p className="menu-eyebrow">ROACH SURVIVOR</p>
            <h1>卵鞘危机</h1>

            <div className="hero-actions">
              <button className="button-primary" type="button" onClick={onStart}>
                开始游戏
              </button>
              <button className="button-secondary" type="button" onClick={onOpenTutorial}>
                查看教程
              </button>
              <button className="button-secondary" type="button" onClick={onOpenChangelog}>
                版本更新日志
              </button>
            </div>

            <div className="menu-config-grid">
              <section className="config-card">
                <span>难度轮盘</span>
                <div className="difficulty-row">
                  {DIFFICULTY_ORDER.map((optionId) => {
                    const option = getDifficultyConfig(optionId);
                    return (
                      <button
                        key={option.id}
                        className={`difficulty-pill ${option.id === difficultyId ? "difficulty-pill-active" : ""}`}
                        type="button"
                        onClick={() => onSelectDifficulty(option.id)}
                      >
                        {option.label}
                      </button>
                    );
                  })}
                </div>
                <p>{difficulty.description}</p>
              </section>

              <section className="config-card">
                <span>本局 Buff</span>
                <strong>
                  已启用 {enabledBuffCount} / {totalBuffCount}
                </strong>
                <p>默认全选，最少保留 3 个，用来调试不同升级组合的强度。</p>
                <button className="button-secondary" type="button" onClick={onOpenBuffSetup}>
                  自定义 Buff
                </button>
              </section>
            </div>
          </div>

          <aside className="hero-logo-stage" aria-label="主角蟑螂标志">
            <RoachLogo className="hero-logo-art" />
          </aside>
        </div>

        <section className="menu-footnote menu-footnote-inline">
          <div>
            <span>目标</span>
            <strong>
              存活 {Math.floor(difficulty.runDuration / 60)}:{String(difficulty.runDuration % 60).padStart(2, "0")} 并击败 {difficulty.bossWaves} 波 Boss
            </strong>
          </div>
          <div>
            <span>当前版本</span>
            <strong>v0.4 Difficulty & Debug Setup</strong>
          </div>
        </section>
      </section>
    </main>
  );
}
