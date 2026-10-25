import React from 'react';
import { sounds } from '../utils/audio';

interface Props {
  onStart: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const ScreenIntro: React.FC<Props> = ({ onStart, soundEnabled, onToggleSound }) => {
  const handleStart = () => {
    sounds.playFoghorn();
    setTimeout(() => {
      sounds.playShipBell();
    }, 400);
    onStart();
  };

  return (
    <div className="relative min-h-screen w-full flex flex-col justify-between overflow-hidden bg-stone-950 text-amber-50">
      {/* Background Map Image with Vintage Film Grain & Vignette */}
      <div 
        className="absolute inset-0 bg-cover bg-center opacity-30 filter sepia contrast-125"
        style={{ backgroundImage: `url('/assets/aistudio/world_map_f1bc5d20.png')` }}
      />
      <div className="absolute inset-0 bg-gradient-to-b from-stone-950/80 via-amber-950/40 to-stone-950/95 pointer-events-none" />

      {/* Top Controls */}
      <header className="relative z-10 flex items-center justify-between px-6 py-4 border-b border-amber-900/40 bg-stone-950/60 backdrop-blur-sm">
        <div className="flex items-center gap-3">
          <i className="fa-solid fa-compass text-amber-400 text-xl animate-spin-slow"></i>
          <span className="text-xs uppercase tracking-widest text-amber-300 font-semibold font-cinzel">
            Hải Trình Tri Thức · Thuyết Trình Tương Tác
          </span>
        </div>

        <button
          onClick={onToggleSound}
          className="flex items-center gap-2 px-3 py-1.5 rounded-lg border border-amber-700/50 bg-stone-900/80 text-amber-300 hover:text-amber-100 hover:border-amber-500 text-xs transition-colors"
          title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
        >
          <i className={`fa-solid ${soundEnabled ? 'fa-volume-high' : 'fa-volume-xmark'}`}></i>
          <span className="hidden sm:inline font-medium">{soundEnabled ? 'Âm thanh: BẬT' : 'Âm thanh: TẮT'}</span>
        </button>
      </header>

      {/* Main Hero Showcase */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 py-8 text-center max-w-4xl mx-auto">
        {/* Pirate Emblem / Insignia */}
        <div className="mb-6 relative">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full border-2 border-amber-500/60 bg-amber-950/60 flex items-center justify-center shadow-[0_0_35px_rgba(245,158,11,0.25)] mx-auto relative group">
            <i className="fa-solid fa-skull-crossbones text-4xl sm:text-5xl text-amber-400 drop-shadow-md"></i>
            <span className="absolute -top-2 -right-2 text-2xl animate-bounce">🏴‍☠️</span>
          </div>
        </div>

        {/* Grand Title */}
        <div className="space-y-3 mb-6">
          <p className="text-xs sm:text-sm font-cinzel tracking-[0.3em] uppercase text-amber-400/90 font-bold">
            Trò Chơi Thuyết Trình Đỉnh Cao
          </p>
          <h1 className="text-5xl sm:text-7xl md:text-8xl font-black font-cinzel text-transparent bg-clip-text bg-gradient-to-b from-amber-200 via-amber-400 to-amber-700 drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] tracking-wider">
            ĐẠI HẢI TRÌNH
          </h1>
          <p className="text-base sm:text-lg text-amber-100/90 font-normal max-w-2xl mx-auto leading-relaxed">
            Chuyến thám hiểm trí tuệ: <span className="font-semibold text-amber-300">Lý Luận Nhận Thức Mác – Lênin</span> và <span className="font-semibold text-amber-300">Nghệ Thuật Giải Mã Deepfake</span>.
          </p>
        </div>

        {/* Feature Pillars */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl mb-8 text-left">
          <div className="bg-stone-900/80 border border-amber-800/40 rounded-xl p-4 backdrop-blur-md hover:border-amber-500/50 transition-all">
            <div className="flex items-center gap-3 mb-2 text-amber-400">
              <i className="fa-solid fa-users text-lg"></i>
              <h3 className="font-bold text-sm text-amber-200">5 Hạm Đội Ra Khơi</h3>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              5 đội chơi tranh tài trên bản đồ cổ thế giới, di chuyển theo từng bước ngoặt kịch tính.
            </p>
          </div>

          <div className="bg-stone-900/80 border border-amber-800/40 rounded-xl p-4 backdrop-blur-md hover:border-amber-500/50 transition-all">
            <div className="flex items-center gap-3 mb-2 text-amber-400">
              <i className="fa-solid fa-brain text-lg"></i>
              <h3 className="font-bold text-sm text-amber-200">20 Câu Hỏi Triết Học</h3>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Trắc nghiệm, đúng/sai và ghép từ: Giải mã cơ chế cảm giác, tri giác, thực tiễn và mô hình GAN.
            </p>
          </div>

          <div className="bg-stone-900/80 border border-amber-800/40 rounded-xl p-4 backdrop-blur-md hover:border-amber-500/50 transition-all">
            <div className="flex items-center gap-3 mb-2 text-amber-400">
              <i className="fa-solid fa-dice-d20 text-lg"></i>
              <h3 className="font-bold text-sm text-amber-200">Thẻ Bài Tarot Định Mệnh</h3>
            </div>
            <p className="text-xs text-stone-300 leading-relaxed">
              Xáo trộn 3D với 10 thẻ bài bí ẩn: Tiến bước, lùi bước, hoán đổi hoặc thử thách đọc nhanh líu lưỡi!
            </p>
          </div>
        </div>

        {/* Main CTA */}
        <button
          onClick={handleStart}
          className="group relative inline-flex items-center justify-center gap-3 px-8 py-4 sm:px-10 sm:py-5 rounded-2xl bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-stone-950 font-cinzel font-black text-lg sm:text-xl tracking-wider shadow-[0_10px_30px_rgba(245,158,11,0.4)] hover:shadow-[0_15px_40px_rgba(245,158,11,0.6)] hover:scale-105 active:scale-95 transition-all duration-200 border-2 border-yellow-300"
        >
          <i className="fa-solid fa-ship text-2xl group-hover:-rotate-12 transition-transform duration-300"></i>
          <span>BẮT ĐẦU HẢI TRÌNH</span>
          <i className="fa-solid fa-arrow-right text-base group-hover:translate-x-1 transition-transform"></i>
        </button>
      </main>

      {/* Footer Notice */}
      <footer className="relative z-10 py-3 text-center text-xs text-amber-400/60 border-t border-amber-950/80 bg-stone-950/70">
        Đại Hải Trình · Trò chơi tương tác phục vụ thuyết trình chuyên đề Triết học & Trí tuệ Nhân tạo
      </footer>
    </div>
  );
};
