import { getMetaUpgradeBonusLabel, getMetaUpgradeCost, getMetaUpgradeMaxLevel, META_UPGRADE_DEFS } from "../game/meta";
import type { MetaUpgradeId, MetaUpgradeLevels } from "../game/types";

interface MetaUpgradeModalProps {
  goldenEggs: number;
  isOpen: boolean;
  metaUpgrades: MetaUpgradeLevels;
  onClose: () => void;
  onPurchase: (upgradeId: MetaUpgradeId) => void;
}

export default function MetaUpgradeModal({
  goldenEggs,
  isOpen,
  metaUpgrades,
  onClose,
  onPurchase,
}: MetaUpgradeModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        aria-modal="true"
        className="tutorial-modal"
        role="dialog"
        aria-label="局外升级"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="menu-eyebrow">META UPGRADES</p>
        <h2>主角外部升级</h2>
        <p className="modal-copy">消耗金色卵鞘强化主角开局属性。数据会通过 Cookie 自动保存在本地，下次打开还能继续加点。</p>

        <div className="buff-modal-head">
          <strong>当前库存 {goldenEggs} 枚金色卵鞘</strong>
          <span className="currency-pill">Cookie 已启用持久化</span>
        </div>

        <div className="meta-grid">
          {META_UPGRADE_DEFS.map((upgrade) => {
            const level = metaUpgrades[upgrade.id];
            const maxLevel = getMetaUpgradeMaxLevel(upgrade.id);
            const cost = getMetaUpgradeCost(upgrade.id, level);
            const isMaxed = level >= maxLevel;
            const affordable = !isMaxed && goldenEggs >= cost;

            return (
              <button
                key={upgrade.id}
                className={`meta-card ${affordable ? "meta-card-active" : ""}`}
                type="button"
                onClick={() => onPurchase(upgrade.id)}
                disabled={!affordable}
              >
                <span>{upgrade.shortName}</span>
                <h3>{upgrade.name}</h3>
                <p>{upgrade.description}</p>
                <div className="meta-stat-line">
                  <strong>当前 Lv.{level} / {maxLevel}</strong>
                  <strong>{getMetaUpgradeBonusLabel(upgrade.id, level)}</strong>
                </div>
                <div className="meta-stat-line">
                  <span>升级后</span>
                  <strong>{isMaxed ? "已满级" : getMetaUpgradeBonusLabel(upgrade.id, level + 1)}</strong>
                </div>
                <div className="meta-stat-line">
                  <span>消耗</span>
                  <strong>{isMaxed ? "已满级" : `${cost} 金色卵鞘`}</strong>
                </div>
              </button>
            );
          })}
        </div>

        <div className="modal-actions">
          <button className="button-primary" type="button" onClick={onClose}>
            关闭升级面板
          </button>
        </div>
      </section>
    </div>
  );
}
