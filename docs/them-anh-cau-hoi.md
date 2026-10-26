# Thêm ảnh vào câu hỏi

`Question` trong `src/types.ts` đã có trường tùy chọn `imageUrl?: string`.
Trong ứng dụng React, ảnh xuất hiện phía trên nội dung câu hỏi, giữ đúng tỉ lệ và cao tối đa 28% màn hình.
Câu số 2 là ví dụ sử dụng ảnh `public/images/deepfake-demo.svg`.

## Cách 1: Ảnh trong dự án

1. Chép ảnh vào `public/images/`, ví dụ `public/images/cau-3.jpg`.
2. Mở `src/data/questions.ts`, tìm câu cần thêm ảnh.
3. Thêm `imageUrl` sau `id`:

```ts
{
  id: 3,
  imageUrl: "/images/cau-3.jpg",
  question: "Nội dung câu hỏi...",
  options: ["A. ...", "B. ...", "C. ...", "D. ..."],
  correct: 0,
  explain: "Giải thích...",
},
```

Đường dẫn không có chữ `public`. Không dùng đường dẫn máy tính như `C:\\...`.
Hỗ trợ PNG, JPG, WebP, GIF và SVG mà trình duyệt hiển thị được.

## Cách 2: URL ảnh trên mạng

Đặt `imageUrl` thành đường dẫn HTTPS trực tiếp đến ảnh của bạn.
Ảnh cần truy cập được mà không đăng nhập, máy trình chiếu cần có Internet và máy chủ ảnh phải cho phép hiển thị từ trang khác.

## Cách 3: Nhúng base64

```ts
imageUrl: "data:image/png;base64,CHUOI_BASE64_CUA_ANH",
```

Thay toàn bộ `CHUOI_BASE64_CUA_ANH` bằng dữ liệu base64 thật, không xuống dòng trong chuỗi.
PNG dùng `image/png`; JPG dùng `image/jpeg`; WebP dùng `image/webp`.
Phải giữ tiền tố `data:...;base64,`, không chỉ dán phần base64.
Ảnh nhúng không cần tải riêng nhưng làm file câu hỏi lớn hơn; nên nén ảnh trước.

## Bỏ hoặc chỉnh kích thước ảnh

- Xóa dòng `imageUrl` để câu chỉ có chữ.
- Trong `src/components/QuestionCard.tsx`, đổi `max-h-[28dvh]` để chỉnh chiều cao tối đa.
- `object-contain` giữ nguyên ảnh, không cắt mép. Nội dung dài có thể cuộn trong thẻ câu hỏi.

Hỗ trợ này áp dụng cho ứng dụng React. Bản HTML độc lập có bộ dựng giao diện riêng trong `src/utils/htmlExporter.ts`; không tự nhận phần hiển thị ảnh của `QuestionCard`.
