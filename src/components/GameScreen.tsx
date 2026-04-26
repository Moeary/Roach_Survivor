import { useEffect, useRef, useState } from "react";
import {
  chooseRelic,
  chooseUpgrade,
  createGameState,
  createInputState,
  drainGameEvents,
  formatTime,
  getBoss,
  getCamera,
  refreshUpgradeChoices,
  resetInputState,
  togglePause,
  updateGame,
} from "../game/core";
import type { PointerEvent as ReactPointerEvent } from "react";
import { RELIC_DEFS } from "../game/relics";
import { getBossWaveTime } from "../game/stages";
import { buildAchievementRunResult, type AchievementRunResult } from "../game/achievements";
import { GameAudioController, getBgmTrackForState, type AudioSettings } from "../audio/gameAudio";
import { summarizeUpgrades } from "../game/upgrades";
import type { EnemyEntity, GameState, InputState, RunSetup } from "../game/types";
import { RelicIcon, UpgradeIcon } from "./GameIcon";
import EnemySprite from "./sprites/enemies/EnemySprite";
import PlayerSprite from "./sprites/player/PlayerSprite";
import EffectSprite from "./sprites/world/EffectSprite";
import MapBackdrop from "./sprites/world/MapBackdrop";
import ObstacleSprite from "./sprites/world/ObstacleSprite";
import OrbitalSprite from "./sprites/world/OrbitalSprite";
import PickupSprite from "./sprites/world/PickupSprite";
import ProjectileSprite from "./sprites/world/ProjectileSprite";
import WorldDefs from "./sprites/world/WorldDefs";

interface GameScreenProps {
  audioSettings: AudioSettings;
  onAwardGoldenEggs: (amount: number) => void;
  onCompleteRun: (result: AchievementRunResult) => void;
  onReturnToMenu: () => void;
  setup: RunSetup;
}

function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value));
}

function toFixed(value: number): number {
  return Number(value.toFixed(1));
}

function isVisible(x: number, y: number, radius: number, state: GameState, margin = 220): boolean {
  const camera = getCamera(state);
  const left = camera.x - state.viewport.width / 2 - margin;
  const right = camera.x + state.viewport.width / 2 + margin;
  const top = camera.y - state.viewport.height / 2 - margin;
  const bottom = camera.y + state.viewport.height / 2 + margin;
  return x + radius >= left && x - radius <= right && y + radius >= top && y - radius <= bottom;
}

function AimReticle({ state, input }: { state: GameState; input: InputState }) {
  if (!input.aimActive) {
    return null;
  }

  const targetX = state.player.x + (input.pointerScreenX - state.viewport.width / 2);
  const targetY = state.player.y + (input.pointerScreenY - state.viewport.height / 2);

  return (
    <g>
      <path d={`M ${toFixed(state.player.x)} ${toFixed(state.player.y)} L ${toFixed(targetX)} ${toFixed(targetY)}`} stroke="rgba(225, 255, 169, 0.16)" strokeWidth="2" strokeDasharray="8 10" />
      <g transform={`translate(${toFixed(targetX)} ${toFixed(targetY)})`}>
        <circle r="16" fill="rgba(215, 240, 109, 0.08)" />
        <circle r="12" fill="none" stroke="rgba(240, 250, 215, 0.72)" strokeWidth="2" />
        <path d="M -18 0 H -6 M 6 0 H 18 M 0 -18 V -6 M 0 6 V 18" stroke="#f6fbdf" strokeWidth="2" strokeLinecap="round" />
      </g>
    </g>
  );
}

function BossTelegraphs({ enemies, state }: { enemies: EnemyEntity[]; state: GameState }) {
  return (
    <g>
      {enemies.map((enemy) => {
        if (enemy.type !== "boss") {
          return null;
        }

        if (enemy.bossAction === "teleport-windup" && enemy.bossTargetX !== undefined && enemy.bossTargetY !== undefined) {
          const pulse = 1 + Math.sin(enemy.pulse * 2) * 0.08;
          const radius = (state.player.radius + 18) * pulse;

          return (
            <g key={`${enemy.id}-teleport-warning`} transform={`translate(${toFixed(enemy.bossTargetX)} ${toFixed(enemy.bossTargetY)})`}>
              <circle r={toFixed(radius + 18)} fill="rgba(255, 108, 132, 0.1)" />
              <circle r={toFixed(radius)} fill="none" stroke="rgba(255, 164, 182, 0.84)" strokeWidth="4" strokeDasharray="10 10" />
              <circle r={toFixed(Math.max(10, radius * 0.34))} fill="rgba(255, 209, 219, 0.16)" />
            </g>
          );
        }

        if (enemy.bossAction === "dash-windup" && enemy.bossTargetX !== undefined && enemy.bossTargetY !== undefined) {
          const preview = getBossDashTelegraph(enemy, state);
          const angle = (Math.atan2(preview.deltaY, preview.deltaX) * 180) / Math.PI;
          const width = enemy.radius + state.player.radius * 0.66;

          return (
            <g key={`${enemy.id}-dash-warning`} transform={`translate(${toFixed(enemy.x)} ${toFixed(enemy.y)}) rotate(${toFixed(angle)})`}>
              <path d={`M 0 0 L ${toFixed(preview.length)} 0`} stroke="rgba(255, 122, 68, 0.14)" strokeWidth={toFixed(width * 1.8)} strokeLinecap="round" />
              <path d={`M 0 0 L ${toFixed(preview.length)} 0`} stroke="rgba(255, 181, 126, 0.92)" strokeWidth="6" strokeDasharray="18 12" strokeLinecap="round" />
              <circle cx={toFixed(preview.length)} cy="0" r="18" fill="rgba(255, 178, 112, 0.12)" />
            </g>
          );
        }

        return null;
      })}
    </g>
  );
}

