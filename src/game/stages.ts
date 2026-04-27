export const STAGE_ONE_DURATION = 240;
export const STAGE_TWO_DURATION = 180;
export const STAGE_THREE_DURATION = 180;
export const ENDLESS_BOSS_INTERVAL = 120;

export const STAGE_TWO_START_TIME = STAGE_ONE_DURATION;
export const STAGE_THREE_START_TIME = STAGE_ONE_DURATION + STAGE_TWO_DURATION;
export const FINAL_BOSS_TIME = STAGE_ONE_DURATION + STAGE_TWO_DURATION + STAGE_THREE_DURATION;

const BOSS_WAVE_TIMINGS: Record<number, number> = {
  1: STAGE_TWO_START_TIME,
  2: STAGE_THREE_START_TIME,
  3: FINAL_BOSS_TIME,
};

export function getBossWaveTime(waveNumber: number): number {
  if (waveNumber <= 0) {
    return 0;
  }

  return BOSS_WAVE_TIMINGS[waveNumber] ?? FINAL_BOSS_TIME;
}

export function getEndlessBossWaveTime(waveNumber: number): number {
  if (waveNumber <= 0) {
    return 0;
  }

  return waveNumber * ENDLESS_BOSS_INTERVAL;
}

export function getRunDurationForBossWaves(bossWaves: number): number {
  return getBossWaveTime(Math.max(1, bossWaves));
}

export function getStageLabelForAppearAt(appearAt: number): string {
  if (appearAt <= 0) {
    return "00:00 - 04:00";
  }

  if (appearAt < STAGE_THREE_START_TIME) {
    return "04:00 - 07:00";
  }

  return "07:00 - 10:00";
}

export function getStageDescriptionForAppearAt(appearAt: number): string {
  if (appearAt <= 0) {
    return "基础敌群";
  }

  if (appearAt < STAGE_THREE_START_TIME) {
    return "中盘追加敌人";
  }

  return "后盘高压敌人";
}
