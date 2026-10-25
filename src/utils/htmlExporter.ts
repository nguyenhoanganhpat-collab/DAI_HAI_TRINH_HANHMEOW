import { INITIAL_QUESTIONS } from '../data/questions';
import { ALL_TAROT_CARDS } from '../data/tarotCards';
import { TRACK_WAYPOINTS } from '../data/tracks';

export function getStandaloneHtmlString(): string {
  return `<!DOCTYPE html>
<html lang="vi">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>ĐẠI HẢI TRÌNH - Game Thuyết Trình Hải Trình & Triết Học</title>
  <script src="https://cdn.tailwindcss.com"></script>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Be+Vietnam+Pro:ital,wght@0,300;0,400;0,500;0,600;0,700;0,800;0,900;1,400&family=Cinzel:wght@600;700;900&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.6.0/css/all.min.css">
  <style>
    body { font-family: 'Be Vietnam Pro', sans-serif; }
    .font-cinzel { font-family: 'Cinzel', serif; }
    .perspective-1000 { perspective: 1000px; }
    .transform-style-3d { transform-style: preserve-3d; }
    .backface-hidden { backface-visibility: hidden; -webkit-backface-visibility: hidden; }
    .rotate-y-180 { transform: rotateY(180deg); }
    .parchment {
      background-color: #fcf8ee;
      background-image: radial-gradient(#d4af37 0.75px, transparent 0.75px), radial-gradient(#d4af37 0.75px, #fcf8ee 0.75px);
      background-size: 20px 20px;
      background-position: 0 0, 10px 10px;
    }
    /* Custom thin scrollbar */
    ::-webkit-scrollbar { width: 5px; height: 5px; }
    ::-webkit-scrollbar-thumb { background: rgba(180, 83, 9, 0.5); border-radius: 4px; }
  </style>
</head>
<body class="bg-stone-950 text-stone-100 antialiased selection:bg-amber-500 selection:text-white h-screen overflow-hidden">
  <div id="app" class="h-screen w-full flex flex-col justify-between overflow-hidden"></div>

  <script>
    const questions = ${JSON.stringify(INITIAL_QUESTIONS)};
    const allTarotCards = ${JSON.stringify(ALL_TAROT_CARDS)};
    const trackWaypoints = ${JSON.stringify(TRACK_WAYPOINTS)};
    
    // Synthesized Sound FX
    const sounds = {
      ctx: null,
      init() {
        if (!this.ctx) {
          const AC = window.AudioContext || window.webkitAudioContext;
          if (AC) this.ctx = new AC();
        }
        if (this.ctx && this.ctx.state === 'suspended') this.ctx.resume();
      },
      playChime() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        [523.25, 659.25, 783.99, 1046.50].forEach((f, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(f, now + idx * 0.08);
          gain.gain.setValueAtTime(0.2, now + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.08 + 0.4);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now + idx * 0.08);
          osc.stop(now + idx * 0.08 + 0.45);
        });
      },
      playWrong() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(160, now);
        osc.frequency.linearRampToValueAtTime(100, now + 0.3);
        gain.gain.setValueAtTime(0.2, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now);
        osc.stop(now + 0.35);
      },
      playShipBell() {
        this.init();
        if (!this.ctx) return;
        const now = this.ctx.currentTime;
        [880, 1760].forEach((f, idx) => {
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now);
          gain.gain.setValueAtTime(0.25, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 1.2);
          osc.connect(gain);
          gain.connect(this.ctx.destination);
          osc.start(now);
          osc.stop(now + 1.25);
        });
      }
    };

    // Game state
    let currentScreen = 'INTRO';
    let teams = [
      { id: 1, name: 'Hải Tặc Mũ Rơm', emoji: '🏴‍☠️', color: '#ef4444', position: 0, score: 0 },
      { id: 2, name: 'Chiến Hạm Hoàng Gia', emoji: '🚢', color: '#3b82f6', position: 0, score: 0 },
      { id: 3, name: 'Thủy Quái Kraken', emoji: '🐙', color: '#10b981', position: 0, score: 0 },
      { id: 4, name: 'Mỏ Neo Vàng', emoji: '⚓', color: '#f59e0b', position: 0, score: 0 },
      { id: 5, name: 'Vương Miện Hải Tặc', emoji: '👑', color: '#a855f7', position: 0, score: 0 }
    ];
    let activeTeamIndex = 0;
    let currentQuestionIndex = 0;
    let checkedAnswer = false;
    let isCorrect = null;
    let selectedOptionIndex = null;
    let textAnswerInput = '';
    let isTarotOpen = false;
    let drawnCard = null;
    let currentTarotDeck = [];
    let hasResetAllOccurred = false;
    let winner = null;
    let attackVictimId = null;
    let autoTimer = null;

    // Tarot Card Progression Logic Engine
    function getWeightedTarotDeck(qNum, hasReset) {
      const c1 = allTarotCards.find(c => c.id === 1); // Tiến 2
      const c2 = allTarotCards.find(c => c.id === 2); // Tiến 1
      const c3 = allTarotCards.find(c => c.id === 3); // Đứng im
      const c4 = allTarotCards.find(c => c.id === 4); // Lùi 2
      const c5 = allTarotCards.find(c => c.id === 5); // Lùi 1
      const c6 = allTarotCards.find(c => c.id === 6); // Đội trước tiến 1
      const c7 = allTarotCards.find(c => c.id === 7); // Reset all
      const c8 = allTarotCards.find(c => c.id === 8); // Tấn công (-2)
      const c9 = allTarotCards.find(c => c.id === 9); // Bét bảng +2
      const c10 = allTarotCards.find(c => c.id === 10); // Đọc líu lưỡi

      let pool = [];
      if (qNum <= 7) {
        // Giai đoạn đầu (Câu 1-7): 80% Tiến 1 hoặc Tiến 2
        pool = [c1, c1, c1, c1, c2, c2, c2, c2, c3, c6];
      } else if (qNum >= 8 && qNum <= 14) {
        // Giai đoạn giữa (Câu 8-14): Lùi, Đứng im, Thử thách. Lá 7 (Reset all) chỉ xuất hiện 1 lần duy nhất khoảng câu 9-12
        const canIncludeReset = !hasReset && qNum >= 9 && qNum <= 12;
        if (canIncludeReset) {
          pool = [c7, c4, c5, c3, c10, c2, c1, c5, c3, c10];
        } else {
          pool = [c4, c5, c3, c10, c2, c1, c5, c3, c6, c10];
        }
      } else {
        // Giai đoạn sau (Câu 15-20): Tấn công, Bét bảng +2, Lùi 2, Tiến 2
        pool = [c8, c8, c9, c9, c4, c4, c1, c1, c2, c10];
      }

      // Fisher-Yates shuffle
      const res = [...pool];
      for (let i = res.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [res[i], res[j]] = [res[j], res[i]];
      }
      return res;
    }

    function render() {
      const app = document.getElementById('app');
      if (currentScreen === 'INTRO') {
        app.innerHTML = renderIntro();
      } else if (currentScreen === 'SETUP') {
        app.innerHTML = renderSetup();
      } else if (currentScreen === 'ARENA') {
        app.innerHTML = renderArena();
      }
    }

    function renderIntro() {
      return \`
        <div class="h-screen w-full flex flex-col justify-between items-center text-center p-6 bg-stone-950 overflow-hidden">
          <div class="my-auto max-w-3xl space-y-6">
            <div class="w-24 h-24 mx-auto rounded-full border-2 border-amber-500 bg-amber-950/80 flex items-center justify-center text-5xl shadow-2xl animate-bounce">
              🏴‍☠️
            </div>
            <p class="text-xs font-cinzel tracking-widest text-amber-400 font-bold uppercase">Game Thuyết Trình Tương Tác</p>
            <h1 class="text-5xl sm:text-7xl font-black font-cinzel text-transparent bg-clip-text bg-gradient-to-r from-amber-200 via-yellow-400 to-amber-600">
              ĐẠI HẢI TRÌNH
            </h1>
            <p class="text-stone-300 text-sm sm:text-base max-w-xl mx-auto">
              Chuyến hải trình tri thức 5 hạm đội: Khám phá Lý luận nhận thức và Nghệ thuật giải mã Deepfake với 20 câu hỏi triết học và 10 thẻ bài Tarot định mệnh.
            </p>
            <div>
              <button onclick="sounds.playShipBell(); currentScreen = 'SETUP'; render();" class="px-8 py-4 bg-gradient-to-r from-amber-600 via-yellow-500 to-amber-600 text-stone-950 font-cinzel font-black text-lg rounded-xl shadow-xl hover:scale-105 active:scale-95 transition-all">
                BẮT ĐẦU HẢI TRÌNH
              </button>
            </div>
          </div>
          <div class="py-2 text-[11px] text-amber-400/60">Đại Hải Trình · Single-Viewport No-Scroll Edition</div>
        </div>
      \`;
    }

    function renderSetup() {
      return \`
        <div class="h-screen w-full p-6 max-w-4xl mx-auto flex flex-col justify-center overflow-hidden">
          <div class="text-center mb-6">
            <h2 class="text-3xl font-black font-cinzel text-amber-300">ĐẶT TÊN 5 ĐỘI CHƠI</h2>
            <p class="text-xs text-stone-400 mt-1">Chuẩn bị sẵn sàng 5 hạm đội cùng giong buồm ra khơi</p>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-5 gap-3 mb-6">
            \${teams.map((t, i) => \`
              <div class="p-3 rounded-xl bg-stone-900 border-2" style="border-color: \${t.color}">
                <div class="text-xs font-bold text-amber-400 mb-1">ĐỘI \${i + 1}</div>
                <div class="text-3xl text-center my-2">\${t.emoji}</div>
                <input type="text" value="\${t.name}" oninput="teams[\${i}].name = this.value" class="w-full text-xs font-semibold px-2 py-1.5 rounded bg-stone-950 border border-stone-700 text-center" />
              </div>
            \`).join('')}
          </div>
          <div class="text-center">
            <button onclick="sounds.playShipBell(); currentScreen = 'ARENA'; render();" class="px-8 py-3.5 bg-yellow-500 hover:bg-yellow-400 text-stone-950 font-cinzel font-bold text-base rounded-xl shadow-xl">
              XÁC NHẬN VÀ RA KHƠI
            </button>
          </div>
        </div>
      \`;
    }

    function renderArena() {
      const q = questions[currentQuestionIndex];
      const activeTeam = teams[activeTeamIndex];
      
      return \`
        <div class="h-screen max-h-screen w-full flex flex-col justify-between bg-stone-950 text-stone-100 overflow-hidden">
          <!-- Topbar (h-12) -->
          <div class="h-12 shrink-0 flex items-center justify-between px-4 sm:px-6 border-b border-amber-900/60 bg-stone-900">
            <div class="flex items-center gap-2 shrink-0">
              <span class="text-amber-400 font-cinzel font-bold text-sm sm:text-base">ĐẠI HẢI TRÌNH</span>
              <span class="text-xs text-stone-400 hidden sm:inline">· Câu \${currentQuestionIndex + 1}/20</span>
            </div>

            <!-- 5 Teams Turn Badges with Active Glow/Pulse -->
            <div class="flex items-center gap-1.5 sm:gap-2 overflow-x-auto py-1 max-w-[60%]">
              \${teams.map((t, idx) => {
                const isActive = idx === activeTeamIndex;
                return \`
                  <button onclick="sounds.playShipBell(); activeTeamIndex = \${idx}; render();" class="flex items-center gap-1 px-2 py-0.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap shrink-0 \${
                    isActive
                      ? 'bg-amber-950/95 border-2 border-amber-400 text-amber-200 ring-2 ring-amber-400 shadow-[0_0_15px_rgba(245,158,11,0.6)] animate-pulse'
                      : 'bg-stone-950/80 border border-stone-800 text-stone-400 hover:text-white'
                  }">
                    <span class="text-sm">\${t.emoji}</span>
                    <span class="truncate max-w-[80px]">\${t.name}</span>
                    \${isActive ? '<span class=\"text-yellow-400 text-[10px]\">👑</span>' : ''}
                  </button>
                \`;
              }).join('')}
            </div>

            <div class="flex items-center gap-2 shrink-0">
              <button onclick="sounds.playShipBell(); isTarotOpen = true; render();" class="px-2.5 py-1 bg-purple-700 hover:bg-purple-600 text-white font-cinzel font-bold text-xs rounded-lg shadow animate-pulse">
                Bốc Bài Tarot
              </button>
            </div>
          </div>

          <!-- Main Layout (Single Viewport - No Scroll) -->
          <div class="flex-1 min-h-0 flex flex-col gap-2 p-2.5 sm:p-3 max-w-[1500px] mx-auto w-full justify-between overflow-hidden">
            
            <!-- Compact World Map Overview at Top -->
            <div class="relative w-full h-24 sm:h-28 md:h-32 shrink-0 rounded-xl overflow-hidden border-2 border-amber-800 shadow-md bg-stone-900">
              <img src="world_map.png" onerror="this.src='world_map.jpg'" class="absolute inset-0 w-full h-full object-cover filter sepia contrast-110 opacity-75" />
              
              <svg class="absolute inset-0 w-full h-full pointer-events-none" viewBox="0 0 100 100" preserveAspectRatio="none">
                \${teams.map((t, idx) => {
                  const pts = trackWaypoints[idx];
                  const d = pts.map((p, i) => i === 0 ? 'M ' + p.x + ' ' + p.y : 'L ' + p.x + ' ' + p.y).join(' ');
                  return \`<path d="\${d}" fill="none" stroke="\${t.color}" stroke-width="1.2" stroke-dasharray="2, 1" stroke-opacity="0.9" />\`;
                }).join('')}
              </svg>

              <div class="absolute inset-0 p-2">
                \${teams.map((t, tIdx) => {
                  const pts = trackWaypoints[tIdx];
                  const pos = t.position;
                  const curPt = pts[Math.min(pos, 10)];
                  const isActive = tIdx === activeTeamIndex;
                  return \`
                    <div class="absolute flex flex-col items-center transition-all duration-700 z-20 pointer-events-none" style="left: \${curPt.x}%; top: \${curPt.y}%; transform: translate(-50%, -50%);">
                      <span class="text-base sm:text-lg filter drop-shadow animate-bounce">\${t.emoji}</span>
                      <span class="text-[8px] font-bold px-1.5 py-0.5 rounded shadow text-white whitespace-nowrap \${isActive ? 'ring-2 ring-yellow-400' : ''}" style="background-color: \${t.color}">\${t.name}</span>
                    </div>
                  \`;
                }).join('')}

                <div class="absolute right-2 top-1/2 -translate-y-1/2 text-center z-10 bg-amber-500 text-stone-950 px-2 py-0.5 rounded shadow border border-yellow-200">
                  <span class="text-sm">🚩</span>
                  <div class="text-[8px] font-bold font-cinzel">ĐÍCH 🏆</div>
                </div>
              </div>
            </div>

            <!-- 20 Questions Quick Navigation Strip -->
            <div class="shrink-0 flex items-center justify-between gap-2 px-3 py-1.5 rounded-xl bg-stone-900 border border-amber-900/60 shadow">
              <div class="flex items-center gap-2 overflow-x-auto py-0.5">
                <span class="text-[11px] font-cinzel font-black text-amber-300 whitespace-nowrap shrink-0">CÂU HỎI:</span>
                <div class="flex items-center gap-1 shrink-0">
                  \${questions.map((_, idx) => \`
                    <button onclick="currentQuestionIndex = \${idx}; checkedAnswer = false; selectedOptionIndex = null; textAnswerInput = ''; render();" class="w-7 h-6 sm:w-8 sm:h-7 rounded text-xs font-bold font-mono transition-all flex items-center justify-center \${
                      currentQuestionIndex === idx ? 'bg-amber-500 text-stone-950 font-black ring-2 ring-yellow-300 shadow-md scale-105' : 'bg-stone-950 text-stone-300 hover:bg-amber-950 hover:text-amber-200 border border-stone-800'
                    }">
                      \${idx + 1}
                    </button>
                  \`).join('')}
                </div>
              </div>
              <div class="text-xs text-amber-400 font-bold hidden sm:inline whitespace-nowrap">
                Lượt: \${activeTeam.name} \${activeTeam.emoji}
              </div>
            </div>

            <!-- Main Center Question Arena (Dominant Focus - Full Width) -->
            <div class="flex-1 min-h-0 p-4 sm:p-5 rounded-2xl parchment border-2 border-amber-800 shadow-xl text-stone-900 flex flex-col justify-between overflow-y-auto">
              <div>
                <div class="flex items-center justify-between mb-2 text-xs font-bold text-amber-900">
                  <span class="px-2.5 py-0.5 bg-amber-900 text-amber-100 rounded font-cinzel">CÂU HỎI \${q.id} / 20</span>
                  <div class="flex gap-1.5">
                    <button onclick="prevQuestion()" class="px-2.5 py-1 bg-amber-200 rounded font-bold hover:bg-amber-300 text-xs">« Câu trước</button>
                    <button onclick="nextQuestion()" class="px-2.5 py-1 bg-amber-200 rounded font-bold hover:bg-amber-300 text-xs">Câu sau »</button>
                  </div>
                </div>

                <h3 class="text-base sm:text-xl font-black mb-3 leading-snug font-sans text-stone-950">\${q.question}</h3>

                <!-- Options -->
                \${q.options ? \`
                  <div class="space-y-2 mb-3">
                    \${q.options.map((opt, oIdx) => {
                      const isCorrectOpt = checkedAnswer && oIdx === q.correct;
                      const isSelected = selectedOptionIndex === oIdx;
                      return \`
                        <div onclick="selectedOptionIndex = \${oIdx}; checkAnswer();" class="p-3 rounded-xl border-2 text-xs sm:text-sm font-medium cursor-pointer transition-all \${
                          isCorrectOpt ? 'bg-emerald-100 border-emerald-600 text-emerald-950 font-bold ring-2 ring-emerald-500' :
                          checkedAnswer && isSelected ? 'bg-rose-100 border-rose-600 text-rose-950' :
                          isSelected ? 'bg-amber-200 border-amber-600 font-bold ring-2 ring-amber-500' : 'bg-white/90 border-amber-300 hover:bg-amber-50'
                        }">
                          \${opt}
                        </div>
                      \`;
                    }).join('')}
                  </div>
                \` : \`
                  <div class="mb-3">
                    <div class="text-xs text-stone-700 font-semibold mb-1">Nhập đáp án hoặc từ khóa:</div>
                    <input type="text" id="textInput" value="\${textAnswerInput}" oninput="textAnswerInput = this.value" placeholder="Nhập câu trả lời tại đây..." class="w-full p-2.5 rounded-xl border-2 border-amber-400 bg-white text-xs font-medium" />
                  </div>
                \`}
              </div>

              <!-- Footer Action Area -->
              <div>
                <div class="flex flex-wrap items-center gap-2 pt-2 border-t border-amber-800/20">
                  <button onclick="checkAnswer()" class="px-5 py-2 rounded-xl bg-amber-700 text-white font-bold text-xs hover:bg-amber-800 shadow">
                    CHECK ĐÁP ÁN
                  </button>
                  <button onclick="openTarot()" class="px-5 py-2 rounded-xl bg-purple-700 text-white font-bold text-xs hover:bg-purple-800 shadow animate-pulse">
                    BỐC BÀI TAROT
                  </button>
                </div>

                <!-- Explanation Box & Auto transition notice -->
                \${checkedAnswer ? \`
                  <div class="mt-2.5 p-3 rounded-xl bg-amber-100 border border-amber-400 text-xs text-stone-800 leading-relaxed shadow-inner">
                    <div class="flex items-center gap-2 mb-1">
                      <span class="px-2 py-0.5 rounded text-white font-bold text-[10px] \${isCorrect ? 'bg-emerald-600' : 'bg-rose-600'}">
                        \${isCorrect ? 'CHÍNH XÁC!' : 'CHƯA CHÍNH XÁC!'}
                      </span>
                      <strong class="text-amber-950 font-cinzel text-[11px]">GIẢI THÍCH:</strong>
                    </div>
                    \${q.correct_text ? '<div class=\"font-bold text-emerald-900 mb-0.5\">Đáp án đúng: ' + q.correct_text + '</div>' : ''}
                    <p>\${q.explain}</p>
                    <div class=\"mt-1.5 pt-1 border-t border-amber-300 text-purple-900 text-[11px] font-semibold flex items-center justify-between\">
                      <span>Tự chuyển sang bốc bài Tarot sau 1.5s...</span>
                      <button onclick=\"openTarot()\" class=\"px-2 py-0.5 bg-purple-700 text-white rounded text-[10px]\">Bốc ngay</button>
                    </div>
                  </div>
                \` : ''}
              </div>
            </div>
          </div>

          <!-- Tarot Modal Overlay -->
          \${isTarotOpen ? renderTarotModal() : ''}
          \${winner ? renderWinnerModal() : ''}
        </div>
      \`;
    }

    function renderTarotModal() {
      const activeTeam = teams[activeTeamIndex];
      return \`
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/85 backdrop-blur-md">
          <div class="bg-stone-900 border-2 border-amber-500 rounded-2xl p-6 max-w-lg w-full text-center shadow-2xl">
            <h3 class="text-xl font-bold font-cinzel text-amber-300 mb-0.5">BỐC BÀI TAROT ĐỊNH MỆNH</h3>
            <p class="text-xs text-stone-300 mb-3">Lượt của \${activeTeam.name} \${activeTeam.emoji}</p>
            \${!drawnCard ? \`
              <div class="grid grid-cols-5 gap-2 my-3">
                \${currentTarotDeck.map((c, i) => \`
                  <div onclick="drawTarotCard(\${i})" class="h-24 rounded-xl bg-gradient-to-b from-amber-900 to-stone-900 border border-amber-500 flex flex-col items-center justify-between p-1.5 cursor-pointer hover:scale-105 transition-all">
                    <span class="text-amber-400 font-cinzel text-[11px] font-bold">#\${i+1}</span>
                    <i class="fa-solid fa-compass text-amber-400 text-base"></i>
                    <span class="text-[8px] text-amber-300/80 font-cinzel">TAROT</span>
                  </div>
                \`).join('')}
              </div>
            \` : \`
              <div class="p-5 rounded-2xl bg-gradient-to-b from-stone-950 to-amber-950 border-2 border-yellow-400 my-3 text-center">
                <div class="text-3xl mb-2">\${drawnCard.id === 8 ? '💀' : drawnCard.id === 10 ? '📜' : '⚓'}</div>
                <h4 class="text-lg font-bold text-amber-200 mb-1 font-cinzel">\${drawnCard.title}</h4>
              </div>

              \${drawnCard.id === 8 ? \`
                <div class="my-2 text-xs text-rose-300">
                  <div class="mb-1 font-bold">Chọn 1 đội để tấn công (-2 bước):</div>
                  <div class="grid grid-cols-2 gap-1.5">
                    \${teams.filter((_, idx) => idx !== activeTeamIndex).map(t => \`
                      <button onclick="attackVictimId = \${t.id}; render();" class="p-1.5 rounded border text-[11px] \${attackVictimId === t.id ? 'bg-rose-900 border-rose-400 text-white font-bold' : 'bg-stone-800 border-stone-700 text-stone-300'}">
                        \${t.emoji} \${t.name}
                      </button>
                    \`).join('')}
                  </div>
                </div>
              \` : ''}

              <button onclick="applyTarotAction()" class="px-6 py-2.5 bg-yellow-500 hover:bg-yellow-400 text-stone-950 font-cinzel font-black rounded-xl shadow-lg text-xs sm:text-sm">
                Áp Dụng & Tiếp Tục
              </button>
            \`}
            <div class="mt-3">
              <button onclick="isTarotOpen = false; render();" class="text-xs text-stone-400 hover:text-white underline">Đóng</button>
            </div>
          </div>
        </div>
      \`;
    }

    function renderWinnerModal() {
      return \`
        <div class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/90 backdrop-blur-md">
          <div class="bg-stone-900 border-2 border-yellow-400 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl">
            <div class="text-5xl mb-2 animate-bounce">🏆</div>
            <h2 class="text-2xl font-bold font-cinzel text-yellow-300">HẢI TRÌNH HOÀN TẤT!</h2>
            <p class="text-xs text-stone-300 my-3">Chúc mừng \${winner.name} \${winner.emoji} đã cán đích chiến thắng đầu tiên!</p>
            <button onclick="winner = null; teams.forEach(t => t.position = 0); currentScreen = 'INTRO'; render();" class="px-6 py-2.5 bg-yellow-500 text-stone-950 font-bold font-cinzel rounded-xl shadow">
              Chơi Lại Từ Đầu
            </button>
          </div>
        </div>
      \`;
    }

    function checkAnswer() {
      if (checkedAnswer) return;
      checkedAnswer = true;
      const q = questions[currentQuestionIndex];
      if (q.options) {
        isCorrect = selectedOptionIndex === q.correct;
      } else if (q.correct_text) {
        isCorrect = textAnswerInput.trim().toLowerCase().length > 0;
      } else {
        isCorrect = true;
      }

      if (isCorrect) sounds.playChime();
      else sounds.playWrong();
      render();

      // Auto-transition to Tarot modal after 1.5s
      clearTimeout(autoTimer);
      autoTimer = setTimeout(() => {
        openTarot();
      }, 1500);
    }

    function openTarot() {
      clearTimeout(autoTimer);
      drawnCard = null;
      attackVictimId = null;
      // Generate phase-weighted cards
      currentTarotDeck = getWeightedTarotDeck(currentQuestionIndex + 1, hasResetAllOccurred);
      isTarotOpen = true;
      render();
    }

    function drawTarotCard(idx) {
      sounds.playShipBell();
      drawnCard = currentTarotDeck[idx];
      render();
    }

    function applyTarotAction() {
      if (!drawnCard) return;
      const t = teams[activeTeamIndex];
      if (drawnCard.id === 1) t.position = Math.min(10, t.position + 2);
      else if (drawnCard.id === 2) t.position = Math.min(10, t.position + 1);
      else if (drawnCard.id === 3) { /* Đứng im */ }
      else if (drawnCard.id === 4) t.position = Math.max(0, t.position - 2);
      else if (drawnCard.id === 5) t.position = Math.max(0, t.position - 1);
      else if (drawnCard.id === 6) {
        const prev = teams[(activeTeamIndex + 4) % 5];
        prev.position = Math.min(10, prev.position + 1);
      } else if (drawnCard.id === 7) {
        teams.forEach(x => x.position = 0);
        hasResetAllOccurred = true;
      } else if (drawnCard.id === 8) {
        const victim = teams.find(x => x.id === attackVictimId) || teams[(activeTeamIndex + 1) % 5];
        victim.position = Math.max(0, victim.position - 2);
      } else if (drawnCard.id === 9) {
        const minPos = Math.min(...teams.map(x => x.position));
        teams.forEach(x => { if (x.position === minPos) x.position = Math.min(10, x.position + 2); });
      } else if (drawnCard.id === 10) {
        t.position = Math.min(10, t.position + 1);
      }

      if (t.position >= 10) winner = t;
      isTarotOpen = false;
      
      // Auto-advance to next question for next team!
      activeTeamIndex = (activeTeamIndex + 1) % 5;
      currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
      checkedAnswer = false;
      selectedOptionIndex = null;
      textAnswerInput = '';
      sounds.playShipBell();
      render();
    }

    function nextQuestion() {
      currentQuestionIndex = (currentQuestionIndex + 1) % questions.length;
      checkedAnswer = false;
      selectedOptionIndex = null;
      textAnswerInput = '';
      render();
    }

    function prevQuestion() {
      currentQuestionIndex = (currentQuestionIndex - 1 + questions.length) % questions.length;
      checkedAnswer = false;
      selectedOptionIndex = null;
      textAnswerInput = '';
      render();
    }

    render();
  </script>
</body>
</html>`;
}

export function exportStandaloneHtmlFile(): void {
  const htmlContent = getStandaloneHtmlString();
  const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'Dai_Hai_Trinh_Single_File.html';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