function getBossDashTelegraph(enemy: EnemyEntity, state: GameState): { deltaX: number; deltaY: number; length: number } {
  const targetX = enemy.bossTargetX ?? state.player.x;
  const targetY = enemy.bossTargetY ?? state.player.y;
  const deltaX = targetX - enemy.x;
  const deltaY = targetY - enemy.y;
  const targetDistance = Math.hypot(deltaX, deltaY) || 1;
  const overrunDistance = state.player.radius + enemy.radius * 1.35 + state.player.stats.moveSpeed * 0.9;
  const length = Math.max(640, Math.min(1320, targetDistance + overrunDistance));

  return {
    deltaX,
    deltaY,
    length,
  };
}

function BossOffscreenIndicator({ boss, camera, state }: { boss: EnemyEntity | null; camera: ReturnType<typeof getCamera>; state: GameState }) {
  if (!boss) {
    return null;
  }

  const width = state.viewport.width;
  const height = state.viewport.height;
  const screenX = boss.x - camera.x + width / 2;
  const screenY = boss.y - camera.y + height / 2;
  const edgePadding = 52;
  const isInView = screenX >= boss.radius && screenX <= width - boss.radius && screenY >= boss.radius && screenY <= height - boss.radius;

  if (isInView) {
    return null;
  }

  const centerX = width / 2;
  const centerY = height / 2;
  const deltaX = screenX - centerX;
  const deltaY = screenY - centerY;
  const ratioX = deltaX === 0 ? Number.POSITIVE_INFINITY : (width / 2 - edgePadding) / Math.abs(deltaX);
  const ratioY = deltaY === 0 ? Number.POSITIVE_INFINITY : (height / 2 - edgePadding) / Math.abs(deltaY);
  const ratio = Math.min(ratioX, ratioY);
  const indicatorX = clamp(centerX + deltaX * ratio, edgePadding, width - edgePadding);
  const indicatorY = clamp(centerY + deltaY * ratio, edgePadding, height - edgePadding);
  const angle = (Math.atan2(deltaY, deltaX) * 180) / Math.PI;

  return (
    <g transform={`translate(${toFixed(indicatorX)} ${toFixed(indicatorY)})`}>
      <circle r="34" fill="rgba(15, 18, 14, 0.78)" stroke="rgba(255, 184, 92, 0.7)" strokeWidth="2.5" />
      <g transform={`rotate(${toFixed(angle)})`}>
        <path d="M 25 0 L -10 -18 L -4 0 L -10 18 Z" fill="#ffcb6d" stroke="#2a160f" strokeWidth="2.2" strokeLinejoin="round" />
      </g>
      <text x="0" y="49" fill="#ffdb8e" fontSize="15" fontWeight="800" textAnchor="middle" letterSpacing="2">
        BOSS
      </text>
    </g>
  );
}

const MOVEMENT_KEY_CODES = ["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"];
const HEART_COUNT = 10;
const SKILL_HOTBAR_SLOTS = 8;
const RELIC_HOTBAR_SLOTS = 5;
const MOBILE_CONTROLS_MEDIA_QUERY = "(pointer: coarse), (max-width: 720px)";
const MOBILE_MOVEMENT_DEADZONE = 34;

function HealthHeart({ fill, index }: { fill: number; index: number }) {
  const clipId = `heart-fill-${index}`;
  const width = clamp(fill, 0, 1) * 64;

  return (
    <svg className="heart-icon" viewBox="0 0 64 64" aria-hidden="true">
      <defs>
        <clipPath id={clipId}>
          <rect x="0" y="0" width={toFixed(width)} height="64" />
        </clipPath>
      </defs>
      <path
        className="heart-icon-empty"
        d="M32 53 C17 42 10 34 10 23 C10 15 16 10 23 10 C27 10 30 12 32 16 C34 12 37 10 41 10 C48 10 54 15 54 23 C54 34 47 42 32 53 Z"
      />
      <path
        className="heart-icon-fill"
        clipPath={`url(#${clipId})`}
        d="M32 53 C17 42 10 34 10 23 C10 15 16 10 23 10 C27 10 30 12 32 16 C34 12 37 10 41 10 C48 10 54 15 54 23 C54 34 47 42 32 53 Z"
      />
      <path
        className="heart-icon-stroke"
        d="M32 53 C17 42 10 34 10 23 C10 15 16 10 23 10 C27 10 30 12 32 16 C34 12 37 10 41 10 C48 10 54 15 54 23 C54 34 47 42 32 53 Z"
      />
    </svg>
  );
}

