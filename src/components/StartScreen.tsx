import { RoachLogo } from "./RoachMascot";

interface StartScreenProps {
  onStart: () => void;
  onOpenTutorial: () => void;
}

const featureCards = [
  {
    title: "鼠标定向喷射",
    copy: "把鼠标挪进战场就能接管瞄准，默认火力只会朝你的指向喷出去。",
  },
  {
    title: "无限下水道",
    copy: "地图不再有边界，整片污水管网会不断往外延伸，还会长出障碍物卡位。",
  },
  {
    title: "升级补自动火力",
    copy: "自动副炮和环绕弹都改成后期变异，让主角和脏兮兮的变异虫群更有差异。",
  },
];

export default function StartScreen({ onOpenTutorial, onStart }: StartScreenProps) {
  return (
    <main className="menu-screen">
      <div className="menu-noise" aria-hidden="true" />
      <section className="hero-panel">
        <div className="hero-header">
          <div className="hero-copy-block">
            <p className="menu-eyebrow">ROACHLIKE SURVIVOR // REACT + TS</p>
            <h1>卵鞘危机</h1>
            <p className="hero-copy">
              下水道彻底炸窝了。你是一只软萌却硬壳的战斗蟑螂，和四周那些脏兮兮、变异过头的怪胎完全不是一个画风，只能靠手动瞄准、
              临场变异和走位，在五分钟虫潮里活下来。
            </p>
          </div>

          <aside className="hero-logo-card" aria-label="主角蟑螂标志">
            <RoachLogo className="hero-logo-art" />
            <div className="hero-logo-copy">
              <span>主角识别</span>
              <strong>小可爱硬壳蟑螂</strong>
              <p>圆脑袋、浅橘脸和整洁甲壳会作为开始界面 Logo，也会直接出现在战场主角身上。</p>
            </div>
          </aside>
        </div>

        <div className="hero-actions">
          <button className="button-primary" type="button" onClick={onStart}>
            开始游戏
          </button>
          <button className="button-secondary" type="button" onClick={onOpenTutorial}>
            查看教程
          </button>
        </div>

        <div className="hero-tags">
          <span>桌面端优先</span>
          <span>WASD 移动</span>
          <span>鼠标定向喷射</span>
          <span>Esc 释放瞄准</span>
          <span>升级三选一</span>
        </div>
      </section>

      <section className="feature-grid" aria-label="玩法亮点">
        {featureCards.map((card) => (
          <article key={card.title} className="feature-card">
            <h2>{card.title}</h2>
            <p>{card.copy}</p>
          </article>
        ))}
      </section>

      <section className="menu-footnote">
        <div>
          <span>目标</span>
          <strong>撑过 05:00 并击败母巢女王</strong>
        </div>
        <div>
          <span>当前版本</span>
          <strong>v0.2 Sewer Expansion</strong>
        </div>
      </section>
    </main>
  );
}
