import type { GameEvent, GameState } from "../game/types";

type BgmTrackId = "wave1" | "boss1" | "wave2" | "boss2" | "wave3" | "boss3";
type SfxTrackId = "playerShot" | "enemyDie" | "goldEggGain" | "playerHurt" | "xpGain" | "levelUp" | "buffReroll";

const BGM_TRACKS: Record<BgmTrackId, string> = {
  wave1: "/audio/bgm/wave-1.ogg",
  boss1: "/audio/bgm/boss-1.ogg",
  wave2: "/audio/bgm/wave-2.ogg",
  boss2: "/audio/bgm/boss-2.ogg",
  wave3: "/audio/bgm/wave-3.ogg",
  boss3: "/audio/bgm/boss-3.ogg",
};

const SFX_TRACKS: Record<SfxTrackId, string> = {
  playerShot: "/audio/sfx/player-shot.ogg",
  enemyDie: "/audio/sfx/enemy-die.ogg",
  goldEggGain: "/audio/sfx/gold-egg.ogg",
  playerHurt: "/audio/sfx/player-hurt.ogg",
  xpGain: "/audio/sfx/xp-gain.ogg",
  levelUp: "/audio/sfx/level-up.ogg",
  buffReroll: "/audio/sfx/buff-reroll.ogg",
};

const SFX_VOLUME: Record<SfxTrackId, number> = {
  playerShot: 0.26,
  enemyDie: 0.28,
  goldEggGain: 0.34,
  playerHurt: 0.3,
  xpGain: 0.18,
  levelUp: 0.32,
  buffReroll: 0.24,
};

const SFX_INTERVAL_MS: Record<SfxTrackId, number> = {
  playerShot: 90,
  enemyDie: 70,
  goldEggGain: 120,
  playerHurt: 120,
  xpGain: 50,
  levelUp: 300,
  buffReroll: 180,
};

export function getBgmTrackForState(state: GameState): BgmTrackId | null {
  if (state.runState === "won" || state.runState === "lost") {
    return null;
  }

  if (state.bossSpawned) {
    return `boss${Math.max(1, Math.min(3, state.bossWavesSpawned))}` as BgmTrackId;
  }

  const explorationWave = Math.max(1, Math.min(3, state.bossWavesDefeated + 1));
  return `wave${explorationWave}` as BgmTrackId;
}

export class GameAudioController {
  private bgm: HTMLAudioElement | null = null;
  private bgmTrack: BgmTrackId | null = null;
  private unavailableBgm = new Set<BgmTrackId>();
  private unavailableSfx = new Set<SfxTrackId>();
  private unlocked = false;
  private lastSfxAt: Partial<Record<SfxTrackId, number>> = {};

  unlock() {
    this.unlocked = true;

    if (this.bgm && this.bgm.paused) {
      void this.bgm.play().catch(() => undefined);
    }
  }

  syncBgm(trackId: BgmTrackId | null) {
    if (trackId && this.unavailableBgm.has(trackId)) {
      return;
    }

    if (trackId === this.bgmTrack) {
      if (this.unlocked && this.bgm?.paused) {
        void this.bgm.play().catch(() => undefined);
      }
      return;
    }

    if (this.bgm) {
      this.bgm.pause();
      this.bgm.currentTime = 0;
      this.bgm = null;
    }

    this.bgmTrack = trackId;

    if (!trackId) {
      return;
    }

    const audio = new Audio(BGM_TRACKS[trackId]);
    audio.loop = true;
    audio.volume = 0.34;
    audio.preload = "auto";
    audio.addEventListener("error", () => {
      this.unavailableBgm.add(trackId);

      if (this.bgm === audio) {
        this.bgm = null;
        this.bgmTrack = null;
      }
    });
    this.bgm = audio;

    if (this.unlocked) {
      void audio.play().catch(() => undefined);
    }
  }

  consumeEvents(events: GameEvent[]) {
    events.forEach((event) => {
      if (event.type === "playerShot") {
        this.playSfx("playerShot");
      } else if (event.type === "enemyDie") {
        this.playSfx("enemyDie");
      } else if (event.type === "goldEggGain") {
        this.playSfx("goldEggGain");
      } else if (event.type === "playerHurt") {
        this.playSfx("playerHurt");
      } else if (event.type === "xpGain") {
        this.playSfx("xpGain");
      } else if (event.type === "levelUp") {
        this.playSfx("levelUp");
      } else if (event.type === "buffReroll") {
        this.playSfx("buffReroll");
      }
    });
  }

  dispose() {
    if (!this.bgm) {
      return;
    }

    this.bgm.pause();
    this.bgm.currentTime = 0;
    this.bgm = null;
    this.bgmTrack = null;
  }

  private playSfx(trackId: SfxTrackId) {
    if (!this.unlocked || this.unavailableSfx.has(trackId)) {
      return;
    }

    const now = performance.now();
    const minInterval = SFX_INTERVAL_MS[trackId];

    if (this.lastSfxAt[trackId] && now - this.lastSfxAt[trackId]! < minInterval) {
      return;
    }

    this.lastSfxAt[trackId] = now;

    const audio = new Audio(SFX_TRACKS[trackId]);
    audio.volume = SFX_VOLUME[trackId];
    audio.preload = "auto";
    audio.addEventListener("error", () => {
      this.unavailableSfx.add(trackId);
    });
    void audio.play().catch(() => undefined);
  }
}
