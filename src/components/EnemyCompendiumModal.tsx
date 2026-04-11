import { BOSS_WAVE_CONFIGS, type BossWaveConfig } from "../game/core";
import { ENEMY_APPEAR_AT, ENEMY_TYPES } from "../game/entities/enemies";
import { DIFFICULTY_ORDER, getDifficultyConfig } from "../game/run/config";
import type { DifficultyId, EnemyEntity, EnemyTypeId } from "../game/types";
import EnemySprite from "./sprites/enemies/EnemySprite";

interface EnemyCompendiumModalProps {
  isOpen: boolean;
  onClose: () => void;
}

type GroundEnemyId = Exclude<EnemyTypeId, "boss">;

type DifficultyStats = {
  damage: number;
  hp: number;
  speed: number;
};

type CompendiumEntry = {
  id: string;
  kind: "enemy" | "boss";
  name: string;
  stageLabel: string;
  description: string;
  preview: EnemyEntity;
  statsByDifficulty: Partial<Record<DifficultyId, DifficultyStats>>;
};

function resolveDifficultyValue(values: Partial<Record<DifficultyId, number>>, difficultyId: DifficultyId): number {
  return values[difficultyId] ?? values.hard ?? values.normal ?? values.easy ?? 0;
}

function formatValue(value: number): string {
  return Number.isInteger(value) ? String(value) : value.toFixed(1);
}

function createPreviewEnemy(
  type: EnemyTypeId,
  options?: {
    bossWave?: number;
    damage?: number;
    hp?: number;
    name?: string;
    radius?: number;
    speed?: number;
  },
): EnemyEntity {
  const template = ENEMY_TYPES[type];
  const isBoss = type === "boss";
  const width = isBoss ? 320 : 240;
  const height = isBoss ? 220 : 170;

  return {
    id: `compendium-${type}-${options?.bossWave ?? 0}`,
    type,
    name: options?.name ?? template.name,
    x: width / 2,
    y: isBoss ? 136 : 102,
    vx: 36,
    vy: 0,
    radius: options?.radius ?? template.radius,
    hp: options?.hp ?? template.hp,
    maxHp: options?.hp ?? template.hp,
    speed: options?.speed ?? template.speed,
    damage: options?.damage ?? template.damage,
    xp: template.xp,
    tint: template.tint,
    alive: true,
    pulse: 0.8,
    bossWave: options?.bossWave,
    summonCooldown: undefined,
    summonTimer: undefined,
    summonBurst: undefined,
    summonPool: undefined,
  };
}

function buildGroundEntries(): CompendiumEntry[] {
  const enemyIds = Object.keys(ENEMY_APPEAR_AT) as GroundEnemyId[];

  return enemyIds.map((enemyId) => {
    const template = ENEMY_TYPES[enemyId];
    const appearAt = ENEMY_APPEAR_AT[enemyId];
    const statsByDifficulty: Partial<Record<DifficultyId, DifficultyStats>> = {};

    DIFFICULTY_ORDER.forEach((difficultyId) => {
      const difficulty = getDifficultyConfig(difficultyId);

      if (difficulty.runDuration <= appearAt) {
        return;
      }

      statsByDifficulty[difficultyId] = {
        hp: Math.max(1, Math.round(template.hp * difficulty.hpMultiplier)),
        damage: Math.max(1, Math.round(template.damage * difficulty.damageMultiplier)),
        speed: Number((template.speed * difficulty.speedMultiplier).toFixed(1)),
      };
    });

    return {
      id: enemyId,
      kind: "enemy",
      name: template.name,
      stageLabel: appearAt === 0 ? "00:00 - 05:00" : appearAt === 300 ? "05:00 - 10:00" : "10:00 - 15:00",
      description: appearAt === 0 ? "基础敌群" : appearAt === 300 ? "中盘追加敌人" : "后盘高压敌人",
      preview: createPreviewEnemy(enemyId),
      statsByDifficulty,
    };
  });
}

function buildBossEntries(): CompendiumEntry[] {
  return Object.entries(BOSS_WAVE_CONFIGS).map(([waveKey, config]) => {
    const bossWave = Number(waveKey);
    const statsByDifficulty: Partial<Record<DifficultyId, DifficultyStats>> = {};

    DIFFICULTY_ORDER.forEach((difficultyId) => {
      const difficulty = getDifficultyConfig(difficultyId);

      if (difficulty.bossWaves < bossWave) {
        return;
      }

      statsByDifficulty[difficultyId] = {
        hp: resolveDifficultyValue(config.hp, difficultyId),
        damage: resolveDifficultyValue(config.damage, difficultyId),
        speed: Number(resolveDifficultyValue(config.speed, difficultyId).toFixed(1)),
      };
    });

    return {
      id: `boss-${bossWave}`,
      kind: "boss",
      name: config.name,
      stageLabel: `Boss 第 ${bossWave} 波`,
      description: getBossDescription(bossWave, config),
      preview: createPreviewEnemy("boss", {
        bossWave,
        damage: resolveDifficultyValue(config.damage, "hard"),
        hp: resolveDifficultyValue(config.hp, "hard"),
        name: config.name,
        radius: config.radius,
        speed: resolveDifficultyValue(config.speed, "hard"),
      }),
      statsByDifficulty,
    };
  });
}

