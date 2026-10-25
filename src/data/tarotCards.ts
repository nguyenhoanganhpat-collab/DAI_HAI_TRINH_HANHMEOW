import { TarotCard } from '../types';

export const ALL_TAROT_CARDS: TarotCard[] = [
  {
    id: 1,
    title: "Tiến 2 bước",
    actionType: "advance_2",
    themeColor: "from-amber-600 to-yellow-500",
    iconName: "fa-solid fa-angles-right",
  },
  {
    id: 2,
    title: "Tiến 1 bước",
    actionType: "advance_1",
    themeColor: "from-emerald-600 to-teal-500",
    iconName: "fa-solid fa-angle-right",
  },
  {
    id: 3,
    title: "Đứng im",
    actionType: "stay",
    themeColor: "from-slate-600 to-zinc-500",
    iconName: "fa-solid fa-anchor",
  },
  {
    id: 4,
    title: "Lùi 2 bước",
    actionType: "retreat_2",
    themeColor: "from-rose-700 to-red-500",
    iconName: "fa-solid fa-angles-left",
  },
  {
    id: 5,
    title: "Lùi 1 bước",
    actionType: "retreat_1",
    themeColor: "from-orange-600 to-amber-500",
    iconName: "fa-solid fa-angle-left",
  },
  {
    id: 6,
    title: "Đội trước đó tiến 1 bước",
    actionType: "prev_advance_1",
    themeColor: "from-cyan-600 to-blue-500",
    iconName: "fa-solid fa-handshake",
  },
  {
    id: 7,
    title: "Tất cả về vị trí xuất phát",
    actionType: "reset_all",
    themeColor: "from-red-800 to-rose-900",
    iconName: "fa-solid fa-tornado",
  },
  {
    id: 8,
    title: "Tấn công 1 đội bất kì (-2 bước đội bị chọn)",
    actionType: "attack_target",
    themeColor: "from-purple-700 to-indigo-800",
    iconName: "fa-solid fa-skull-crossbones",
  },
  {
    id: 9,
    title: "Đội bét bảng được cộng 2 bước",
    actionType: "boost_last",
    themeColor: "from-lime-600 to-emerald-600",
    iconName: "fa-solid fa-life-ring",
  },
  {
    id: 10,
    title: "Thử thách: Đọc nhanh không vấp: \"Luộc hột vịt lộn, luộc lộn hột vịt lạc, ăn lộn hột vịt lạc, luộc lại hột vịt lộn\"",
    actionType: "tongue_twister",
    themeColor: "from-fuchsia-700 to-pink-600",
    iconName: "fa-solid fa-feather-pointed",
  },
];

export const TAROT_CARDS = ALL_TAROT_CARDS;

/**
 * Game Logic Engine: Generates a 10-card weighted pool based on game phase.
 *
 * Phase 1a (Q1-5):  90% Advance — Khởi hành thần tốc, tạo hưng phấn cho người chơi
 * Phase 1b (Q6-7):  70% Advance — Chớm sóng, bắt đầu xuất hiện bài không thuận
 * Phase 2a (Q8-11): ~30% Advance — Sóng gió bùng phát. "Tất cả về xuất phát" xuất hiện
 *                   ĐÚNG 1 LẦN DUY NHẤT trong cửa sổ câu 9-11 nếu chưa xảy ra.
 * Phase 2b (Q12-14): 20% Advance — Giông bão dữ dội, retreat và challenge tăng mạnh
 * Phase 3  (Q15-20): Kịch tính quyết chiến — Attack, Boost last, Retreat 2, Advance 2
 *
 * Pool size: 10 cards, shuffled with Fisher-Yates algorithm.
 */
