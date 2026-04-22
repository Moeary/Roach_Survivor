import type React from "react";
import type { AchievementId, RelicId, UpgradeId } from "../game/types";

type IconTone = "lime" | "amber" | "red" | "cyan" | "violet" | "green";

const TONE_COLORS: Record<IconTone, { fill: string; stroke: string; glow: string }> = {
  lime: { fill: "#d7f06d", stroke: "#f4ffd0", glow: "rgba(215, 240, 109, 0.26)" },
  amber: { fill: "#ffbd5f", stroke: "#ffe0a4", glow: "rgba(255, 189, 95, 0.25)" },
  red: { fill: "#ff6f5f", stroke: "#ffd0ca", glow: "rgba(255, 111, 95, 0.25)" },
  cyan: { fill: "#7ed7ff", stroke: "#d6f4ff", glow: "rgba(126, 215, 255, 0.22)" },
  violet: { fill: "#b896ff", stroke: "#eadfff", glow: "rgba(184, 150, 255, 0.24)" },
  green: { fill: "#8dff8d", stroke: "#d9ffd9", glow: "rgba(141, 255, 141, 0.22)" },
};

interface IconProps<TId extends string> {
  id: TId;
  className?: string;
  locked?: boolean;
  title?: string;
}

function IconShell({
  children,
  className = "",
  locked = false,
  title,
  tone,
}: {
  children: React.ReactNode;
  className?: string;
  locked?: boolean;
  title?: string;
  tone: IconTone;
}) {
  const colors = TONE_COLORS[tone];

  return (
    <svg
      aria-hidden={title ? undefined : true}
      aria-label={title}
      className={`game-icon ${className} ${locked ? "game-icon-locked" : ""}`}
      role={title ? "img" : undefined}
      viewBox="0 0 64 64"
    >
      <rect x="5" y="5" width="54" height="54" rx="10" fill="#151a16" stroke="rgba(244, 241, 220, 0.2)" strokeWidth="3" />
      <circle cx="32" cy="32" r="21" fill={colors.glow} />
      <g fill={colors.fill} stroke={colors.stroke} strokeLinecap="round" strokeLinejoin="round" strokeWidth="3.6">
        {children}
      </g>
    </svg>
  );
}

function getUpgradeTone(id: UpgradeId): IconTone {
  if (id === "damage" || id === "burstShell" || id === "corrosiveGland") {
    return "red";
  }

  if (id === "lightningStrike" || id === "frostEgg") {
    return "cyan";
  }

  if (id === "autoTurret" || id === "orbitals" || id === "pierce" || id === "volley") {
    return "amber";
  }

  return "lime";
}

export function UpgradeIcon({ id, className, locked, title }: IconProps<UpgradeId>) {
  return (
    <IconShell className={className} locked={locked} title={title} tone={getUpgradeTone(id)}>
      {id === "damage" ? (
        <>
          <path d="M21 43 C18 34 20 23 31 16 C43 22 47 34 40 46 C33 48 26 47 21 43 Z" />
          <path d="M26 31 L39 25" fill="none" />
          <path d="M25 39 L43 35" fill="none" />
        </>
      ) : null}
      {id === "attackSpeed" ? (
        <>
          <path d="M20 43 L32 17 L44 43 Z" />
          <path d="M17 23 H27 M13 33 H25 M40 23 H50 M39 33 H53" fill="none" />
        </>
      ) : null}
      {id === "volley" ? (
        <>
          <circle cx="23" cy="34" r="7" />
          <circle cx="32" cy="24" r="7" />
          <circle cx="41" cy="34" r="7" />
          <path d="M22 47 C28 42 36 42 42 47" fill="none" />
        </>
      ) : null}
      {id === "pierce" ? (
        <>
          <path d="M15 35 H43" fill="none" />
          <path d="M38 23 L50 35 L38 47 Z" />
          <path d="M24 22 L31 29 M22 46 L30 38" fill="none" />
        </>
      ) : null}
      {id === "moveSpeed" ? (
        <>
          <path d="M23 42 C28 28 34 21 43 17 C41 29 35 38 23 42 Z" />
          <path d="M19 48 C27 42 34 35 43 20" fill="none" />
          <path d="M13 25 H24 M10 35 H22" fill="none" />
        </>
      ) : null}
      {id === "pickupRadius" ? (
        <>
          <circle cx="32" cy="32" r="6" />
          <circle cx="32" cy="32" r="16" fill="none" />
          <path d="M15 16 L23 24 M49 16 L41 24 M15 48 L23 40 M49 48 L41 40" fill="none" />
        </>
      ) : null}
      {id === "autoTurret" ? (
        <>
          <path d="M22 43 V30 L34 23 L45 29 V43 Z" />
          <path d="M34 24 V15 H48" fill="none" />
          <path d="M19 47 H48" fill="none" />
        </>
      ) : null}
      {id === "orbitals" ? (
        <>
          <circle cx="32" cy="32" r="7" />
          <ellipse cx="32" cy="32" rx="22" ry="12" fill="none" />
          <circle cx="12" cy="31" r="4" />
          <circle cx="52" cy="33" r="4" />
        </>
      ) : null}
      {id === "lightningStrike" ? (
        <path d="M37 12 L20 35 H31 L26 52 L45 27 H34 Z" />
      ) : null}
      {id === "burstShell" ? (
        <>
          <path d="M32 14 L36 27 L50 24 L40 34 L49 47 L34 41 L25 53 L26 38 L12 35 L26 29 Z" />
          <circle cx="32" cy="33" r="5" />
        </>
      ) : null}
      {id === "frostEgg" ? (
        <>
          <path d="M32 13 V51 M15 23 L49 41 M49 23 L15 41" fill="none" />
          <path d="M25 18 L32 25 L39 18 M25 46 L32 39 L39 46" fill="none" />
        </>
      ) : null}
      {id === "corrosiveGland" ? (
        <>
          <path d="M32 13 C43 26 48 34 48 42 C48 50 41 55 32 55 C23 55 16 50 16 42 C16 34 21 26 32 13 Z" />
          <path d="M24 39 C28 43 35 44 41 38" fill="none" />
        </>
      ) : null}
    </IconShell>
  );
}

