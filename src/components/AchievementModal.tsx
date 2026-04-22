import { ACHIEVEMENT_DEFS, ACHIEVEMENT_TIERS, getAchievementUnlockCount } from "../game/achievements";
import type { AchievementUnlocks } from "../game/types";
import { AchievementIcon } from "./GameIcon";

interface AchievementModalProps {
  achievements: AchievementUnlocks;
  isOpen: boolean;
  onClose: () => void;
}

export default function AchievementModal({ achievements, isOpen, onClose }: AchievementModalProps) {
  if (!isOpen) {
    return null;
  }

  const unlockedCount = getAchievementUnlockCount(achievements);

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        aria-modal="true"
        className="tutorial-modal modal-wide modal-achievements"
        role="dialog"
        aria-label="成就档案"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="menu-eyebrow">ACHIEVEMENTS</p>
        <h2>蟑螂档案</h2>
        <p className="modal-copy">成就按北方迷你蟑螂、美洲大镰、广东双马尾、火星异种递进。使用游戏内快进测试的局不会解锁成就。</p>

        <div className="achievement-summary">
          <strong>{unlockedCount} / {ACHIEVEMENT_DEFS.length} 已完成</strong>
          <span>完成全部成就后自动解锁火星异种皮肤</span>
        </div>

        <div className="achievement-tier-list">
          {ACHIEVEMENT_TIERS.map((tier) => {
            const tierAchievements = ACHIEVEMENT_DEFS.filter((achievement) => achievement.tier === tier.id);
            const tierUnlockedCount = tierAchievements.reduce((total, achievement) => total + (achievements[achievement.id] ? 1 : 0), 0);

            return (
              <section key={tier.id} className={`achievement-tier achievement-tier-${tier.id}`}>
                <div className="achievement-tier-head">
                  <div>
                    <span>{tier.label}</span>
                    <p>{tier.description}</p>
                  </div>
                  <strong>{tierUnlockedCount} / {tierAchievements.length}</strong>
                </div>

                <div className="achievement-grid">
                  {tierAchievements.map((achievement) => {
                    const unlocked = Boolean(achievements[achievement.id]);

                    return (
                      <article key={achievement.id} className={`achievement-card ${unlocked ? "achievement-card-unlocked" : ""}`}>
                        <div className="achievement-card-headline">
                          <AchievementIcon id={achievement.id} className="achievement-card-icon" locked={!unlocked} />
                          <div>
                            <span>{achievement.shortName}</span>
                            <h3>{achievement.name}</h3>
                          </div>
                        </div>
                        <p>{achievement.description}</p>
                        <strong>{unlocked ? "已完成" : "未完成"}</strong>
                      </article>
                    );
                  })}
                </div>
              </section>
            );
          })}
        </div>

        <div className="modal-actions">
          <button className="button-primary" type="button" onClick={onClose}>
            关闭档案
          </button>
        </div>
      </section>
    </div>
  );
}