function getBossDescription(bossWave: number, config: BossWaveConfig): string {
  if (bossWave === 2) {
    return "高速冲阵型 Boss，压迫感靠移速和贴脸追击提供。";
  }

  if (bossWave === 3) {
    return `最终 Boss，会定期召唤 ${config.summonPool?.length ?? 0} 种高压小弟。`;
  }

  return "基础母巢女王，负责第一波压轴。";
}

function EnemyPreview({ enemy }: { enemy: EnemyEntity }) {
  const isBoss = enemy.type === "boss";
  const width = isBoss ? 320 : 240;
  const height = isBoss ? 220 : 170;

  return (
    <svg className="compendium-preview-svg" viewBox={`0 0 ${width} ${height}`} role="img" aria-label={`${enemy.name} 预览`}>
      <defs>
        <radialGradient id={`compendium-glow-${enemy.id}`} cx="50%" cy="40%" r="68%">
          <stop offset="0%" stopColor={isBoss ? "rgba(255, 125, 102, 0.22)" : "rgba(214, 239, 109, 0.18)"} />
          <stop offset="100%" stopColor="rgba(255, 255, 255, 0)" />
        </radialGradient>
      </defs>
      <rect x="18" y="14" width={width - 36} height={height - 28} rx="26" fill="rgba(255, 255, 255, 0.02)" />
      <ellipse cx={width / 2} cy={height * 0.45} rx={isBoss ? 118 : 88} ry={isBoss ? 72 : 54} fill={`url(#compendium-glow-${enemy.id})`} />
      <EnemySprite enemy={enemy} />
    </svg>
  );
}

const COMPENDIUM_ENTRIES: CompendiumEntry[] = [...buildGroundEntries(), ...buildBossEntries()];

export default function EnemyCompendiumModal({ isOpen, onClose }: EnemyCompendiumModalProps) {
  if (!isOpen) {
    return null;
  }

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <section
        aria-modal="true"
        className="tutorial-modal modal-wide modal-compendium"
        role="dialog"
        aria-label="怪物图鉴"
        onClick={(event) => event.stopPropagation()}
      >
        <p className="menu-eyebrow">BESTIARY</p>
        <h2>怪物图鉴</h2>
        <p className="modal-copy">每张卡直接展示当前游戏里的 SVG 敌人形象，并列出它实际会出现的难度数据。没出现的难度不会展示。</p>

        <div className="compendium-grid">
          {COMPENDIUM_ENTRIES.map((entry) => (
            <article key={entry.id} className={`compendium-card ${entry.kind === "boss" ? "compendium-card-boss" : ""}`}>
              <EnemyPreview enemy={entry.preview} />
              <div className="compendium-card-head">
                <div>
                  <span>{entry.stageLabel}</span>
                  <h3>{entry.name}</h3>
                </div>
                <em>{entry.description}</em>
              </div>

              <div className="compendium-stats-grid">
                {DIFFICULTY_ORDER.filter((difficultyId) => entry.statsByDifficulty[difficultyId]).map((difficultyId) => {
                  const stats = entry.statsByDifficulty[difficultyId]!;
                  const difficulty = getDifficultyConfig(difficultyId);

                  return (
                    <section key={`${entry.id}-${difficultyId}`} className={`compendium-difficulty compendium-difficulty-${difficultyId}`}>
                      <strong>{difficulty.label}</strong>
                      <div className="compendium-stat-row">
                        <span>血量</span>
                        <b>{formatValue(stats.hp)}</b>
                      </div>
                      <div className="compendium-stat-row">
                        <span>伤害</span>
                        <b>{formatValue(stats.damage)}</b>
                      </div>
                      <div className="compendium-stat-row">
                        <span>速度</span>
                        <b>{formatValue(stats.speed)}</b>
                      </div>
                    </section>
                  );
                })}
              </div>
            </article>
          ))}
        </div>

        <div className="modal-actions">
          <button className="button-primary" type="button" onClick={onClose}>
            关闭图鉴
          </button>
        </div>
      </section>
    </div>
  );
}
