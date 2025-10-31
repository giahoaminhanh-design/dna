WORLD BASEMAP + ASEAN NHIỀU MÀU + HOÀNG SA/TRƯỜNG SA CÙNG MÀU VIỆT NAM

Triển khai (repo giahoaminhanh-design/dna):
1) Upload index.html, style.css, script.js (và asean.geojson nếu muốn offline) lên nhánh main (thư mục gốc /).
2) Settings → Pages → Deploy from a branch → main / (root) → Save.
3) Link: https://giahoaminhanh-design.github.io/dna/

Ghi chú kỹ thuật:
- Dùng tile layer OpenStreetMap cho nền thế giới.
- Chỉ vẽ polygons ASEAN (11 nước) đè lên nền và tô mỗi nước một màu (chỉnh trong COLORS).
- Hai quần đảo được vẽ dưới dạng polygon và gán màu như Việt Nam theo lựa chọn hiển thị.
- Nếu cần hoàn toàn offline, cung cấp asean.geojson (đã lọc 11 nước) trong repo (script ưu tiên file này).
