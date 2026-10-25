export interface Waypoint {
  x: number; // percentage (0-100)
  y: number; // percentage (0-100)
}

export const MAX_STEPS = 10;

// 8 Zigzag navigation tracks spanning from left to right across the world map
// Supports 2–8 teams dynamically
export const TRACK_WAYPOINTS: Waypoint[][] = [
  // Đội 1: Đường Bắc Hải (North Route) — y≈16
  [
    { x: 5, y: 16 },
    { x: 14, y: 12 },
    { x: 23, y: 19 },
    { x: 33, y: 13 },
    { x: 43, y: 20 },
    { x: 53, y: 14 },
    { x: 63, y: 21 },
    { x: 72, y: 15 },
    { x: 81, y: 21 },
    { x: 89, y: 16 },
    { x: 96, y: 18 },
  ],
  // Đội 2: Đường Nhiệt Đới (Tropical Route) — y≈32
  [
    { x: 5, y: 32 },
    { x: 13, y: 36 },
    { x: 22, y: 29 },
    { x: 32, y: 35 },
    { x: 42, y: 30 },
    { x: 52, y: 37 },
    { x: 62, y: 31 },
    { x: 71, y: 37 },
    { x: 80, y: 32 },
    { x: 89, y: 36 },
    { x: 96, y: 34 },
  ],
  // Đội 3: Đường Xích Đạo (Equatorial Route) — y≈50
  [
    { x: 5, y: 50 },
    { x: 14, y: 46 },
    { x: 23, y: 53 },
    { x: 33, y: 47 },
    { x: 43, y: 54 },
    { x: 53, y: 48 },
    { x: 63, y: 55 },
    { x: 72, y: 49 },
    { x: 81, y: 54 },
    { x: 89, y: 49 },
    { x: 96, y: 51 },
  ],
  // Đội 4: Đường Nam Hải (South Oceanic Route) — y≈67
  [
    { x: 5, y: 67 },
    { x: 14, y: 72 },
    { x: 23, y: 65 },
    { x: 33, y: 71 },
    { x: 42, y: 66 },
    { x: 52, y: 72 },
    { x: 62, y: 66 },
    { x: 71, y: 72 },
    { x: 81, y: 67 },
    { x: 89, y: 71 },
    { x: 96, y: 68 },
  ],
  // Đội 5: Đường Băng Nam Cực (Antarctic Edge Route) — y≈84
  [
    { x: 5, y: 84 },
    { x: 13, y: 88 },
    { x: 22, y: 81 },
    { x: 32, y: 87 },
    { x: 42, y: 82 },
    { x: 52, y: 88 },
    { x: 62, y: 83 },
    { x: 72, y: 88 },
    { x: 81, y: 83 },
    { x: 89, y: 87 },
    { x: 96, y: 85 },
  ],
  // Đội 6: Đường Bắc Gió (Northern Wind Route) — y≈24
  [
    { x: 5, y: 24 },
    { x: 14, y: 20 },
    { x: 23, y: 27 },
    { x: 33, y: 21 },
    { x: 43, y: 28 },
    { x: 53, y: 22 },
    { x: 63, y: 29 },
    { x: 72, y: 23 },
    { x: 81, y: 28 },
    { x: 89, y: 23 },
    { x: 96, y: 25 },
  ],
  // Đội 7: Đường Gió Mùa (Monsoon Route) — y≈40
  [
    { x: 5, y: 40 },
    { x: 13, y: 44 },
    { x: 22, y: 37 },
    { x: 32, y: 43 },
    { x: 42, y: 38 },
    { x: 52, y: 45 },
    { x: 62, y: 39 },
    { x: 71, y: 44 },
    { x: 80, y: 39 },
    { x: 89, y: 43 },
    { x: 96, y: 41 },
  ],
  // Đội 8: Đường Hải Lưu Ấm (Warm Current Route) — y≈60
  [
    { x: 5, y: 60 },
    { x: 14, y: 56 },
    { x: 23, y: 63 },
    { x: 33, y: 57 },
    { x: 43, y: 64 },
    { x: 53, y: 58 },
    { x: 63, y: 65 },
    { x: 72, y: 59 },
    { x: 81, y: 64 },
    { x: 89, y: 59 },
    { x: 96, y: 61 },
  ],
];

// Helper to generate SVG path string for smooth zigzag line
export function getSvgPath(points: Waypoint[]): string {
  if (points.length === 0) return '';
  return points.reduce((acc, pt, index) => {
    if (index === 0) return `M ${pt.x} ${pt.y}`;
    // Bezier curve approximation
    const prev = points[index - 1];
    const midX = (prev.x + pt.x) / 2;
    return `${acc} C ${midX} ${prev.y}, ${midX} ${pt.y}, ${pt.x} ${pt.y}`;
  }, '');
}
