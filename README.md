# 🏴‍☠️ ĐẠI HẢI TRÌNH

> **Trò chơi thuyết trình tương tác** — Khám phá *Lý Luận Nhận Thức Mác – Lênin* và *Nghệ Thuật Giải Mã Deepfake* qua hải trình kịch tính trên bản đồ thế giới cổ.

---

## 📖 Giới Thiệu

**Đại Hải Trình** là một ứng dụng game web tương tác được thiết kế dành riêng cho các buổi thuyết trình lớp học / hội trường. Năm đội chơi tranh tài trên bản đồ hải trình cổ, lần lượt trả lời 20 câu hỏi triết học và Deepfake, rồi bốc thẻ Tarot bí ẩn để tiến — hoặc lùi — trên đường đua về đích.

Toàn bộ giao diện hiển thị trong **một viewport 100 vh duy nhất** (không cuộn trang), lý tưởng cho màn hình chiếu và TV lớn trong phòng học.

---

## ✨ Tính Năng Nổi Bật

| Tính năng | Mô tả |
|---|---|
| 🗺️ **Bản đồ thế giới cổ** | Nền ảnh cổ điển với 5 tuyến đường zigzag SVG, mỗi đội một làn riêng |
| 🚢 **5 Hạm Đội** | Mỗi đội có biểu tượng, màu sắc và tên riêng; tàu di chuyển mượt mà với animation 700ms |
| 🧠 **20 Câu Hỏi** | Trắc nghiệm 4 đáp án, câu Đúng/Sai, câu điền từ ghép — chủ đề Triết học & Deepfake |
| 🎴 **Thẻ Tarot 3D** | 10 loại thẻ với trọng số theo 3 giai đoạn trò chơi; xáo bài Fisher-Yates |
| 🔊 **Âm thanh tổng hợp** | Web Audio API: chuông tàu, kèn sương mù, chuông đúng/sai, fanfare chiến thắng |
| 🖥️ **Chế độ toàn màn hình** | Nút Fullscreen tích hợp — phù hợp trình chiếu hội trường |
| 📥 **Xuất HTML độc lập** | Tải về 1 file `.html` duy nhất chạy offline hoàn toàn |
| 🏆 **Màn hình chiến thắng** | Modal mừng chiến thắng khi đội chạm mốc 10 bước |

---

## 🗂️ Cấu Trúc Dự Án

```
DAI_HAI_TRINH_HANHMEOW/
├── public/
│   ├── world_map.png           # Bản đồ thế giới cổ (dùng trong GameBoard)
│   ├── world_map.jpg           # Fallback bản đồ
│   ├── dai_hai_trinh.html      # Phiên bản HTML tĩnh độc lập
│   └── assets/
│       └── aistudio/
│           └── world_map_f1bc5d20.png  # Bản đồ nền màn hình Intro
├── src/
│   ├── App.tsx                 # Root: quản lý màn hình & state đội chơi
│   ├── main.tsx                # Entry point React
│   ├── index.css               # Tailwind CSS + Custom fonts (Cinzel)
│   ├── types.ts                # TypeScript types: Team, Question, TarotCard...
│   ├── components/
│   │   ├── ScreenIntro.tsx     # Màn hình chào mừng / Landing page
│   │   ├── ScreenTeamSetup.tsx # Màn hình cài đặt tên 5 đội
│   │   ├── ScreenMainArena.tsx # Màn hình chính: header, bảng câu hỏi, footer
│   │   ├── GameBoard.tsx       # Bản đồ SVG 5 tuyến + tokens tàu di chuyển
│   │   ├── QuestionCard.tsx    # Hiển thị câu hỏi, đáp án & giải thích
│   │   ├── Sidebar.tsx         # Bảng điểm phụ các đội
│   │   ├── TarotDrawModal.tsx  # Modal bốc bài Tarot 3D
│   │   └── VictoryModal.tsx    # Modal ăn mừng chiến thắng
│   ├── data/
│   │   ├── questions.ts        # 20 câu hỏi triết học & Deepfake
│   │   ├── tarotCards.ts       # 10 thẻ Tarot + logic trọng số theo giai đoạn
│   │   └── tracks.ts           # Tọa độ % 5 tuyến đường + hàm SVG path
│   └── utils/
│       ├── audio.ts            # SoundManager: tổng hợp âm thanh Web Audio API
│       └── htmlExporter.ts     # Xuất toàn bộ game thành 1 file HTML
├── index.html
├── vite.config.ts
├── tsconfig.json
├── package.json
└── metadata.json
```

