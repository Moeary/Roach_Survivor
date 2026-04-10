# 卵鞘危机

React + TypeScript + Vite 重构版的蟑螂幸存者原型。当前版本加入了难度轮盘、金色卵鞘掉落、局外成长，以及分阶段音频资源入口。

## 玩法

- 主武器会持续朝当前鼠标方向发射卵鞘，鼠标移入战场即可接管瞄准，按 `Esc` 释放。
- 开局不再自动索敌，自动副炮和环绕弹需要通过升级解锁。
- 地图会随着移动不断生成新的下水道片区，片区中包含可碰撞障碍物。
- 简单 / 普通 / 困难分别对应 `05:00 / 10:00 / 15:00` 和 `1 / 2 / 3` 波 Boss。
- 普通敌人会以极低概率掉落金色卵鞘，Boss 波次会固定掉落更多金色卵鞘。
- 金色卵鞘会通过 Cookie 保存在本地，可用于主页里的局外升级。

## 本地运行

```bash
npm install
npm run dev
```

构建产物：

```bash
npm run build
```

## 操作

- `WASD` / 方向键：移动
- 鼠标进入战场：接管瞄准
- `Esc`：释放鼠标瞄准
- `1` / `2` / `3`：选择升级
- `P`：暂停
- `Enter`：结算后重开

## 音频资源

把音频文件放到 `public/audio/` 下，约定见 [public/audio/README.md](public/audio/README.md)。

- BGM：`public/audio/bgm/wave-1.ogg`、`boss-1.ogg`、`wave-2.ogg`、`boss-2.ogg`、`wave-3.ogg`、`boss-3.ogg`
- SFX：`public/audio/sfx/player-shot.ogg`、`enemy-die.ogg`、`gold-egg.ogg`

## 项目结构

- `src/App.tsx`：菜单与游戏入口切换
- `src/components/StartScreen.tsx`：开始界面、难度轮盘和局外入口
- `src/components/GameScreen.tsx`：SVG 战场、HUD、结算与音频接线
- `src/components/MetaUpgradeModal.tsx`：局外升级弹窗
- `src/components/RoachMascot.tsx`：主角蟑螂兼容转发组件
- `src/components/TutorialModal.tsx`：教程弹窗
- `src/game/core.ts`：游戏循环、生成、碰撞、Boss、掉落与战斗逻辑
- `src/game/meta/`：局外成长定义与 Cookie 存档
- `src/game/upgrades.ts`：升级定义转发层
- `src/audio/gameAudio.ts`：BGM 和音效控制器
- `src/game/types.ts`：类型定义
- `src/styles.css`：全局样式

## 备注

- 仓库里还保留了旧版原生 JS 文件作迁移参考，但当前入口只使用 `src/main.tsx` 下的 React + TypeScript 实现。
- `dist/` 为构建输出目录，可随时重新生成。
