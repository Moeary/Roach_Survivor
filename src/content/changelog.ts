export interface ChangelogEntry {
  version: string;
  date: string;
  summary: string;
  items: string[];
}

export const CHANGELOG_ENTRIES: ChangelogEntry[] = [
  {
    version: "v0.6 UI, Audio & Bestiary",
    date: "2026-04-11",
    summary: "主页补上音量面板、怪物图鉴和更顺手的菜单排版。",
    items: [
      "主页新增音量调整，可分别控制全体、BGM 和 SFX 音量，并提供试听反馈。",
      "主页新增怪物图鉴，直接展示当前 SVG 敌人形象和各难度下实际生效的血量、伤害、速度。",
      "难度按钮改成三列等宽，困难不会再掉到下一行。",
      "局外升级面板改成一行四列桌面布局，并移除 Cookie 已启用持久化提示。",
      "主页当前版本号更新为 v0.6。",
    ],
  },
  {
    version: "v0.5 Enemy Surge Refresh",
    date: "2026-04-11",
    summary: "扩充敌人梯度、重做高波次 Boss，并统一难度成长参数。",
    items: [
      "普通怪的金色卵鞘掉率改成按难度统一配置，当前三档先统一为 0.2%。",
      "敌人池扩展为 10 种：0-5 分钟保持 3 种，5-10 分钟新增 3 种，10-15 分钟再新增 4 种。",
      "普通难度怪物生命和伤害为 1.5 倍、速度 1.2 倍；困难难度生命和伤害为 2 倍、速度 1.4 倍。",
      "第二波 Boss 改为高速突进型，第三波 Boss 改为高血量召唤型最终 Boss。",
    ],
  },
  {
    version: "v0.5 Meta Progression & Audio",
    date: "2026-04-09",
    summary: "加入金色卵鞘收集、局外成长和分阶段音频入口。",
    items: [
      "普通怪开始以极低概率掉落金色卵鞘，Boss 波次按难度固定掉落并支持结算自动收集。",
      "主页新增局外升级面板，可消耗金色卵鞘强化开局攻击、移速和血量，进度用 Cookie 持久化。",
      "新增透明作弊热区和音频控制器，预留分波次 BGM、发射音效和击杀音效的资源入口。",
    ],
  },
  {
    version: "v0.4 Difficulty & Debug Setup",
    date: "2026-04-09",
    summary: "加入难度轮盘、本局 Buff 开关，并把战场 world sprites 继续拆分。",
    items: [
      "主页可切换简单、普通、困难三档，对应 5 / 10 / 15 分钟和 1 / 2 / 3 波 Boss。",
      "新增自定义 Buff 弹窗，默认全开，但至少保留 3 个升级池用于平衡测试。",
      "主角不再整只旋转，只保留发射方向旋转；地图 defs 也从 GameScreen 中拆出。",
    ],
  },
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