---

## 🎮 Luật Chơi

### Vòng lặp cơ bản
```
Lượt đội → Trả lời câu hỏi → MC chấm điểm → Bốc bài Tarot → Tự động sang đội tiếp theo
```

1. **Trả lời câu hỏi**: MC đọc câu hỏi, đội trả lời. MC bấm `+1` hoặc `+2` trên sidebar để di chuyển tàu.
2. **Bốc bài Tarot**: Sau mỗi câu, đội hiện tại bốc 1 trong 10 thẻ ngẫu nhiên. Hiệu ứng được áp dụng ngay lập tức.
3. **Tự động luân chuyển**: Sau khi Tarot được áp dụng, hệ thống tự động chuyển sang đội tiếp theo và câu hỏi tiếp theo.
4. **Chiến thắng**: Đội đầu tiên chạm mốc **bước 10** trên bản đồ giành chiến thắng.

### Giai đoạn & Trọng số Tarot

| Giai đoạn | Câu | Bộ bài xuất hiện |
|---|---|---|
| **Pha 1** — Khởi hành | Câu 1–7 | 80% Tiến 1–2 bước, ưu tiên thuận lợi |
| **Pha 2** — Sóng gió | Câu 8–14 | Lùi, Đứng im, Thử thách líu lưỡi; *"Tất cả về xuất phát"* xuất hiện **đúng 1 lần** (câu 9–11) |
| **Pha 3** — Quyết chiến | Câu 15–20 | Tấn công, Lùi 2, Đội bét +2 — kịch tính tối đa |

### 10 Loại Thẻ Tarot

| Thẻ | Hiệu ứng |
|---|---|
| 🟡 Tiến 2 bước | `advance_2` — đội bốc tiến +2 |
| 🟢 Tiến 1 bước | `advance_1` — đội bốc tiến +1 |
| ⚓ Đứng im | `stay` — không thay đổi vị trí |
| 🔴 Lùi 2 bước | `retreat_2` — đội bốc lùi -2 |
| 🟠 Lùi 1 bước | `retreat_1` — đội bốc lùi -1 |
| 🤝 Đội trước tiến 1 | `prev_advance_1` — đội trước đó được +1 |
| 🌪️ Tất cả về xuất phát | `reset_all` — **reset toàn bộ** về vị trí 0 |
| 💀 Tấn công 1 đội | `attack_target` — chọn 1 đội bất kỳ, trừ -2 |
| 🛟 Đội bét bảng +2 | `boost_last` — đội đứng cuối được +2 |
| 🪶 Líu lưỡi | `tongue_twister` — đọc câu líu lưỡi không vấp |

---

## 🧩 Ngân Hàng Câu Hỏi

20 câu hỏi thuộc 3 dạng, xoay quanh hai chủ đề song song:

- **Triết học Mác – Lênin**: Nhận thức cảm tính, Nhận thức lý tính, Thực tiễn, Chân lý
- **Công nghệ Deepfake & AI**: Cơ chế GAN (Generator / Discriminator), nhận biết & phòng tránh lừa đảo

| Dạng câu hỏi | Số lượng | Ví dụ |
|---|---|---|
| Trắc nghiệm 4 đáp án | 10 câu | Câu 1, 2, 3, 10, 11, 12, 16, 18, 19... |
| Đúng / Sai | 5 câu | Câu 4, 5, 13, 20... |
| Điền từ / Ghép khái niệm | 5 câu | Câu 6, 7, 8, 9, 14, 15, 17... |

---

## 🛠️ Công Nghệ Sử Dụng

