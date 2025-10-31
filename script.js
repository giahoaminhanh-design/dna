// ASEAN only, per-country colors, no basemap; Paracel/Spratly styled as part of Vietnam per user's display preference.
const STATUS = document.getElementById('status');
function showStatus(msg, isErr=false){ STATUS.textContent = msg; STATUS.style.display='block'; STATUS.style.background = isErr ? '#7f1d1d' : '#111827'; }

const ASEAN = ['Vietnam','Thailand','Laos','Cambodia','Myanmar','Malaysia','Singapore','Indonesia','Philippines','Brunei','Timor-Leste'];
const ASEAN_SET = new Set(ASEAN);

const COLORS = {
  Vietnam:'#22c55e', Thailand:'#60a5fa', Laos:'#a78bfa', Cambodia:'#f472b6',
  Myanmar:'#fb923c', Malaysia:'#38bdf8', Singapore:'#f87171', Indonesia:'#34d399',
  Philippines:'#fbbf24', Brunei:'#c084fc', 'Timor-Leste':'#f59e0b'
};

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

// No basemap
const map = L.map('map', { zoomControl:true, scrollWheelZoom:true, minZoom:3, maxZoom:10 });
const seaBounds = [[-15, 90],[30, 150]];
map.setMaxBounds(seaBounds);
map.fitBounds(seaBounds);

function nameOf(props){ return props.ADMIN || props.NAME || props.NAME_EN || props.name || props.sovereignt; }
function styleByName(name){ return { color:'#1f2937', weight:1, fillColor: COLORS[name] || '#9ca3af', fillOpacity:0.88 }; }
function activeStyle(name){ return { color:'#111827', weight:1.5, fillColor: COLORS[name] || '#22c55e', fillOpacity:0.98 }; }

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
  if (window.geoLayer) window.geoLayer.eachLayer(l => { const n=l.feature && nameOf(l.feature.properties); l.setStyle(styleByName(n)); l._active=false; });
}
document.addEventListener('click', e => { if (e.target.matches('[data-close]')) closeModal(); });
document.addEventListener('keydown', e => { if (e.key === 'Escape') closeModal(); });

async function tryFetch(url){ const r = await fetch(url, {mode:'cors'}); if(!r.ok) throw new Error('HTTP '+r.status); return r.json(); }

// Islands polygons displayed with Vietnam's color, labeled as belonging to Vietnam (display choice).
const ISLANDS = {
  "Quần đảo Hoàng Sa (Việt Nam)": {
    "type":"Feature","properties":{"name":"Vietnam"}, "geometry":{"type":"Polygon","coordinates":[[[111.2,16.1],[112.8,16.1],[112.8,17.1],[111.2,17.1],[111.2,16.1]]]}
  },
  "Quần đảo Trường Sa (Việt Nam)": {
    "type":"Feature","properties":{"name":"Vietnam"}, "geometry":{"type":"Polygon","coordinates":[[[111.8,7.8],[117.3,7.8],[117.3,12.6],[111.8,12.6],[111.8,7.8]]]}
  }
};

function addIslands(){
  Object.keys(ISLANDS).forEach(label => {
    const f = ISLANDS[label];
    const layer = L.geoJSON(f, {
      style: { color:'#14532d', weight:1.2, fillColor: COLORS['Vietnam'], fillOpacity:0.35 }
    }).addTo(map);
    layer.bindTooltip(label, {sticky:true, opacity:0.95});
  });
}

(function addLegend(){
  const div = L.DomUtil.create('div', 'legend');
  let html = '<h3>Màu quốc gia</h3>';
  Object.keys(COLORS).forEach(n => {
    html += `<div class="legend-item"><span class="legend-swatch" style="background:${COLORS[n]}"></span>${n}</div>`;
  });
  html += `<hr><div class="legend-item"><span class="legend-swatch" style="background:${COLORS['Vietnam']}"></span>Hoàng Sa / Trường Sa (VN)</div>`;
  div.innerHTML = html;
  L.control({position:'bottomright'}).onAdd = () => div;
  L.control({position:'bottomright'}).addTo(map);
})();

(async function init(){
  showStatus('Đang tải dữ liệu ASEAN...');
  let geo=null;
  const sources = [
    './asean.geojson',
    'https://raw.githubusercontent.com/datasets/geo-countries/master/data/countries.geojson',
    'https://cdn.jsdelivr.net/gh/datasets/geo-countries@master/data/countries.geojson',
    'https://raw.githubusercontent.com/johan/world.geo.json/master/countries.geo.json'
  ];
  for (const url of sources){
    try {
      const data = await tryFetch(url);
      if (!data || !data.features) continue;
      if (url.endsWith('asean.geojson')) {
        geo = data; // assume already filtered
      } else {
        const feats = data.features.filter(f => ASEAN_SET.has(nameOf(f.properties)));
        geo = { type:'FeatureCollection', features:feats };
      }
      showStatus('Tải từ: '+url);
      break;
    } catch(e){ /* try next */ }
  }
  if (!geo || !geo.features || !geo.features.length){ showStatus('Không có dữ liệu ASEAN. Hãy upload file asean.geojson.', true); return; }

  window.geoLayer = L.geoJSON(geo, {
    style: feat => styleByName(nameOf(feat.properties)),
    onEachFeature: (feature, layer) => {
      const name = nameOf(feature.properties);
      layer.bindTooltip(name, {sticky:true, opacity:0.9});
      layer.on('click', () => {
        window.geoLayer.eachLayer(l => { const n=l.feature&&nameOf(l.feature.properties); l.setStyle(styleByName(n)); l._active=false; });
        layer.setStyle(activeStyle(name)); layer._active=true; if (layer.bringToFront) layer.bringToFront();
        openModal(name);
      });
      layer.on('mouseover', ()=>{ if (!layer._active){ const n=name; layer.setStyle({ fillOpacity: 0.95, fillColor: COLORS[n]||'#9ca3af' }); } });
      layer.on('mouseout',  ()=>{ if (!layer._active){ const n=name; layer.setStyle({ fillOpacity: 0.88, fillColor: COLORS[n]||'#9ca3af' }); } });
    }
  }).addTo(map);

  map.fitBounds(window.geoLayer.getBounds(), { padding:[20,20] });
  addIslands();
  showStatus('Tải xong. Chỉ ASEAN, mỗi nước một màu.'); setTimeout(()=> STATUS.style.display='none', 2500);
})();