function getRelicTone(id: RelicId): IconTone {
  if (id === "bloodthirst" || id === "thickSkin" || id === "stressDodge") {
    return "cyan";
  }

  if (id === "speedPheromone" || id === "doubleHatch" || id === "magnetTendril") {
    return "green";
  }

  if (id === "glassCannon" || id === "deathRage") {
    return "violet";
  }

  return "amber";
}

export function RelicIcon({ id, className, locked, title }: IconProps<RelicId>) {
  return (
    <IconShell className={className} locked={locked} title={title} tone={getRelicTone(id)}>
      {id === "ricochet" ? (
        <>
          <path d="M19 42 C34 43 46 34 44 22" fill="none" />
          <path d="M45 22 L35 24 L42 14 Z" />
          <circle cx="20" cy="42" r="5" />
        </>
      ) : null}
      {id === "critGland" ? (
        <>
          <path d="M32 13 L37 26 L51 27 L40 36 L43 50 L32 42 L21 50 L24 36 L13 27 L27 26 Z" />
          <path d="M32 23 V36" fill="none" />
        </>
      ) : null}
      {id === "chainSpore" ? (
        <>
          <circle cx="20" cy="24" r="7" />
          <circle cx="42" cy="22" r="7" />
          <circle cx="33" cy="44" r="7" />
          <path d="M26 24 H36 M39 29 L35 38 M25 30 L30 39" fill="none" />
        </>
      ) : null}
      {id === "frenzyGland" ? (
        <>
          <path d="M20 48 C15 34 20 19 33 13 C29 25 40 26 41 40 C42 47 36 52 29 52" />
          <path d="M35 23 C47 29 51 39 44 49" fill="none" />
        </>
      ) : null}
      {id === "bloodthirst" ? (
        <>
          <path d="M32 13 C43 27 47 35 47 43 C47 51 40 55 32 55 C24 55 17 51 17 43 C17 35 21 27 32 13 Z" />
          <path d="M25 39 H39 M32 32 V46" fill="none" />
        </>
      ) : null}
      {id === "thickSkin" ? (
        <>
          <path d="M32 12 L49 20 V32 C49 43 42 51 32 55 C22 51 15 43 15 32 V20 Z" />
          <path d="M24 31 H40 M24 40 H40" fill="none" />
        </>
      ) : null}
      {id === "stressDodge" ? (
        <>
          <path d="M19 46 C27 29 38 21 50 18 C47 31 39 43 19 46 Z" />
          <path d="M16 23 C25 20 31 17 37 12" fill="none" />
        </>
      ) : null}
      {id === "magnetTendril" ? (
        <>
          <path d="M20 18 V34 C20 43 25 49 32 49 C39 49 44 43 44 34 V18" fill="none" />
          <path d="M20 18 H29 M35 18 H44" fill="none" />
        </>
      ) : null}
      {id === "speedPheromone" ? (
        <>
          <path d="M18 41 C29 29 38 23 49 19" fill="none" />
          <path d="M40 17 L50 19 L44 28 Z" />
          <path d="M14 24 H25 M11 34 H23" fill="none" />
        </>
      ) : null}
      {id === "doubleHatch" ? (
        <>
          <ellipse cx="25" cy="34" rx="10" ry="16" />
          <ellipse cx="40" cy="34" rx="10" ry="16" />
          <path d="M22 31 L28 37 M37 31 L43 37" fill="none" />
        </>
      ) : null}
      {id === "glassCannon" ? (
        <>
          <path d="M18 46 L32 14 L46 46 Z" />
          <path d="M32 14 V46 M23 35 H41" fill="none" />
        </>
      ) : null}
      {id === "deathRage" ? (
        <>
          <path d="M20 46 C16 32 22 18 32 13 C42 18 48 32 44 46 C39 52 25 52 20 46 Z" />
          <path d="M25 34 H39 M27 25 L24 29 M37 25 L40 29" fill="none" />
        </>
      ) : null}
    </IconShell>
  );
}

