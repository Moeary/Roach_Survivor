import type { PlayerSkinId } from "../../../game/types";

interface RoachMascotProps {
  blink?: boolean;
  scale?: number;
  showGroundShadow?: boolean;
  variant?: PlayerSkinId;
}

function ClassicRoachMascot({ blink, showGroundShadow }: { blink: boolean; showGroundShadow: boolean }) {
  return (
    <>
      {showGroundShadow ? <ellipse cx="0" cy="62" rx="34" ry="11" fill="rgba(0, 0, 0, 0.16)" /> : null}

      <g fill="none" stroke="#171113" strokeWidth="4.6" strokeLinecap="round">
        <path d="M -10 -74 C -12 -104, -24 -124, -46 -140" />
        <path d="M 10 -74 C 12 -104, 24 -124, 46 -140" />
      </g>

      <g>
        <ellipse cx="0" cy="6" rx="33" ry="47" fill="#2d171c" stroke="#171113" strokeWidth="4.5" />
        <ellipse cx="0" cy="6" rx="24" ry="39" fill="#5a3837" />
        <path
          d="M 0 -28 C 10 -18, 15 -3, 14 18 C 13 36, 8 50, 0 62 C -8 50, -13 36, -14 18 C -15 -3, -10 -18, 0 -28"
          fill="none"
          stroke="#9a6a60"
          strokeWidth="3.6"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </g>

      <g transform="translate(0 -50)">
        <circle r="35" fill="#f4b98f" stroke="#171113" strokeWidth="4.5" />
        <circle cx="-16" cy="10" r="5.3" fill="#ff9ca1" opacity="0.88" />
        <circle cx="16" cy="10" r="5.3" fill="#ff9ca1" opacity="0.88" />

        {blink ? (
          <g fill="none" stroke="#171113" strokeWidth="4" strokeLinecap="round">
            <path d="M -13 -3 H -4" />
            <path d="M 4 -3 H 13" />
          </g>
        ) : (
          <>
            <circle cx="-8" cy="-3" r="3.6" fill="#171113" />
            <circle cx="8" cy="-3" r="3.6" fill="#171113" />
          </>
        )}

        <path d="M -7 15 C -5 25, 5 25, 7 15" fill="none" stroke="#171113" strokeWidth="4.2" strokeLinecap="round" />
      </g>

      <g fill="none" stroke="#171113" strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M -18 -6 C -22 10, -22 24, -18 40" />
        <path d="M 18 -6 C 22 10, 22 24, 18 40" />
      </g>

      <g fill="none" stroke="#171113" strokeWidth="4.4" strokeLinecap="round" strokeLinejoin="round">
        <path d="M -8 50 C -10 66, -10 78, -7 92" />
        <path d="M 8 50 C 10 66, 10 78, 7 92" />
      </g>

      <g fill="#fff5ef" stroke="#171113" strokeWidth="3.2">
        <path d="M -10 94 C -8 86, -3 84, 0 88 C 3 84, 8 86, 10 94 C 4 99, -4 99, -10 94" />
      </g>
    </>
  );
}

