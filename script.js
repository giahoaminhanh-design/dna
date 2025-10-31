// Bản đồ Leaflet + GeoJSON (biên giới thật). Upload thẳng lên GitHub Pages là chạy.
const ASEAN_NAMES = new Set(['Vietnam','Thailand','Laos','Cambodia','Myanmar','Malaysia','Singapore','Indonesia','Philippines','Brunei','Timor-Leste']);

// Thông tin demo; có thể sửa theo ý
const INFO = {
  Vietnam:{population:'~100 triệu',language:'Tiếng Việt',culture:'Á Đông + Pháp'},
  Thailand:{population:'~71 triệu',language:'Tiếng Thái',culture:'Phật giáo, hoàng gia'},
  Laos:{population:'~7.6 triệu',language:'Tiếng Lào',culture:'Theravada'},
  Cambodia:{population:'~17 triệu',language:'Khmer',culture:'Angkor'},
  Myanmar:{population:'~55 triệu',language:'Burmese',culture:'Đa dân tộc'},
  Malaysia:{population:'~34 triệu',language:'Bahasa',culture:'Hồi giáo, đa tộc'},
  Singapore:{population:'~6 triệu',language:'Anh/Hoa/ML/Tamil',culture:'Đa văn hoá'},
  Indonesia:{population:'~280 triệu',language:'Bahasa',culture:'Quần đảo đa ngữ'},
  Philippines:{population:'~115 triệu',language:'Filipino/Anh',culture:'TBN + Mỹ'},
  Brunei:{population:'~0.45 triệu',language:'Malay',culture:'Hồi giáo'},
  'Timor-Leste':{population:'~1.4 triệu',language:'Tetum/Bồ',culture:'Đông Timor'},
};

// Khởi tạo map
const map = L.map('map', { zoomControl:true, scrollWheelZoom:true });
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap',
  maxZoom: 18
}).addTo(map);

// loadGeoJSON: thử lấy từ nguồn công khai; nếu fail thì thử file local asean.geojson
async function loadGeoJSON(){
  try {
    // Dataset công khai phổ biến (countries.geojson)
    const url = 'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson';
    const r = await fetch(url, {mode:'cors'});
    if (!r.ok) throw new Error('Remote fetch failed');
    return await r.json();
  } catch (e) {
    console.warn('Remote geojson failed, fallback to local asean.geojson', e);
    const r2 = await fetch('./asean.geojson');
    return await r2.json();
  }
}

function featureName(props){
  // Thử nhiều key tên quốc gia phổ biến
  return props.ADMIN || props.NAME || props.NAME_EN || props.name || props.sovereignt;
}

function baseStyle(){ return { color:'#1e3a8a', weight:1.2, fillColor:'#60a5fa', fillOpacity:0.7 }; }
function activeStyle(){ return { color:'#14532d', weight:1.5, fillColor:'#22c55e', fillOpacity:0.95 }; }

function openModal(name){
  const meta = INFO[name] || {population:'—', language:'—', culture:'—'};
  document.getElementById('modal-title').textContent = name;
  document.getElementById('info-population').textContent = meta.population;
  document.getElementById('info-language').textContent = meta.language;
  document.getElementById('info-culture').textContent = meta.culture;
  const modal = document.getElementById('modal');
  modal.classList.remove('hidden'); modal.setAttribute('aria-hidden','false');
}

function closeModal(){
  const modal = document.getElementById('modal');
  modal.classList.add('hidden'); modal.setAttribute('aria-hidden','true');
  // reset dim
  geoLayer.eachLayer(l => { l.setStyle(baseStyle()); l._active = false; });
}

document.addEventListener('click', (e)=>{ if (e.target.matches('[data-close]')) closeModal(); });
document.addEventListener('keydown', (e)=>{ if (e.key === 'Escape') closeModal(); });

let geoLayer;

loadGeoJSON().then(geo => {
  // Lọc chỉ 11 nước ASEAN
  const filtered = {
    type: 'FeatureCollection',
    features: geo.features.filter(f => ASEAN_NAMES.has(featureName(f.properties)))
  };

  geoLayer = L.geoJSON(filtered, {
    style: baseStyle,
    onEachFeature: (feature, layer) => {
      const name = featureName(feature.properties);
      layer.bindTooltip(name, {sticky:true, opacity:0.9});
      layer.on('click', () => {
        // dim các nước khác + highlight nước được chọn
        geoLayer.eachLayer(l => { l.setStyle(baseStyle()); l._active = false; });
        layer.setStyle(activeStyle()); layer._active = true;
        // đưa lên top tạo cảm giác "nổi lên"
        if (layer.bringToFront) layer.bringToFront();
        openModal(name);
      });
      layer.on('mouseover', ()=>{ if (!layer._active) layer.setStyle({ fillOpacity: 0.85 }); });
      layer.on('mouseout',  ()=>{ if (!layer._active) layer.setStyle({ fillOpacity: 0.7  }); });
    }
  }).addTo(map);

  map.fitBounds(geoLayer.getBounds(), { padding:[20,20] });
});
