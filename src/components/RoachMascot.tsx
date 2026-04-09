interface RoachMascotProps {
  blink?: boolean;
  scale?: number;
}

export function RoachMascot({ blink = false, scale = 1 }: RoachMascotProps) {
  return (
    <g transform={`scale(${scale})`}>
      <ellipse cx="0" cy="60" rx="38" ry="12" fill="rgba(0, 0, 0, 0.16)" />

      <g fill="none" stroke="#171113" strokeWidth="4.5" strokeLinecap="round">
        <path d="M -10 -74 C -18 -110, -30 -130, -54 -146" />
        <path d="M 12 -74 C 20 -110, 32 -130, 56 -146" />
      </g>

      <g fill="none" stroke="#171113" strokeWidth="4.5" strokeLinecap="round">
        <path d="M -24 2 C -40 12, -47 28, -53 48" />
        <path d="M -20 20 C -34 34, -40 52, -42 72" />
        <path d="M 24 2 C 40 12, 47 28, 53 48" />
        <path d="M 20 20 C 34 34, 40 52, 42 72" />
      </g>

      <g>
        <ellipse cx="0" cy="8" rx="34" ry="48" fill="#2a1617" stroke="#171113" strokeWidth="4.5" />
        <ellipse cx="0" cy="8" rx="27" ry="42" fill="#462427" />
        <path d="M 0 -30 C 14 -18, 21 0, 18 24 C 16 42, 8 56, 0 66" fill="none" stroke="#171113" strokeWidth="4" strokeLinecap="round" />
        <path d="M 0 -30 C -14 -18, -21 0, -18 24 C -16 42, -8 56, 0 66" fill="none" stroke="#171113" strokeWidth="4" strokeLinecap="round" />
        <path
          d="M -22 -24 C -12 -20, -7 -6, -8 10 C -9 28, -14 42, -18 52"
          fill="none"
          stroke="#8f6555"
          strokeWidth="3.6"
          strokeLinecap="round"
        />
        <path
          d="M 22 -24 C 12 -20, 7 -6, 8 10 C 9 28, 14 42, 18 52"
          fill="none"
          stroke="#8f6555"
          strokeWidth="3.6"
          strokeLinecap="round"
        />
      </g>

      <g transform="translate(0 -50)">
        <circle r="36" fill="#f0b48a" stroke="#171113" strokeWidth="4.5" />
        <circle cx="-16" cy="10" r="5.5" fill="#ff9b8f" opacity="0.88" />
        <circle cx="16" cy="10" r="5.5" fill="#ff9b8f" opacity="0.88" />

        {blink ? (
          <g fill="none" stroke="#171113" strokeWidth="4" strokeLinecap="round">
            <path d="M -12 -2 H -4" />
            <path d="M 4 -2 H 12" />
          </g>
        ) : (
          <>
            <circle cx="-8" cy="-4" r="3.4" fill="#171113" />
            <circle cx="8" cy="-4" r="3.4" fill="#171113" />
          </>
        )}

        <path d="M -7 14 C -5 24, 5 24, 7 14" fill="none" stroke="#171113" strokeWidth="4" strokeLinecap="round" />
      </g>

      <g fill="none" stroke="#171113" strokeWidth="4.2" strokeLinecap="round">
        <path d="M -8 64 C -10 74, -12 80, -10 90" />
        <path d="M 8 64 C 10 74, 12 80, 10 90" />
      </g>

      <g fill="#fff4ef" stroke="#171113" strokeWidth="3.2">
        <path d="M -8 92 C -8 82, -2 80, 0 84 C 2 80, 8 82, 8 92 C 3 98, -3 98, -8 92" />
      </g>
    </g>
  );
}

export function RoachLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 240 260" aria-hidden="true">
      <defs>
        <radialGradient id="roachLogoGlow" cx="50%" cy="50%" r="60%">
          <stop offset="0%" stopColor="rgba(247, 226, 160, 0.9)" />
          <stop offset="100%" stopColor="rgba(247, 226, 160, 0)" />
        </radialGradient>
      </defs>
      <rect width="240" height="260" rx="54" fill="rgba(255, 255, 255, 0.03)" />
      <circle cx="120" cy="128" r="92" fill="url(#roachLogoGlow)" />
      <g transform="translate(120 138)">
        <RoachMascot scale={1.55} />
      </g>
    </svg>
  );
}
