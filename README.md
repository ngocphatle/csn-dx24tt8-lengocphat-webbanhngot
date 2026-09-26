# 🍰 Tiệm Bánh Ngọt

Ứng dụng web đơn trang (SPA) giới thiệu các loại bánh ngọt truyền thống và hiện đại của Việt Nam.

**Sinh viên:** Lê Ngọc Phát
**Repo:** `csn-dx24tt8-lengocphat-webbanhngot`

---

## Tính năng

- Trang chủ với hero search, thống kê và top bánh nổi bật
- Danh sách 20 loại bánh ngọt từ 3 miền Bắc – Trung – Nam
- Tìm kiếm theo tên, nguyên liệu, xuất xứ
- Lọc theo vùng miền và thể loại (6 loại)
- Sắp xếp theo tên hoặc đánh giá
- Phân trang (6 bánh/trang)
- Trang chi tiết từng loại bánh với nguyên liệu, xuất xứ, dịp dùng
- Trang Admin: thêm bánh mới lưu vào `localStorage`
- Responsive, chạy hoàn toàn trên trình duyệt

## Công nghệ

HTML5 · CSS3 · JavaScript thuần (Vanilla JS) — không dùng framework hay thư viện ngoài.

## Cách chạy

1. Mở thư mục `src/` bằng **VS Code Live Server**
2. Hoặc mở thẳng `src/index.html` trên trình duyệt
3. Trang admin: `src/admin.html`

## Cấu trúc

```
src/
├── index.html
├── admin.html
├── css/
│   ├── style.css
│   └── admin.css
├── images/         ← 20 ảnh PNG theo tên bánh
└── js/
    ├── data.js      ← CAKES[] — 20 loại bánh tĩnh
    ├── app.js       ← SPA router, render, filter, sort, phân trang
    └── admin.js     ← Form thêm bánh, localStorage
```