function PickleReporterMascot({ blink, showGroundShadow }: { blink: boolean; showGroundShadow: boolean }) {
  return (
    <>
      {showGroundShadow ? <ellipse cx="0" cy="92" rx="54" ry="14" fill="rgba(0, 0, 0, 0.16)" /> : null}

      <g fill="none" stroke="#25211c" strokeWidth="4.8" strokeLinecap="round">
        <path d="M -12 -86 C -10 -114, -16 -138, -28 -150" />
        <path d="M 12 -86 C 10 -114, 16 -138, 28 -150" />
      </g>

      <g fill="none" stroke="#40342d" strokeWidth="8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M -28 -12 L -70 -38" />
        <path d="M -30 18 L -76 14" />
        <path d="M -24 44 L -66 76" />
        <path d="M 30 -12 L 78 -40" />
        <path d="M 34 22 L 84 24" />
        <path d="M 28 50 L 72 84" />
      </g>

      <g transform="translate(0 -6)">
        <path
          d="M -32 -88 C -32 -102, -20 -114, -6 -114 H 6 C 20 -114, 32 -102, 32 -88 V 50 C 32 66, 20 82, 0 100 C -20 82, -32 66, -32 50 Z"
          fill="#397145"
          stroke="#172018"
          strokeWidth="5"
        />
        <path d="M -24 -58 C -8 -74, 8 -74, 24 -58" fill="none" stroke="#bed9e3" strokeWidth="9" strokeLinecap="round" />
        {!blink ? (
          <>
            <circle cx="-10" cy="-40" r="8.6" fill="#f5f0d2" />
            <circle cx="12" cy="-38" r="7.8" fill="#f5f0d2" />
            <circle cx="-10" cy="-40" r="3.2" fill="#1a1513" />
            <circle cx="12" cy="-38" r="3" fill="#1a1513" />
          </>
        ) : null}
        <path
          d="M -15 -16 C -8 -8, 8 -8, 18 -18 C 20 -6, 18 8, 10 18 C -2 20, -14 14, -18 0"
          fill="#265831"
          opacity="0.28"
        />
        <path d="M -18 -6 C -8 6, 8 6, 20 -8" fill="none" stroke="#d8e1a8" strokeWidth="5.5" strokeLinecap="round" />
        {blink ? (
          <g fill="none" stroke="#1a1513" strokeWidth="4" strokeLinecap="round">
            <path d="M -18 -42 H -4" />
            <path d="M 4 -40 H 18" />
          </g>
        ) : null}
        <path d="M -10 22 C -2 30, 10 30, 18 20" fill="none" stroke="#efe7bd" strokeWidth="4.6" strokeLinecap="round" />
        <g fill="#f4edcf">
          <circle cx="-12" cy="2" r="2.4" />
          <circle cx="-3" cy="6" r="2.2" />
          <circle cx="6" cy="6" r="2.1" />
          <circle cx="14" cy="2" r="2.2" />
          <circle cx="-10" cy="12" r="2.1" />
          <circle cx="-1" cy="14" r="2.1" />
          <circle cx="8" cy="14" r="2" />
        </g>
      </g>

      <g fill="none" stroke="#d7d0b9" strokeWidth="7" strokeLinecap="round" strokeLinejoin="round">
        <path d="M -26 -20 L -48 -6" />
        <path d="M -22 6 L -54 20" />
        <path d="M -18 30 L -48 46" />
        <path d="M 26 -16 L 50 -4" />
        <path d="M 24 10 L 54 22" />
        <path d="M 18 34 L 46 50" />
      </g>

      <g transform="translate(-74 -12) rotate(-8)">
        <rect x="-18" y="-18" width="28" height="24" rx="4" fill="#26303b" stroke="#171113" strokeWidth="4" />
        <circle cx="-4" cy="-6" r="6" fill="#5f7388" />
      </g>

      <g transform="translate(74 -28) rotate(6)">
        <rect x="-20" y="-26" width="34" height="42" rx="4" fill="#2c343d" stroke="#171113" strokeWidth="4" />
        <circle cx="-2" cy="-8" r="10" fill="#212830" />
        <circle cx="-2" cy="-8" r="5" fill="#5a6f87" />
        <rect x="0" y="-38" width="6" height="16" rx="3" fill="#4d5560" />
      </g>

      <g transform="translate(0 74)" fill="none" strokeLinecap="round" strokeLinejoin="round">
        <path d="M -16 -10 L -34 18" stroke="#d68a68" strokeWidth="10" />
        <path d="M 12 -12 L 28 12" stroke="#7b6a62" strokeWidth="10" />
        <path d="M -34 18 L -34 56" stroke="#7e7d82" strokeWidth="8" />
        <path d="M 28 12 L 28 54" stroke="#cfc78f" strokeWidth="8" />
        <path d="M -46 60 C -38 48, -22 48, -16 60" stroke="#c6c8cf" strokeWidth="9" />
        <path d="M 12 58 C 20 48, 34 48, 42 58" stroke="#c5c8ce" strokeWidth="9" />
      </g>
    </>
  );
}

