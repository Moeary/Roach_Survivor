interface RoachMascotProps {
  blink?: boolean;
  scale?: number;
}

export function RoachMascot({ blink = false, scale = 1 }: RoachMascotProps) {
  return (
    <g transform={`scale(${scale})`}>
      <ellipse cx="0" cy="62" rx="34" ry="11" fill="rgba(0, 0, 0, 0.16)" />

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
    </g>
  );
}

export function RoachLogo({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 240 320" aria-hidden="true">
      <defs>
        <radialGradient id="roachLogoGlow" cx="50%" cy="46%" r="60%">
          <stop offset="0%" stopColor="rgba(247, 226, 160, 0.82)" />
          <stop offset="100%" stopColor="rgba(247, 226, 160, 0)" />
        </radialGradient>
      </defs>
      <rect width="240" height="320" rx="54" fill="rgba(255, 255, 255, 0.03)" />
      <circle cx="120" cy="136" r="98" fill="url(#roachLogoGlow)" />
      <g transform="translate(120 154)">
        <RoachMascot scale={1.62} />
      </g>
    </svg>
  );
}
