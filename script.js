
const STATUS = document.getElementById('status');
function showStatus(msg, isErr=false){
  STATUS.textContent = msg; STATUS.style.display='block';
  STATUS.style.background = isErr ? '#7f1d1d' : '#111827';
  clearTimeout(window.__statusTimer); window.__statusTimer=setTimeout(()=> STATUS.style.display='none', 2400);
}

const map = L.map('map', { zoomControl: true, attributionControl: false });
const boundsSE = [[-12, 90],[24, 150]];
map.fitBounds(boundsSE);
L.control.attribution({prefix:false}).addTo(map);

const COLORS = {
  'Vietnam':'#22c55e','Thailand':'#60a5fa','Laos':'#a78bfa','Cambodia':'#f472b6',
  'Myanmar':'#fb923c','Malaysia':'#38bdf8','Singapore':'#f87171','Indonesia':'#34d399',
  'Philippines':'#fbbf24','Brunei':'#c084fc','Timor-Leste':'#f59e0b'
};

const DATA = {
  'Vietnam':{capital:'Hà Nội',population:'~100 triệu',area:'~331.000 km²',gdp:'~430 tỷ USD',currency:'VND',language:'Tiếng Việt',culture:'Á Đông'},
  'Thailand':{capital:'Bangkok',population:'~71 triệu',area:'~513.000 km²',gdp:'~500 tỷ USD',currency:'THB',language:'Tiếng Thái',culture:'Phật giáo, hoàng gia'},
  'Laos':{capital:'Viêng Chăn',population:'~7.6 triệu',area:'~237.000 km²',gdp:'~15 tỷ USD',currency:'LAK',language:'Tiếng Lào',culture:'Phật giáo Theravada'},
  'Cambodia':{capital:'Phnom Penh',population:'~17 triệu',area:'~181.000 km²',gdp:'~30 tỷ USD',currency:'KHR',language:'Tiếng Khmer',culture:'Angkor'},
  'Myanmar':{capital:'Naypyidaw',population:'~55 triệu',area:'~676.000 km²',gdp:'~65 tỷ USD',currency:'MMK',language:'Tiếng Myanmar',culture:'Đa sắc tộc'},
  'Malaysia':{capital:'Kuala Lumpur',population:'~34 triệu',area:'~330.000 km²',gdp:'~410 tỷ USD',currency:'MYR',language:'Tiếng Mã Lai',culture:'Đa sắc tộc'},
  'Singapore':{capital:'Singapore',population:'~5.9 triệu',area:'~733 km²',gdp:'~500+ tỷ USD',currency:'SGD',language:'Anh/Mã Lai/Quan thoại/Tamil',culture:'Đa văn hoá'},
  'Indonesia':{capital:'Nusantara',population:'~280 triệu',area:'~1.9 triệu km²',gdp:'~1.4 nghìn tỷ USD',currency:'IDR',language:'Tiếng Indonesia',culture:'Quốc đảo'},
  'Philippines':{capital:'Manila',population:'~119 triệu',area:'~300.000 km²',gdp:'~440 tỷ USD',currency:'PHP',language:'Filipino/Anh',culture:'Latinh-Á'},
  'Brunei':{capital:'Bandar Seri Begawan',population:'~0.45 triệu',area:'~5.765 km²',gdp:'~18 tỷ USD',currency:'BND',language:'Tiếng Mã Lai',culture:'Dầu khí'},
  'Timor-Leste':{capital:'Dili',population:'~1.4 triệu',area:'~15.000 km²',gdp:'~3 tỷ USD',currency:'USD',language:'Tetum/Portuguese',culture:'Lusophone'}
};

function getName(props){ return props.NAME_0 || props.name || '—'; }
function styleByName(name){ return { color:'#0f172a', weight:0.7, fillColor: COLORS[name] || '#9ca3af', fillOpacity:0.88 }; }
function activeStyle(name){ return { color:'#0f172a', weight:1.3, fillColor: COLORS[name] || '#9ca3af', fillOpacity:0.96 }; }

function bindEvents(layer, name){
  layer.on('click', () => {
    window.geoLayer.eachLayer(l => { const n=getName(l.feature.properties); l.setStyle(styleByName(n)); l._active=false; });
    layer.setStyle(activeStyle(name)); layer._active=true; if (layer.bringToFront) layer.bringToFront();
    openPanel(name);
  });
  layer.on('mouseover', () => { if (!layer._active) layer.setStyle({fillOpacity:0.95}); });
  layer.on('mouseout',  () => { if (!layer._active) layer.setStyle({fillOpacity:0.88}); });
}

function openPanel(name){
  const info = DATA[name] || {};
  document.getElementById('info-name').textContent = name || '—';
  document.getElementById('info-capital').textContent = info.capital || '—';
  document.getElementById('info-population').textContent = info.population || '—';
  document.getElementById('info-area').textContent = info.area || '—';
  document.getElementById('info-gdp').textContent = info.gdp || '—';
  document.getElementById('info-currency').textContent = info.currency || '—';
  document.getElementById('info-language').textContent = info.language || '—';
  document.getElementById('info-culture').textContent = info.culture || '—';
}

(function init(){
  const gj = window.__ASEAN_GEOJSON__;
  window.geoLayer = L.geoJSON(gj, {
    style: f => styleByName(getName(f.properties)),
    onEachFeature: (feature, layer) => {
      const name = getName(feature.properties);
      layer.bindTooltip(name, {sticky:true, direction:'auto'});
      bindEvents(layer, name);
    }
  }).addTo(map);
  map.fitBounds(window.geoLayer.getBounds(), {padding:[20,20]});
  showStatus('Tải xong. Bấm polygon để xem chi tiết.');

  // Search + reset
  const input = document.getElementById('search');
  document.getElementById('resetBtn').onclick = () => map.fitBounds(window.geoLayer.getBounds(), {padding:[20,20]});
  input.addEventListener('keydown', (e)=>{
    if (e.key === 'Enter'){
      const query = input.value.trim().toLowerCase();
      if (!query) return;
      let found = null;
      window.geoLayer.eachLayer(l => {
        const n = getName(l.feature.properties);
        if (n && n.toLowerCase().includes(query)) found = l;
      });
      if (found){
        map.fitBounds(found.getBounds(), {padding:[20,20]});
        found.fire('click');
      } else {
        showStatus('Không tìm thấy quốc gia phù hợp', true);
      }
    }
  });
})();
