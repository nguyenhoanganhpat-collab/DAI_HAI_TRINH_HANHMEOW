import React from 'react';
import { Team } from '../types';
import { TRACK_WAYPOINTS, getSvgPath, MAX_STEPS } from '../data/tracks';

interface Props {
  teams: Team[];
  activeTeamIndex: number;
  onSelectTeamPosition?: (teamIndex: number, newPosition: number) => void;
}

export const GameBoard: React.FC<Props> = ({
  teams,
  activeTeamIndex,
  onSelectTeamPosition,
}) => {
  return (
    <div className="relative w-full h-24 sm:h-28 md:h-32 lg:h-36 rounded-xl overflow-hidden border-2 border-amber-800/80 shadow-[0_8px_25px_rgba(0,0,0,0.6)] bg-stone-900 wood-frame select-none">
      {/* Background Vintage World Map Image */}
      <img
        src="/world_map.png"
        onError={(e) => {
          const target = e.currentTarget;
          if (!target.src.includes('world_map.jpg')) {
            target.src = '/world_map.jpg';
          }
        }}
        alt="Bản đồ thế giới cổ Đại Hải Trình"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover filter sepia-[0.35] contrast-115 brightness-95 opacity-85 pointer-events-none"
      />

      {/* Parchment Warm Vignette Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-amber-950/40 via-transparent to-amber-950/40 pointer-events-none" />
      <div className="absolute inset-0 pointer-events-none shadow-[inset_0_0_50px_rgba(43,26,12,0.8)]" />

      {/* SVG Layer for 5 Zigzag Navigation Roadtracks */}
      <svg 
        className="absolute inset-0 w-full h-full pointer-events-none" 
        viewBox="0 0 100 100" 
        preserveAspectRatio="none"
      >
        {teams.map((team, idx) => {
          const waypoints = TRACK_WAYPOINTS[idx] || [];
          const pathD = getSvgPath(waypoints);
          const isActive = idx === activeTeamIndex;

          return (
            <g key={`track-${team.id}`}>
              {/* Outer shadow line */}
              <path
                d={pathD}
                fill="none"
                stroke="#1c1917"
                strokeWidth={isActive ? "2.6" : "1.6"}
                strokeOpacity="0.7"
                strokeLinecap="round"
              />
              {/* Colored maritime route line */}
              <path
                d={pathD}
                fill="none"
                stroke={team.color}
                strokeWidth={isActive ? "1.8" : "1.0"}
                strokeDasharray={isActive ? "2, 1" : "1.5, 1.5"}
                strokeOpacity={isActive ? "1" : "0.6"}
                strokeLinecap="round"
              />
            </g>
          );
        })}
      </svg>

      {/* Waypoint Nodes along the 5 Tracks */}
      <div className="absolute inset-0 pointer-events-auto">
        {teams.map((team, tIdx) => {
          const waypoints = TRACK_WAYPOINTS[tIdx] || [];
          return waypoints.map((pt, stepIdx) => {
            const isDestination = stepIdx === MAX_STEPS;
            const isStart = stepIdx === 0;
            const isCurrentPos = team.position === stepIdx;

            return (
              <div
                key={`wp-${tIdx}-${stepIdx}`}
                onClick={() => onSelectTeamPosition && onSelectTeamPosition(tIdx, stepIdx)}
                className={`absolute -translate-x-1/2 -translate-y-1/2 rounded-full cursor-pointer transition-all duration-150 hover:scale-140 z-10 ${
                  isDestination
                    ? 'w-5 h-5 bg-yellow-400 border border-stone-900 shadow-md flex items-center justify-center animate-pulse'
                    : isStart
                    ? 'w-2.5 h-2.5 bg-amber-950 border border-amber-300'
                    : isCurrentPos
                    ? 'w-3.5 h-3.5 bg-white border-2 shadow-lg ring-1 ring-yellow-400'
                    : 'w-2 h-2 sm:w-2.5 sm:h-2.5 bg-amber-950/80 border border-amber-300/70'
                }`}
                style={{
                  left: `${pt.x}%`,
                  top: `${pt.y}%`,
                  borderColor: isCurrentPos ? team.color : undefined,
                }}
                title={`${team.name}`}
              >
                {isDestination && (
                  <span className="text-[9px] leading-none">🚩</span>
                )}
              </div>
            );
          });
        })}

        {/* Start Harbor Badge */}
        <div className="absolute left-2.5 top-2 z-20 bg-stone-950/80 backdrop-blur-xs px-2 py-0.5 rounded border border-amber-700/60 text-[9px] sm:text-[10px] font-cinzel font-bold text-amber-300 shadow">
          <i className="fa-solid fa-anchor mr-1 text-amber-400"></i> XUẤT PHÁT
        </div>

        {/* Finish Line Island Badge */}
        <div className="absolute right-2.5 top-2 z-20 bg-amber-500 text-stone-950 px-2 py-0.5 rounded border border-yellow-200 text-[9px] sm:text-[10px] font-cinzel font-black shadow-lg flex items-center gap-1 animate-pulse">
          <i className="fa-solid fa-flag-checkered text-stone-950"></i> ĐÍCH 🚩 🏆
        </div>

        {/* 5 Ships / Tokens Moving smoothly on the Zigzag Waypoints */}
        {teams.map((team, idx) => {
          const waypoints = TRACK_WAYPOINTS[idx] || [];
          const clampedPos = Math.max(0, Math.min(MAX_STEPS, team.position));
          const currentPt = waypoints[clampedPos] || waypoints[0];
          const isActive = idx === activeTeamIndex;

          return (
            <div
              key={`ship-${team.id}`}
              className={`absolute transition-all duration-700 ease-out z-30 flex flex-col items-center pointer-events-none -translate-x-1/2 -translate-y-1/2 ${
                isActive ? 'scale-110 z-40' : 'scale-95 opacity-85'
              }`}
              style={{
                left: `${currentPt.x}%`,
                top: `${currentPt.y}%`,
              }}
            >
              {/* Active beacon pulse ring */}
              {isActive && (
                <div 
                  className="absolute -inset-2 rounded-full animate-ping opacity-60 pointer-events-none"
                  style={{ backgroundColor: team.color }}
                />
              )}

              {/* Ship Avatar Bubble */}
              <div
                className={`relative w-7 h-7 sm:w-8 sm:h-8 rounded-full border-2 flex items-center justify-center text-sm sm:text-base shadow-[0_4px_12px_rgba(0,0,0,0.8)] backdrop-blur-xs bg-stone-950/90 transition-all ${
                  isActive
                    ? 'ring-2 ring-yellow-400 ring-offset-1 ring-offset-stone-900 shadow-[0_0_15px_rgba(234,179,8,0.9)]'
                    : ''
                }`}
                style={{ borderColor: team.color }}
              >
                <span className="drop-shadow-sm select-none animate-bounce" style={{ animationDuration: `${2 + idx * 0.25}s` }}>
                  {team.emoji}
                </span>

                {/* Active Turn Crown */}
                {isActive && (
                  <span className="absolute -top-2.5 text-[10px] text-yellow-300 drop-shadow animate-pulse">
                    👑
                  </span>
                )}
              </div>

              {/* Team Label Badge */}
              <div
                className="mt-0.5 px-2 py-0.5 rounded text-[9px] font-bold text-white whitespace-nowrap shadow-md tracking-tight flex items-center gap-1 border border-white/20"
                style={{ backgroundColor: team.color }}
              >
                <span className="truncate max-w-[80px] sm:max-w-[100px]">{team.name}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
