import React from 'react';
import { Team } from '../types';
import { sounds } from '../utils/audio';
import { MAX_STEPS } from '../data/tracks';

interface Props {
  teams: Team[];
  activeTeamIndex: number;
  currentQuestionIndex: number;
  totalQuestions: number;
  onSelectActiveTeam: (index: number) => void;
  onAdjustTeamPosition: (teamIndex: number, delta: number) => void;
  onSelectQuestion: (index: number) => void;
  onExportHtml: () => void;
  onOpenTarot: () => void;
}

export const Sidebar: React.FC<Props> = ({
  teams,
  activeTeamIndex,
  currentQuestionIndex,
  totalQuestions,
  onSelectActiveTeam,
  onAdjustTeamPosition,
  onSelectQuestion,
  onExportHtml,
  onOpenTarot,
}) => {
  return (
    <aside className="w-full h-full flex flex-col justify-between gap-3 text-stone-100 select-none">
      {/* 5 Teams Card Container */}
      <div className="bg-stone-900/95 border-2 border-amber-800/80 rounded-2xl p-3 sm:p-4 shadow-xl backdrop-blur-md flex flex-col gap-2.5">
        <div className="flex items-center justify-between pb-2 border-b border-amber-900/50">
          <div className="flex items-center gap-2">
            <i className="fa-solid fa-flag-checkered text-amber-400 text-sm"></i>
            <h3 className="font-cinzel font-black text-xs sm:text-sm text-amber-200 uppercase tracking-wider">
              Bảng Điểm & Bước Đi
            </h3>
          </div>
          <span className="text-[10px] text-amber-400/90 font-mono font-bold">Đích: {MAX_STEPS} mốc 🚩</span>
        </div>

        {/* List of 5 Teams with Active Pulse Glow Effect */}
        <div className="space-y-2">
          {teams.map((team, idx) => {
            const isActive = idx === activeTeamIndex;

            return (
              <div
                key={team.id}
                className={`relative px-3 py-2 rounded-xl border transition-all duration-300 ${
                  isActive
                    ? 'bg-amber-950/90 border-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.55)] ring-2 ring-amber-400 animate-pulse'
                    : 'bg-stone-950/85 border-stone-800 hover:border-amber-700/60'
                }`}
              >
                {/* Team Info Header */}
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="text-lg shrink-0">{team.emoji}</span>
                    <span className="font-bold text-xs sm:text-sm text-stone-100 truncate">
                      {team.name}
                    </span>
                  </div>

                  {/* Active turn badge */}
                  {isActive ? (
                    <span className="px-2 py-0.5 rounded bg-yellow-400 text-stone-950 font-cinzel font-black text-[9px] uppercase tracking-wider shrink-0 shadow-sm flex items-center gap-1">
                      <span className="w-1.5 h-1.5 rounded-full bg-red-600 animate-ping"></span>
                      LƯỢT CHƠI
                    </span>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        sounds.playFlip();
                        onSelectActiveTeam(idx);
                      }}
                      className="text-[10px] text-stone-400 hover:text-amber-300 underline shrink-0 cursor-pointer"
                      title="Chuyển lượt cho đội này"
                    >
                      Chọn
                    </button>
                  )}
                </div>

                {/* Roadtrack Progress bar */}
                <div className="w-full bg-stone-900 rounded-full h-2 overflow-hidden border border-stone-800">
                  <div
                    className="h-full rounded-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, (team.position / MAX_STEPS) * 100)}%`,
                      backgroundColor: team.color,
                    }}
                  />
                </div>

                {/* Score & Step count info */}
                <div className="flex items-center justify-between mt-1 pt-1 border-t border-stone-800/80 text-[10px]">
                  <div className="flex items-center gap-2 text-stone-300">
                    <span>Mốc: <strong className="font-mono text-amber-300 font-bold">{team.position}/{MAX_STEPS}</strong></span>
                    <span>·</span>
                    <span>Điểm: <strong className="font-mono text-amber-300 font-bold">{team.score}</strong></span>
                  </div>

                  {/* MC Quick Steppers */}
                  <div className="flex items-center gap-1">
                    <button
                      type="button"
                      onClick={() => onAdjustTeamPosition(idx, -1)}
                      className="w-4 h-4 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold flex items-center justify-center transition-colors cursor-pointer text-[10px]"
                      title="Lùi 1 bước"
                    >
                      -
                    </button>
                    <button
                      type="button"
                      onClick={() => onAdjustTeamPosition(idx, 1)}
                      className="w-4 h-4 rounded bg-stone-800 hover:bg-stone-700 text-stone-300 font-bold flex items-center justify-center transition-colors cursor-pointer text-[10px]"
                      title="Tiến 1 bước"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 20 Question Selector Grid (Compact) */}
      <div className="bg-stone-900/95 border border-amber-900/60 rounded-2xl p-2.5 sm:p-3 shadow-xl backdrop-blur-md">
        <div className="flex items-center justify-between mb-2">
          <span className="font-cinzel font-bold text-[11px] text-amber-300 uppercase tracking-wider">
            20 Câu Hỏi Hải Trình
          </span>
          <span className="text-[9px] text-stone-400">Chọn câu</span>
        </div>

        <div className="grid grid-cols-5 gap-1 text-center">
          {Array.from({ length: totalQuestions }).map((_, idx) => {
            const isCurrent = idx === currentQuestionIndex;
            return (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  sounds.playFlip();
                  onSelectQuestion(idx);
                }}
                className={`py-1 rounded text-xs font-bold font-mono transition-all cursor-pointer ${
                  isCurrent
                    ? 'bg-amber-500 text-stone-950 shadow-md ring-2 ring-yellow-300 font-black'
                    : 'bg-stone-950 text-stone-300 hover:bg-amber-950 hover:text-amber-200 border border-stone-800'
                }`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
      </div>

      {/* Action Tools */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={onOpenTarot}
          className="flex-1 py-2 px-2 rounded-xl bg-gradient-to-r from-purple-800 to-indigo-800 hover:from-purple-700 hover:to-indigo-700 text-amber-100 font-cinzel font-bold text-xs tracking-wider shadow-md flex items-center justify-center gap-1.5 border border-purple-500 cursor-pointer animate-pulse"
        >
          <i className="fa-solid fa-wand-magic-sparkles text-yellow-300 text-xs"></i>
          <span>BỐC BÀI</span>
        </button>

        <button
          type="button"
          onClick={onExportHtml}
          className="py-2 px-3 rounded-xl bg-stone-950 hover:bg-stone-800 text-amber-300 border border-amber-800/80 text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
          title="Tải về file HTML đơn lẻ chạy offline"
        >
          <i className="fa-solid fa-download text-xs"></i>
          <span>Tải HTML</span>
        </button>
      </div>
    </aside>
  );
};
