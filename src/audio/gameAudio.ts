import type { GameEvent, GameState } from "../game/types";

export type BgmTrackId = "menu" | "victory" | "wave1" | "boss1" | "wave2" | "boss2" | "wave3" | "boss3";
export type AudioCueId =
  | "playerShot"
  | "enemyDie"
  | "goldEggGain"
  | "playerHurt"
  | "xpGain"
  | "levelUp"
  | "buffReroll"
  | "metaUpgrade"
  | "metaReset"
  | "difficultySelect"
  | "startGame"
  | "cheat"
  | "uiOpen";

const BGM_TRACKS: Record<BgmTrackId, string[]> = {
  menu: ["/audio/bgm/menu.ogg"],
  victory: ["/audio/bgm/victory.ogg", "/audio/bgm/menu.ogg"],
  wave1: ["/audio/bgm/wave-1.ogg"],
  boss1: ["/audio/bgm/boss-1.ogg", "/audio/bgm/wave-1.ogg"],
  wave2: ["/audio/bgm/wave-2.ogg"],
  boss2: ["/audio/bgm/boss-2.ogg", "/audio/bgm/wave-2.ogg"],
  wave3: ["/audio/bgm/wave-3.ogg"],
  boss3: ["/audio/bgm/boss-3.ogg", "/audio/bgm/wave-3.ogg"],
};

const SFX_TRACKS: Record<AudioCueId, string> = {
  playerShot: "/audio/sfx/player-shot.ogg",
  enemyDie: "/audio/sfx/enemy-die.ogg",
  goldEggGain: "/audio/sfx/gold-egg.ogg",
  playerHurt: "/audio/sfx/player-hurt.ogg",
  xpGain: "/audio/sfx/xp-gain.ogg",
  levelUp: "/audio/sfx/level-up.ogg",
  buffReroll: "/audio/sfx/buff-reroll.ogg",
  metaUpgrade: "/audio/sfx/meta-upgrade.ogg",
  metaReset: "/audio/sfx/meta-reset.ogg",
  difficultySelect: "/audio/sfx/difficulty-select.ogg",
  startGame: "/audio/sfx/start-game.ogg",
  cheat: "/audio/sfx/cheat.ogg",
  uiOpen: "/audio/sfx/ui-open.ogg",
};

const SFX_VOLUME: Record<AudioCueId, number> = {
  playerShot: 0.26,
  enemyDie: 0.28,
  goldEggGain: 0.34,
  playerHurt: 0.3,
  xpGain: 0.18,
  levelUp: 0.32,
  buffReroll: 0.24,
  metaUpgrade: 0.26,
  metaReset: 0.28,
  difficultySelect: 0.22,
  startGame: 0.28,
  cheat: 0.3,
  uiOpen: 0.2,
};

const SFX_INTERVAL_MS: Record<AudioCueId, number> = {
  playerShot: 90,
  enemyDie: 70,
  goldEggGain: 120,
  playerHurt: 120,
  xpGain: 50,
  levelUp: 300,
  buffReroll: 180,
  metaUpgrade: 120,
  metaReset: 200,
  difficultySelect: 100,
  startGame: 180,
  cheat: 120,
  uiOpen: 100,
};

const AUDIO_TEMPLATE_CACHE = new Map<string, HTMLAudioElement>();
let audioWarmupScheduled = false;

function getAudioTemplate(path: string): HTMLAudioElement {
  let audio = AUDIO_TEMPLATE_CACHE.get(path);

  if (!audio) {
    audio = new Audio(path);
    audio.preload = "auto";
    AUDIO_TEMPLATE_CACHE.set(path, audio);
  }

  return audio;
}

function createPlayableAudio(path: string): HTMLAudioElement {
  const template = getAudioTemplate(path);
  const clone = template.cloneNode(true) as HTMLAudioElement;
  clone.src = path;
  clone.preload = "auto";
  return clone;
}

