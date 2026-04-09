import { useEffect, useRef, useState } from "react";
import {
  chooseUpgrade,
  createGameState,
  createInputState,
  formatTime,
  getBoss,
  getCamera,
  getPhaseLabel,
  getStatusLabel,
  resetInputState,
  togglePause,
  updateGame,
} from "../game/core";
import { summarizeUpgrades } from "../game/upgrades";
import type {
  Decoration,
  EffectEntity,
  GameState,
  InputState,
  ObstacleEntity,
  OrbitalEntity,
  PickupEntity,
  ProjectileEntity,
} from "../game/types";
import EnemySprite from "./sprites/enemies/EnemySprite";
import PlayerSprite from "./sprites/player/PlayerSprite";

interface GameScreenProps {
  onReturnToMenu: () => void;
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

function renderMap(camera: { x: number; y: number }, decorations: Decoration[], map: GameState["map"]) {
  const left = camera.x - map.width / 2;
  const top = camera.y - map.height / 2;
  const right = left + map.width;
  const bottom = top + map.height;
  const laneSpacing = 220;
  const gutterSpacing = 340;
  const laneStart = Math.floor(top / laneSpacing) - 2;
  const laneCount = Math.ceil(map.height / laneSpacing) + 4;
  const gutterStart = Math.floor(left / gutterSpacing) - 2;
  const gutterCount = Math.ceil(map.width / gutterSpacing) + 4;

  const laneMarkup = Array.from({ length: laneCount }, (_, index) => {
    const row = laneStart + index;
    const y = row * laneSpacing + 140;
    return (
      <path
        key={"lane-" + row}
        d={`M ${left - 220} ${y} C ${left + map.width * 0.24} ${y + 28}, ${left + map.width * 0.62} ${y - 42}, ${right + 220} ${y + 20}`}
        stroke="rgba(164, 190, 110, 0.07)"
        strokeWidth="18"
        fill="none"
      />
    );
  });

  const gutterMarkup = Array.from({ length: gutterCount }, (_, index) => {
    const column = gutterStart + index;
    const x = column * gutterSpacing + 110;
    return (
      <path
        key={"gutter-" + column}
        d={`M ${x} ${top - 180} C ${x + 18} ${top + map.height * 0.3}, ${x - 22} ${top + map.height * 0.66}, ${x + 14} ${bottom + 180}`}
        stroke="rgba(255, 160, 79, 0.06)"
        strokeWidth="24"
        fill="none"
      />
    );
  });

  return (
    <>
      <rect x={left} y={top} width={map.width} height={map.height} fill="url(#floorGradient)" />
      <rect x={left} y={top} width={map.width} height={map.height} fill="url(#sewerGrid)" opacity="0.86" />
      <rect x={left} y={top} width={map.width} height={map.height} fill="url(#sewerScratches)" opacity="0.2" />
      {laneMarkup}
      {gutterMarkup}
      {decorations.map((prop) => {
        if (prop.type === "puddle") {
          return (
            <g key={prop.id} transform={`translate(${toFixed(prop.x)} ${toFixed(prop.y)}) rotate(${toFixed(prop.rotation)}) scale(${toFixed(prop.scale)})`}>
              <ellipse rx="54" ry="30" fill="rgba(113, 210, 87, 0.12)" />
              <ellipse rx="34" ry="18" fill="rgba(214, 239, 109, 0.08)" />
            </g>
          );
        }

        if (prop.type === "crumb") {
          return (
            <g key={prop.id} transform={`translate(${toFixed(prop.x)} ${toFixed(prop.y)}) rotate(${toFixed(prop.rotation)}) scale(${toFixed(prop.scale)})`}>
              <polygon points="-18,-10 14,-16 22,4 -2,18 -24,2" fill="#8e6d3f" />
              <polygon points="-6,-2 8,-6 10,2 -2,8" fill="#c7a26a" />
            </g>
          );
        }

        if (prop.type === "cap") {
          return (
            <g key={prop.id} transform={`translate(${toFixed(prop.x)} ${toFixed(prop.y)}) rotate(${toFixed(prop.rotation)}) scale(${toFixed(prop.scale)})`}>
              <circle r="26" fill="#345468" />
              <circle r="16" fill="#233641" />
              <circle r="7" fill="#a0d5f8" />
            </g>
          );
        }

        if (prop.type === "drain") {
          return (
            <g key={prop.id} transform={`translate(${toFixed(prop.x)} ${toFixed(prop.y)}) rotate(${toFixed(prop.rotation)}) scale(${toFixed(prop.scale)})`}>
              <rect x="-34" y="-22" width="68" height="44" rx="8" fill="#26322c" />
              <path d="M -24 -12 H 24 M -24 0 H 24 M -24 12 H 24" stroke="#8e9e7d" strokeWidth="4" strokeLinecap="round" />
            </g>
          );
        }

        return (
          <g key={prop.id} transform={`translate(${toFixed(prop.x)} ${toFixed(prop.y)}) rotate(${toFixed(prop.rotation)}) scale(${toFixed(prop.scale)})`}>
            <ellipse rx="46" ry="20" fill="rgba(74, 43, 24, 0.22)" />
            <ellipse rx="26" ry="10" fill="rgba(118, 83, 56, 0.18)" />
          </g>
        );
      })}
    </>
  );
}

function PickupSprite({ pickup }: { pickup: PickupEntity }) {
  return (
    <g transform={`translate(${toFixed(pickup.x)} ${toFixed(pickup.y)})`}>
      <circle r={toFixed(pickup.radius + 8)} fill="url(#slimeGlow)" opacity="0.42" />
      <circle r={toFixed(pickup.radius)} fill="#d7f06d" />
      <circle r={toFixed(Math.max(4, pickup.radius * 0.42))} fill="#f7ffe0" />
    </g>
  );
}

function ProjectileSprite({ projectile }: { projectile: ProjectileEntity }) {
  const angle = (projectile.angle * 180) / Math.PI;
  return (
    <g transform={`translate(${toFixed(projectile.x)} ${toFixed(projectile.y)}) rotate(${toFixed(angle)})`}>
      <ellipse cx="-8" cy="0" rx="16" ry="7" fill="rgba(198, 255, 92, 0.16)" />
      <ellipse rx={projectile.variant === "auto" ? "12" : "15"} ry={projectile.variant === "auto" ? "6" : "8"} fill={projectile.tint} />
      <ellipse cx="4" rx={projectile.variant === "auto" ? "6" : "8"} ry={projectile.variant === "auto" ? "4" : "5"} fill="rgba(116, 86, 58, 0.55)" />
    </g>
  );
}

function OrbitalSprite({ orbital }: { orbital: OrbitalEntity }) {
  return (
    <g transform={`translate(${toFixed(orbital.x)} ${toFixed(orbital.y)})`} opacity={orbital.active ? 1 : 0.3}>
      <circle r={toFixed(orbital.radius + 8)} fill="url(#slimeGlow)" opacity={orbital.active ? 0.24 : 0.12} />
      <ellipse rx={toFixed(orbital.radius + 2)} ry={toFixed(orbital.radius * 0.7)} fill={orbital.active ? "#f4f0d2" : "rgba(244, 240, 210, 0.35)"} />
      <ellipse cx="4" rx={toFixed(orbital.radius * 0.48)} ry={toFixed(orbital.radius * 0.34)} fill={orbital.active ? "#d8c89d" : "rgba(216, 200, 157, 0.25)"} />
    </g>
  );
}

function ObstacleSprite({ obstacle }: { obstacle: ObstacleEntity }) {
  if (obstacle.type === "pipe") {
    return (
      <g transform={`translate(${toFixed(obstacle.x)} ${toFixed(obstacle.y)}) rotate(${toFixed(obstacle.rotation)}) scale(${toFixed(obstacle.scale)})`}>
        <ellipse cx="0" cy={toFixed(obstacle.radius * 0.8)} rx={toFixed(obstacle.radius * 1.15)} ry={toFixed(obstacle.radius * 0.42)} fill="rgba(0, 0, 0, 0.28)" />
        <circle r={toFixed(obstacle.radius)} fill="#314f55" stroke="#16242a" strokeWidth="8" />
        <circle r={toFixed(obstacle.radius * 0.6)} fill="#4b7580" stroke="#9bc3cf" strokeWidth="4" />
        <path d={`M -${toFixed(obstacle.radius * 0.66)} 0 H ${toFixed(obstacle.radius * 0.66)}`} stroke="#9bc3cf" strokeWidth="6" strokeLinecap="round" />
      </g>
    );
  }

  if (obstacle.type === "barrel") {
    return (
      <g transform={`translate(${toFixed(obstacle.x)} ${toFixed(obstacle.y)}) rotate(${toFixed(obstacle.rotation)}) scale(${toFixed(obstacle.scale)})`}>
        <ellipse cx="0" cy={toFixed(obstacle.radius * 0.8)} rx={toFixed(obstacle.radius * 1.1)} ry={toFixed(obstacle.radius * 0.38)} fill="rgba(0, 0, 0, 0.28)" />
        <rect x={toFixed(-obstacle.radius * 0.78)} y={toFixed(-obstacle.radius * 0.94)} width={toFixed(obstacle.radius * 1.56)} height={toFixed(obstacle.radius * 1.9)} rx={toFixed(obstacle.radius * 0.3)} fill="#7f5a34" stroke="#352315" strokeWidth="7" />
        <path d={`M -${toFixed(obstacle.radius * 0.76)} -${toFixed(obstacle.radius * 0.34)} H ${toFixed(obstacle.radius * 0.76)}`} stroke="#d8b27b" strokeWidth="5" />
        <path d={`M -${toFixed(obstacle.radius * 0.76)} ${toFixed(obstacle.radius * 0.42)} H ${toFixed(obstacle.radius * 0.76)}`} stroke="#d8b27b" strokeWidth="5" />
      </g>
    );
  }

  return (
    <g transform={`translate(${toFixed(obstacle.x)} ${toFixed(obstacle.y)}) rotate(${toFixed(obstacle.rotation)}) scale(${toFixed(obstacle.scale)})`}>
      <ellipse cx="0" cy={toFixed(obstacle.radius * 0.78)} rx={toFixed(obstacle.radius * 1.18)} ry={toFixed(obstacle.radius * 0.44)} fill="rgba(0, 0, 0, 0.3)" />
      <ellipse rx={toFixed(obstacle.radius * 1.12)} ry={toFixed(obstacle.radius * 0.9)} fill="#594134" stroke="#251713" strokeWidth="7" />
      <ellipse rx={toFixed(obstacle.radius * 0.7)} ry={toFixed(obstacle.radius * 0.54)} fill="#8f6b4e" />
      <circle cx={toFixed(-obstacle.radius * 0.28)} cy={toFixed(-obstacle.radius * 0.08)} r={toFixed(obstacle.radius * 0.14)} fill="#2c1c16" />
      <circle cx={toFixed(obstacle.radius * 0.18)} cy={toFixed(obstacle.radius * 0.1)} r={toFixed(obstacle.radius * 0.12)} fill="#2c1c16" />
    </g>
  );
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

function EffectSprite({ effect }: { effect: EffectEntity }) {
  const progress = effect.age / effect.duration;
  const radius = effect.radius * (0.5 + progress * 1.2);
  const opacity = clamp(1 - progress, 0, 1);

  return (
    <g transform={`translate(${toFixed(effect.x)} ${toFixed(effect.y)})`} opacity={toFixed(opacity)}>
      <circle r={toFixed(radius)} fill={effect.tint} opacity="0.26" />
      <circle r={toFixed(radius * 0.5)} fill={effect.tint} opacity="0.5" />
    </g>
  );
}

export default function GameScreen({ onReturnToMenu }: GameScreenProps) {
  const stateRef = useRef<GameState>(createGameState());
  const inputRef = useRef<InputState>(createInputState());
  const frameRef = useRef<number | null>(null);
  const lastFrameRef = useRef<number>(performance.now());
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [, forceRender] = useState(0);

  function refresh() {
    forceRender((value) => value + 1);
  }

  function restartRun() {
    stateRef.current = createGameState();
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
          updatePointerPosition(event.clientX, event.clientY);
          refresh();
        }}
        onMouseMove={(event) => updatePointerPosition(event.clientX, event.clientY)}
        onMouseDown={(event) => {
          updatePointerPosition(event.clientX, event.clientY);
          refresh();
        }}
      >
        <defs>
          <linearGradient id="floorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#314238" />
            <stop offset="42%" stopColor="#213129" />
            <stop offset="100%" stopColor="#161f1b" />
          </linearGradient>
          <pattern id="sewerGrid" width="180" height="180" patternUnits="userSpaceOnUse">
            <rect width="180" height="180" fill="transparent" />
            <path d="M 0 48 H 180" stroke="rgba(196, 225, 110, 0.08)" strokeWidth="3" />
            <path d="M 0 132 H 180" stroke="rgba(196, 225, 110, 0.06)" strokeWidth="2" />
            <path d="M 48 0 V 180" stroke="rgba(255, 184, 77, 0.05)" strokeWidth="2" />
            <path d="M 132 0 V 180" stroke="rgba(255, 184, 77, 0.04)" strokeWidth="2" />
          </pattern>
          <pattern id="sewerScratches" width="280" height="280" patternUnits="userSpaceOnUse">
            <path d="M 12 240 L 92 168 M 138 40 L 200 0 M 192 220 L 264 156" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="3" strokeLinecap="round" />
            <path d="M 18 68 L 54 42 M 172 120 L 236 82" stroke="rgba(214, 239, 109, 0.04)" strokeWidth="2" strokeLinecap="round" />
          </pattern>
          <radialGradient id="slimeGlow" cx="50%" cy="50%" r="60%">
            <stop offset="0%" stopColor="rgba(198, 255, 92, 0.9)" />
            <stop offset="100%" stopColor="rgba(198, 255, 92, 0)" />
          </radialGradient>
          <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
            <feGaussianBlur stdDeviation="6" />
          </filter>
        </defs>

        <g transform={`translate(${toFixed(translateX)} ${toFixed(translateY)})`}>
          <g>{renderMap(camera, visibleDecorations, state.map)}</g>
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
        </div>

        <div className="hud-target">
          <span>目标</span>
          <strong>活过 05:00 并击败女王</strong>
          <em>Esc 释放瞄准 / P 暂停</em>
        </div>
      </div>

      {boss ? (
        <div className="boss-bar">
          <div className="boss-bar-head">
            <span>母巢女王</span>
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
                <h2>母巢女王被你轰碎了</h2>
                <p className="overlay-copy">你活过了五分钟，还把整片污水区最肥的一只蟑螂炸成了壳片。</p>
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
