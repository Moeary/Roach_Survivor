import type { Decoration, GameState } from "../../../game/types";

function toFixed(value: number): number {
  return Number(value.toFixed(1));
}

export default function MapBackdrop({
  camera,
  decorations,
  map,
}: {
  camera: { x: number; y: number };
  decorations: Decoration[];
  map: GameState["map"];
}) {
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
