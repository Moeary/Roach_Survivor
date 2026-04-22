import { PLAYER_SKIN_DEFS } from "../game/meta";
import type { PlayerSkinId } from "../game/types";
import { RoachShowcase } from "./sprites/player/RoachMascot";

interface SkinLabModalProps {
  goldenEggs: number;
  isOpen: boolean;
  onClose: () => void;
  onPurchase: (skinId: PlayerSkinId) => void;
  onSelect: (skinId: PlayerSkinId) => void;
  ownedSkinIds: PlayerSkinId[];
  selectedSkinId: PlayerSkinId;
}

export default function SkinLabModal({
  goldenEggs,
  isOpen,
  onClose,
  onPurchase,
  onSelect,
  ownedSkinIds,
  selectedSkinId,
}: SkinLabModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        aria-modal="true"
        className="tutorial-modal modal-wide modal-skin-lab"
        role="dialog"
        aria-label="广Door人的神必实验室"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="menu-eyebrow">SKIN LAB</p>
        <h2>广Door人的神必实验室</h2>
        <p className="modal-copy">花费金色卵鞘解锁新皮肤，已拥有的皮肤可以随时切换，右侧展示柜会同步更新当前装备。</p>

        <div className="buff-modal-head">
          <strong>当前库存 {goldenEggs} 枚金色卵鞘</strong>
          <span className="currency-pill">已解锁 {ownedSkinIds.length} / {PLAYER_SKIN_DEFS.length} 套</span>
        </div>

        <div className="skin-lab-grid">
          {PLAYER_SKIN_DEFS.map((skin) => {
            const isOwned = ownedSkinIds.includes(skin.id);
            const isSelected = selectedSkinId === skin.id;
            const isAchievementReward = skin.unlockType === "achievement";
            const canAfford = !isAchievementReward && goldenEggs >= skin.cost;
            const buttonLabel = isSelected ? "当前装备" : isOwned ? "装备皮肤" : isAchievementReward ? "达成成就解锁" : "购买并装备";
            const buttonClassName = isOwned || isAchievementReward ? "button-secondary" : "button-primary";

            return (
              <article key={skin.id} className={`skin-card ${isSelected ? "skin-card-selected" : ""}`}>
                <div className="skin-card-preview">
                  <RoachShowcase className="skin-card-art" skinId={skin.id} />
                </div>

                <div className="skin-card-copy">
                  <span>{skin.shortName}</span>
                  <h3>{skin.name}</h3>
                  <p>{skin.description}</p>
                  <em>{skin.flavor}</em>
                </div>

                <div className="skin-card-meta">
                  <strong>{isAchievementReward ? (skin.rewardDescription ?? "成就奖励") : skin.cost === 0 ? "默认解锁" : `${skin.cost} 金色卵鞘`}</strong>
                  <span>{isSelected ? "当前装备中" : isOwned ? "已拥有" : isAchievementReward ? "成就奖励" : canAfford ? "可购买" : "卵鞘不足"}</span>
                </div>

                <div className="skin-card-actions">
                  <button
                    className={buttonClassName}
                    type="button"
                    disabled={isSelected || (!isOwned && !canAfford)}
                    onClick={() => {
                      if (isOwned) {
                        onSelect(skin.id);
                        return;
                      }

                      onPurchase(skin.id);
                    }}
                  >
                    {buttonLabel}
                  </button>
                </div>
              </article>
            );
          })}
        </div>

        <div className="modal-actions">
          <button className="button-primary" type="button" onClick={onClose}>
            关闭实验室
          </button>
        </div>
      </section>
    </div>
  );
}
