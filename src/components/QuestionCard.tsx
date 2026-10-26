import React, { useState, useEffect, useRef } from "react";
import { Question, Team } from "../types";
import { sounds } from "../utils/audio";

interface Props {
  question: Question;
  activeTeam: Team;
  currentNumber: number;
  totalQuestions: number;
  onNextQuestion: () => void;
  onPrevQuestion: () => void;
  onOpenTarot: () => void;
  onSelectQuestion: (index: number) => void;
}

export const QuestionCard: React.FC<Props> = ({
  question,
  activeTeam,
  currentNumber,
  totalQuestions,
  onNextQuestion,
  onPrevQuestion,
  onOpenTarot,
}) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isChecked, setIsChecked] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean | null>(null);
  const [userTextInput, setUserTextInput] = useState<string>("");
  const [isImageZoomed, setIsImageZoomed] = useState(false);

  // Interactive word bank state
  const [selectedWords, setSelectedWords] = useState<string[]>([]);
  const [wordBank, setWordBank] = useState<string[]>([]);

  // Auto-transition countdown to Tarot modal
  const [tarotCountdown, setTarotCountdown] = useState<number | null>(null);
  const countdownTimerRef = useRef<NodeJS.Timeout | null>(null);

  // Reset local state when question changes
  useEffect(() => {
    setSelectedOption(null);
    setIsChecked(false);
    setIsCorrect(null);
    setUserTextInput("");
    setSelectedWords([]);
    setTarotCountdown(null);
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }

    const match = question.question.match(/\[([^\]]+)\]/g);
    if (match && match.length > 0) {
      const words = match.map((w) => w.replace(/[\[\]]/g, "").trim());
      const uniqueWords = Array.from(new Set(words));
      setWordBank([...uniqueWords].sort(() => Math.random() - 0.5));
    } else {
      setWordBank([]);
    }
  }, [question.id, question.question]);

  useEffect(() => {
    return () => {
      if (countdownTimerRef.current) {
        clearInterval(countdownTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (!isImageZoomed) return;

    const handleEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsImageZoomed(false);
    };

    window.addEventListener("keydown", handleEscape);
    return () => window.removeEventListener("keydown", handleEscape);
  }, [isImageZoomed]);

  const handleSelectOption = (index: number) => {
    if (isChecked) return;
    setSelectedOption(index);
    sounds.playFlip();
  };

  const handleWordBankClick = (word: string) => {
    if (isChecked) return;
    sounds.playFlip();
    if (selectedWords.includes(word)) {
      setSelectedWords(selectedWords.filter((w) => w !== word));
    } else {
      setSelectedWords([...selectedWords, word]);
    }
  };

  const startAutoTarotTransition = () => {
    let count = 2;
    setTarotCountdown(count);
    if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);

    countdownTimerRef.current = setInterval(() => {
      count -= 1;
      if (count <= 0) {
        if (countdownTimerRef.current) clearInterval(countdownTimerRef.current);
        setTarotCountdown(null);
        onOpenTarot();
      } else {
        setTarotCountdown(count);
      }
    }, 750); // ~1.5s total delay
  };

  const cancelAutoTarot = () => {
    if (countdownTimerRef.current) {
      clearInterval(countdownTimerRef.current);
      countdownTimerRef.current = null;
    }
    setTarotCountdown(null);
  };

  const handleCheckAnswer = () => {
    setIsChecked(true);

    let correctCheck = true;
    if (question.options && typeof question.correct === "number") {
      correctCheck = selectedOption === question.correct;
    } else if (question.correct_text) {
      const cleanInput = userTextInput.trim().toLowerCase();
      const cleanTarget = question.correct_text.toLowerCase();
      correctCheck = cleanInput.length > 0 && cleanTarget.includes(cleanInput);
    }

    setIsCorrect(correctCheck);
    if (correctCheck) {
      sounds.playCorrect();
    } else {
      sounds.playWrong();
    }

    // Auto-transition to Tarot modal after 1.5s
    startAutoTarotTransition();
  };

  const isTrueFalse =
    question.options &&
    question.options.length === 2 &&
    (question.options[0] === "ĐÚNG" || question.options[0] === "SAI");

  return (
    <div className="relative parchment-card rounded-xl p-4 sm:p-5 border-2 border-amber-800/80 shadow-xl wood-frame text-stone-900 w-full h-full min-h-0 flex flex-col overflow-y-auto">
      {/* Top Header Row (Compact) */}
      <div className="flex items-center justify-between gap-2 pb-2 border-b border-amber-800/30 shrink-0">
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded bg-amber-900 text-amber-100 font-cinzel font-bold text-xs tracking-wider shadow-xs">
            CÂU {currentNumber} / {totalQuestions}
          </span>
          <span className="text-[11px] text-amber-950 font-semibold hidden md:inline">
            Triết học Mác - Lênin & Deepfake
          </span>
        </div>

        {/* Turn Indicator */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg border text-xs font-bold text-white shadow-xs"
          style={{
            backgroundColor: activeTeam.color,
            borderColor: activeTeam.borderColor,
          }}
        >
          <span className="text-sm">{activeTeam.emoji}</span>
          <span className="truncate max-w-[120px] sm:max-w-[180px]">
            Đang chơi: {activeTeam.name}
          </span>
        </div>

        {/* Nav arrows */}
        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={onPrevQuestion}
            className="w-7 h-7 rounded bg-amber-200/80 hover:bg-amber-300 text-amber-950 font-bold flex items-center justify-center transition-colors cursor-pointer text-xs"
            title="Câu trước"
          >
            <i className="fa-solid fa-chevron-left text-[10px]"></i>
          </button>
          <button
            type="button"
            onClick={onNextQuestion}
            className="w-7 h-7 rounded bg-amber-200/80 hover:bg-amber-300 text-amber-950 font-bold flex items-center justify-center transition-colors cursor-pointer text-xs"
            title="Câu sau"
          >
            <i className="fa-solid fa-chevron-right text-[10px]"></i>
          </button>
        </div>
      </div>

      {/* Question Central Body (Dominant Large Text) */}
      <div className="flex-1 shrink-0 py-2">
        {question.imageUrl && (
          <img
            key={question.imageUrl}
            src={question.imageUrl}
            alt={`Ảnh minh họa câu ${currentNumber}`}
            onClick={() => setIsImageZoomed(true)}
            title="Bấm để phóng to ảnh"
            className="block w-full max-h-[28dvh] object-contain rounded-lg mb-3 bg-white/60 cursor-zoom-in hover:opacity-90 transition-opacity"
          />
        )}
        <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-black text-stone-900 leading-snug font-sans tracking-tight mb-3">
          {question.question}
        </h2>

        {/* True/False Buttons */}
        {isTrueFalse && (
          <div className="grid grid-cols-2 gap-3 my-2">
            {question.options!.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectAnswer = isChecked && idx === question.correct;
              const isWrongSelected =
                isChecked && isSelected && idx !== question.correct;

              let btnStyle =
                "bg-white/90 border-amber-400 text-stone-800 hover:bg-amber-100";
              if (isCorrectAnswer) {
                btnStyle =
                  "bg-emerald-500 border-emerald-600 text-white font-black shadow-lg ring-3 ring-emerald-300";
              } else if (isWrongSelected) {
                btnStyle =
                  "bg-rose-600 border-rose-700 text-white font-bold ring-2 ring-rose-400";
              } else if (isSelected) {
                btnStyle =
                  "bg-amber-500 border-amber-600 text-stone-950 font-black shadow-md ring-2 ring-amber-400";
              }

              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => handleSelectOption(idx)}
                  className={`py-3.5 px-4 rounded-xl border-2 text-lg sm:text-2xl font-cinzel font-black flex items-center justify-center gap-2.5 transition-all cursor-pointer ${btnStyle}`}
                >
                  <i
                    className={`fa-solid ${option === "ĐÚNG" ? "fa-circle-check text-emerald-400" : "fa-circle-xmark text-rose-400"}`}
                  ></i>
                  <span>{option}</span>
                </button>
              );
            })}
          </div>
        )}

        {/* 4 Options */}
        {!isTrueFalse && question.options && question.options.length > 0 && (
          <div className="space-y-2 my-1">
            {question.options.map((option, idx) => {
              const isSelected = selectedOption === idx;
              const isCorrectAnswer = isChecked && idx === question.correct;
              const isWrongSelected =
                isChecked && isSelected && idx !== question.correct;

              let cardStyle =
                "bg-white/90 border-amber-300/80 hover:bg-amber-100/70 hover:border-amber-500 text-stone-800";
              if (isCorrectAnswer) {
                cardStyle =
                  "bg-emerald-100 border-emerald-600 text-emerald-950 font-bold ring-2 ring-emerald-500 shadow-sm";
              } else if (isWrongSelected) {
                cardStyle =
                  "bg-rose-100 border-rose-500 text-rose-950 font-semibold ring-1 ring-rose-400";
              } else if (isSelected) {
                cardStyle =
                  "bg-amber-200 border-amber-600 text-stone-900 font-bold ring-2 ring-amber-500 shadow-xs";
              }

              return (
                <div
                  key={idx}
                  onClick={() => handleSelectOption(idx)}
                  className={`p-2.5 sm:p-3 rounded-lg border-2 transition-all cursor-pointer flex items-center justify-between text-xs sm:text-sm ${cardStyle}`}
                >
                  <span className="leading-tight font-medium">{option}</span>
                  <div className="shrink-0 ml-2">
                    {isCorrectAnswer && (
                      <i className="fa-solid fa-circle-check text-emerald-600 text-base"></i>
                    )}
                    {isWrongSelected && (
                      <i className="fa-solid fa-circle-xmark text-rose-600 text-base"></i>
                    )}
                    {!isChecked && isSelected && (
                      <i className="fa-solid fa-circle-dot text-amber-700 text-sm"></i>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Word Bank & Fill-in Questions */}
        {(!question.options || question.options.length === 0) && (
          <div className="space-y-2 my-1">
            {wordBank.length > 0 && (
              <div className="p-2.5 bg-amber-100/80 rounded-lg border border-amber-400">
                <span className="text-[10px] font-bold text-amber-900 uppercase tracking-wider block mb-1">
                  Kho từ gợi ý:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {wordBank.map((word) => {
                    const isPicked = selectedWords.includes(word);
                    const pickIndex = selectedWords.indexOf(word) + 1;
                    return (
                      <button
                        key={word}
                        type="button"
                        onClick={() => handleWordBankClick(word)}
                        className={`px-2.5 py-1 rounded text-xs font-bold border transition-all cursor-pointer ${
                          isPicked
                            ? "bg-amber-600 text-white border-amber-700 shadow-xs"
                            : "bg-white text-stone-800 border-amber-300 hover:bg-amber-50"
                        }`}
                      >
                        {isPicked && (
                          <span className="mr-1 text-[10px] bg-black/20 px-1 rounded">
                            ({pickIndex})
                          </span>
                        )}
                        {word}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            <div className="flex gap-2">
              <input
                type="text"
                value={userTextInput}
                onChange={(e) => setUserTextInput(e.target.value)}
                placeholder="Nhập đáp án tại đây..."
                className="flex-1 px-3 py-2 rounded-lg border-2 border-amber-300 bg-white text-xs sm:text-sm focus:outline-none focus:border-amber-600 font-medium"
              />
            </div>

            {isChecked && question.correct_text && (
              <div className="p-2 rounded-lg bg-emerald-100 border border-emerald-600 text-emerald-950 animate-in fade-in">
                <span className="text-xs uppercase font-bold tracking-wider text-emerald-800 block">
                  ĐÁP ÁN:
                </span>
                <span className="text-sm font-bold font-cinzel text-emerald-950">
                  {question.correct_text}
                </span>
              </div>
            )}
          </div>
        )}
      </div>

      {isImageZoomed && question.imageUrl && (
        <div
          className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm p-4 sm:p-8 flex items-center justify-center cursor-zoom-out"
          role="dialog"
          aria-modal="true"
          aria-label="Ảnh phóng to"
          onClick={() => setIsImageZoomed(false)}
        >
          <div className="relative max-w-[95vw] max-h-[92dvh]" onClick={(event) => event.stopPropagation()}>
            <img
              src={question.imageUrl}
              alt={`Ảnh minh họa câu ${currentNumber} phóng to`}
              className="max-w-[95vw] max-h-[92dvh] object-contain rounded-xl shadow-2xl"
            />
            <button
              type="button"
              onClick={() => setIsImageZoomed(false)}
              className="absolute -right-2 -top-2 w-9 h-9 rounded-full bg-stone-900 text-white border border-amber-300 shadow-lg hover:bg-stone-700 cursor-pointer"
              aria-label="Đóng ảnh phóng to"
              title="Đóng (Esc)"
            >
              <i className="fa-solid fa-xmark" />
            </button>
          </div>
        </div>
      )}

      {/* Bottom Action Area (Compact) */}
      <div className="pt-2 border-t border-amber-800/30 shrink-0 space-y-2">
        <div className="flex items-center justify-between gap-2">
          {!isChecked ? (
            <button
              type="button"
              onClick={handleCheckAnswer}
              className="px-6 py-2 rounded-xl bg-gradient-to-r from-amber-700 to-amber-800 hover:from-amber-600 hover:to-amber-700 text-amber-50 font-cinzel font-black text-xs sm:text-sm tracking-wide shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer border border-amber-500"
            >
              <i className="fa-solid fa-check-double mr-1.5"></i>
              CHECK ĐÁP ÁN
            </button>
          ) : (
            <button
              type="button"
              onClick={() => {
                cancelAutoTarot();
                setIsChecked(false);
              }}
              className="px-3 py-1 rounded bg-stone-300 hover:bg-stone-400 text-stone-800 font-medium text-xs transition-colors cursor-pointer"
            >
              <i className="fa-solid fa-rotate-left mr-1"></i>
              Đóng kết quả
            </button>
          )}

          <button
            type="button"
            onClick={() => {
              cancelAutoTarot();
              onOpenTarot();
            }}
            className="group px-5 py-2 rounded-xl bg-gradient-to-r from-purple-800 to-indigo-800 hover:from-purple-700 hover:to-indigo-700 text-white font-cinzel font-bold text-xs sm:text-sm tracking-wide shadow-md hover:scale-105 active:scale-95 transition-all cursor-pointer border border-purple-400 animate-pulse"
          >
            <i className="fa-solid fa-wand-magic-sparkles mr-1.5 text-yellow-300"></i>
            BỐC BÀI
          </button>
        </div>

        {/* Auto Tarot Transition Notice */}
        {isChecked && tarotCountdown !== null && (
          <div className="px-3 py-1.5 bg-purple-950/95 text-purple-100 rounded-lg border border-purple-400 flex items-center justify-between animate-in fade-in text-xs">
            <span className="flex items-center gap-1.5">
              <i className="fa-solid fa-hourglass-half text-amber-400 animate-spin text-xs"></i>
              <span>
                Tự động mở bài Tarot sau{" "}
                <strong className="text-yellow-300 font-bold">
                  {tarotCountdown}s
                </strong>
                ...
              </span>
            </span>
            <div className="flex gap-1.5">
              <button
                type="button"
                onClick={() => {
                  cancelAutoTarot();
                  onOpenTarot();
                }}
                className="px-2 py-0.5 rounded bg-yellow-400 text-stone-950 font-bold text-[11px] shadow cursor-pointer"
              >
                Bốc ngay
              </button>
              <button
                type="button"
                onClick={cancelAutoTarot}
                className="px-1.5 py-0.5 rounded bg-stone-800 text-stone-300 text-[11px] cursor-pointer"
              >
                Dừng
              </button>
            </div>
          </div>
        )}

        {/* Detailed Explanation Box */}
        {isChecked && (
          <div className="p-2.5 sm:p-3 rounded-lg bg-amber-100/95 border border-amber-400 shadow-inner text-xs leading-relaxed text-stone-800 animate-in fade-in">
            <div className="flex items-center gap-2 mb-1">
              <span
                className={`px-2 py-0.5 rounded text-white font-black text-[10px] uppercase ${isCorrect ? "bg-emerald-600" : "bg-rose-600"}`}
              >
                {isCorrect ? "CHÍNH XÁC!" : "CHƯA CHÍNH XÁC!"}
              </span>
              <span className="font-cinzel font-bold text-amber-950 text-[11px]">
                GIẢI THÍCH CHI TIẾT:
              </span>
            </div>
            <p className="font-sans text-stone-800 text-xs leading-snug line-clamp-3 hover:line-clamp-none transition-all">
              {question.explain}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};
