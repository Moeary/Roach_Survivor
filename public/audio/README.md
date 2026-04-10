# Audio Assets

把音频文件放到这个目录下，游戏会按固定文件名自动读取。

## BGM

放到 `public/audio/bgm/`：

- `wave-1.ogg`
- `boss-1.ogg`
- `wave-2.ogg`
- `boss-2.ogg`
- `wave-3.ogg`
- `boss-3.ogg`

推荐对应关系：

- `wave-1.ogg`：第一波常规战斗
- `boss-1.ogg`：第一波 Boss 战
- `wave-2.ogg`：第二波常规战斗
- `boss-2.ogg`：第二波 Boss 战
- `wave-3.ogg`：第三波常规战斗
- `boss-3.ogg`：第三波 Boss 战

## SFX

放到 `public/audio/sfx/`：

- `player-shot.ogg`
- `enemy-die.ogg`
- `gold-egg.ogg`
- `player-hurt.ogg`
- `xp-gain.ogg`
- `level-up.ogg`
- `buff-reroll.ogg`

说明：

- `player-shot.ogg`：主武器和自动副炮发射时播放
- `enemy-die.ogg`：敌人死亡时播放
- `gold-egg.ogg`：拾取金色卵鞘时播放
- `player-hurt.ogg`：主角受伤时播放
- `xp-gain.ogg`：经验颗粒被吸收时播放
- `level-up.ogg`：进入升级选择时播放
- `buff-reroll.ogg`：点击刷新升级词条时播放

目前实现默认按 `.ogg` 读取。如果你想改成别的扩展名，调整 `src/audio/gameAudio.ts` 里的路径常量即可。
