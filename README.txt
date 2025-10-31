ASEAN ONLY + MỖI NƯỚC MÀU RIÊNG + HIỂN THỊ HOÀNG SA/TRƯỜNG SA THUỘC VIỆT NAM (theo yêu cầu hiển thị)

Triển khai (repo giahoaminhanh-design/dna):
1) Upload index.html, style.css, script.js (và asean.geojson nếu muốn offline) lên nhánh main (thư mục gốc /).
2) Settings → Pages → Deploy from a branch → main / (root) → Save.
3) Link: https://giahoaminhanh-design.github.io/dna/

Ghi chú kỹ thuật:
- Không dùng nền bản đồ thế giới. Chỉ vẽ polygons ASEAN.
- Màu từng nước chỉnh trong COLORS ở script.js.
- Hai quần đảo được vẽ và gán màu như Việt Nam theo lựa chọn hiển thị của bạn.
- Nếu cần đường biên đảo chi tiết, thay các polygon minh hoạ bằng GeoJSON cụ thể.
- Để không phụ thuộc internet, cung cấp asean.geojson (đã lọc 11 nước) trong repo.
