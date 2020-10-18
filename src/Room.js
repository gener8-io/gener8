import React, { useMemo } from "react";
import Wall from "./Wall";

const WALL_THICKNESS = 2;

const Room = ({ label, coords }) => {
  const computeCentroid = () => {
    var first = coords[0],
      last = coords[coords.length - 1];
    if (first.x !== last.x || first.y !== last.y) coords.push(first);
    var twicearea = 0,
      x = 0,
      y = 0,
      nPts = coords.length,
      p1,
      p2,
      f;
    for (var i = 0, j = nPts - 1; i < nPts; j = i++) {
      p1 = coords[i];
      p2 = coords[j];
      f = p1.x * p2.y - p2.x * p1.y;
      twicearea += f;
      x += (p1.x + p2.x) * f;
      y += (p1.y + p2.y) * f;
    }
    f = twicearea * 3;
    return { x: x / f, y: y / f };
  };
  const walls = useMemo(
    () =>
      coords.map((_, i) => {
        const a = coords[i];
        const b = coords[(i + 1) % coords.length];
        return [a, b];
      }),
    [coords]
  );

  return (
    <g>
      {walls.map(([a, b]) => (
        <Wall
          key={`wall-${a.x},${a.y}-${b.x},${b.y}`}
          corner1={a}
          corner2={b}
          thickness={WALL_THICKNESS}
        />
      ))}
      <text x={computeCentroid().x} y={computeCentroid().y} fill="#722ed1" fontSize="6">
        {label}
      </text>
    </g>
  );
};

export default Room;