| Thành phần | Công nghệ |
|---|---|
| **Framework UI** | React 19 + TypeScript 7 |
| **Build tool** | Vite 8 |
| **Styling** | Tailwind CSS v4 |
| **Animation** | Motion (Framer Motion) |
| **Icons** | Font Awesome 6, Lucide React |
| **Âm thanh** | Web Audio API (tổng hợp thuần túy, không file âm thanh ngoài) |
| **AI Integration** | `@google/genai` (Gemini API — server-side) |
| **Server** | Express.js (proxy Gemini API key) |

---

## 🚀 Hướng Dẫn Cài Đặt & Chạy

### Yêu cầu
- Node.js ≥ 18
- npm hoặc yarn

### Cài đặt

```bash
# Clone / mở thư mục dự án
cd DAI_HAI_TRINH_HANHMEOW

# Cài dependencies
npm install
```

### Cấu hình môi trường

Tạo file `.env` từ file mẫu:

```bash
cp .env.example .env
```

Điền Gemini API key vào `.env`:

```env
GEMINI_API_KEY=your_api_key_here
```

### Chạy development

```bash
npm run dev
# → http://localhost:3000
```

### Build production

```bash
npm run build
npm run preview
```

### Các lệnh khác

```bash
npm run lint    # Kiểm tra TypeScript (tsc --noEmit)
npm run clean   # Xóa thư mục dist
```

---

## 🖥️ Hướng Dẫn Sử Dụng Khi Thuyết Trình

1. **Mở trình duyệt fullscreen** — Nhấn nút `⛶` trên header hoặc phím `F11`.
2. **Màn hình Intro** — Giới thiệu trò chơi, nhấn **"Bắt Đầu Hải Trình"**.
3. **Cài đặt đội** — Đặt tên cho 5 đội theo sở thích, nhấn **"Xác nhận"**.
4. **Màn hình chính**:
   - Bảng câu hỏi ở trung tâm — MC đọc câu cho đội đang active (có vương miện 👑).
   - Điều chỉnh vị trí tàu bằng các nút `+1 / +2 / -1 / -2` trực tiếp trên sidebar hoặc bấm vào waypoint trên bản đồ.
   - Nhấn **"Bốc Tarot"** sau mỗi câu để bốc thẻ bí ẩn.
5. **Xuất HTML** — Nhấn nút **"Tải HTML"** để tải về 1 file chạy offline (không cần server).

---

## 📐 Kiến Trúc

```
App (state: teams, currentScreen, soundEnabled)
 ├── ScreenIntro          → onStart → TEAM_SETUP
 ├── ScreenTeamSetup      → onConfirmTeams → MAIN_ARENA
 └── ScreenMainArena
      ├── GameBoard        ← 5 tuyến SVG + di chuyển tàu
      ├── QuestionCard     ← hiển thị câu hỏi / đáp án
      ├── TarotDrawModal   ← bốc bài → cập nhật teams → auto next
      └── VictoryModal     ← khi team.position >= MAX_STEPS (10)
```

### Luồng dữ liệu Tarot

```
TarotDrawModal
  → getPhaseWeightedCardPool(questionNumber, hasResetAllOccurred)
  → Fisher-Yates shuffle 10 thẻ
  → Người chơi lật thẻ (flip animation 3D)
  → onApplyTarotEffect(actionDesc, updatedTeams, wasResetAll)
  → ScreenMainArena cập nhật state → chuyển lượt tự động
```

---

## 📝 Ghi Chú Phát Triển

- File `public/dai_hai_trinh.html` là phiên bản **single-file HTML** tĩnh độc lập — phục vụ trường hợp không có server.
- Hàm `exportStandaloneHtmlFile()` trong [`htmlExporter.ts`](src/utils/htmlExporter.ts) tạo ra bản tải về từ phiên bản React đang chạy.
- Âm thanh hoàn toàn tổng hợp bằng **Web Audio API oscillators** — không phụ thuộc file audio bên ngoài.
- Card pool Tarot sử dụng thuật toán **Fisher-Yates shuffle** đảm bảo phân phối đều. Card "Reset All" được giới hạn xuất hiện **đúng 1 lần** trong toàn bộ ván chơi.

---

## 📄 License

Dự án phục vụ mục đích học thuật và thuyết trình nội bộ.

---

*Đại Hải Trình · Triết Học Mác – Lênin & Giải Mã Deepfake · Made with ⚓ & ❤️*
