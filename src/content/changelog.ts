export interface ChangelogEntry {
  version: string;
  date: string;
  summary: string;
  items: string[];
}

export const CHANGELOG_ENTRIES: ChangelogEntry[] = [
  {
    version: "v0.8 Desktop Release & Deployment Tooling",
    date: "2026-04-13",
    summary: "补上桌面端分发、Docker 部署和站点分析接线，并把当前版本推进到 v0.8。",
    items: [
      "接入 Vercel Analytics，浏览器部署可直接统计访问，Electron 本地页面会自动跳过分析上报。",
      "新增 Electron 主进程、打包脚本和 electron-builder 配置，可生成 Windows NSIS 与 Linux AppImage 桌面端产物。",
      "新增 GitHub Actions 发布流程，推送 v* tag 后会自动创建 Release 并一次性上传 Windows 和 Linux 的 amd64 构建。",
      "新增 Dockerfile、docker-compose.yml 和 Nginx 静态托管配置，方便本地或服务器直接容器化部署。",
      "补上 SVG 应用图标，并将项目当前版本更新为 v0.8。",
    ],
  },
  {
    version: "v0.7 Boss Timing & Meta Sustain",
    date: "2026-04-12",
    summary: "压缩整局时长，修正第一波 Boss 传送锁点，并补上自动回血局外升级。",
    items: [
      "每局节奏重排为 4:00 / 7:00 / 10:00 三个阶段节点，简单、普通、困难分别对应 1 / 2 / 3 波 Boss。",
      "第一波 Boss 的贴脸传送改为开始前摇时就固定落点，不会因为前摇变长而持续修正到主角脸上。",
      "第二、三阶段怪物时间轴随新节奏同步压缩，图鉴与 HUD 里的阶段时间也一起更新。",
      "局外升级新增自动回血，最高 3 级，每级每秒恢复 1 点生命，花费为 10 / 20 / 30 金色卵鞘。",
      "主页当前版本号更新为 v0.7。",
    ],
  },
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
