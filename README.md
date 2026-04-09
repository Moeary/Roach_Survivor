# 卵鞘危机

React + TypeScript + Vite 重构版的蟑螂幸存者原型。当前版本把原本固定边界的战场改成了可持续扩展的下水道区域，并把主角操作改成了 `WASD` 移动 + 鼠标定向喷射。

## 玩法

- 主武器会持续朝当前鼠标方向发射卵鞘，鼠标移入战场即可接管瞄准，按 `Esc` 释放。
- 开局不再自动索敌，自动副炮和环绕弹需要通过升级解锁。
- 地图会随着移动不断生成新的下水道片区，片区中包含可碰撞障碍物。
- 存活到 `05:00` 后会触发母巢女王 Boss 战。

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

## 项目结构

- `src/App.tsx`：菜单与游戏入口切换
- `src/components/StartScreen.tsx`：开始界面与主角 Logo 展示
- `src/components/GameScreen.tsx`：SVG 战场、HUD、升级与结算浮层
- `src/components/RoachMascot.tsx`：主角蟑螂共享 SVG 组件
- `src/components/TutorialModal.tsx`：教程弹窗
- `src/game/core.ts`：游戏循环、生成、碰撞、Boss、瞄准与战斗逻辑
- `src/game/upgrades.ts`：升级定义与摘要
- `src/game/types.ts`：类型定义
- `src/styles.css`：全局样式

## 备注

- 仓库里还保留了旧版原生 JS 文件作迁移参考，但当前入口只使用 `src/main.tsx` 下的 React + TypeScript 实现。
- `dist/` 为构建输出目录，可随时重新生成。
