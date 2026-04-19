import type { GameState, RelicChoice, RelicId } from "./types";

export interface RelicDefinition {
  id: RelicId;
  name: string;
  description: string;
  category: "offensive" | "defensive" | "utility" | "risk";
  onAcquire?: (state: GameState) => void;
}

export const RELIC_DEFS: RelicDefinition[] = [
  {
    id: "ricochet",
    name: "弹射外壳",
    description: "弹丸击杀敌人后弹向最近目标，额外穿透 1 次。",
    category: "offensive",
  },
  {
    id: "critGland",
    name: "暴击腺体",
    description: "弹丸命中时有 15% 概率造成 3 倍伤害。",
    category: "offensive",
  },
  {
    id: "chainSpore",
    name: "连锁孢子",
    description: "击杀敌人时向周围最近 3 个敌人释放孢子，各造成 40% 攻击力伤害。",
    category: "offensive",
  },
  {
    id: "frenzyGland",
    name: "狂暴分泌",
    description: "周围每有 1 个敌人，攻速提升 3%（上限 30%）。",
    category: "offensive",
  },
  {
    id: "bloodthirst",
    name: "噬血本能",
    description: "每击杀 1 个敌人回复 3 点生命值。",
    category: "defensive",
  },
  {
    id: "thickSkin",
    name: "硬皮角质",
    description: "所有受到的伤害 -4（最低 1）。",
    category: "defensive",
  },
  {
    id: "stressDodge",
    name: "应激闪避",
    description: "受到伤害时有 12% 概率完全免疫。",
    category: "defensive",
  },
  {
    id: "magnetTendril",
    name: "磁力触须",
    description: "全屏自动吸取经验球。",
    category: "utility",
  },
  {
    id: "speedPheromone",
    name: "加速信息素",
    description: "击杀敌人后获得 3 秒 +25% 移速加成。",
    category: "utility",
  },
  {
    id: "doubleHatch",
    name: "双倍孵化",
    description: "所有经验获取量 +50%。",
    category: "utility",
  },
  {
    id: "glassCannon",
    name: "玻璃大炮",
    description: "伤害 +40%，最大生命 -30%。",
    category: "risk",
    onAcquire(state) {
      state.player.stats.projectileDamage *= 1.4;
      state.player.stats.autoTurretDamage *= 1.4;
      state.player.maxHp = Math.round(state.player.maxHp * 0.7);
      state.player.hp = Math.min(state.player.hp, state.player.maxHp);
    },
  },
  {
    id: "deathRage",
    name: "濒死狂怒",
    description: "生命越低伤害越高：每缺失 1% 生命 → 伤害 +1%。",
    category: "risk",
  },
];

const RELIC_MAP = new Map<RelicId, RelicDefinition>(RELIC_DEFS.map((r) => [r.id, r]));

export function getRelicDef(id: RelicId): RelicDefinition | undefined {
  return RELIC_MAP.get(id);
}

function shuffle<T>(input: T[]): T[] {
  const array = input.slice();

  for (let i = array.length - 1; i > 0; i -= 1) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = array[i];
    array[i] = array[j]!;
    array[j] = temp!;
  }

  return array;
}

export function pickRelicChoices(state: GameState, count: number): RelicChoice[] {
  const available = RELIC_DEFS.filter((r) => !state.relics.includes(r.id));

  return shuffle(available)
    .slice(0, Math.min(count, available.length))
    .map((r) => ({
      id: r.id,
      name: r.name,
      description: r.description,
      category: r.category,
    }));
}

export const RELIC_MILESTONE_INTERVAL = 5;
