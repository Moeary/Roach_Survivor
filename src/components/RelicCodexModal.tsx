import { RELIC_DEFS } from "../game/relics";
import { RelicIcon } from "./GameIcon";

interface RelicCodexModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORY_LABELS: Record<(typeof RELIC_DEFS)[number]["category"], string> = {
  offensive: "进攻",
  defensive: "防御",
  utility: "功能",
  risk: "风险",
};

export default function RelicCodexModal({ isOpen, onClose }: RelicCodexModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        aria-modal="true"
        className="tutorial-modal modal-wide modal-relic-codex"
        role="dialog"
        aria-label="圣遗物图鉴"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="menu-eyebrow">RELIC CODEX</p>
        <h2>圣遗物图鉴</h2>
        <p className="modal-copy">圣遗物会在单局里按等级节点出现，拿到后永久影响这一局的战斗节奏。</p>

        <div className="relic-codex-grid">
          {RELIC_DEFS.map((relic) => (
            <article key={relic.id} className={`relic-codex-card relic-codex-card-${relic.category}`}>
              <RelicIcon id={relic.id} className="relic-codex-icon" />
              <div className="relic-codex-copy">
                <span>{CATEGORY_LABELS[relic.category]}</span>
                <h3>{relic.name}</h3>
                <p>{relic.description}</p>
              </div>
            </article>
          ))}
        </div>

        <div className="modal-actions">
          <button className="button-primary" type="button" onClick={onClose}>
            关闭图鉴
          </button>
        </div>
      </section>
    </div>
  );
}