export function getPhaseWeightedCardPool(
  questionNumber: number,
  hasResetAllOccurred: boolean
): TarotCard[] {
  const c1 = ALL_TAROT_CARDS.find((c) => c.id === 1)!; // Tiến 2
  const c2 = ALL_TAROT_CARDS.find((c) => c.id === 2)!; // Tiến 1
  const c3 = ALL_TAROT_CARDS.find((c) => c.id === 3)!; // Đứng im
  const c4 = ALL_TAROT_CARDS.find((c) => c.id === 4)!; // Lùi 2
  const c5 = ALL_TAROT_CARDS.find((c) => c.id === 5)!; // Lùi 1
  const c6 = ALL_TAROT_CARDS.find((c) => c.id === 6)!; // Đội trước đó tiến 1
  const c7 = ALL_TAROT_CARDS.find((c) => c.id === 7)!; // Tất cả về xuất phát
  const c8 = ALL_TAROT_CARDS.find((c) => c.id === 8)!; // Tấn công 1 đội (-2)
  const c9 = ALL_TAROT_CARDS.find((c) => c.id === 9)!; // Đội bét bảng +2
  const c10 = ALL_TAROT_CARDS.find((c) => c.id === 10)!; // Thử thách đọc nhanh

  let pool: TarotCard[] = [];

  if (questionNumber <= 5) {
    // Phase 1a (Câu 1-5): 90% Advance — Khởi hành thần tốc
    // 3x tiến2 + 6x tiến1 + 1x đứng im = 9/10 advance
    pool = [c1, c1, c1, c2, c2, c2, c2, c2, c2, c3];

  } else if (questionNumber <= 7) {
    // Phase 1b (Câu 6-7): 70% Advance — Chớm sóng
    // 2x tiến2 + 3x tiến1 + 2x đứng im + 1x lùi1 + 2x đội trước tiến1
    pool = [c1, c1, c2, c2, c2, c3, c3, c5, c6, c6];

  } else if (questionNumber <= 11) {
    // Phase 2a (Câu 8-11): ~30% Advance — Sóng gió bùng phát
    // Card 7 "Tất cả về vị trí xuất phát" CHỈ ĐƯỢC XUẤT HIỆN DUY NHẤT 1 LẦN (cửa sổ câu 9-11)
    const canIncludeReset = !hasResetAllOccurred && questionNumber >= 9 && questionNumber <= 11;

    if (canIncludeReset) {
      // Có reset_all: 2x tiến + 1x đứng im + 2x lùi1 + 2x lùi2 + 1x challenge + 1x đứng im + 1x reset
      pool = [c7, c4, c4, c5, c5, c3, c10, c2, c1, c3];
    } else {
      // Không có reset_all: tăng lùi và challenge
      pool = [c4, c4, c5, c5, c3, c10, c2, c1, c6, c3];
    }

  } else if (questionNumber <= 14) {
    // Phase 2b (Câu 12-14): 20% Advance — Giông bão dữ dội
    // 2x lùi2 + 2x lùi1 + 2x challenge + 2x đứng im + 1x tiến2 + 1x tiến1
    pool = [c4, c4, c5, c5, c10, c10, c3, c3, c2, c1];

  } else {
    // Phase 3 (Câu 15-20): Kịch tính về đích — Attack, Boost last, Retreat 2, Advance 2
    pool = [c8, c8, c9, c9, c4, c4, c1, c1, c2, c10];
  }

  // Fisher-Yates shuffle the 10 mystery cards
  const shuffled = [...pool];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }

  return shuffled;
}

/**
 * Draws a single random card from a given pool (or creates a new phase pool).
 * Can be called externally to get just one card without managing the full deck UI.
 * @param pool - Pre-generated pool from getPhaseWeightedCardPool, or null to use phase logic
 * @param questionNumber - Used if pool is null
 * @param hasResetAllOccurred - Used if pool is null
 */
export function drawSingleCard(
  pool: TarotCard[] | null,
  questionNumber?: number,
  hasResetAllOccurred?: boolean
): TarotCard {
  const deck = pool ?? getPhaseWeightedCardPool(questionNumber ?? 1, hasResetAllOccurred ?? false);
  return deck[Math.floor(Math.random() * deck.length)];
}
