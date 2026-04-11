# Audio Assets

把音频文件放到这个目录下，游戏会按固定文件名自动读取。

## BGM

放到 `public/audio/bgm/`：

- `menu.ogg`
- `victory.ogg`
- `wave-1.ogg`
- `boss-1.ogg`
- `wave-2.ogg`
- `boss-2.ogg`
- `wave-3.ogg`
- `boss-3.ogg`

推荐对应关系：

- `menu.ogg`：主页面循环 BGM
- `victory.ogg`：胜利结算 BGM
- `wave-1.ogg`：第一波常规战斗
- `boss-1.ogg`：第一波 Boss 战
- `wave-2.ogg`：第二波常规战斗
- `boss-2.ogg`：第二波 Boss 战
- `wave-3.ogg`：第三波常规战斗
- `boss-3.ogg`：第三波 Boss 战

如果暂时没有单独的 Boss 曲目，`boss-1.ogg / boss-2.ogg / boss-3.ogg` 可以先不放。
当前音频控制器会自动回退到对应的 `wave-1.ogg / wave-2.ogg / wave-3.ogg`，并且不会因为轨道名切换而把同一个文件重复重启。

## SFX

放到 `public/audio/sfx/`：

- `player-shot.ogg`
- `enemy-die.ogg`
- `gold-egg.ogg`
- `player-hurt.ogg`
- `xp-gain.ogg`
- `level-up.ogg`
- `buff-reroll.ogg`
- `meta-upgrade.ogg`
- `meta-reset.ogg`
- `difficulty-select.ogg`
- `start-game.ogg`
- `cheat.ogg`
- `ui-open.ogg`

说明：

- `player-shot.ogg`：主武器和自动副炮发射时播放
- `enemy-die.ogg`：敌人死亡时播放
- `gold-egg.ogg`：拾取金色卵鞘时播放
- `player-hurt.ogg`：主角受伤时播放
- `xp-gain.ogg`：经验颗粒被吸收时播放
- `level-up.ogg`：进入升级选择时播放
- `buff-reroll.ogg`：点击刷新升级词条时播放
- `meta-upgrade.ogg`：局外升级成功时播放
- `meta-reset.ogg`：局外重置加点时播放
- `difficulty-select.ogg`：切换难度时播放
- `start-game.ogg`：点击开始游戏时播放
- `cheat.ogg`：点击作弊按钮时播放
- `ui-open.ogg`：打开教程、日志、Buff 面板、局外成长面板时播放

当前仓库里这批 `public/audio/sfx/*.ogg` 只是占位音效，后续你可以直接用同名文件覆盖，不需要修改代码。

目前实现默认按 `.ogg` 读取。如果你想改成别的扩展名，调整 `src/audio/gameAudio.ts` 里的路径常量即可。
