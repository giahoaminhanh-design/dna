// Bản đồ Leaflet + GeoJSON với nhiều nguồn fallback + thông báo lỗi rõ ràng
const STATUS = document.getElementById('status');
function showStatus(msg, isErr=false){ STATUS.textContent = msg; STATUS.style.display='block'; STATUS.style.background = isErr ? '#7f1d1d' : '#111827'; }

const ASEAN = new Set(['Vietnam','Thailand','Laos','Cambodia','Myanmar','Malaysia','Singapore','Indonesia','Philippines','Brunei','Timor-Leste']);
const INFO = { Vietnam:{population:'~100 triệu',language:'Tiếng Việt',culture:'Á Đông + Pháp'},
Thailand:{population:'~71 triệu',language:'Tiếng Thái',culture:'Phật giáo, hoàng gia'},
Laos:{population:'~7.6 triệu',language:'Tiếng Lào',culture:'Theravada'},
Cambodia:{population:'~17 triệu',language:'Khmer',culture:'Angkor'},
Myanmar:{population:'~55 triệu',language:'Burmese',culture:'Đa dân tộc'},
Malaysia:{population:'~34 triệu',language:'Bahasa',culture:'Hồi giáo, đa tộc'},
Singapore:{population:'~6 triệu',language:'Anh/Hoa/ML/Tamil',culture:'Đa văn hoá'},
Indonesia:{population:'~280 triệu',language:'Bahasa',culture:'Quần đảo đa ngữ'},
Philippines:{population:'~115 triệu',language:'Filipino/Anh',culture:'TBN + Mỹ'},
Brunei:{population:'~0.45 triệu',language:'Malay',culture:'Hồi giáo'},
'Timor-Leste':{population:'~1.4 triệu',language:'Tetum/Bồ',culture:'Đông Timor'}, };

const map = L.map('map'); L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{attribution:'&copy; OpenStreetMap'}).addTo(map);

function nameOf(props){ return props.ADMIN || props.NAME || props.NAME_EN || props.name || props.sovereignt; }
function baseStyle(){ return { color:'#1e3a8a', weight:1.2, fillColor:'#60a5fa', fillOpacity:0.7 }; }
function activeStyle(){ return { color:'#14532d', weight:1.5, fillColor:'#22c55e', fillOpacity:0.95 }; }

function openModal(name){
  const m = INFO[name] || {population:'—', language:'—', culture:'—'};
  document.getElementById('modal-title').textContent = name;
  document.getElementById('info-population').textContent = m.population;
  document.getElementById('info-language').textContent = m.language;
  document.getElementById('info-culture').textContent = m.culture;
  const modal = document.getElementById('modal');
  modal.classList.remove('hidden'); modal.setAttribute('aria-hidden','false');
}
function closeModal(){
  const modal = document.getElementById('modal');
  modal.classList.add('hidden'); modal.setAttribute('aria-hidden','true');
  if (window.geoLayer) window.geoLayer.eachLayer(l => { l.setStyle(baseStyle()); l._active=false; });
}
document.addEventListener('click', e => { if (e.target.matches('[data-close]')) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

async function tryFetch(url){
  const r = await fetch(url, {mode:'cors'});
  if (!r.ok) throw new Error('HTTP '+r.status); return r.json();
}

(async function init(){
  showStatus('Đang tải dữ liệu biên giới...');
  // Nhiều nguồn fallback phổ biến có CORS mở
  const sources = [
    'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson',
    'https://cdn.jsdelivr.net/gh/datasets/geo-countries@master/data/countries.geojson',
    'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json',
    './asean.geojson' // cuối cùng: local
  ];
  let geo = null, lastErr = null;
  for (const url of sources){
    try { geo = await tryFetch(url); showStatus('Tải từ: '+url); break; }
    catch(e){ lastErr = e; }
  }
  if (!geo){ showStatus('Không tải được GeoJSON. Vui lòng upload file asean.geojson (đã lọc) vào repo.', true); return; }

  const filtered = { type:'FeatureCollection', features: (geo.features || []).filter(f => ASEAN.has(nameOf(f.properties))) };
  if (!filtered.features.length){ showStatus('GeoJSON không có dữ liệu ASEAN. Hãy thay asean.geojson bằng dữ liệu đúng.', true); return; }

  window.geoLayer = L.geoJSON(filtered, {
    style: baseStyle,
    onEachFeature: (feature, layer) => {
      const name = nameOf(feature.properties);
      layer.bindTooltip(name, {sticky:true, opacity:0.9});
      layer.on('click', () => {
        window.geoLayer.eachLayer(l => { l.setStyle(baseStyle()); l._active=false; });
        layer.setStyle(activeStyle()); layer._active=true; if (layer.bringToFront) layer.bringToFront();
        openModal(name);
      });
      layer.on('mouseover', ()=>{ if (!layer._active) layer.setStyle({ fillOpacity: 0.85 }); });
      layer.on('mouseout',  ()=>{ if (!layer._active) layer.setStyle({ fillOpacity: 0.7  }); });
    }
  }).addTo(map);
  map.fitBounds(window.geoLayer.getBounds(), { padding:[20,20] });
  showStatus('Tải xong. Click vào quốc gia để xem thông tin.');
  setTimeout(()=> STATUS.style.display='none', 2500);
})();