function scheduleAudioWarmup(): void {
  if (audioWarmupScheduled || typeof window === "undefined") {
    return;
  }

  audioWarmupScheduled = true;
  const queue = Array.from(
    new Set([
      ...Object.values(BGM_TRACKS).flat(),
      ...Object.values(SFX_TRACKS),
    ]),
  );

  const warmup = (deadline?: IdleDeadline) => {
    let processed = 0;

    while (queue.length && processed < 2 && (!deadline || deadline.timeRemaining() > 6)) {
      const path = queue.shift()!;
      const template = getAudioTemplate(path);
      template.load();
      processed += 1;
    }

    if (!queue.length) {
      return;
    }

    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(warmup);
      return;
    }

    globalThis.setTimeout(() => warmup(), 80);
  };

  if ("requestIdleCallback" in window) {
    window.requestIdleCallback(warmup);
    return;
  }

  globalThis.setTimeout(() => warmup(), 80);
}

export function getBgmTrackForState(state: GameState): BgmTrackId | null {
  if (state.runState === "won") {
    return "victory";
  }

  if (state.runState === "lost") {
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
  private bgmSourcePath: string | null = null;
  private unavailableBgm = new Set<string>();
  private unavailableSfx = new Set<AudioCueId>();
  private unlocked = false;
  private lastSfxAt: Partial<Record<AudioCueId, number>> = {};

  constructor() {
    scheduleAudioWarmup();
  }

  unlock() {
    this.unlocked = true;

    if (this.bgm && this.bgm.paused) {
      void this.bgm.play().catch(() => undefined);
    }
  }

  syncBgm(trackId: BgmTrackId | null) {
    const nextSource = this.resolveBgmSource(trackId);

    if (trackId === this.bgmTrack && nextSource === this.bgmSourcePath) {
      if (this.unlocked && this.bgm?.paused) {
        void this.bgm.play().catch(() => undefined);
      }
      return;
    }

    if (!nextSource) {
      if (this.bgm) {
        this.bgm.pause();
        this.bgm.currentTime = 0;
      }

      this.bgm = null;
      this.bgmTrack = trackId;
      this.bgmSourcePath = null;
      return;
    }

    if (nextSource === this.bgmSourcePath) {
      this.bgmTrack = trackId;

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
    this.bgmSourcePath = nextSource;
    const requestedTrack = trackId;
    const audio = createPlayableAudio(nextSource);
    audio.loop = true;
    audio.volume = 0.34;
    audio.addEventListener("error", () => {
      this.unavailableBgm.add(nextSource);

      if (this.bgm === audio) {
        this.bgm = null;
        this.bgmSourcePath = null;

        if (requestedTrack) {
          this.syncBgm(requestedTrack);
        }
      }
    });
    this.bgm = audio;

    if (this.unlocked) {
      void audio.play().catch(() => undefined);
    }
  }

  private resolveBgmSource(trackId: BgmTrackId | null): string | null {
    if (!trackId) {
      return null;
    }

    const candidates = BGM_TRACKS[trackId];
    return candidates.find((candidate) => !this.unavailableBgm.has(candidate)) ?? null;
  }

  consumeEvents(events: GameEvent[]) {
    events.forEach((event) => {
      if (event.type === "playerShot") {
        this.playCue("playerShot");
      } else if (event.type === "enemyDie") {
        this.playCue("enemyDie");
      } else if (event.type === "goldEggGain") {
        this.playCue("goldEggGain");
      } else if (event.type === "playerHurt") {
        this.playCue("playerHurt");
      } else if (event.type === "xpGain") {
        this.playCue("xpGain");
      } else if (event.type === "levelUp") {
        this.playCue("levelUp");
      } else if (event.type === "buffReroll") {
        this.playCue("buffReroll");
      }
    });
  }

  playCue(cueId: AudioCueId) {
    this.playSfx(cueId);
  }

  dispose() {
    if (!this.bgm) {
      return;
    }

    this.bgm.pause();
    this.bgm.currentTime = 0;
    this.bgm = null;
    this.bgmTrack = null;
    this.bgmSourcePath = null;
  }

  private playSfx(trackId: AudioCueId) {
    if (!this.unlocked || this.unavailableSfx.has(trackId)) {
      return;
    }

    const now = performance.now();
    const minInterval = SFX_INTERVAL_MS[trackId];

    if (this.lastSfxAt[trackId] && now - this.lastSfxAt[trackId]! < minInterval) {
      return;
    }

    this.lastSfxAt[trackId] = now;

    const audio = createPlayableAudio(SFX_TRACKS[trackId]);
    audio.volume = SFX_VOLUME[trackId];
    audio.addEventListener("error", () => {
      this.unavailableSfx.add(trackId);
    });
    void audio.play().catch(() => undefined);
  }
}
