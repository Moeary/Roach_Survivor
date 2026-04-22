import { UPGRADE_DEFS } from "../game/upgrades";
import type { UpgradeId } from "../game/types";
import { UpgradeIcon } from "./GameIcon";

interface BuffSetupModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReset: () => void;
  onToggleUpgrade: (upgradeId: UpgradeId) => void;
  selectedUpgrades: UpgradeId[];
}

export default function BuffSetupModal({
  isOpen,
  onClose,
  onReset,
  onToggleUpgrade,
  selectedUpgrades,
}: BuffSetupModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        aria-modal="true"
        className="tutorial-modal modal-run-buffs"
        role="dialog"
        aria-label="自定义本局 Buff"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="menu-eyebrow">RUN BUFFS</p>
        <h2>自定义本局 Buff</h2>
        <p className="modal-copy">
          默认全开，最少保留 3 个 Buff，方便你在单局里专门测试升级权重和强度表现。
        </p>

        <div className="buff-modal-head">
          <strong>
            已启用 {selectedUpgrades.length} / {UPGRADE_DEFS.length}
          </strong>
          <button className="button-secondary" type="button" onClick={onReset}>
            重置为全选
          </button>
        </div>

        <div className="buff-grid">
          {UPGRADE_DEFS.map((upgrade) => {
            const enabled = selectedUpgrades.includes(upgrade.id);
            const locked = enabled && selectedUpgrades.length <= 3;

            return (
              <button
                key={upgrade.id}
                className={`buff-card ${enabled ? "buff-card-active" : ""}`}
                type="button"
                onClick={() => onToggleUpgrade(upgrade.id)}
                disabled={locked}
              >
                <div className="buff-card-headline">
                  <UpgradeIcon id={upgrade.id} className="buff-card-icon" locked={!enabled} />
                  <div>
                    <span>{upgrade.shortName}</span>
                    <h3>{upgrade.name}</h3>
                  </div>
                </div>
                <p>{upgrade.description}</p>
                <strong className="buff-card-state">{enabled ? (locked ? "至少保留 3 个" : "已启用") : "已关闭"}</strong>
              </button>
            );
          })}
        </div>

        <div className="modal-actions">
          <button className="button-primary" type="button" onClick={onClose}>
            确认
          </button>
        </div>
      </section>
    </div>
  );
}
