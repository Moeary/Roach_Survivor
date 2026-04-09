import { CHANGELOG_ENTRIES } from "../content/changelog";

interface ChangelogModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function ChangelogModal({ isOpen, onClose }: ChangelogModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        aria-modal="true"
        className="tutorial-modal"
        role="dialog"
        aria-label="版本更新日志"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="menu-eyebrow">CHANGELOG</p>
        <h2>版本更新日志</h2>
        <p className="modal-copy">后续版本改动都会继续往这里累计，不再把更新说明塞进主页主体。</p>

        <div className="changelog-list">
          {CHANGELOG_ENTRIES.map((entry) => (
            <article key={entry.version} className="changelog-entry">
              <div className="changelog-head">
                <div>
                  <span>{entry.date}</span>
                  <h3>{entry.version}</h3>
                </div>
                <p>{entry.summary}</p>
              </div>
              <ul className="tip-list">
                {entry.items.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>

        <div className="modal-actions">
          <button className="button-primary" type="button" onClick={onClose}>
            关闭日志
          </button>
        </div>
      </section>
    </div>
  );
}
