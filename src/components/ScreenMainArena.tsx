import React, { useState } from "react";
import { Team, Question } from "../types";
import { GameBoard } from "./GameBoard";
import { QuestionCard } from "./QuestionCard";
import { TarotDrawModal } from "./TarotDrawModal";
import { VictoryModal } from "./VictoryModal";
import { sounds } from "../utils/audio";
import { exportStandaloneHtmlFile } from "../utils/htmlExporter";
import { MAX_STEPS } from "../data/tracks";

interface Props {
  teams: Team[];
  questions: Question[];
  onUpdateTeams: (teams: Team[]) => void;
  onResetGame: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
}

export const ScreenMainArena: React.FC<Props> = ({
  teams,
  questions,
  onUpdateTeams,
  onResetGame,
  soundEnabled,
  onToggleSound,
}) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<number>(0);
  const [activeTeamIndex, setActiveTeamIndex] = useState<number>(0);
  const [isTarotOpen, setIsTarotOpen] = useState<boolean>(false);
  const [hasResetAllOccurred, setHasResetAllOccurred] =
    useState<boolean>(false);
  const [winningTeam, setWinningTeam] = useState<Team | null>(null);
  const [isVictoryModalOpen, setIsVictoryModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  const handleNextQuestion = () => {
    setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
  };

  const handlePrevQuestion = () => {
    setCurrentQuestionIndex(
      (prev) => (prev - 1 + questions.length) % questions.length,
    );
  };

  const handleAdjustTeamPosition = (teamIndex: number, delta: number) => {
    const updated = teams.map((team) => ({ ...team }));
    const newPos = Math.max(
      0,
      Math.min(MAX_STEPS, updated[teamIndex].position + delta),
    );
    updated[teamIndex].position = newPos;
    if (delta > 0) {
      updated[teamIndex].score += 10;
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }
    onUpdateTeams(updated);

    if (newPos >= MAX_STEPS) {
      setWinningTeam(updated[teamIndex]);
      setIsVictoryModalOpen(true);
    }
  };

  const handleTarotApplied = (
    actionDesc: string,
    updatedTeams: Team[],
    wasResetAll: boolean,
  ) => {
    onUpdateTeams(updatedTeams);
    if (wasResetAll) {
      setHasResetAllOccurred(true);
    }
    setIsTarotOpen(false);
    showToast(actionDesc);

    // Check if any team has won
    const winner = updatedTeams.find((t) => t.position >= MAX_STEPS);
    if (winner) {
      setWinningTeam(winner);
      setTimeout(() => {
        setIsVictoryModalOpen(true);
      }, 700);
    } else {
      // Auto-advance to next team AND next question as required!
      setActiveTeamIndex((prev) => (prev + 1) % teams.length);
      setCurrentQuestionIndex((prev) => (prev + 1) % questions.length);
      sounds.playShipBell();
    }
  };

  // Fullscreen toggle for presentation mode
  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen().catch(() => {});
    } else {
      document.exitFullscreen().catch(() => {});
    }
  };

  const currentQ = questions[currentQuestionIndex] || questions[0];
  const activeTeam = teams[activeTeamIndex] || teams[0];
  const previousTeamIndex = (activeTeamIndex - 1 + teams.length) % teams.length;

  return (
    <div className="relative h-dvh max-h-dvh overflow-hidden w-full bg-stone-950 text-stone-100 flex flex-col selection:bg-amber-500 selection:text-white">
      {/* Background Vintage World Map Cover */}
      <div
        className="fixed inset-0 bg-cover bg-center opacity-15 filter sepia contrast-125 pointer-events-none"
        style={{ backgroundImage: `url('/world_map.png')` }}
      />
      <div className="fixed inset-0 bg-gradient-to-b from-stone-950/80 via-stone-950/60 to-stone-950/95 pointer-events-none" />

      {/* Top Header Bar (Height ~52px) */}
      <header className="relative z-40 h-13 shrink-0 flex items-center justify-between gap-6 px-6 bg-stone-950/90 border-b border-amber-900/50 backdrop-blur-md shadow-md">
        {/* Brand Zone */}
        <div className="flex items-center gap-3 shrink-0">
          <i className="fa-solid fa-compass text-amber-400 text-lg animate-spin-slow"></i>
          <span className="font-cinzel font-black text-lg text-amber-200 tracking-wider whitespace-nowrap">
            ĐẠI HẢI TRÌNH
          </span>
          <span className="text-xs text-amber-400/80 font-semibold hidden md:inline">
            · Triết Học & Deepfake
          </span>
        </div>

        {/* 5 Teams Interactive Turn Selector with Active Glow/Pulse */}
        <nav className="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1 max-w-[55%]">
          {teams.map((t, idx) => {
            const isActive = idx === activeTeamIndex;
            return (
              <button
                key={t.id}
                type="button"
                onClick={() => {
                  sounds.playFlip();
                  setActiveTeamIndex(idx);
                }}
                className={`flex items-center gap-1.5 px-2.5 py-1 rounded-xl text-xs font-bold transition-all cursor-pointer whitespace-nowrap shrink-0 ${
                  isActive
                    ? "bg-amber-950/95 border-2 border-amber-400 text-amber-200 ring-2 ring-amber-400 shadow-[0_0_18px_rgba(245,158,11,0.65)] animate-pulse"
                    : "bg-stone-900/80 border border-stone-800 text-stone-300 hover:border-amber-700/60 hover:text-white"
                }`}
                title="Bấm để chuyển lượt cho hạm đội này"
              >
                <span className="text-sm">{t.emoji}</span>
                <span className="truncate max-w-[80px] sm:max-w-[120px]">
                  {t.name}
                </span>
                {isActive && (
                  <span className="text-yellow-400 text-[10px]">👑</span>
                )}
              </button>
            );
          })}
        </nav>

        {/* Action Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <a
            href="/dai_hai_trinh.html"
            target="_blank"
            rel="noreferrer"
            className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-amber-500/60 bg-amber-950/80 hover:bg-amber-900 text-amber-200 text-xs font-semibold transition-colors"
            title="Mở phiên bản 1 file HTML duy nhất trong tab mới"
          >
            <i className="fa-solid fa-file-code"></i>
            <span>Mở File HTML</span>
          </a>

          <button
            onClick={exportStandaloneHtmlFile}
            className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg border border-yellow-500/60 bg-yellow-500 text-stone-950 hover:bg-yellow-400 text-xs font-bold transition-all shadow-sm cursor-pointer"
            title="Tải về máy file HTML độc lập duy nhất"
          >
            <i className="fa-solid fa-download"></i>
            <span>Tải HTML</span>
          </button>

          <button
            onClick={onToggleSound}
            className="p-1.5 rounded-lg border border-amber-800/60 bg-stone-900 text-amber-300 hover:text-white text-xs transition-colors cursor-pointer"
            title={soundEnabled ? "Tắt âm thanh" : "Bật âm thanh"}
          >
            <i
              className={`fa-solid ${soundEnabled ? "fa-volume-high" : "fa-volume-xmark"}`}
            ></i>
          </button>

          <button
            onClick={toggleFullscreen}
            className="p-1.5 rounded-lg border border-amber-800/60 bg-stone-900 text-amber-300 hover:text-white text-xs transition-colors cursor-pointer"
            title="Toàn màn hình trình chiếu"
          >
            <i className="fa-solid fa-expand"></i>
          </button>

          <button
            onClick={() => {
              if (
                confirm("Bạn có chắc chắn muốn khởi động lại toàn bộ trò chơi?")
              ) {
                onResetGame();
              }
            }}
            className="px-2.5 py-1 rounded-lg border border-amber-800/60 bg-stone-900 hover:bg-stone-800 text-stone-300 hover:text-white text-xs font-medium transition-colors cursor-pointer"
          >
            <i className="fa-solid fa-arrow-rotate-left mr-1"></i>
            Chơi lại
          </button>
        </div>
      </header>

      {/* Toast Notification Banner */}
      {toastMessage && (
        <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 px-5 py-2 rounded-xl bg-amber-500 text-stone-950 font-bold text-xs sm:text-sm shadow-2xl border-2 border-yellow-200 animate-in fade-in slide-in-from-top-4 flex items-center gap-2">
          <i className="fa-solid fa-scroll text-sm"></i>
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Single Viewport (NO SCROLL) Layout */}
      <main className="relative z-10 flex-1 min-h-0 w-full max-w-[1500px] mx-auto p-2.5 sm:p-3 flex flex-col gap-2 overflow-hidden">
        {/* Top Compact World Map Overview with 5 Zigzag Tracks */}
        <div className="shrink-0">
          <GameBoard
            teams={teams}
            activeTeamIndex={activeTeamIndex}
            onSelectTeamPosition={(teamIdx, newPos) => {
              const updated = teams.map((team, idx) =>
                idx === teamIdx ? { ...team, position: newPos } : team,
              );
              onUpdateTeams(updated);
              sounds.playShipBell();
              if (newPos >= MAX_STEPS) {
                setWinningTeam(updated[teamIdx]);
                setIsVictoryModalOpen(true);
              }
            }}
          />
        </div>

        {/* 20 Questions Quick Navigation Strip + Tarot Trigger */}
        <div className="shrink-0 flex items-center justify-between gap-3 px-3 py-1.5 rounded-xl bg-stone-900/95 border border-amber-900/60 shadow-md">
          <div className="flex items-center gap-2 overflow-x-auto py-0.5">
            <span className="text-[11px] font-cinzel font-black text-amber-300 whitespace-nowrap shrink-0 flex items-center gap-1">
              <i className="fa-solid fa-map-location-dot text-amber-400"></i>
              <span>CÂU HỎI:</span>
            </span>
            <div className="flex items-center gap-1 shrink-0">
              {questions.map((_, idx) => {
                const isCurrent = idx === currentQuestionIndex;
                return (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => {
                      sounds.playFlip();
                      setCurrentQuestionIndex(idx);
                    }}
                    className={`w-7 h-6 sm:w-8 sm:h-7 rounded text-xs font-bold font-mono transition-all cursor-pointer flex items-center justify-center ${
                      isCurrent
                        ? "bg-amber-500 text-stone-950 font-black ring-2 ring-yellow-300 shadow-md scale-105"
                        : "bg-stone-950 text-stone-300 hover:bg-amber-950 hover:text-amber-200 border border-stone-800"
                    }`}
                    title={`Chuyển đến Câu ${idx + 1}`}
                  >
                    {idx + 1}
                  </button>
                );
              })}
            </div>
          </div>

          <button
            type="button"
            onClick={() => setIsTarotOpen(true)}
            className="shrink-0 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-purple-700 to-indigo-700 hover:from-purple-600 hover:to-indigo-600 text-amber-100 font-cinzel font-bold text-xs tracking-wider shadow border border-purple-400 flex items-center gap-1.5 cursor-pointer animate-pulse"
          >
            <i className="fa-solid fa-wand-magic-sparkles text-yellow-300 text-xs"></i>
            <span className="hidden sm:inline">BỐC BÀI</span> TAROT
          </button>
        </div>

        {/* Central Question Arena (Dominant Focus, Fits Viewport) */}
        <div className="w-full flex-1 min-h-0 overflow-hidden">
          <QuestionCard
            question={currentQ}
            activeTeam={activeTeam}
            currentNumber={currentQuestionIndex + 1}
            totalQuestions={questions.length}
            onNextQuestion={handleNextQuestion}
            onPrevQuestion={handlePrevQuestion}
            onOpenTarot={() => setIsTarotOpen(true)}
            onSelectQuestion={(idx) => setCurrentQuestionIndex(idx)}
          />
        </div>
      </main>

      {/* 3D Tarot Draw Modal with Game Progression Logic */}
      <TarotDrawModal
        isOpen={isTarotOpen}
        activeTeam={activeTeam}
        allTeams={teams}
        previousTeamIndex={previousTeamIndex}
        currentQuestionNumber={currentQuestionIndex + 1}
        hasResetAllOccurred={hasResetAllOccurred}
        onApplyTarotEffect={handleTarotApplied}
        onClose={() => setIsTarotOpen(false)}
      />

      {/* Victory Celebration Modal */}
      <VictoryModal
        isOpen={isVictoryModalOpen}
        winningTeam={winningTeam}
        allTeams={teams}
        onPlayAgain={onResetGame}
        onClose={() => setIsVictoryModalOpen(false)}
      />

      {/* Minimal Footer (~22px) */}
      <footer className="relative z-10 h-6 shrink-0 border-t border-amber-950/80 bg-stone-950/95 flex items-center justify-center text-[10px] text-amber-500/70">
        Đại Hải Trình · Triết học Mác - Lênin & Giải mã Deepfake · Single
        Viewport 100vh
      </footer>
    </div>
  );
};
