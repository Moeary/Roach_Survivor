import { useEffect, useRef, useState } from "react";
import {
  chooseUpgrade,
  createGameState,
  createInputState,
  drainGameEvents,
  formatTime,
  getBoss,
  getCamera,
  getPhaseLabel,
  getStatusLabel,
  refreshUpgradeChoices,
  resetInputState,
  togglePause,
  updateGame,
} from "../game/core";
import { GameAudioController, getBgmTrackForState, type AudioSettings } from "../audio/gameAudio";
import { summarizeUpgrades } from "../game/upgrades";
import type { GameState, InputState, RunSetup } from "../game/types";
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

export default function GameScreen({ audioSettings, onAwardGoldenEggs, onReturnToMenu, setup }: GameScreenProps) {
  const stateRef = useRef<GameState>(createGameState(setup));
  const inputRef = useRef<InputState>(createInputState());
  const frameRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number>(performance.now());
  const svgRef = useRef<SVGSVGElement | null>(null);
  const awardGoldenEggsRef = useRef(onAwardGoldenEggs);
  const audioRef = useRef<GameAudioController | null>(null);
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

    const bossInterval = state.runDuration / state.difficulty.bossWaves;
    const nextBossTime = bossInterval * (state.bossWavesSpawned + 1);
    const targetTime = Math.max(0, nextBossTime - 5);

    if (state.timer >= targetTime) {
      return false;
    }

    audioRef.current?.unlock();
    audioRef.current?.playCue("cheat");
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

  useEffect(() => {
    awardGoldenEggsRef.current = onAwardGoldenEggs;
  }, [onAwardGoldenEggs]);

  useEffect(() => {
    audioRef.current?.setSettings(audioSettings);
  }, [audioSettings]);

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

      if (["KeyW", "KeyA", "KeyS", "KeyD", "ArrowUp", "ArrowDown", "ArrowLeft", "ArrowRight"].includes(code)) {
        event.preventDefault();
      }

      if (code === "Escape" && inputRef.current.aimActive) {
        event.preventDefault();
        inputRef.current.aimActive = false;
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

      refresh();
      frameRef.current = window.requestAnimationFrame(frame);
    }

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("keyup", handleKeyUp);
    window.addEventListener("blur", handleBlur);
    frameRef.current = window.requestAnimationFrame(frame);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("keyup", handleKeyUp);
      window.removeEventListener("blur", handleBlur);

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
  const healthRatio = clamp(state.player.hp / state.player.maxHp, 0, 1);
  const xpRatio = clamp(state.xp / state.xpToNext, 0, 1);
  const nextBossTime = (state.runDuration / state.difficulty.bossWaves) * (state.bossWavesSpawned + 1);
  const fastForwardTarget = Math.max(0, nextBossTime - 5);
  const canFastForward = state.runState === "running" && !state.bossSpawned && state.bossWavesSpawned < state.difficulty.bossWaves && state.timer < fastForwardTarget;
  const targetText = `存活 ${formatTime(state.runDuration)} 并击败 ${state.difficulty.bossWaves} 波 Boss`;
  const difficultyText = `${state.difficulty.label} / ${state.difficulty.bossWaves} 波 Boss`;
  const bossTitle = boss ? `${boss.name} 第 ${boss.bossWave ?? state.bossWavesSpawned} 波` : "";
  const visibleDecorations = state.decorations.filter((decoration) => isVisible(decoration.x, decoration.y, 88, state, 340));
  const visibleObstacles = state.obstacles.filter((obstacle) => isVisible(obstacle.x, obstacle.y, obstacle.radius * 1.4, state, 340));
  const visiblePickups = state.pickups.filter((pickup) => isVisible(pickup.x, pickup.y, pickup.radius, state));
  const visibleEnemies = state.enemies.filter((enemy) => isVisible(enemy.x, enemy.y, enemy.radius, state, 180));
  const visibleProjectiles = state.projectiles.filter((projectile) => isVisible(projectile.x, projectile.y, projectile.radius, state, 120));
  const visibleOrbitals = state.orbitals.filter((orbital) => isVisible(orbital.x, orbital.y, orbital.radius, state, 80));
  const visibleEffects = state.effects.filter((effect) => isVisible(effect.x, effect.y, effect.radius * 2, state, 160));

  return (
    <main className={`game-screen ${input.aimActive ? "game-screen-aiming" : ""}`}>
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
          audioRef.current?.unlock();
          updatePointerPosition(event.clientX, event.clientY);
          refresh();
        }}
      >
        <WorldDefs />

        <g transform={`translate(${toFixed(translateX)} ${toFixed(translateY)})`}>
          <g>
            <MapBackdrop camera={camera} decorations={visibleDecorations} map={state.map} />
          </g>
          <g>{visibleObstacles.map((obstacle) => <ObstacleSprite key={obstacle.id} obstacle={obstacle} />)}</g>
          <g>{visiblePickups.map((pickup) => <PickupSprite key={pickup.id} pickup={pickup} />)}</g>
          <g>{visibleEnemies.map((enemy) => <EnemySprite key={enemy.id} enemy={enemy} />)}</g>
          <g>{visibleProjectiles.map((projectile) => <ProjectileSprite key={projectile.id} projectile={projectile} />)}</g>
          <g>{visibleOrbitals.map((orbital) => <OrbitalSprite key={orbital.id} orbital={orbital} />)}</g>
          <g><PlayerSprite player={state.player} /></g>
          <g><AimReticle state={state} input={input} /></g>
          <g>{visibleEffects.map((effect) => <EffectSprite key={effect.id} effect={effect} />)}</g>
        </g>
      </svg>

      {!input.aimActive && state.runState === "running" ? (
        <div className="aim-hint">把鼠标移进战场接管瞄准，按 Esc 释放。</div>
      ) : null}

      <div className="hud-top">
        <div className="hud-cluster">
          <div className="hud-pill">
            <span>局势</span>
            <strong>{getStatusLabel(state)}</strong>
          </div>
          <div className="hud-pill">
            <span>计时</span>
            <strong>{formatTime(state.timer)}</strong>
          </div>
          <div className="hud-pill">
            <span>阶段</span>
            <strong>{getPhaseLabel(state)}</strong>
          </div>
          <div className="hud-pill">
            <span>威胁</span>
            <strong>{state.enemies.length}</strong>
          </div>
          <div className="hud-pill">
            <span>瞄准</span>
            <strong>{input.aimActive ? "鼠标接管中" : "等待接管"}</strong>
          </div>
          <div className="hud-pill">
            <span>难度</span>
            <strong>{difficultyText}</strong>
          </div>
          <div className="hud-pill">
            <span>金色卵鞘</span>
            <strong>{state.runGoldenEggsCollected}</strong>
          </div>
        </div>

        <div className="hud-target">
          <button
            className="hud-target-trigger"
            type="button"
            onClick={fastForwardToNextBossPrep}
            disabled={!canFastForward}
            title={canFastForward ? `作弊：快进到 ${formatTime(fastForwardTarget)}` : "当前不可快进"}
            aria-label={canFastForward ? `作弊：快进到 ${formatTime(fastForwardTarget)}` : "当前不可快进"}
          >
            目标
          </button>
          <strong>{targetText}</strong>
          <em>Esc 释放瞄准 / P 暂停</em>
        </div>
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
        <section className="hud-stack hud-stack-left">
          <div className="hud-card">
            <div className="hud-card-head">
              <span>生命值</span>
              <strong>
                {Math.ceil(state.player.hp)} / {state.player.maxHp}
              </strong>
            </div>
            <div className="meter-shell">
              <div className="meter-fill meter-fill-health" style={{ width: `${(healthRatio * 100).toFixed(1)}%` }} />
            </div>
          </div>

          <div className="hud-card">
            <div className="hud-card-head">
              <span>经验值</span>
              <strong>
                {state.xp} / {state.xpToNext}
              </strong>
            </div>
            <div className="meter-shell">
              <div className="meter-fill meter-fill-xp" style={{ width: `${(xpRatio * 100).toFixed(1)}%` }} />
            </div>
          </div>
        </section>

        <section className="hud-card build-card">
          <div className="hud-card-head">
            <span>变异摘要</span>
            <strong>Lv.{state.level}</strong>
          </div>
          <div className="build-chip-row">
            {summary.length ? (
              summary.map((entry) => (
                <span key={entry.id} className="build-chip">
                  {entry.shortName} Lv.{entry.rank}
                </span>
              ))
            ) : (
              <span className="build-chip build-chip-muted">暂未变异</span>
            )}
          </div>
        </section>
      </div>

      {state.runState !== "running" ? (
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
                      <span className="choice-hotkey">{index + 1}</span>
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
