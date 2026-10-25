import React, { useState, useEffect } from 'react';
import { Team, TarotCard } from '../types';
import { getPhaseWeightedCardPool, ALL_TAROT_CARDS } from '../data/tarotCards';
import { sounds } from '../utils/audio';

interface Props {
  isOpen: boolean;
  activeTeam: Team;
  allTeams: Team[];
  previousTeamIndex: number;
  currentQuestionNumber: number;
  hasResetAllOccurred: boolean;
  onApplyTarotEffect: (resultText: string, updatedTeams: Team[], wasResetAll: boolean) => void;
  onClose: () => void;
}

export const TarotDrawModal: React.FC<Props> = ({
  isOpen,
  activeTeam,
  allTeams,
  previousTeamIndex,
  currentQuestionNumber,
  hasResetAllOccurred,
  onApplyTarotEffect,
  onClose,
}) => {
  const [shuffledDeck, setShuffledDeck] = useState<TarotCard[]>([]);
  const [isShuffling, setIsShuffling] = useState<boolean>(true);
  const [selectedCard, setSelectedCard] = useState<TarotCard | null>(null);
  const [isFlipped, setIsFlipped] = useState<boolean>(false);
  const [targetTeamId, setTargetTeamId] = useState<number | null>(null);
  const [challengeTimer, setChallengeTimer] = useState<number>(15);
  const [timerRunning, setTimerRunning] = useState<boolean>(false);

  // Initialize deck according to Game Phase distribution rules
  useEffect(() => {
    if (isOpen) {
      setIsShuffling(true);
      setSelectedCard(null);
      setIsFlipped(false);
      setTargetTeamId(null);
      setChallengeTimer(15);
      setTimerRunning(false);

      sounds.playShuffle();

      // Generate deck based on game progression
      const pool = getPhaseWeightedCardPool(currentQuestionNumber, hasResetAllOccurred);
      setShuffledDeck(pool);

      // Rapid visual shuffle animation
      const timer = setTimeout(() => {
        setIsShuffling(false);
      }, 650);

      return () => clearTimeout(timer);
    }
  }, [isOpen, currentQuestionNumber, hasResetAllOccurred]);

  // Challenge timer countdown
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timerRunning && challengeTimer > 0) {
      interval = setInterval(() => {
        setChallengeTimer((prev) => {
          if (prev <= 1) {
            sounds.playWrong();
            setTimerRunning(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [timerRunning, challengeTimer]);

  if (!isOpen) return null;

  const handleCardClick = (card: TarotCard) => {
    if (isShuffling || selectedCard) return;
    setSelectedCard(card);
    sounds.playFlip();

    // Trigger 3D flip animation
    setTimeout(() => {
      setIsFlipped(true);
      if (card.actionType.startsWith('advance') || card.actionType === 'boost_last') {
        sounds.playCorrect();
      } else if (card.actionType.startsWith('retreat') || card.actionType === 'reset_all') {
        sounds.playWrong();
      } else {
        sounds.playShipBell();
      }
    }, 280);
  };

  const handleApply = (challengeSuccess = true) => {
    if (!selectedCard) return;

    let updated = allTeams.map((t) => ({ ...t }));
    let actionDesc = '';
    let wasResetAll = false;

    switch (selectedCard.actionType) {
      case 'advance_2': {
        updated = updated.map((t) =>
          t.id === activeTeam.id ? { ...t, position: Math.min(10, t.position + 2), score: t.score + 20 } : t
        );
        actionDesc = `${activeTeam.name} (${activeTeam.emoji}) Tiến 2 bước!`;
        break;
      }
      case 'advance_1': {
        updated = updated.map((t) =>
          t.id === activeTeam.id ? { ...t, position: Math.min(10, t.position + 1), score: t.score + 10 } : t
        );
        actionDesc = `${activeTeam.name} (${activeTeam.emoji}) Tiến 1 bước!`;
        break;
      }
      case 'stay': {
        actionDesc = `${activeTeam.name} (${activeTeam.emoji}) Đứng im!`;
        break;
      }
      case 'retreat_2': {
        updated = updated.map((t) =>
          t.id === activeTeam.id ? { ...t, position: Math.max(0, t.position - 2) } : t
        );
        actionDesc = `${activeTeam.name} (${activeTeam.emoji}) Lùi 2 bước!`;
        break;
      }
      case 'retreat_1': {
        updated = updated.map((t) =>
          t.id === activeTeam.id ? { ...t, position: Math.max(0, t.position - 1) } : t
        );
        actionDesc = `${activeTeam.name} (${activeTeam.emoji}) Lùi 1 bước!`;
        break;
      }
      case 'prev_advance_1': {
        const prevTeam = allTeams[previousTeamIndex] || allTeams[0];
        updated = updated.map((t) =>
          t.id === prevTeam.id ? { ...t, position: Math.min(10, t.position + 1), score: t.score + 10 } : t
        );
        actionDesc = `Đội trước đó: ${prevTeam.name} (${prevTeam.emoji}) tiến 1 bước!`;
        break;
      }
      case 'reset_all': {
        updated = updated.map((t) => ({ ...t, position: 0 }));
        actionDesc = `Bão táp quét qua! Tất cả 5 đội đều về vị trí xuất phát!`;
        wasResetAll = true;
        break;
      }
      case 'attack_target': {
        if (targetTeamId === null) {
          alert('Vui lòng chọn 1 đội đối thủ để tấn công (-2 bước)!');
          return;
        }
        const victim = updated.find((t) => t.id === targetTeamId);
        updated = updated.map((t) =>
          t.id === targetTeamId ? { ...t, position: Math.max(0, t.position - 2) } : t
        );
        actionDesc = `${activeTeam.name} tấn công ${victim?.name} (Bị trừ 2 bước)!`;
        break;
      }
      case 'boost_last': {
        const minPos = Math.min(...updated.map((t) => t.position));
        const lowestTeams = updated.filter((t) => t.position === minPos);
        updated = updated.map((t) =>
          t.position === minPos ? { ...t, position: Math.min(10, t.position + 2), score: t.score + 10 } : t
        );
        actionDesc = `Đội bét bảng (${lowestTeams.map((t) => t.name).join(', ')}) được cộng 2 bước!`;
        break;
      }
      case 'tongue_twister': {
        if (challengeSuccess) {
          updated = updated.map((t) =>
            t.id === activeTeam.id ? { ...t, position: Math.min(10, t.position + 1), score: t.score + 15 } : t
          );
          actionDesc = `${activeTeam.name} đọc chuẩn xác câu líu lưỡi: Tiến 1 bước!`;
        } else {
          actionDesc = `${activeTeam.name} đọc vấp thử thách: Đứng im!`;
        }
        break;
      }
    }

    onApplyTarotEffect(actionDesc, updated, wasResetAll);
  };

  const getPhaseLabel = () => {
    if (currentQuestionNumber <= 7) return 'Giai đoạn 1 (Câu 1-7): Xuất phát thần tốc';
    if (currentQuestionNumber <= 14) return 'Giai đoạn 2 (Câu 8-14): Giông bão & Thử thách';
    return 'Giai đoạn 3 (Câu 15-20): Kịch tính về đích';
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md animate-in fade-in">
      <div className="relative w-full max-w-4xl bg-stone-900 border-2 border-amber-600/70 rounded-2xl p-6 sm:p-8 shadow-[0_0_50px_rgba(0,0,0,0.9)] flex flex-col items-center">
        {/* Ornate corner brass rivets */}
        <div className="absolute top-3 left-3 text-amber-500/50 text-sm">✦</div>
        <div className="absolute top-3 right-3 text-amber-500/50 text-sm">✦</div>
        <div className="absolute bottom-3 left-3 text-amber-500/50 text-sm">✦</div>
        <div className="absolute bottom-3 right-3 text-amber-500/50 text-sm">✦</div>

        {/* Modal Header */}
        <div className="text-center mb-4">
          <div className="inline-flex items-center gap-2 text-xs font-cinzel tracking-widest text-amber-400 uppercase font-bold mb-1">
            <i className="fa-solid fa-moon"></i>
            <span>VÒNG XOAY ĐỊNH MỆNH · BỐC BÀI TAROT</span>
            <i className="fa-solid fa-sun"></i>
          </div>
          <h2 className="text-2xl sm:text-3xl font-black font-cinzel text-amber-200">
            LƯỢT BỐC BÀI CỦA {activeTeam.name.toUpperCase()} {activeTeam.emoji}
          </h2>
          <div className="mt-1 text-xs text-amber-400/80 font-medium">
            {getPhaseLabel()}
          </div>
        </div>

        {/* Shuffling Status Indicator */}
        {isShuffling && (
          <div className="flex items-center gap-2 mb-3 text-xs font-cinzel text-amber-300 animate-pulse bg-amber-950/60 px-3 py-1 rounded-full border border-amber-700/50">
            <i className="fa-solid fa-arrows-rotate animate-spin"></i>
            <span>Thuật toán Fisher-Yates đang tráo đổi 10 lá bài...</span>
          </div>
        )}

        {/* Cards Arena (10 cards in 2 rows of 5) */}
        {!selectedCard ? (
          <div className="w-full">
            <div className="grid grid-cols-5 gap-2.5 sm:gap-4 max-w-3xl mx-auto py-2">
              {shuffledDeck.slice(0, 10).map((card, idx) => (
                <div
                  key={`${card.id}-${idx}`}
                  onClick={() => handleCardClick(card)}
                  className={`group relative h-36 sm:h-44 rounded-xl border-2 border-amber-500/60 bg-gradient-to-b from-amber-950 via-stone-900 to-amber-950 shadow-lg cursor-pointer transform transition-all duration-300 ${
                    isShuffling
                      ? 'scale-95 animate-pulse rotate-1'
                      : 'hover:-translate-y-2 hover:scale-105 hover:border-amber-300 hover:shadow-[0_0_20px_rgba(245,158,11,0.5)]'
                  }`}
                >
                  {/* Card Back Ornate Nautical Pattern */}
                  <div className="w-full h-full p-2 flex flex-col items-center justify-between border border-amber-600/30 rounded-lg bg-[radial-gradient(#b45309_1px,transparent_1px)] bg-[size:10px_10px]">
                    <div className="text-[10px] text-amber-400/80 font-cinzel font-bold">
                      #{idx + 1}
                    </div>
                    <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full border border-amber-400/40 flex items-center justify-center bg-stone-950/60 shadow-inner group-hover:rotate-45 transition-transform duration-500">
                      <i className="fa-solid fa-compass text-amber-400 text-base sm:text-lg"></i>
                    </div>
                    <div className="text-[9px] text-amber-300/70 font-cinzel uppercase tracking-widest">
                      TAROT
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Single Revealed Card in 3D */
          <div className="w-full max-w-md mx-auto my-3 flex flex-col items-center perspective-1000">
            <div
              className={`w-72 sm:w-80 h-92 rounded-2xl border-4 border-amber-400 shadow-[0_0_40px_rgba(245,158,11,0.5)] transform-style-3d transition-transform duration-700 ${
                isFlipped ? 'rotate-y-180' : ''
              }`}
            >
              {/* Back Face (before flip) */}
              <div className="absolute inset-0 backface-hidden rounded-xl bg-gradient-to-b from-amber-950 to-stone-900 flex flex-col items-center justify-center border border-amber-500/40 p-6">
                <i className="fa-solid fa-compass text-5xl text-amber-400 animate-spin-slow"></i>
                <span className="mt-4 font-cinzel text-amber-200 text-sm font-bold tracking-widest">ĐANG LẬT BÀI...</span>
              </div>

              {/* Front Face (revealed after 180deg flip) */}
              <div className="absolute inset-0 backface-hidden rotate-y-180 rounded-xl bg-gradient-to-b from-stone-900 via-amber-950 to-stone-900 border-2 border-amber-300 p-6 flex flex-col items-center justify-between text-center">
                {/* Header Badge */}
                <div className="w-full flex items-center justify-between border-b border-amber-500/30 pb-2">
                  <span className="text-xs font-cinzel font-bold text-amber-400">LÁ BÀI TAROT</span>
                  <span className="text-xs text-amber-300">✦ HẢI TRÌNH ✦</span>
                </div>

                {/* Central Emblem & Strict Concise Text */}
                <div className="my-auto space-y-4">
                  <div className={`w-20 h-20 mx-auto rounded-full bg-gradient-to-br ${selectedCard.themeColor} flex items-center justify-center shadow-lg text-white border-2 border-yellow-300`}>
                    <i className={`${selectedCard.iconName} text-3xl`}></i>
                  </div>

                  {/* Concise Title only */}
                  <h3 className="text-xl sm:text-2xl font-black font-cinzel text-amber-100 leading-snug drop-shadow-md">
                    {selectedCard.title}
                  </h3>
                </div>

                {/* Bottom Card Footer */}
                <div className="w-full pt-2 border-t border-amber-500/30 text-[11px] text-amber-400/80 font-cinzel">
                  Quyết định của biển cả
                </div>
              </div>
            </div>

            {/* Special Options if Card 8: Tấn công 1 đội bất kì */}
            {isFlipped && selectedCard.actionType === 'attack_target' && (
              <div className="w-full mt-4 bg-stone-950/85 border border-rose-700/60 rounded-xl p-4 text-center animate-in fade-in">
                <p className="text-xs font-bold text-rose-300 mb-2">
                  <i className="fa-solid fa-skull mr-1"></i>
                  Chọn 1 hạm đội đối thủ để tấn công (Trừ 2 bước):
                </p>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  {allTeams
                    .filter((t) => t.id !== activeTeam.id)
                    .map((t) => (
                      <button
                        key={t.id}
                        type="button"
                        onClick={() => setTargetTeamId(t.id)}
                        className={`p-2.5 rounded-lg border text-xs font-semibold flex flex-col items-center gap-1 transition-all cursor-pointer ${
                          targetTeamId === t.id
                            ? 'bg-rose-900 border-rose-400 text-white shadow-lg ring-2 ring-rose-400 scale-105'
                            : 'bg-stone-900 border-stone-700 text-stone-300 hover:border-amber-500'
                        }`}
                      >
                        <span className="text-xl">{t.emoji}</span>
                        <span className="truncate w-full font-bold">{t.name}</span>
                        <span className="text-[10px] text-stone-400">Mốc: {t.position}/10</span>
                      </button>
                    ))}
                </div>
              </div>
            )}

            {/* Special Options if Card 10: Thử thách đọc nhanh câu líu lưỡi */}
            {isFlipped && selectedCard.actionType === 'tongue_twister' && (
              <div className="w-full mt-4 bg-stone-950/90 border border-purple-600/70 rounded-xl p-4 text-center animate-in fade-in">
                <div className="flex items-center justify-center gap-2 text-amber-300 text-xs font-bold mb-2">
                  <i className="fa-solid fa-stopwatch text-base"></i>
                  <span>Đồng hồ thử thách: {challengeTimer}s</span>
                </div>

                <div className="flex justify-center gap-2 mb-3">
                  {!timerRunning && challengeTimer === 15 ? (
                    <button
                      type="button"
                      onClick={() => setTimerRunning(true)}
                      className="px-3.5 py-1.5 bg-amber-600 hover:bg-amber-500 text-stone-950 text-xs font-bold rounded-lg cursor-pointer"
                    >
                      <i className="fa-solid fa-play mr-1"></i> Bắt đầu bấm giờ (15s)
                    </button>
                  ) : timerRunning ? (
                    <button
                      type="button"
                      onClick={() => setTimerRunning(false)}
                      className="px-3 py-1.5 bg-stone-700 hover:bg-stone-600 text-amber-200 text-xs font-bold rounded-lg cursor-pointer"
                    >
                      <i className="fa-solid fa-pause mr-1"></i> Tạm dừng
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => {
                        setChallengeTimer(15);
                        setTimerRunning(true);
                      }}
                      className="px-3 py-1.5 bg-stone-700 hover:bg-stone-600 text-amber-200 text-xs font-bold rounded-lg cursor-pointer"
                    >
                      <i className="fa-solid fa-rotate mr-1"></i> Đặt lại giờ
                    </button>
                  )}
                </div>

                <div className="flex justify-center gap-3">
                  <button
                    type="button"
                    onClick={() => handleApply(true)}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                  >
                    <i className="fa-solid fa-check mr-1.5"></i> Đọc chuẩn (+1 bước)
                  </button>
                  <button
                    type="button"
                    onClick={() => handleApply(false)}
                    className="px-5 py-2.5 bg-rose-700 hover:bg-rose-600 text-white text-xs font-bold rounded-xl shadow-md cursor-pointer"
                  >
                    <i className="fa-solid fa-xmark mr-1.5"></i> Vấp từ (Đứng im)
                  </button>
                </div>
              </div>
            )}

            {/* Standard Confirmation Button */}
            {isFlipped && selectedCard.actionType !== 'tongue_twister' && (
              <div className="mt-5 flex justify-center">
                <button
                  type="button"
                  onClick={() => handleApply(true)}
                  className="px-8 py-3.5 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-stone-950 font-cinzel font-black text-sm sm:text-base rounded-xl shadow-[0_4px_20px_rgba(245,158,11,0.5)] hover:scale-105 active:scale-95 transition-all border border-yellow-300 cursor-pointer"
                >
                  <span>ÁP DỤNG & CHUYỂN ĐỘI TIẾP THEO</span>
                </button>
              </div>
            )}
          </div>
        )}

        {/* Modal Close option */}
        <button
          type="button"
          onClick={onClose}
          className="mt-4 text-xs text-stone-400 hover:text-stone-200 underline cursor-pointer"
        >
          Đóng (Dành cho MC)
        </button>
      </div>
    </div>
  );
};