function HealthHearts({ current, max }: { current: number; max: number }) {
  return (
    <div className="heart-row" aria-label={`生命值 ${Math.ceil(current)} / ${max}`}>
      {Array.from({ length: HEART_COUNT }, (_, index) => {
        const heartValue = (current / Math.max(1, max)) * HEART_COUNT - index;
        return <HealthHeart key={index} fill={heartValue} index={index} />;
      })}
    </div>
  );
}

export default function GameScreen({ audioSettings, onAwardGoldenEggs, onCompleteRun, onReturnToMenu, setup }: GameScreenProps) {
  const stateRef = useRef<GameState>(createGameState(setup));
  const inputRef = useRef<InputState>(createInputState());
  const frameRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number>(performance.now());
  const completionReportedRef = useRef(false);
  const svgRef = useRef<SVGSVGElement | null>(null);
  const awardGoldenEggsRef = useRef(onAwardGoldenEggs);
  const completeRunRef = useRef(onCompleteRun);
  const audioRef = useRef<GameAudioController | null>(null);
  const isMobileControlsRef = useRef(false);
  const mobilePointerIdRef = useRef<number | null>(null);
  const mobileNoticePausedRunRef = useRef(false);
  const mobileNoticeSeenRef = useRef(false);
  const [isMobileControls, setIsMobileControls] = useState(false);
  const [mobileNoticeOpen, setMobileNoticeOpen] = useState(false);
  const [, forceRender] = useState(0);

  if (!audioRef.current) {
    audioRef.current = new GameAudioController(audioSettings);
  }

  function refresh() {
    forceRender((value) => value + 1);
  }

  function restartRun() {
    stateRef.current = createGameState(setup);
    resetInputState(inputRef.current);
    if (isMobileControlsRef.current) {
      inputRef.current.autoAim = true;
    }
    completionReportedRef.current = false;
    lastFrameRef.current = performance.now();
    refresh();
  }

  function chooseUpgradeByIndex(index: number) {
    const choice = stateRef.current.upgradeChoices[index];

    if (!choice) {
      return false;
    }

    const didChoose = chooseUpgrade(stateRef.current, choice.id);

    if (didChoose) {
      refresh();
    }

    return didChoose;
  }

  function chooseRelicByIndex(index: number) {
    const choice = stateRef.current.relicChoices[index];

    if (!choice) {
      return false;
    }

    const didChoose = chooseRelic(stateRef.current, choice.id);

    if (didChoose) {
      refresh();
    }

    return didChoose;
  }

  function rerollChoices() {
    const didRefresh = refreshUpgradeChoices(stateRef.current);

    if (didRefresh) {
      refresh();
    }

    return didRefresh;
  }

  function fastForwardToNextBossPrep() {
    const state = stateRef.current;

    if (state.runState !== "running" || state.bossSpawned || state.bossWavesSpawned >= state.difficulty.bossWaves) {
      return false;
    }

    const nextBossTime = getBossWaveTime(state.bossWavesSpawned + 1);
    const targetTime = Math.max(0, nextBossTime - 5);

    if (state.timer >= targetTime) {
      return false;
    }

    audioRef.current?.unlock();
    audioRef.current?.playCue("cheat");
    state.sessionStats.usedCheat = true;
    state.timer = targetTime;
    refresh();
    return true;
  }

  function updatePointerPosition(clientX: number, clientY: number) {
    const svg = svgRef.current;

    if (!svg) {
      return;
    }

    const bounds = svg.getBoundingClientRect();
    const x = ((clientX - bounds.left) / bounds.width) * 1280;
    const y = ((clientY - bounds.top) / bounds.height) * 720;

    inputRef.current.pointerScreenX = clamp(x, 0, 1280);
    inputRef.current.pointerScreenY = clamp(y, 0, 720);
    inputRef.current.aimActive = true;
  }

  function setMobileMovementFromPointer(clientX: number, clientY: number): boolean {
    const svg = svgRef.current;

    if (!svg) {
      return false;
    }

    const bounds = svg.getBoundingClientRect();
    const x = ((clientX - bounds.left) / bounds.width) * 1280;
    const y = ((clientY - bounds.top) / bounds.height) * 720;
    const deltaX = x - 640;
    const deltaY = y - 360;
    const isMoving = Math.hypot(deltaX, deltaY) > MOBILE_MOVEMENT_DEADZONE;

    inputRef.current.left = isMoving && deltaX < -MOBILE_MOVEMENT_DEADZONE;
    inputRef.current.right = isMoving && deltaX > MOBILE_MOVEMENT_DEADZONE;
    inputRef.current.up = isMoving && deltaY < -MOBILE_MOVEMENT_DEADZONE;
    inputRef.current.down = isMoving && deltaY > MOBILE_MOVEMENT_DEADZONE;

    if (isMoving && stateRef.current.runState === "running") {
      stateRef.current.sessionStats.usedMovementKeys = true;
    }

    return isMoving;
  }

  function clearMobileMovement() {
    inputRef.current.up = false;
    inputRef.current.down = false;
    inputRef.current.left = false;
    inputRef.current.right = false;
    inputRef.current.aimActive = false;
    mobilePointerIdRef.current = null;
    refresh();
  }

  function handleMobilePointerDown(event: ReactPointerEvent<SVGSVGElement>) {
    if (!isMobileControlsRef.current || event.pointerType === "mouse") {
      return;
    }

    event.preventDefault();
    audioRef.current?.unlock();
    inputRef.current.autoAim = true;
    mobilePointerIdRef.current = event.pointerId;
    event.currentTarget.setPointerCapture(event.pointerId);
    updatePointerPosition(event.clientX, event.clientY);
    setMobileMovementFromPointer(event.clientX, event.clientY);
    refresh();
  }

  function handleMobilePointerMove(event: ReactPointerEvent<SVGSVGElement>) {
    if (!isMobileControlsRef.current || event.pointerId !== mobilePointerIdRef.current) {
      return;
    }

    event.preventDefault();
    updatePointerPosition(event.clientX, event.clientY);
    setMobileMovementFromPointer(event.clientX, event.clientY);
    refresh();
  }

  function handleMobilePointerEnd(event: ReactPointerEvent<SVGSVGElement>) {
    if (!isMobileControlsRef.current || event.pointerId !== mobilePointerIdRef.current) {
      return;
    }

    event.preventDefault();
    event.currentTarget.releasePointerCapture(event.pointerId);
    clearMobileMovement();
  }

  function dismissMobileNotice() {
    setMobileNoticeOpen(false);

    if (mobileNoticePausedRunRef.current && stateRef.current.runState === "paused") {
      stateRef.current.runState = "running";
      mobileNoticePausedRunRef.current = false;
      lastFrameRef.current = performance.now();
      refresh();
    }
  }

  useEffect(() => {
    awardGoldenEggsRef.current = onAwardGoldenEggs;
  }, [onAwardGoldenEggs]);

  useEffect(() => {
    completeRunRef.current = onCompleteRun;
  }, [onCompleteRun]);

  useEffect(() => {
    audioRef.current?.setSettings(audioSettings);
  }, [audioSettings]);

  useEffect(() => {
    const mediaQuery = window.matchMedia(MOBILE_CONTROLS_MEDIA_QUERY);

    function applyMobileControlsPreference() {
      const enabled = mediaQuery.matches;
      isMobileControlsRef.current = enabled;
      setIsMobileControls(enabled);

      if (!enabled) {
        return;
      }

      inputRef.current.autoAim = true;

      if (!mobileNoticeSeenRef.current) {
        mobileNoticeSeenRef.current = true;
        setMobileNoticeOpen(true);

        if (stateRef.current.runState === "running") {
          stateRef.current.runState = "paused";
          mobileNoticePausedRunRef.current = true;
        }

        refresh();
      }
    }

    applyMobileControlsPreference();
    mediaQuery.addEventListener("change", applyMobileControlsPreference);

    return () => {
      mediaQuery.removeEventListener("change", applyMobileControlsPreference);
    };
  }, []);

  useEffect(() => {
    function setDirection(code: string, pressed: boolean) {
      if (code === "KeyW" || code === "ArrowUp") {
        inputRef.current.up = pressed;
      } else if (code === "KeyS" || code === "ArrowDown") {
        inputRef.current.down = pressed;
      } else if (code === "KeyA" || code === "ArrowLeft") {
        inputRef.current.left = pressed;
      } else if (code === "KeyD" || code === "ArrowRight") {
        inputRef.current.right = pressed;
      }
    }

    function handleKeyDown(event: KeyboardEvent) {
      const state = stateRef.current;
      const code = event.code;
      audioRef.current?.unlock();

      if (MOVEMENT_KEY_CODES.includes(code)) {
        event.preventDefault();

        if (!event.repeat && state.runState === "running") {
          state.sessionStats.usedMovementKeys = true;
        }
      }

      if (code === "Escape" && inputRef.current.aimActive) {
        event.preventDefault();
        inputRef.current.aimActive = false;
        refresh();
        return;
      }

      if (code === "KeyF" && !event.repeat) {
        event.preventDefault();
        inputRef.current.autoAim = !inputRef.current.autoAim;
        refresh();
        return;
      }

      if (code === "KeyP" && !event.repeat) {
        event.preventDefault();
        if (togglePause(state)) {
          refresh();
        }
        return;
      }

      if (state.runState === "relicChoice" && !event.repeat) {
        if (code === "Digit1") { event.preventDefault(); chooseRelicByIndex(0); return; }
        if (code === "Digit2") { event.preventDefault(); chooseRelicByIndex(1); return; }
        if (code === "Digit3") { event.preventDefault(); chooseRelicByIndex(2); return; }
      }

      if (state.runState === "levelup" && !event.repeat) {
        if (code === "KeyR") {
          event.preventDefault();
          rerollChoices();
          return;
        }

        if (code === "Digit1") {
          event.preventDefault();
          chooseUpgradeByIndex(0);
          return;
        }

        if (code === "Digit2") {
          event.preventDefault();
          chooseUpgradeByIndex(1);
          return;
        }

        if (code === "Digit3") {
          event.preventDefault();
          chooseUpgradeByIndex(2);
          return;
        }
      }

      if ((state.runState === "won" || state.runState === "lost") && !event.repeat && code === "Enter") {
        event.preventDefault();
        restartRun();
        return;
      }

      setDirection(code, true);
    }

    function handleKeyUp(event: KeyboardEvent) {
      setDirection(event.code, false);
    }

    function handleBlur() {
      resetInputState(inputRef.current);
    }

    function handleContextMenu(event: MouseEvent) {
      event.preventDefault();
    }

    function frame(now: number) {
      const deltaSeconds = (now - lastFrameRef.current) / 1000;
      lastFrameRef.current = now;
      updateGame(stateRef.current, inputRef.current, deltaSeconds);
      audioRef.current?.syncBgm(getBgmTrackForState(stateRef.current));

      const events = drainGameEvents(stateRef.current);
      audioRef.current?.consumeEvents(events);
      events.forEach((event) => {
        if (event.type === "goldEggGain" && event.amount) {
          awardGoldenEggsRef.current(event.amount);
        }
      });

      if (!completionReportedRef.current && (stateRef.current.runState === "won" || stateRef.current.runState === "lost")) {
        completionReportedRef.current = true;
        completeRunRef.current(buildAchievementRunResult(stateRef.current, setup));
      }

      refresh();
      frameRef.current = window.requestAnimationFrame(frame);
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("contextmenu", handleContextMenu);
    frameRef.current = window.requestAnimationFrame(frame);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("contextmenu", handleContextMenu);

      if (frameRef.current !== null) {
        window.cancelAnimationFrame(frameRef.current);
      }

      audioRef.current?.dispose();
    };
  }, []);

  const state = stateRef.current;
  const input = inputRef.current;
  const camera = getCamera(state);
  const translateX = state.viewport.width / 2 - camera.x;
  const translateY = state.viewport.height / 2 - camera.y;
  const boss = getBoss(state);
  const summary = summarizeUpgrades(state);
  const xpRatio = clamp(state.xp / state.xpToNext, 0, 1);
  const xpRemaining = Math.max(0, state.xpToNext - state.xp);
  const nextBossTime = getBossWaveTime(state.bossWavesSpawned + 1);
  const fastForwardTarget = Math.max(0, nextBossTime - 5);
  const canFastForward = state.runState === "running" && !state.bossSpawned && state.bossWavesSpawned < state.difficulty.bossWaves && state.timer < fastForwardTarget;
  const targetText = `存活 ${formatTime(state.runDuration)} 并击败 ${state.difficulty.bossWaves} 波 Boss`;
  const bossTitle = boss ? `${boss.name} 第 ${boss.bossWave ?? state.bossWavesSpawned} 波` : "";
  const relicInventory = state.relics
    .map((relicId) => RELIC_DEFS.find((relic) => relic.id === relicId))
    .filter((relic): relic is (typeof RELIC_DEFS)[number] => Boolean(relic));
  const skillPlaceholderCount = Math.max(0, SKILL_HOTBAR_SLOTS - summary.length);
  const relicPlaceholderCount = Math.max(0, RELIC_HOTBAR_SLOTS - relicInventory.length);
  const visibleDecorations = state.decorations.filter((decoration) => isVisible(decoration.x, decoration.y, 88, state, 340));
  const visibleObstacles = state.obstacles.filter((obstacle) => isVisible(obstacle.x, obstacle.y, obstacle.radius * 1.4, state, 340));
  const visiblePickups = state.pickups.filter((pickup) => isVisible(pickup.x, pickup.y, pickup.radius, state));
  const visibleEnemies = state.enemies.filter((enemy) => isVisible(enemy.x, enemy.y, enemy.radius, state, 180));
  const visibleProjectiles = state.projectiles.filter((projectile) => isVisible(projectile.x, projectile.y, projectile.radius, state, 120));
  const visibleOrbitals = state.orbitals.filter((orbital) => isVisible(orbital.x, orbital.y, orbital.radius, state, 80));
  const visibleEffects = state.effects.filter((effect) => isVisible(effect.x, effect.y, effect.radius * 2, state, 160));
  const groundEffects = visibleEffects.filter((effect) => effect.type === "blood-pool" || effect.type === "acid-pool");
  const overlayEffects = visibleEffects.filter((effect) => effect.type !== "blood-pool" && effect.type !== "acid-pool");

  return (
    <main className={`game-screen ${input.aimActive ? "game-screen-aiming" : ""} ${isMobileControls ? "game-screen-mobile-controls" : ""}`} onContextMenu={(event) => event.preventDefault()}>
      <svg
        ref={svgRef}
        className="game-svg"
        viewBox="0 0 1280 720"
        preserveAspectRatio="xMidYMid slice"
        aria-label="蟑螂幸存者游戏画面"
        role="img"
        onMouseEnter={(event) => {
          audioRef.current?.unlock();
          updatePointerPosition(event.clientX, event.clientY);
          refresh();
        }}
        onMouseMove={(event) => updatePointerPosition(event.clientX, event.clientY)}
        onMouseDown={(event) => {
          if (event.button !== 0) {
            event.preventDefault();
            return;
          }

          audioRef.current?.unlock();
          updatePointerPosition(event.clientX, event.clientY);
          refresh();
        }}
        onPointerDown={handleMobilePointerDown}
        onPointerMove={handleMobilePointerMove}
        onPointerCancel={handleMobilePointerEnd}
        onPointerUp={handleMobilePointerEnd}
      >
        <WorldDefs />

        <g transform={`translate(${toFixed(translateX)} ${toFixed(translateY)})`}>
          <g>
            <MapBackdrop camera={camera} decorations={visibleDecorations} map={state.map} />
          </g>
          <g>{groundEffects.map((effect) => <EffectSprite key={effect.id} effect={effect} />)}</g>
          <g>{visibleObstacles.map((obstacle) => <ObstacleSprite key={obstacle.id} obstacle={obstacle} />)}</g>
          <g>{visiblePickups.map((pickup) => <PickupSprite key={pickup.id} pickup={pickup} />)}</g>
          <g><BossTelegraphs enemies={visibleEnemies} state={state} /></g>
          <g>{visibleEnemies.map((enemy) => <EnemySprite key={enemy.id} enemy={enemy} />)}</g>
          <g>{visibleProjectiles.map((projectile) => <ProjectileSprite key={projectile.id} projectile={projectile} />)}</g>
          <g>{visibleOrbitals.map((orbital) => <OrbitalSprite key={orbital.id} orbital={orbital} />)}</g>
          <g><PlayerSprite player={state.player} skinId={setup.selectedSkinId} /></g>
          <g><AimReticle state={state} input={input} /></g>
          <g>{overlayEffects.map((effect) => <EffectSprite key={effect.id} effect={effect} />)}</g>
        </g>
        <BossOffscreenIndicator boss={boss} camera={camera} state={state} />
      </svg>

      {!input.aimActive && !input.autoAim && state.runState === "running" ? (
        <div className="aim-hint">把鼠标移进战场接管瞄准，按 Esc 释放。按 F 切换自瞄。</div>
      ) : null}

      {isMobileControls && !mobileNoticeOpen && state.runState === "running" ? (
        <div className="mobile-control-hint">移动端试玩：按住战场控制移动，自瞄已开启。</div>
      ) : null}

      <div className="hud-top">
        <section className="hud-objective" aria-label="局内目标">
          <button
            className="hud-objective-trigger"
            type="button"
            onClick={fastForwardToNextBossPrep}
            disabled={!canFastForward}
            title={canFastForward ? `作弊：快进到 ${formatTime(fastForwardTarget)}` : "当前不可快进"}
            aria-label={canFastForward ? `作弊：快进到 ${formatTime(fastForwardTarget)}` : "当前不可快进"}
          >
            局内目标
          </button>
          <strong>{targetText}</strong>
          <div className="hud-objective-row">
            <span>当前时间 <b>{formatTime(state.timer)}</b></span>
            <span>还剩敌人 <b>{state.enemies.length}</b></span>
          </div>
        </section>
      </div>

      {boss ? (
        <div className="boss-bar">
          <div className="boss-bar-head">
            <span>{bossTitle}</span>
            <strong>
              {Math.ceil(boss.hp)} / {boss.maxHp}
            </strong>
          </div>
          <div className="meter-shell meter-shell-boss">
            <div className="meter-fill meter-fill-boss" style={{ width: `${(clamp(boss.hp / boss.maxHp, 0, 1) * 100).toFixed(1)}%` }} />
          </div>
        </div>
      ) : null}

      <div className="hud-bottom">
        <section className="minecraft-hud" aria-label="战斗状态栏">
          <div className="minecraft-health-row">
            <HealthHearts current={state.player.hp} max={state.player.maxHp} />
            <span>{Math.ceil(state.player.hp)} / {state.player.maxHp}</span>
          </div>

          <div className="minecraft-xp-row">
            <strong>Lv.{state.level}</strong>
            <div className="minecraft-xp-track" aria-label={`经验值 ${state.xp} / ${state.xpToNext}`}>
              <div className="minecraft-xp-fill" style={{ width: `${(xpRatio * 100).toFixed(1)}%` }} />
            </div>
            <span>还差 {xpRemaining} EXP</span>
          </div>

          <div className="inventory-hotbar">
            <div className="inventory-section inventory-section-skills" aria-label="技能栏">
              {summary.map((entry) => (
                <div key={entry.id} className="inventory-slot inventory-slot-filled" title={`${entry.name} Lv.${entry.rank}`}>
                  <UpgradeIcon id={entry.id} className="inventory-icon" />
                  <span className="inventory-slot-label">{entry.shortName}</span>
                  <b className="inventory-slot-level">{entry.rank}</b>
                </div>
              ))}
              {Array.from({ length: skillPlaceholderCount }, (_, index) => (
                <div key={`skill-empty-${index}`} className="inventory-slot inventory-slot-empty" aria-hidden="true" />
              ))}
            </div>

            <div className="inventory-divider" aria-hidden="true" />

            <div className="inventory-section inventory-section-relics" aria-label="圣遗物栏">
              {relicInventory.map((relic) => (
                <div key={relic.id} className={`inventory-slot inventory-slot-filled inventory-slot-relic inventory-slot-relic-${relic.category}`} title={`${relic.name}：${relic.description}`}>
                  <RelicIcon id={relic.id} className="inventory-icon" />
                  <span className="inventory-slot-label">{relic.name}</span>
                </div>
              ))}
              {Array.from({ length: relicPlaceholderCount }, (_, index) => (
                <div key={`relic-empty-${index}`} className="inventory-slot inventory-slot-empty inventory-slot-empty-relic" aria-hidden="true" />
              ))}
            </div>
          </div>
        </section>
      </div>

      {mobileNoticeOpen ? (
        <div className="mobile-notice-backdrop">
          <section className="mobile-notice-card">
            <p className="menu-eyebrow">MOBILE MODE</p>
            <h2>移动端只是临时兼容</h2>
            <p className="overlay-copy">这套玩法仍然更适合电脑端。手机上会自动开启自瞄，按住战场并朝想去的方向拖动即可移动。</p>
            <div className="modal-actions">
              <button className="button-primary" type="button" onClick={dismissMobileNotice}>
                继续试玩
              </button>
              <button className="button-secondary" type="button" onClick={onReturnToMenu}>
                返回主菜单
              </button>
            </div>
          </section>
        </div>
      ) : state.runState !== "running" ? (
        <div className="overlay-shell">
          <section className="overlay-card">
            {state.runState === "levelup" ? (
              <>
                <p className="menu-eyebrow">LEVEL UP</p>
                <h2>腺体突然暴走了</h2>
                <p className="overlay-copy">选择一次变异强化。战斗会暂停，直到你完成选择。</p>
                <div className="choice-toolbar">
                  <span className="currency-pill">剩余刷新 {state.upgradeRefreshesRemaining}</span>
                  <button className="button-secondary" type="button" onClick={rerollChoices} disabled={state.upgradeRefreshesRemaining <= 0}>
                    刷新增益
                  </button>
                </div>
                <div className="choice-grid">
                  {state.upgradeChoices.map((choice, index) => (
                    <button key={choice.id} className="choice-card" type="button" onClick={() => chooseUpgradeByIndex(index)}>
                      <div className="choice-card-top">
                        <UpgradeIcon id={choice.id} className="choice-icon" />
                        <span className="choice-hotkey">{index + 1}</span>
                      </div>
                      <h3>{choice.name}</h3>
                      <p>{choice.description}</p>
                      <p className="overlay-copy">
                        当前等级 {choice.currentRank} -&gt; {choice.nextRank}
                      </p>
                    </button>
                  ))}
                </div>
              </>
            ) : null}

            {state.runState === "relicChoice" ? (
              <>
                <p className="menu-eyebrow">RELIC</p>
                <h2>发现了古老的遗物</h2>
                <p className="overlay-copy">选择一件遗物，它将伴随你这一整局。</p>
                <div className="choice-grid">
                  {state.relicChoices.map((choice, index) => (
                    <button key={choice.id} className="choice-card relic-card" type="button" onClick={() => chooseRelicByIndex(index)}>
                      <div className="choice-card-top">
                        <RelicIcon id={choice.id} className="choice-icon" />
                        <span className="choice-hotkey">{index + 1}</span>
                      </div>
                      <span className={`relic-category relic-category-${choice.category}`}>{choice.category === "offensive" ? "进攻" : choice.category === "defensive" ? "防御" : choice.category === "utility" ? "功能" : "风险"}</span>
                      <h3>{choice.name}</h3>
                      <p>{choice.description}</p>
                    </button>
                  ))}
                </div>
              </>
            ) : null}

            {state.runState === "paused" ? (
              <>
                <p className="menu-eyebrow">PAUSED</p>
                <h2>下水道短暂停摆</h2>
                <p className="overlay-copy">准备好了就继续突围，或者返回主菜单看看教程。</p>
                <div className="modal-actions">
                  <button className="button-primary" type="button" onClick={() => { togglePause(stateRef.current); refresh(); }}>
                    继续战斗
                  </button>
                  <button className="button-secondary" type="button" onClick={restartRun}>
                    重新开局
                  </button>
                  <button className="button-secondary" type="button" onClick={onReturnToMenu}>
                    返回主菜单
                  </button>
                </div>
              </>
            ) : null}

            {state.runState === "won" ? (
              <>
                <p className="menu-eyebrow">VICTORY</p>
                <h2>整片母巢被你轰穿了</h2>
                <p className="overlay-copy">你撑过了 {formatTime(state.runDuration)}，并清掉了 {state.difficulty.bossWaves} 波 Boss，整个污水区都被你打成了空壳。</p>
                <div className="stats-grid">
                  <div className="stats-item"><span>存活时间</span><strong>{formatTime(state.timer)}</strong></div>
                  <div className="stats-item"><span>击杀总数</span><strong>{state.sessionStats.kills}</strong></div>
                  <div className="stats-item"><span>Boss 击败</span><strong>{state.sessionStats.bossesDefeated}</strong></div>
                  <div className="stats-item"><span>最高等级</span><strong>Lv.{state.sessionStats.peakLevel}</strong></div>
                  <div className="stats-item"><span>造成伤害</span><strong>{Math.round(state.sessionStats.damageDealt).toLocaleString()}</strong></div>
                  <div className="stats-item"><span>承受伤害</span><strong>{Math.round(state.sessionStats.damageTaken).toLocaleString()}</strong></div>
                  <div className="stats-item"><span>弹丸发射</span><strong>{state.sessionStats.projectilesFired}</strong></div>
                  <div className="stats-item"><span>金色卵鞘</span><strong>{state.runGoldenEggsCollected}</strong></div>
                  <div className="stats-item"><span>移动键</span><strong>{state.sessionStats.usedMovementKeys ? "已使用" : "未使用"}</strong></div>
                  <div className="stats-item"><span>快进测试</span><strong>{state.sessionStats.usedCheat ? "已使用" : "未使用"}</strong></div>
                </div>
                <div className="modal-actions">
                  <button className="button-primary" type="button" onClick={restartRun}>
                    再来一局
                  </button>
                  <button className="button-secondary" type="button" onClick={onReturnToMenu}>
                    返回主菜单
                  </button>
                </div>
              </>
            ) : null}

            {state.runState === "lost" ? (
              <>
                <p className="menu-eyebrow">DEFEAT</p>
                <h2>你被虫潮啃穿了</h2>
                <p className="overlay-copy">这次走位没顶住。下一局试试更早拿攻速、移速、自动副炮或者环绕弹。</p>
                <div className="stats-grid">
                  <div className="stats-item"><span>存活时间</span><strong>{formatTime(state.timer)}</strong></div>
                  <div className="stats-item"><span>击杀总数</span><strong>{state.sessionStats.kills}</strong></div>
                  <div className="stats-item"><span>Boss 击败</span><strong>{state.sessionStats.bossesDefeated}</strong></div>
                  <div className="stats-item"><span>最高等级</span><strong>Lv.{state.sessionStats.peakLevel}</strong></div>
                  <div className="stats-item"><span>造成伤害</span><strong>{Math.round(state.sessionStats.damageDealt).toLocaleString()}</strong></div>
                  <div className="stats-item"><span>承受伤害</span><strong>{Math.round(state.sessionStats.damageTaken).toLocaleString()}</strong></div>
                  <div className="stats-item"><span>弹丸发射</span><strong>{state.sessionStats.projectilesFired}</strong></div>
                  <div className="stats-item"><span>金色卵鞘</span><strong>{state.runGoldenEggsCollected}</strong></div>
                  <div className="stats-item"><span>移动键</span><strong>{state.sessionStats.usedMovementKeys ? "已使用" : "未使用"}</strong></div>
                  <div className="stats-item"><span>快进测试</span><strong>{state.sessionStats.usedCheat ? "已使用" : "未使用"}</strong></div>
                </div>
                <div className="modal-actions">
                  <button className="button-primary" type="button" onClick={restartRun}>
                    重新孵化
                  </button>
                  <button className="button-secondary" type="button" onClick={onReturnToMenu}>
                    返回主菜单
                  </button>
                </div>
              </>
            ) : null}
          </section>
        </div>
      ) : null}
    </main>
  );
}
