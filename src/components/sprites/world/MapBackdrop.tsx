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
  const brickSpacing = 110;
  const laneStart = Math.floor(top / laneSpacing) - 2;
  const laneCount = Math.ceil(map.height / laneSpacing) + 4;
  const gutterStart = Math.floor(left / gutterSpacing) - 2;
  const gutterCount = Math.ceil(map.width / gutterSpacing) + 4;
  const brickStart = Math.floor(left / brickSpacing) - 2;
  const brickCount = Math.ceil(map.width / brickSpacing) + 4;

  const laneMarkup = Array.from({ length: laneCount }, (_, index) => {
    const row = laneStart + index;
    const y = row * laneSpacing + 140;
    return (
      <path
        key={"lane-" + row}
        d={`M ${left - 220} ${y} C ${left + map.width * 0.24} ${y + 28}, ${left + map.width * 0.62} ${y - 42}, ${right + 220} ${y + 20}`}
        stroke="rgba(96, 129, 119, 0.14)"
        strokeWidth="16"
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
        stroke="rgba(123, 88, 55, 0.15)"
        strokeWidth="18"
        fill="none"
      />
    );
  });

  const brickMarkup = Array.from({ length: brickCount }, (_, index) => {
    const column = brickStart + index;
    const x = column * brickSpacing + (Math.abs(column) % 2) * 42;
    return (
      <path
        key={"brick-" + column}
        d={`M ${x} ${top - 120} V ${bottom + 120}`}
        stroke="rgba(184, 164, 132, 0.045)"
        strokeWidth="3"
        strokeDasharray="44 34"
      />
    );
  });

  return (
    <>
      <rect x={left} y={top} width={map.width} height={map.height} fill="url(#floorGradient)" />
      <rect x={left} y={top} width={map.width} height={map.height} fill="url(#sewerBrick)" opacity="0.64" />
      <rect x={left} y={top} width={map.width} height={map.height} fill="url(#sewerGrid)" opacity="0.74" />
      <rect x={left} y={top} width={map.width} height={map.height} fill="url(#sewerScratches)" opacity="0.18" />
      {brickMarkup}
      {laneMarkup}
      {gutterMarkup}
      {decorations.map((prop) => {
        if (prop.type === "shallowWater" || prop.type === "puddle") {
          return (
            <g key={prop.id} transform={`translate(${toFixed(prop.x)} ${toFixed(prop.y)}) rotate(${toFixed(prop.rotation)}) scale(${toFixed(prop.scale)})`}>
              <ellipse rx="78" ry="40" fill="rgba(39, 117, 116, 0.32)" stroke="rgba(133, 188, 175, 0.18)" strokeWidth="4" />
              <ellipse rx="86" ry="47" fill="none" stroke="rgba(95, 206, 255, 0.74)" strokeWidth="4" strokeDasharray="14 10" />
              <ellipse rx="52" ry="22" fill="rgba(118, 169, 139, 0.16)" />
              <path d="M -54 -4 C -24 -18, 20 -14, 52 2 M -38 15 C -8 4, 26 10, 42 20" stroke="rgba(206, 220, 170, 0.24)" strokeWidth="4" strokeLinecap="round" fill="none" />
            </g>
          );
        }

        if (prop.type === "crumb") {
          return (
            <g key={prop.id} transform={`translate(${toFixed(prop.x)} ${toFixed(prop.y)}) rotate(${toFixed(prop.rotation)}) scale(${toFixed(prop.scale)})`}>
              <polygon points="-20,-8 14,-15 25,2 4,17 -26,6" fill="#826542" />
              <polygon points="-8,-1 9,-7 12,3 -1,9" fill="#caa66d" opacity="0.72" />
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
            <ellipse rx="52" ry="22" fill="rgba(91, 48, 27, 0.3)" />
            <ellipse rx="28" ry="10" fill="rgba(154, 101, 63, 0.2)" />
          </g>
        );
      })}
    </>
  );
}
