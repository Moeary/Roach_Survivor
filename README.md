# 卵鞘危机

一款以“下水道蟑螂生存战”为主题的 Web Roguelite 小游戏。玩家需要在不断扩张的污水区中生存、升级、击败多阶段 Boss，并把掉落的金色卵鞘带回主菜单继续做局外成长。

![](https://raw.githubusercontent.com/Moeary/pic_bed/main/img/202604122233100.png)

## 项目概览

- **技术栈**：React 19、TypeScript、Vite、Electron
- **目标平台**：现代浏览器、Windows / Linux 桌面端
- **核心体验**：即时移动射击 + 幸存者式升级选择 + 局外成长
- **当前内容量**：3 档难度、3 波 Boss、10 个本局 Buff、8 项局外升级

## 核心特色

- **手感明确的生存战斗**
  - 主武器持续朝当前瞄准方向喷射卵鞘，鼠标移入战场即可接管瞄准，按 `Esc` 释放。
  - 地图会随着玩家移动持续生成新的下水道片区，战斗空间不会锁死在单屏内。
  - 障碍物具有真实碰撞，走位、卡角和拉扯都会直接影响存活率。

- **逐段抬压的关卡节奏**
  - 简单 / 普通 / 困难分别对应 `04:00 / 07:00 / 10:00` 的整局时长，以及 `1 / 2 / 3` 波 Boss。
  - 敌人池会随时间扩展：前期是基础单位，中期加入更强追击者，后期再叠加高压精英怪。
  - Boss 拥有独立技能阶段：贴脸传送、障碍穿越冲刺、召唤杂兵与旧 Boss 支援。

- **成型感更强的成长系统**
  - 本局提供 10 个可自定义启用的 Buff，支持专门测试某条构筑路线。
  - 局外成长提供 8 项升级，包括基础伤害、移速、血量、经验吸附、接触减伤、升级回血等。
  - 金色卵鞘通过 Cookie 持久化，回到主菜单后可继续投入外部强化。

- **完整的音频接线**
  - 已接入菜单 / 战斗 / Boss / 胜利 BGM。
  - 已预留 Boss 技能、召唤、雷击、失败等 SFX 文件位，后续可以直接替换占位资源。

## 操作说明

- `WASD` / 方向键：移动
- 鼠标进入战场：接管瞄准
- `Esc`：释放鼠标瞄准
- `1` / `2` / `3`：选择升级
- `R`：升级弹窗内刷新词条
- `P`：暂停
- `Enter`：结算后重开  

## 快速开始

### 本地开发

```bash
npm install
npm run dev
```

### 生产构建

```bash
npm run build
```

### 生产打包

```bash
# 当前系统可打的 Electron 包
npm run electron:dist

# Windows NSIS 安装包
npm run electron:dist:win

# Linux AppImage
npm run electron:dist:linux
```

Electron 打包产物会输出到 `release/`。

### Docker 构建

```bash
docker compose up --build
```

- 默认通过 `http://localhost:8080` 提供静态页面。
- `Dockerfile` 使用多阶段构建：Node 负责编译 Vite，Nginx 负责分发 `dist/`。

## 目录结构

- `src/App.tsx`：菜单流转、音频设置、局外升级与开局配置
- `src/components/StartScreen.tsx`：开始界面、难度入口、功能面板
- `src/components/GameScreen.tsx`：主战场视图、HUD、输入接线、结算层
- `src/game/core.ts`：核心循环、碰撞、敌人生成、Boss 技能、Buff 生效逻辑
- `src/game/entities/`：玩家和敌人基础数据
- `src/game/meta/`：局外成长定义与 Cookie 存档
- `src/game/upgrades/`：本局 Buff 定义、选择与摘要逻辑
- `src/audio/gameAudio.ts`：BGM / SFX 控制器与事件消费
- `public/audio/`：音频资源目录
- `electron/`：桌面端主进程入口
