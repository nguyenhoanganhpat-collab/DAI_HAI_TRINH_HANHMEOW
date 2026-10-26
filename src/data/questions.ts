import { Question } from "../types";

export const INITIAL_QUESTIONS: Question[] = [
  {
    id: 1,
    question:
      "Giai đoạn Nhận thức cảm tính bao gồm các hình thức cơ bản nào theo thứ tự phát triển?",
    options: [
      "A. Cảm giác, Tri giác và Biểu tượng",
      "B. Khái niệm, Phán đoán và Suy lý",
      "C. Cảm giác, Phán đoán và Thực tiễn",
      "D. Khái niệm, Tri giác và Chân lý",
    ],
    correct: 0,
    explain:
      "Nhận thức cảm tính gồm 3 hình thức: Cảm giác (phản ánh từng thuộc tính riêng lẻ bề ngoài), Tri giác (tổng hợp các cảm giác thành hình ảnh toàn vẹn) và Biểu tượng (tái hiện hình ảnh sự vật trong óc).",
  },
  {
    id: 2,
    imageUrl: "/images/deepfake-demo.svg",
    question:
      " Công nghệ Deepfake đã tác động và đánh lừa trực tiếp vào yếu tố nào trong nhận thức của con người?",
    options: [
      "A. Khả năng phân tích logic và suy luận của não bộ",
      "B. Bản năng tin tưởng tuyệt đối vào các giác quan (thị giác, thính giác)",
      "C. Quy trình phê duyệt tài chính của doanh nghiệp",
      "D. Tri thức lý luận triết học Mác – Lênin",
    ],
    correct: 1,
    explain:
      "Deepfake mô phỏng hình ảnh và giọng nói chân thực, hack trực tiếp vào cơ chế mặc định (mắt thấy tai nghe là thật) của bộ não",
  },
  {
    id: 3,
    question:
      "Theo Lý luận nhận thức Mác - Lênin, yếu tố nào vừa là cơ sở, động lực, mục đích của nhận thức, vừa là tiêu chuẩn duy nhất để kiểm nghiệm chân lý?",
    options: [
      "A. Nhận thức cảm tính",
      "B. Tư duy trừu tượng",
      "C. Thực tiễn",
      "D. Công nghệ AI",
    ],
    correct: 2,
    explain:
      "Thực tiễn cung cấp tài liệu, thúc đẩy nhận thức phát triển và là thước đo duy nhất kiểm tra tri thức đúng hay sai.",
  },
  {
    id: 4,
    question:
      "Phát biểu: 'Tri giác là hình thức nhận thức chỉ phản ánh từng thuộc tính riêng lẻ, bề ngoài của sự vật khi nó tác động trực tiếp lên giác quan.'",
    options: ["ĐÚNG", "SAI"],
    correct: 1,
    explain:
      "Phản ánh từng thuộc tính riêng lẻ là Cảm giác; còn Tri giác là hình ảnh toàn vẹn về sự vật do tổng hợp nhiều cảm giác tạo nên.",
  },
  {
    id: 5,
    question:
      "Phát biểu: 'Deepfake trở thành công cụ lừa đảo nguy hiểm vì nó đánh trực tiếp vào bản năng tin tưởng tuyệt đối của bộ não con người đối với các giác quan Mắt thấy, tai nghe.'",
    options: ["ĐÚNG", "SAI"],
    correct: 0,
    explain:
      "Suốt hàng vạn năm tiến hóa, bộ não con người được lập trình để mặc định những gì trực tiếp nhìn thấy và nghe thấy là bằng chứng xác thực nhất, và Deepfake đã lợi dụng chính điểm này để bẻ gãy bộ lọc niềm tin.",
  },
  {
    id: 6,
    imageUrl: "/images/image6.jpg",
    question:
      "Gợi ý của MC: 'Cụm từ gồm 4 từ (15 chữ cái): Đây là giai đoạn nhận thức mở đầu giúp con người thu nhận thông tin qua giác quan, nhưng nếu chỉ dừng ở đây thì rất dễ sập bẫy công nghệ!'",
    correct_text: "NHẬN THỨC CẢM TÍNH",
    explain:
      "Nhận thức cảm tính phản ánh vẻ bề ngoài qua mắt thấy tai nghe nên không tự xác nhận được video có bị AI giả mạo hay không.",
  },
  {
    id: 7,
    imageUrl: "images/image7.png",
    question:
      "Gợi ý của MC: 'Từ khóa gồm 2 từ (8 chữ cái): Toàn bộ hoạt động vật chất có mục đích, mang tính lịch sử - xã hội của con người; đây là cơ sở và tiêu chuẩn để kiểm nghiệm nhận thức đúng hay sai.'",
    correct_text: "THỰC TIỄN",
    explain:
      "Muốn giải mã Deepfake phải đưa vào kiểm nghiệm thực tiễn (như gọi điện thoại trực tiếp qua kênh chính thức hoặc đối soát quy trình tài chính).",
  },
  {
    id: 8,
    question:
      "Hãy ghép các từ cho sẵn dưới đây vào vị trí thích hợp để hoàn thành khái niệm Chân lý:\nKho từ gợi ý: [thực tiễn] | [khách quan] | [phù hợp] | [tri thức]\n'Chân lý là những (1)_______ của con người có nội dung (2)_______ với hiện thực (3)_______, và sự phù hợp đó đã được (4)_______ kiểm nghiệm và chứng minh.'",
    correct_text: "(1) tri thức - (2) phù hợp - (3) khách quan - (4) thực tiễn",
    explain:
      "Thứ tự điền đúng: (1) tri thức, (2) phù hợp, (3) khách quan, (4) thực tiễn.",
  },
  {
    id: 9,
    question:
      "Hãy ghép các từ cho sẵn dưới đây vào vị trí thích hợp để hoàn thành định nghĩa Nhận thức lý tính:\nKho từ gợi ý: [trừu tượng] | [bản chất] | [khái quát] | [gián tiếp]\n'Nhận thức lý tính là giai đoạn cao hơn của quá trình nhận thức. Con người sử dụng tư duy (1)_______ để phản ánh (2)_______, (3)_______ và sâu sắc (4)_______, quy luật của sự vật.'",
    correct_text:
      "(1) trừu tượng - (2) gián tiếp - (3) khái quát - (4) bản chất",
    explain:
      "Thứ tự điền đúng: (1) trừu tượng, (2) gián tiếp, (3) khái quát, (4) bản chất.",
  },
  {
    id: 10,
    question:
      "Trong điều kiện tự nhiên, khi không có công nghệ can thiệp, bộ não con người có thể tự làm sai lệch ký ức và diễn giải sai những gì mắt thấy, tai nghe không?",
    options: [
      "A. Không, vì não bộ luôn ghi nhớ chính xác mọi thông tin từ giác quan.",
      "B. Có, vì não bộ có thể tự lấp đầy khoảng trống thông tin bằng ký ức và kinh nghiệm quá khứ, dẫn đến nhận thức sai lệch về thực tại",
      "C. Không, vì chỉ có AI mới có thể làm sai lệch ký ức của con người.",
      "D. Có, nhưng chỉ khi con người mắc bệnh tâm lý nghiêm trọng.",
    ],
    correct: 1,
    explain:
      "Ký ức không hoạt động như một chiếc camera ghi lại mọi thứ chính xác. Não bộ thường ghép nối ký ức cũ để lấp đầy khoảng trống thông tin (Ký ức giả & Định kiến xác nhận).",
  },
  {
    id: 11,
    question:
      "Một sinh viên xem video Deepfake về giảng viên của mình và lập tức chia sẻ vì video trông rất chân thực. Sai lầm chủ yếu của sinh viên là gì?",
    options: [
      "A. Sử dụng mạng xã hội để tiếp nhận thông tin.",
      "B. Đồng nhất vẻ ngoài có tính thuyết phục với bản chất của sự việc khi chưa có đủ căn cứ.",
      "C. Tin rằng công nghệ AI có thể tạo ra hình ảnh chân thực.",
      "D. Sử dụng điện thoại để xem video.",
    ],
    correct: 1,
    explain:
      "Hình ảnh chân thực chưa đủ chứng minh sự việc đã xảy ra. Sinh viên đã vội vàng đưa ra kết luận khi chưa phân tích đầy đủ thông tin và bằng chứng liên quan.",
  },
  {
    id: 12,
    question:
      "Hai người xem cùng một video Deepfake nhưng đưa ra hai kết luận khác nhau do có kiến thức và kinh nghiệm khác nhau. Tình huống này cho thấy điều gì?",
    options: [
      "A. Cùng một thông tin thì mọi người luôn có nhận thức giống nhau.",
      "B. Nhận thức của con người có thể chịu ảnh hưởng của vốn hiểu biết và kinh nghiệm đã tích lũy.",
      "C. Người có nhiều kinh nghiệm luôn đưa ra kết luận chính xác.",
      "D. Mọi kết luận khác nhau đều không có giá trị.",
    ],
    correct: 1,
    explain:
      "Kiến thức và kinh nghiệm ảnh hưởng đến cách con người tiếp nhận, phân tích và đánh giá thông tin.",
  },
  {
    id: 13,
    question:
      "“Khi một video Deepfake được phát hiện là giả, toàn bộ thông tin mà người xem thu nhận từ video đó đều vô giá trị đối với nhận thức.”",
    options: ["ĐÚNG", "SAI"],
    correct: 1,
    explain:
      "SAI. Cần phân biệt giữa việc video không phản ánh đúng sự kiện được mô tả và việc mọi thông tin liên quan đều vô giá trị. Video có thể cung cấp manh mối về cách thức lừa đảo, nguồn phát tán.",
  },
  {
    id: 14,
    question:
      "Hoàn thiện lập luận - Kho từ: [tiền đề] – [logic] – [hiện thực khách quan] – [chân lý]\n‘Một kết luận được suy ra bằng lập luận (1) ________ chưa chắc đã là (2) ________ nếu (3) ________ của lập luận không phù hợp với (4) ________.’",
    correct_text:
      "(1) logic - (2) chân lý - (3) tiền đề - (4) hiện thực khách quan",
    explain:
      "Lập luận hợp logic chỉ bảo đảm kết luận được suy ra đúng từ tiền đề theo quy tắc suy luận. Nếu tiền đề sai, kết luận vẫn có thể sai.",
  },
  {
    id: 15,
    question:
      "Nhận thức và sự điều chỉnh tri thức - Kho từ: [tương đối] – [tuyệt đối] – [bổ sung] – [phát triển]\n‘Trong quá trình nhận thức, tri thức của con người vừa mang tính (1) ________ trong những điều kiện lịch sử cụ thể, vừa có thể tiến gần đến chân lý (2) ________. Khi thực tiễn xuất hiện những dữ kiện mới, tri thức cần được (3) ________ và (4) ________.’",
    correct_text:
      "(1) tương đối - (2) tuyệt đối - (3) bổ sung - (4) phát triển",
    explain:
      "Nhận thức có giới hạn lịch sử nhưng vẫn tiến sâu vào hiện thực. Khi có bằng chứng mới, tri thức được bổ sung và phát triển.",
  },
  {
    id: 16,
    question:
      "Một người phân tích video Deepfake rất logic nhưng vẫn kết luận sai vì toàn bộ dữ liệu ban đầu đều đã bị làm giả. Nguyên nhân trực tiếp dẫn đến sai lầm là gì?",
    options: [
      "A. Quá trình suy luận logic luôn dẫn đến nhận thức sai lệch.",
      "B. Nhận thức lý tính hoàn toàn tách rời nhận thức cảm tính.",
      "C. Tiền đề sai lệch có thể dẫn đến kết luận sai dù quá trình suy luận hợp logic.",
      "D. Chân lý được xác định dựa trên mức độ đồng thuận của số đông.",
    ],
    correct: 2,
    explain:
      "Một lập luận hợp logic chưa chắc tạo ra kết luận đúng nếu các tiền đề không phản ánh chính xác hiện thực.",
  },
  {
    id: 17,
    imageUrl: "images/image17.jpg",
    question:
      "Gợi ý của MC: 'Hai từ chỉ những căn cứ được dùng để xác nhận hoặc bác bỏ một nhận định.'",
    correct_text: "BẰNG CHỨNG",
    explain:
      "Chốt kiến thức: Khi đánh giá video, cần tìm dữ liệu gốc, nguồn đăng tải và những thông tin độc lập có thể đối chiếu.",
  },
  {
    id: 18,
    question:
      "Một nhân viên phát hiện video giám đốc có dấu hiệu bất thường, suy luận là Deepfake, sau đó gọi vào số điện thoại đã lưu từ trước và đối chiếu với kế toán trưởng để xác minh lệnh chuyển tiền. Hành động nào thể hiện rõ nhất vai trò của thực tiễn?",
    options: [
      "A. Nhận diện khuôn mặt và giọng nói của giám đốc qua video.",
      "B. Phát hiện khẩu hình không khớp với âm thanh và hình thành nghi vấn.",
      "C. Sử dụng kênh liên lạc độc lập và đối chiếu quy trình tài chính để xác minh tính xác thực của lệnh chuyển tiền.",
      "D. Vận dụng kiến thức về công nghệ AI để giải thích cách video có thể bị làm giả.",
    ],
    correct: 2,
    explain:
      "Đáp án C thể hiện trực tiếp vai trò kiểm nghiệm qua hoạt động thực tiễn.",
  },
  {
    id: 19,
    question:
      "Trong mô hình GAN, Generator liên tục tạo ra video giả chân thực, còn Discriminator ngày càng khó phân biệt. Xét dưới góc độ nhận thức luận, cách giải thích nào phù hợp nhất?",
    options: [
      "A. Generator và Discriminator mô phỏng trực tiếp hai giai đoạn nhận thức cảm tính và lý tính.",
      "B. Sự hoàn thiện của video giả chứng minh ranh giới giữa hiện thực khách quan và nhận thức chủ quan đã bị xóa bỏ.",
      "C. Khi Discriminator không phát hiện được lỗi, video giả mặc nhiên trở thành chân lý.",
      "D. GAN cho thấy độ chân thực của biểu hiện cảm tính không bảo đảm tính xác thực của đối tượng, do đó cần phương pháp kiểm chứng độc lập.",
    ],
    correct: 3,
    explain:
      "Đáp án D: Độ chân thực cảm tính bề ngoài không bảo đảm tính xác thực, cần kiểm chứng độc lập.",
  },
  {
    id: 20,
    question:
      "Giới hạn của nhận thức cảm tính: 'Khi một video Deepfake có hình ảnh và âm thanh hoàn toàn chân thực, nhận thức cảm tính của con người phản ánh đúng hiện thực khách quan, vì cảm giác và tri giác đều được hình thành từ những kích thích có thật.'",
    options: ["ĐÚNG", "SAI"],
    correct: 1,
    explain:
      "SAI. Kích thích có thật nhưng nội dung tạo ra không tương ứng sự kiện ngoài đời. Nhận thức cảm tính chỉ phản ánh thuộc tính bề ngoài.",
  },
];
