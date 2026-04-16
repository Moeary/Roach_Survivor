import type { AudioSettings } from "../audio/gameAudio";

interface VolumeSettingsModalProps {
  isOpen: boolean;
  onChange: <K extends keyof AudioSettings>(key: K, value: AudioSettings[K]) => void;
  onClose: () => void;
  onPreviewBgm: () => void;
  onPreviewSfx: () => void;
  settings: AudioSettings;
}

type SliderSetting = {
  key: keyof AudioSettings;
  label: string;
  description: string;
  preview?: "bgm" | "sfx";
};

const SLIDER_SETTINGS: SliderSetting[] = [
  {
    key: "masterVolume",
    label: "全体音量",
    description: "统一控制所有声音的总输出。",
  },
  {
    key: "bgmVolume",
    label: "BGM 音量",
    description: "调整菜单和战斗音乐，松手后会重播主菜单 BGM 作为反馈。",
    preview: "bgm",
  },
  {
    key: "sfxVolume",
    label: "SFX 音量",
    description: "调整射击、Boss 技能、雷击、升级和失败音效，松手后会播放 level-up 作为反馈。",
    preview: "sfx",
  },
];

function toPercent(value: number): number {
  return Math.round(value * 100);
}

export default function VolumeSettingsModal({
  isOpen,
  onChange,
  onClose,
  onPreviewBgm,
  onPreviewSfx,
  settings,
}: VolumeSettingsModalProps) {
  if (!isOpen) {
    return null;
  }

  function preview(setting: SliderSetting) {
    if (setting.preview === "bgm") {
      onPreviewBgm();
    } else if (setting.preview === "sfx") {
      onPreviewSfx();
    }
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        aria-modal="true"
        className="tutorial-modal modal-compact"
        role="dialog"
        aria-label="音量设置"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="menu-eyebrow">AUDIO</p>
        <h2>音量调整</h2>
        <p className="modal-copy">三条滑杆会立即作用到当前音频。BGM 和音效滑杆在松手后会自动播放一次反馈音。</p>

        <div className="audio-grid">
          {SLIDER_SETTINGS.map((setting) => (
            <section key={setting.key} className="audio-card">
              <div className="audio-card-head">
                <div>
                  <span>{setting.label}</span>
                  <strong>{toPercent(settings[setting.key])}%</strong>
                </div>
                <em>{setting.preview === "bgm" ? "反馈：菜单 BGM" : setting.preview === "sfx" ? "反馈：level-up" : "实时生效"}</em>
              </div>
              <p>{setting.description}</p>
              <input
                className="volume-slider"
                max="100"
                min="0"
                step="1"
                type="range"
                value={toPercent(settings[setting.key])}
                onChange={(event) => onChange(setting.key, Number(event.target.value) / 100)}
                onKeyUp={() => preview(setting)}
                onPointerUp={() => preview(setting)}
              />
            </section>
          ))}
        </div>

        <div className="modal-actions">
          <button className="button-primary" type="button" onClick={onClose}>
            关闭音量面板
          </button>
        </div>
      </section>
    </div>
  );
}
