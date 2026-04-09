import { RoachLogo } from "./sprites/player/RoachMascot";

interface StartScreenProps {
  onStart: () => void;
  onOpenTutorial: () => void;
  onOpenChangelog: () => void;
}

export default function StartScreen({ onOpenChangelog, onOpenTutorial, onStart }: StartScreenProps) {
  return (
    <main className="menu-screen">
      <div className="menu-noise" aria-hidden="true" />
      <section className="hero-panel">
        <div className="hero-main">
          <div className="hero-copy-block">
            <p className="menu-eyebrow">ROACHLIKE SURVIVOR // REACT + TS</p>
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
          </div>

          <aside className="hero-logo-stage" aria-label="主角蟑螂标志">
            <RoachLogo className="hero-logo-art" />
          </aside>
        </div>

        <section className="menu-footnote menu-footnote-inline">
          <div>
            <span>目标</span>
            <strong>撑过 05:00 并击败母巢女王</strong>
          </div>
          <div>
            <span>当前版本</span>
            <strong>v0.3 Menu & Asset Refactor</strong>
          </div>
        </section>
      </section>
    </main>
  );
}
