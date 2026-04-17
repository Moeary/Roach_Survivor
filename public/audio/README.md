# 音频资源说明

本目录用于存放游戏运行时会直接请求的音频文件。项目已经接好路径约定，只要文件名一致，就可以在不改代码的情况下直接替换为正式素材。

## 目录结构

- `bgm/`：循环播放的背景音乐
- `sfx/`：战斗、UI、升级、Boss 技能等短音效

## BGM 文件

- `bgm/menu.ogg`：主菜单循环
- `bgm/wave-1.ogg`：第一阶段探索战斗
- `bgm/boss-1.ogg`：第一波 Boss
- `bgm/wave-2.ogg`：第二阶段探索战斗
- `bgm/boss-2.ogg`：第二波 Boss
- `bgm/wave-3.ogg`：第三阶段探索战斗
- `bgm/boss-3.ogg`：第三波 Boss
- `bgm/victory.ogg`：通关结算

## SFX 文件

- `sfx/player-shot.ogg`：主武器 / 自动副炮发射
- `sfx/enemy-die.ogg`：普通敌人或 Boss 死亡
- `sfx/player-hurt.ogg`：主角受击
- `sfx/xp-gain.ogg`：吸收经验
- `sfx/gold-egg.ogg`：获得金色卵鞘
- `sfx/level-up.ogg`：升级弹窗出现
- `sfx/buff-reroll.ogg`：刷新本局 Buff
- `sfx/meta-upgrade.ogg`：购买局外升级
- `sfx/meta-reset.ogg`：重置局外升级
- `sfx/difficulty-select.ogg`：切换难度
- `sfx/start-game.ogg`：开始游戏
- `sfx/ui-open.ogg`：打开任意功能弹窗
- `sfx/cheat.ogg`：作弊快进或测试入口
- `sfx/boss-skill-charge.ogg`：Boss 技能前摇 / 蓄力
- `sfx/boss-skill-cast.ogg`：Boss 技能正式释放
- `sfx/boss-summon.ogg`：Boss 召唤杂兵或支援 Boss
- `sfx/lightning-strike.ogg`：静电巢雷触发
- `sfx/player-defeat.ogg`：主角失败结算

## 占位文件建议

- 如果暂时没有正式素材，可以先复制一个长度较短的 `.ogg` 作为占位。
- 代码会在文件缺失时报错后自动跳过该条音效，但为了避免首轮运行出现资源错误，建议占位文件先补齐。
- 正式替换时只需要覆盖同名文件，不需要改动任何源码。

## 2026-04-17 SFX 替换记录

- 来源站点：Mixkit
- 许可页：[Mixkit License](https://mixkit.co/license/)
- 说明：本次替换用于项目内游戏音效，不单独再分发源文件。

- `sfx/ui-open.ogg`
  来源：`Opening software interface`
  下载页：`https://mixkit.co/free-sound-effects/download/2578/?context=item+grid`
- `sfx/boss-skill-charge.ogg`
  来源：`Monster calm growl`
  下载页：`https://mixkit.co/free-sound-effects/download/1956/?context=item+grid`
- `sfx/boss-skill-cast.ogg`
  来源：`Heavy electric shockwave impact`
  下载页：`https://mixkit.co/free-sound-effects/download/2599/?context=item+grid`
- `sfx/boss-summon.ogg`
  来源：`Giant monster roar`
  下载页：`https://mixkit.co/free-sound-effects/download/1972/?context=item+grid`
- `sfx/lightning-strike.ogg`
  来源：`Electricity lightning blast`
  下载页：`https://mixkit.co/free-sound-effects/download/2601/?context=item+grid`
- `sfx/player-defeat.ogg`
  来源：`Spooky game over`
  下载页：`https://mixkit.co/free-sound-effects/download/1948/?context=item+grid`
