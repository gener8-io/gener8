import React, { useMemo } from "react";
import Wall from "./Wall";

const WALL_THICKNESS = 10;

const Room = ({ label, coords }) => {
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
      <text
        x={coords[0].x + 60}
        y={coords[0].y + 60}
        fill="#722ed1"
        fontSize="40"
      >
        {label}
      </text>
    </g>
  );
};

export default Room;
