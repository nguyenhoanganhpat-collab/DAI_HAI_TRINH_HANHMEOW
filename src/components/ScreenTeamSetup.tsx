import React, { useState } from 'react';
import { Team } from '../types';
import { sounds } from '../utils/audio';

interface Props {
  initialTeams: Team[];
  teamCount: number;
  fullPalette: Team[];
  onChangeTeamCount: (count: number) => void;
  onConfirmTeams: (teams: Team[]) => void;
  onBack: () => void;
}

const EMOJI_OPTIONS = [
  '🏴‍☠️', '🚢', '⚓', '🐙', '👑', 
  '🦈', '🦜', '🧭', '⚔️', '🗺️', 
  '🐳', '⛵', '🏝️', '🪙', '🦁',
  '🦅', '⚡', '🔥', '🛡️', '🧜'
];

export const ScreenTeamSetup: React.FC<Props> = ({
  initialTeams,
  teamCount,
  fullPalette,
  onChangeTeamCount,
  onConfirmTeams,
  onBack,
}) => {
  const [teams, setTeams] = useState<Team[]>(initialTeams);
  const [activeEmojiPickerIndex, setActiveEmojiPickerIndex] = useState<number | null>(null);

  const handleNameChange = (index: number, name: string) => {
    const updated = [...teams];
    updated[index].name = name;
    setTeams(updated);
  };

  const handleEmojiSelect = (index: number, emoji: string) => {
    const updated = [...teams];
    updated[index].emoji = emoji;
    setTeams(updated);
    setActiveEmojiPickerIndex(null);
    sounds.playCorrect();
  };

  // Add one team from palette, preserving existing edits
  const handleAddTeam = () => {
    if (teamCount >= 8) return;
    const newCount = teamCount + 1;
    onChangeTeamCount(newCount);
    // Add next team from palette at the end
    const nextPaletteTeam = fullPalette[teams.length];
    if (nextPaletteTeam) {
      setTeams((prev) => [...prev, { ...nextPaletteTeam, position: 0, score: 0 }]);
    }
    sounds.playFlip();
  };

  // Remove last team
  const handleRemoveTeam = () => {
    if (teamCount <= 2) return;
    const newCount = teamCount - 1;
    onChangeTeamCount(newCount);
    setTeams((prev) => prev.slice(0, newCount));
    sounds.playWrong();
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sounds.playShipBell();
    onConfirmTeams(teams);
  };

  // Dynamic grid: auto-adjust columns based on team count
  const gridCols =
    teams.length <= 2 ? 'grid-cols-1 sm:grid-cols-2' :
    teams.length === 3 ? 'grid-cols-1 sm:grid-cols-3' :
    teams.length === 4 ? 'grid-cols-2 md:grid-cols-4' :
    teams.length <= 6 ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-6' :
    'grid-cols-2 md:grid-cols-4';

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-x-hidden bg-stone-950 text-amber-50">
      {/* Background Map Image with Vintage Overlay */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-25 filter sepia contrast-125 fixed"
        style={{ backgroundImage: `url('/assets/aistudio/world_map_f1bc5d20.png')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/85 via-amber-950/50 to-stone-950/95 pointer-events-none fixed" />

      {/* Top Header */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-amber-900/40 bg-stone-950/70 backdrop-blur-md">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-amber-400 hover:text-amber-200 transition-colors"
        >
          <i className="fa-solid fa-arrow-left"></i>
          <span>Quay lại trang chủ</span>
        </button>

        <h2 className="text-sm sm:text-base font-cinzel font-bold tracking-widest text-amber-300 uppercase">
          Thiết Lập Hạm Đội ({teams.length} Đội)
        </h2>

        <div className="w-16"></div>
      </header>

      {/* Content Form */}
      <main className="relative z-10 flex-1 max-w-6xl w-full mx-auto px-4 py-6 flex flex-col justify-center">
        <div className="text-center mb-6">
          <h1 className="text-3xl sm:text-4xl font-black font-cinzel text-amber-200 drop-shadow-md">
            ĐẶT TÊN CÁC ĐỘI CHƠI
          </h1>
          <p className="text-xs sm:text-sm text-stone-300 mt-2">
            Nhập tên đội và chọn linh vật Emoji đại diện cho hải trình sắp tới
          </p>
        </div>

        {/* ── Team Count Adjuster ── */}
        <div className="flex items-center justify-center gap-4 mb-6 bg-stone-900/80 border border-amber-800/50 rounded-2xl px-6 py-3 w-fit mx-auto backdrop-blur-md shadow-lg">
          <span className="text-xs font-cinzel font-bold text-amber-300 uppercase tracking-wider">
            <i className="fa-solid fa-users mr-2 text-amber-400"></i>
            Số đội chơi:
          </span>

          <button
            type="button"
            onClick={handleRemoveTeam}
            disabled={teams.length <= 2}
            className="w-8 h-8 rounded-lg bg-rose-900/80 hover:bg-rose-700 disabled:opacity-30 disabled:cursor-not-allowed text-white font-black text-lg flex items-center justify-center transition-all border border-rose-600/60 cursor-pointer"
            title="Bớt 1 đội (tối thiểu 2)"
          >
            −
          </button>

          <span className="w-10 text-center font-cinzel font-black text-2xl text-amber-200">
            {teams.length}
          </span>

          <button
            type="button"
            onClick={handleAddTeam}
            disabled={teams.length >= 8}
            className="w-8 h-8 rounded-lg bg-emerald-900/80 hover:bg-emerald-700 disabled:opacity-30 disabled:cursor-not-allowed text-white font-black text-lg flex items-center justify-center transition-all border border-emerald-600/60 cursor-pointer"
            title="Thêm 1 đội (tối đa 8)"
          >
            +
          </button>

          <span className="text-[10px] text-stone-400 font-medium">(2 – 8 đội)</span>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className={`grid gap-3 ${gridCols}`}>
            {teams.map((team, idx) => (
              <div 
                key={team.id}
                className="relative bg-stone-900/90 border-2 rounded-xl p-4 shadow-xl backdrop-blur-md transition-all hover:scale-[1.02] flex flex-col justify-between"
                style={{ borderColor: team.color }}
              >
                {/* Team Number Badge */}
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xs font-cinzel font-bold text-amber-400/90 tracking-wider">
                    ĐỘI {idx + 1}
                  </span>
                  <span 
                    className="w-3 h-3 rounded-full border border-white/40 shadow-sm"
                    style={{ backgroundColor: team.color }}
                  />
                </div>

                {/* Emoji Avatar Selector */}
                <div className="relative mb-4 flex flex-col items-center">
                  <button
                    type="button"
                    onClick={() => setActiveEmojiPickerIndex(activeEmojiPickerIndex === idx ? null : idx)}
                    className="w-16 h-16 rounded-2xl border-2 border-dashed border-amber-500/50 bg-stone-950/70 hover:bg-stone-800 flex items-center justify-center text-3xl shadow-inner transition-transform hover:scale-110 active:scale-95"
                    title="Nhấn để đổi Emoji"
                  >
                    <span>{team.emoji}</span>
                  </button>
                  <span className="text-[10px] text-amber-400/70 mt-1 cursor-pointer">
                    Đổi Emoji <i className="fa-solid fa-pen text-[8px]"></i>
                  </span>

                  {/* Popover Emoji Grid */}
                  {activeEmojiPickerIndex === idx && (
                    <div className="absolute top-20 z-50 p-2 bg-stone-900 border border-amber-600 rounded-xl shadow-2xl grid grid-cols-5 gap-1.5 w-52 animate-in fade-in zoom-in-95">
                      {EMOJI_OPTIONS.map((em) => (
                        <button
                          key={em}
                          type="button"
                          onClick={() => handleEmojiSelect(idx, em)}
                          className={`w-9 h-9 flex items-center justify-center text-xl rounded-lg hover:bg-amber-900/40 transition-colors ${
                            team.emoji === em ? 'bg-amber-500/20 ring-1 ring-amber-400' : ''
                          }`}
                        >
                          {em}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

                {/* Name Input */}
                <div>
                  <label className="block text-[11px] font-medium text-stone-400 mb-1">
                    Tên hạm đội
                  </label>
                  <input
                    type="text"
                    required
                    maxLength={24}
                    value={team.name}
                    onChange={(e) => handleNameChange(idx, e.target.value)}
                    className="w-full px-3 py-2 text-xs font-semibold text-amber-100 bg-stone-950 border border-stone-700 rounded-lg focus:outline-none focus:border-amber-400 transition-colors text-center"
                    placeholder={`Đội ${idx + 1}`}
                  />
                </div>
              </div>
            ))}
          </div>

          {/* Action Bar */}
          <div className="pt-6 text-center">
            <button
              type="submit"
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-stone-950 font-cinzel font-black text-base sm:text-lg tracking-wider shadow-[0_8px_25px_rgba(245,158,11,0.4)] hover:shadow-[0_12px_35px_rgba(245,158,11,0.6)] hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-yellow-300 cursor-pointer"
            >
              <i className="fa-solid fa-anchor text-xl"></i>
              <span>XÁC NHẬN VÀ RA KHƠI</span>
              <i className="fa-solid fa-ship text-xl"></i>
            </button>
          </div>
        </form>
      </main>

      {/* Footer Info */}
      <footer className="relative z-10 py-3 text-center text-xs text-amber-400/50 border-t border-amber-950/80 bg-stone-950/70">
        Hãy phân chia vị trí và chọn người đại diện mỗi đội trước khi chính thức ra khơi
      </footer>
    </div>
  );
};
