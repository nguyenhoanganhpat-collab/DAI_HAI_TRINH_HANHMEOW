import React, { useEffect } from 'react';
import { Team } from '../types';
import { sounds } from '../utils/audio';

interface Props {
  isOpen: boolean;
  winningTeam: Team | null;
  allTeams: Team[];
  onPlayAgain: () => void;
  onClose: () => void;
}

export const VictoryModal: React.FC<Props> = ({
  isOpen,
  winningTeam,
  allTeams,
  onPlayAgain,
  onClose,
}) => {
  useEffect(() => {
    if (isOpen) {
      sounds.playFanfare();
    }
  }, [isOpen]);

  if (!isOpen || !winningTeam) return null;

  // Sort teams by position desc, then score desc
  const sorted = [...allTeams].sort((a, b) => {
    if (b.position !== a.position) return b.position - a.position;
    return b.score - a.score;
  });

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/90 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-2xl bg-stone-900 border-2 border-yellow-400 rounded-3xl p-6 sm:p-10 text-center shadow-[0_0_60px_rgba(234,179,8,0.4)]">
        {/* Confetti / Trophy header */}
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-tr from-amber-500 to-yellow-300 flex items-center justify-center shadow-lg text-stone-950 text-5xl mb-4 animate-bounce">
          🏆
        </div>

        <p className="text-xs font-cinzel tracking-widest text-amber-400 uppercase font-bold">
          Hải Trình Hoàn Tất · Vua Hải Tặc Tri Thức
        </p>

        <h2 className="text-3xl sm:text-5xl font-black font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 via-amber-400 to-yellow-100 my-2">
          CHÚC MỪNG {winningTeam.name.toUpperCase()}!
        </h2>

        <p className="text-sm text-stone-300 max-w-md mx-auto mb-6">
          Hạm đội {winningTeam.emoji} {winningTeam.name} đã xuất sắc vượt qua giông bão nhận thức, giải mã thành công Deepfake và cán đích hải trình đầu tiên!
        </p>

        {/* Podium Rankings */}
        <div className="bg-stone-950/70 border border-amber-800/50 rounded-2xl p-4 mb-6">
          <h3 className="text-xs font-cinzel text-amber-300 font-bold uppercase tracking-wider mb-3">
            Bảng Xếp Hạng Chung Cuộc
          </h3>
          <div className="space-y-2">
            {sorted.map((team, rank) => (
              <div
                key={team.id}
                className={`flex items-center justify-between px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all ${
                  rank === 0
                    ? 'bg-amber-500/20 border border-amber-400 text-amber-200'
                    : 'bg-stone-900/60 text-stone-300 border border-stone-800'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">
                    {rank === 0 ? '🥇' : rank === 1 ? '🥈' : rank === 2 ? '🥉' : `${rank + 1}.`}
                  </span>
                  <span className="text-lg">{team.emoji}</span>
                  <span className="font-bold">{team.name}</span>
                </div>
                <div className="flex items-center gap-4 text-xs font-mono">
                  <span>Cột mốc: {team.position}/10</span>
                  <span className="text-amber-400 font-bold">{team.score} điểm</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-4">
          <button
            onClick={onPlayAgain}
            className="px-6 py-3 rounded-xl bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-stone-950 font-cinzel font-black text-sm tracking-wider shadow-lg hover:scale-105 active:scale-95 transition-all cursor-pointer"
          >
            <i className="fa-solid fa-rotate-right mr-2"></i>
            CHƠI LẠI TỪ ĐẦU
          </button>
          <button
            onClick={onClose}
            className="px-6 py-3 rounded-xl bg-stone-800 text-stone-300 hover:text-white font-cinzel font-bold text-sm tracking-wider hover:bg-stone-700 transition-all cursor-pointer"
          >
            Ở LẠI BẢNG ĐỒ
          </button>
        </div>
      </div>
    </div>
  );
};
