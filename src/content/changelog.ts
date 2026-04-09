export interface ChangelogEntry {
  version: string;
  date: string;
  summary: string;
  items: string[];
}

export const CHANGELOG_ENTRIES: ChangelogEntry[] = [
  {
    version: "v0.3 Menu & Asset Refactor",
    date: "2026-04-09",
    summary: "主页收束成单面板，主角/敌人/升级数据开始拆分到独立目录。",
    items: [
      "开始界面精简为标题、开始、教程、更新日志和底部版本信息。",
      "主角蟑螂重画成更接近吉祥物的可爱比例，保留一双手和一双脚。",
      "玩家属性、敌人定义、敌人贴图和升级定义开始脱离单个大文件。",
    ],
  },
  {
    version: "v0.2 Sewer Expansion",
    date: "2026-04-09",
    summary: "战场改成无限下水道，加入障碍物和新的自动攻击升级。",
    items: [
      "主武器改成朝鼠标方向喷射，Esc 可释放瞄准。",
      "加入自动副炮和环绕弹升级。",
      "地图按区块扩展并生成障碍物。",
    ],
  },
  {
    version: "v0.1 React Migration Demo",
    date: "2026-04-08",
    summary: "原始原生 JS 版本迁移到 React + TypeScript + Vite。",
    items: [
      "主流程改成菜单 + 教程弹窗 + React 游戏画面。",
      "核心玩法、升级和 Boss 逻辑完成类型化。",
      "构建流程改为 npm / Vite。",
    ],
  },
];
