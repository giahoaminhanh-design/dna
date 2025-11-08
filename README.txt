ASEAN-ONLY — Chỉ hiển thị Đông Nam Á (không nền thế giới)

Cách dùng (repo giahoaminhanh-design/dna):
1) Upload index.html, style.css, script.js (+ asean.geojson nếu muốn offline) vào nhánh main (thư mục gốc).
2) Settings → Pages → Deploy from a branch → main / (root) → Save.
3) Link: https://giahoaminhanh-design.github.io/dna/

Nguồn dữ liệu:
- Ưu tiên asean.geojson (nếu có, đã lọc 11 nước). Nếu file này trống/không có, script sẽ tải countries.geojson từ Internet rồi lọc ASEAN.
- Không có tile layer nền → không hiển thị các nước ngoài ASEAN.

Muốn hoàn toàn không phụ thuộc internet? Xuất asean.geojson từ mapshaper.org (lọc 11 nước) rồi upload thay file hiện tại.
