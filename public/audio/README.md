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
- `sfx/enemy-die.ogg`：普通敌人死亡的兼容回退文件
- `sfx/enemy-die-hit.ogg`：普通敌人被子弹 / 近战 / 直接命中击杀
- `sfx/enemy-die-explode.ogg`：普通敌人被爆炸击杀
- `sfx/enemy-die-shock.ogg`：普通敌人被雷击 / 电击击杀
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
- `sfx/boss-spawn.ogg`：Boss 登场
- `sfx/boss-die.ogg`：Boss 死亡
- `sfx/boss-skill-charge.ogg`：Boss 技能前摇 / 蓄力
- `sfx/boss-skill-cast.ogg`：Boss 技能正式释放
- `sfx/boss-summon.ogg`：Boss 召唤杂兵或支援 Boss
- `sfx/lightning-strike.ogg`：静电巢雷触发
- `sfx/player-defeat.ogg`：主角失败结算

## 变体命名规则

- 运行时支持同一类音效的多候选文件：`name_1.ogg`、`name_2.ogg`、`name_3.ogg`、`name_4.ogg`
- 如果这些候选文件存在，游戏会在可用文件里随机播放，并尽量避免同一音效连续两次完全相同
- 如果候选文件不存在，或你试听后只想保留一个版本，直接保留 / 覆盖对应的基础文件 `name.ogg` 即可
- 推荐工作流：
  先试听 `*_1` 到 `*_4`
  然后把最满意的那个改成基础名 `name.ogg`
  最后删掉其他候选；代码会自动回退到基础文件
- 当前已经接入随机候选的类别包括：
  `player-shot`
  `enemy-die-hit`、`enemy-die-explode`、`enemy-die-shock`
  `player-hurt`、`player-defeat`
  `xp-gain`、`gold-egg`、`level-up`
  `buff-reroll`
  `meta-upgrade`、`meta-reset`
  `difficulty-select`、`start-game`、`cheat`、`ui-open`
  `boss-spawn`、`boss-die`、`boss-skill-charge`、`boss-skill-cast`、`boss-summon`
  `lightning-strike`

## 占位文件建议

- 如果暂时没有正式素材，可以先复制一个长度较短的 `.ogg` 作为占位。
- 代码会在文件缺失时报错后自动跳过该条音效，但为了避免首轮运行出现资源错误，建议占位文件先补齐。
- 正式替换时只需要覆盖同名文件，不需要改动任何源码。

## 2026-04-17 SFX 替换记录

- 来源站点：Mixkit
- 许可页：[Mixkit License](https://mixkit.co/license/)
- 说明：本次已经把项目里当前接线的主要 SFX 全部补成候选池，具体下载 ID 与转换流程记录在 `scripts/import-mixkit-sfx.ps1`
- 已导入为多候选的类别：
  `player-shot`
  `player-hurt`
  `player-defeat`
  `enemy-die-hit`
  `enemy-die-explode`
  `enemy-die-shock`
  `xp-gain`
  `gold-egg`
  `level-up`
  `buff-reroll`
  `meta-upgrade`
  `meta-reset`
  `difficulty-select`
  `start-game`
  `cheat`
  `ui-open`
  `boss-spawn`
  `boss-die`
  `boss-skill-charge`
  `boss-skill-cast`
  `boss-summon`
  `lightning-strike`
- 说明补充：
  `lightning-strike_3.ogg` 与 `lightning-strike_4.ogg` 在转码时做了倍速处理，让雷击更短、更利落
  每个类别的 `_1` 文件额外复制成了基础名 `name.ogg`，方便在删掉其余候选后继续正常播放