function LabVariantMascot({ blink, showGroundShadow, skinId }: { blink: boolean; showGroundShadow: boolean; skinId: PlayerSkinId }) {
  const isTerra = skinId === "terraChampion";
  const isGirl = skinId === "roachGirl";
  const isTwinTail = skinId === "cantonTwinTail";
  const isMantis = skinId === "americanMantis";
  const isMini = skinId === "northernMini";
  const isKnight = skinId === "sewerKnight";
  const isNeon = skinId === "neonScout";
  const shellFill = isTerra ? "#171514" : isGirl || isTwinTail ? "#3a211f" : isKnight ? "#59646c" : isNeon ? "#173939" : isMantis ? "#47321e" : "#6b4a31";
  const bellyFill = isTerra ? "#4b4039" : isGirl ? "#7d4b45" : isTwinTail ? "#663c52" : isKnight ? "#9aa5a8" : isNeon ? "#1e6560" : isMantis ? "#8a6a35" : "#a57a54";
  const faceFill = isTerra ? "#2f2924" : isGirl || isTwinTail ? "#f0b792" : isKnight ? "#d7ded8" : "#f2bf8e";
  const eyeFill = isTerra ? "#ff4b3f" : isNeon ? "#a8fff0" : "#171113";
  const accent = isTerra ? "#ff6048" : isGirl ? "#f1d8d8" : isTwinTail ? "#ff8bd5" : isKnight ? "#d9f1f0" : isNeon ? "#7dffe7" : isMantis ? "#c8ef70" : "#ffe18a";
  const scaleY = isMini ? 0.82 : isTerra ? 1.14 : 1;

  return (
    <g transform={`scale(${isMini ? 0.82 : 1} ${scaleY})`}>
      {showGroundShadow ? <ellipse cx="0" cy={isTerra ? 82 : 70} rx={isTerra ? 52 : 38} ry="12" fill="rgba(0, 0, 0, 0.18)" /> : null}

      {isGirl || isTwinTail ? (
        <g fill="none" stroke={isTwinTail ? "#25121c" : "#211513"} strokeWidth="13" strokeLinecap="round">
          <path d="M -20 -76 C -54 -96, -70 -60, -62 -18 C -58 18, -74 42, -92 64" />
          <path d="M 20 -76 C 54 -96, 70 -60, 62 -18 C 58 18, 74 42, 92 64" />
        </g>
      ) : null}

      <g fill="none" stroke={isTerra ? "#111" : "#171113"} strokeWidth={isTerra ? 8 : 4.8} strokeLinecap="round">
        <path d={isMantis ? "M -18 -76 C -36 -108, -66 -124, -104 -132" : "M -10 -74 C -14 -106, -28 -124, -48 -142"} />
        <path d={isMantis ? "M 18 -76 C 36 -108, 66 -124, 104 -132" : "M 10 -74 C 14 -106, 28 -124, 48 -142"} />
      </g>

      <g fill="none" stroke={isTerra ? "#191312" : isKnight ? "#3c4449" : "#171113"} strokeWidth={isTerra ? 10 : isMantis ? 7 : 5} strokeLinecap="round" strokeLinejoin="round">
        <path d={isMantis ? "M -30 -8 L -96 -52 L -124 -18" : "M -24 -2 L -62 -32"} />
        <path d={isMantis ? "M 30 -8 L 96 -52 L 124 -18" : "M 24 -2 L 62 -32"} />
        <path d="M -28 28 L -76 42" />
        <path d="M 28 28 L 76 42" />
      </g>

      <g>
        <ellipse cx="0" cy="12" rx={isTerra ? 42 : 34} ry={isTerra ? 58 : 48} fill={shellFill} stroke="#171113" strokeWidth={isTerra ? 5.8 : 4.5} />
        <ellipse cx="0" cy="12" rx={isTerra ? 28 : 24} ry={isTerra ? 46 : 39} fill={bellyFill} />
        <path d="M 0 -26 C 12 -10, 16 8, 14 30 C 12 48, 6 62, 0 74 C -6 62, -12 48, -14 30 C -16 8, -12 -10, 0 -26" fill="none" stroke={accent} strokeWidth={isTerra ? 4.8 : 3.8} strokeLinecap="round" strokeLinejoin="round" opacity="0.86" />
        {isKnight ? <path d="M -28 -2 H 28 M -24 22 H 24 M -18 46 H 18" stroke="#e7f2ed" strokeWidth="4" strokeLinecap="round" opacity="0.72" /> : null}
        {isNeon ? <circle r="44" fill="none" stroke="#7dffe7" strokeWidth="3" strokeDasharray="8 10" opacity="0.5" /> : null}
      </g>

      <g transform={`translate(0 ${isTerra ? -58 : -50})`}>
        <circle r={isTerra ? 34 : 35} fill={faceFill} stroke="#171113" strokeWidth="4.5" />
        {isTerra ? <path d="M -22 10 C -8 22, 10 22, 24 8" fill="none" stroke={accent} strokeWidth="5" strokeLinecap="round" /> : null}
        {isGirl ? <path d="M -30 -8 C -14 -28, 14 -28, 30 -8" fill="none" stroke="#211513" strokeWidth="12" strokeLinecap="round" /> : null}
        {isTwinTail ? <path d="M -32 -6 C -16 -30, 16 -30, 32 -6" fill="none" stroke="#2b1730" strokeWidth="12" strokeLinecap="round" /> : null}
        {blink ? (
          <g fill="none" stroke="#171113" strokeWidth="4" strokeLinecap="round">
            <path d="M -14 -4 H -4" />
            <path d="M 4 -4 H 14" />
          </g>
        ) : (
          <>
            <circle cx="-9" cy="-4" r={isTerra ? 4.8 : 3.7} fill={eyeFill} />
            <circle cx="9" cy="-4" r={isTerra ? 4.8 : 3.7} fill={eyeFill} />
          </>
        )}
        <path d={isTerra ? "M -10 17 C -3 12, 3 12, 10 17" : "M -7 15 C -5 25, 5 25, 7 15"} fill="none" stroke="#171113" strokeWidth="4.2" strokeLinecap="round" />
        {isTwinTail ? <g fill={accent}><circle cx="-27" cy="-4" r="5" /><circle cx="27" cy="-4" r="5" /></g> : null}
      </g>

      {isGirl ? (
        <path d="M -24 40 C -10 56, 10 56, 24 40 L 32 72 H -32 Z" fill="#e8e2dc" stroke="#171113" strokeWidth="4" strokeLinejoin="round" />
      ) : null}

      <g transform="translate(0 66)" fill="none" stroke={isTerra ? "#171113" : "#171113"} strokeWidth={isTerra ? 8 : 4.8} strokeLinecap="round" strokeLinejoin="round">
        <path d={isTerra ? "M -18 -8 L -34 44" : "M -10 -10 L -14 34"} />
        <path d={isTerra ? "M 18 -8 L 34 44" : "M 10 -10 L 14 34"} />
        {isMantis ? <path d="M -54 8 L -86 42 M 54 8 L 86 42" stroke="#c8ef70" strokeWidth="7" /> : null}
      </g>
    </g>
  );
}

