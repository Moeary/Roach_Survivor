export default function WorldDefs() {
  return (
    <defs>
      <linearGradient id="floorGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#202a25" />
        <stop offset="42%" stopColor="#17211d" />
        <stop offset="100%" stopColor="#0d1513" />
      </linearGradient>

      <pattern id="sewerGrid" width="180" height="180" patternUnits="userSpaceOnUse">
        <rect width="180" height="180" fill="transparent" />
        <path d="M 0 48 H 180" stroke="rgba(178, 164, 119, 0.07)" strokeWidth="3" />
        <path d="M 0 132 H 180" stroke="rgba(178, 164, 119, 0.052)" strokeWidth="2" />
        <path d="M 48 0 V 180" stroke="rgba(95, 129, 119, 0.052)" strokeWidth="2" />
        <path d="M 132 0 V 180" stroke="rgba(95, 129, 119, 0.044)" strokeWidth="2" />
      </pattern>

      <pattern id="sewerBrick" width="220" height="110" patternUnits="userSpaceOnUse">
        <rect width="220" height="110" fill="transparent" />
        <path d="M 0 0 H 220 M 0 55 H 220 M 0 110 H 220" stroke="rgba(193, 174, 137, 0.04)" strokeWidth="3" />
        <path d="M 55 0 V 55 M 165 0 V 55 M 0 55 V 110 M 110 55 V 110 M 220 55 V 110" stroke="rgba(193, 174, 137, 0.034)" strokeWidth="3" />
      </pattern>

      <pattern id="sewerScratches" width="280" height="280" patternUnits="userSpaceOnUse">
        <path d="M 12 240 L 92 168 M 138 40 L 200 0 M 192 220 L 264 156" stroke="rgba(255, 255, 255, 0.04)" strokeWidth="3" strokeLinecap="round" />
        <path d="M 18 68 L 54 42 M 172 120 L 236 82" stroke="rgba(214, 239, 109, 0.04)" strokeWidth="2" strokeLinecap="round" />
      </pattern>

      <linearGradient id="eggcaseGradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#1b0608" />
        <stop offset="48%" stopColor="#5a1119" />
        <stop offset="100%" stopColor="#9b2a2b" />
      </linearGradient>

      <radialGradient id="slimeGlow" cx="50%" cy="50%" r="60%">
        <stop offset="0%" stopColor="rgba(198, 255, 92, 0.9)" />
        <stop offset="100%" stopColor="rgba(198, 255, 92, 0)" />
      </radialGradient>

      <filter id="softGlow" x="-30%" y="-30%" width="160%" height="160%">
        <feGaussianBlur stdDeviation="6" />
      </filter>
    </defs>
  );
}