function getAchievementTone(id: AchievementId): IconTone {
  if (id.startsWith("hard")) {
    return "red";
  }

  if (id === "normalClear" || id === "twoBosses" || id === "relicCollector" || id === "mutationStack") {
    return "amber";
  }

  if (id === "bossHunter" || id === "lowDamageHard") {
    return "violet";
  }

  return "lime";
}

export function AchievementIcon({ id, className, locked, title }: IconProps<AchievementId>) {
  return (
    <IconShell className={className} locked={locked} title={title} tone={getAchievementTone(id)}>
      {id === "firstMolting" ? (
        <>
          <path d="M20 45 C18 32 22 21 32 15 C42 21 46 32 44 45 C38 50 26 50 20 45 Z" />
          <path d="M25 29 L39 25 M24 38 H40" fill="none" />
        </>
      ) : null}
      {id === "hundredKills" ? (
        <>
          <circle cx="32" cy="32" r="18" fill="none" />
          <circle cx="32" cy="32" r="7" />
          <path d="M32 10 V20 M32 44 V54 M10 32 H20 M44 32 H54" fill="none" />
        </>
      ) : null}
      {id === "firstClear" ? (
        <>
          <path d="M21 51 V15" fill="none" />
          <path d="M22 16 H46 L39 27 L46 38 H22 Z" />
        </>
      ) : null}
      {id === "eggPocket" ? (
        <>
          <path d="M18 28 H46 L42 50 H22 Z" />
          <ellipse cx="32" cy="28" rx="11" ry="14" />
        </>
      ) : null}
      {id === "normalClear" ? (
        <path d="M17 33 L27 44 L48 19" fill="none" />
      ) : null}
      {id === "twoBosses" ? (
        <>
          <path d="M18 44 L22 24 L32 36 L42 24 L46 44 Z" />
          <path d="M23 49 H41" fill="none" />
        </>
      ) : null}
      {id === "relicCollector" ? (
        <path d="M32 12 L49 27 L41 51 H23 L15 27 Z" />
      ) : null}
      {id === "mutationStack" ? (
        <>
          <rect x="18" y="36" width="28" height="10" rx="3" />
          <rect x="21" y="25" width="22" height="10" rx="3" />
          <rect x="24" y="14" width="16" height="10" rx="3" />
        </>
      ) : null}
      {id === "hardClear" ? (
        <>
          <path d="M21 47 C17 34 21 22 32 13 C30 25 42 26 43 39 C44 47 38 52 31 52" />
          <path d="M35 24 C45 30 48 40 42 49" fill="none" />
        </>
      ) : null}
      {id === "hardCollector" ? (
        <>
          <path d="M19 28 H45 L42 50 H22 Z" />
          <path d="M24 28 C25 17 39 17 40 28" fill="none" />
          <circle cx="32" cy="39" r="5" />
        </>
      ) : null}
      {id === "lowDamageHard" ? (
        <>
          <path d="M32 12 L49 20 V32 C49 43 42 51 32 55 C22 51 15 43 15 32 V20 Z" />
          <path d="M23 34 L30 41 L42 25" fill="none" />
        </>
      ) : null}
      {id === "bossHunter" ? (
        <>
          <circle cx="32" cy="35" r="15" />
          <path d="M22 18 L28 25 M42 18 L36 25 M26 35 H26.5 M38 35 H38.5 M27 44 H37" fill="none" />
        </>
      ) : null}
      {id === "hardFlawless" ? (
        <path d="M32 12 L37 26 L52 26 L40 35 L45 50 L32 41 L19 50 L24 35 L12 26 L27 26 Z" />
      ) : null}
      {id === "hardStillness" ? (
        <>
          <path d="M32 14 V48" fill="none" />
          <circle cx="32" cy="20" r="6" />
          <path d="M19 48 H45 M22 37 C26 42 38 42 42 37" fill="none" />
        </>
      ) : null}
      {id === "hardNoMeta" ? (
        <>
          <circle cx="32" cy="32" r="18" fill="none" />
          <path d="M20 44 L44 20" fill="none" />
        </>
      ) : null}
      {id === "hardOverkill" ? (
        <>
          <path d="M32 12 L36 27 L51 22 L41 35 L52 45 L37 42 L32 55 L27 42 L12 45 L23 35 L13 22 L28 27 Z" />
          <circle cx="32" cy="34" r="5" />
        </>
      ) : null}
    </IconShell>
  );
}