export function RoachMascot({ blink = false, scale = 1, showGroundShadow = true, variant = "labStandard" }: RoachMascotProps) {
  return (
    <g transform={`scale(${scale})`}>
      {variant === "pickleReporter" ? (
        <PickleReporterMascot blink={blink} showGroundShadow={showGroundShadow} />
      ) : variant === "labStandard" ? (
        <ClassicRoachMascot blink={blink} showGroundShadow={showGroundShadow} />
      ) : (
        <LabVariantMascot blink={blink} showGroundShadow={showGroundShadow} skinId={variant} />
      )}
    </g>
  );
}

export function RoachShowcase({ className, skinId = "labStandard" }: { className?: string; skinId?: PlayerSkinId }) {
  const scale =
    skinId === "pickleReporter"
      ? 1.16
      : skinId === "terraChampion"
        ? 1.36
        : skinId === "roachGirl" || skinId === "cantonTwinTail"
          ? 1.34
          : skinId === "americanMantis"
            ? 1.18
            : skinId === "northernMini"
              ? 1.82
              : 1.5;

  return (
    <svg className={className} viewBox="0 0 280 340" aria-hidden="true">
      <rect x="18" y="16" width="244" height="308" rx="40" fill="rgba(255, 255, 255, 0.03)" stroke="rgba(214, 239, 109, 0.1)" />
      <g fill="none" stroke="rgba(214, 239, 109, 0.12)" strokeLinecap="round">
        <path d="M 44 52 H 86" />
        <path d="M 44 52 V 88" />
        <path d="M 194 52 H 236" />
        <path d="M 236 52 V 88" />
        <path d="M 44 286 H 86" />
        <path d="M 44 250 V 286" />
        <path d="M 194 286 H 236" />
        <path d="M 236 250 V 286" />
        <path d="M 92 286 H 188" opacity="0.44" />
      </g>
      <g transform={`translate(140 188)`}>
        <RoachMascot scale={scale} variant={skinId} />
      </g>
    </svg>
  );
}

export function RoachLogo({ className, skinId }: { className?: string; skinId?: PlayerSkinId }) {
  return <RoachShowcase className={className} skinId={skinId} />;
}
