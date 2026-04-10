interface TutorialModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const controls = [
  ["移动", "WASD / 方向键"],
  ["瞄准", "鼠标进入战场后接管方向，Esc 释放"],
  ["攻击", "主武器会持续朝当前鼠标方向喷射卵鞘"],
  ["刷新词条", "升级时点按钮或按 R，前提是局外已解锁刷新次数"],
  ["升级选择", "点卡片或按 1 / 2 / 3"],
  ["暂停", "P"],
  ["重开", "结算时按 Enter"],
];

const tips = [
  "前期优先拿攻速、伤害或移速，先把手动瞄准的节奏跑起来。",
  "自动副炮和环绕弹现在要靠升级解锁，不会开局就帮你全自动清场。",
  "经验颗粒会自动吸附，不需要贴脸才吃得到。",
  "金色卵鞘会掉落并通过 Cookie 保存在本地，回到主页后可以做局外升级。",
  "无限地图里会不断长出障碍物，被敌人碰到会掉血并产生击退，走位要留出绕位空间。",
];

export default function TutorialModal({ isOpen, onClose }: TutorialModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        aria-modal="true"
        className="tutorial-modal"
        role="dialog"
        aria-label="游戏教程"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="menu-eyebrow">TUTORIAL</p>
        <h2>怎么活过这场蟑螂虫潮</h2>
        <p className="modal-copy">
          游戏画面现在会全屏留给战斗。教程、规则和按键说明都收进这里，避免再挤占你的操作视野，也方便说明新版鼠标瞄准。
        </p>

        <div className="tutorial-grid">
          <div className="tutorial-block">
            <h3>操作</h3>
            <ul className="modal-list">
              {controls.map(([label, value]) => (
                <li key={label}>
                  <span>{label}</span>
                  <strong>{value}</strong>
                </li>
              ))}
            </ul>
          </div>

          <div className="tutorial-block">
            <h3>生存建议</h3>
            <ul className="tip-list">
              {tips.map((tip) => (
                <li key={tip}>{tip}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="modal-actions">
          <button className="button-primary" type="button" onClick={onClose}>
            关闭教程
          </button>
        </div>
      </section>
    </div>
  );
}
