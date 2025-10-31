BẢN ĐỒ ĐÔNG NAM Á (BIÊN GIỚI THẬT) — DEPLOY THẲNG GITHUB PAGES

Cách dùng (repo: giahoaminhanh-design/dna):
1) Tải zip này, giải nén.
2) Upload 4 file: index.html, style.css, script.js, asean.geojson vào nhánh main (thư mục gốc /).
3) Settings → Pages → Deploy from a branch → main / (root) → Save.
4) Link chạy: https://giahoaminhanh-design.github.io/dna/

Ghi chú:
- Mặc định script lấy GeoJSON từ:
  https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson
  → Sau đó lọc ra 11 nước ASEAN. Nếu vì lý do mạng/CORS mà không load được, script sẽ fallback sang file local asean.geojson.
- Nếu muốn chắc chắn không phụ thuộc mạng ngoài, hãy tự thay file asean.geojson bằng dữ liệu ASEAN thật (GeoJSON) xuất từ mapshaper.org.
- Tuỳ biến thông tin hiển thị trong biến INFO bên trong script.js.
