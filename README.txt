FIX TRẮNG TRANG:
- Script đã thêm 3 nguồn GeoJSON công khai (CORS mở) + fallback local asean.geojson.
- Có hộp trạng thái báo lý do lỗi nếu không tải được dữ liệu.

Triển khai:
1) Upload index.html, style.css, script.js, asean.geojson lên repo giahoaminhanh-design/dna (thư mục gốc).
2) Bật Pages: main / (root).
3) Nếu vẫn trắng trang, mở DevTools (F12) kiểm tra tab Network: các URL GeoJSON có 200/OK không.
4) Đảm bảo không có extension chặn raw.githubusercontent.com / jsdelivr / openstreetmap.

Nếu muốn không phụ thuộc mạng, thay nội dung asean.geojson bằng bộ biên giới ASEAN (GeoJSON).