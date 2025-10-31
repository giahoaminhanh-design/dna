// Minimal interactive SEA map without any build tools
const countries = [
  {
    name: 'Vietnam',
    path: 'M370,420 L380,400 L390,410 L395,430 Z',
    info: {
      population: '100 triệu',
      language: 'Tiếng Việt',
      culture: 'Pha trộn Á Đông, ảnh hưởng Trung Hoa và Pháp',
    },
  },
  {
    name: 'Thailand',
    path: 'M320,350 L340,340 L350,360 L330,370 Z',
    info: {
      population: '71 triệu',
      language: 'Tiếng Thái',
      culture: 'Phật giáo chiếm ưu thế, văn hoá hoàng gia lâu đời',
    },
  },
  {
    name: 'Malaysia',
    path: 'M300,450 L320,460 L330,470 L310,465 Z',
    info: {
      population: '34 triệu',
      language: 'Tiếng Mã Lai',
      culture: 'Ảnh hưởng Hồi giáo và đa sắc tộc',
    },
  },
  {
    name: 'Singapore',
    path: 'M330,490 L335,492 L332,495 Z',
    info: {
      population: '6 triệu',
      language: 'Anh, Hoa, Mã Lai, Tamil',
      culture: 'Đa văn hoá, trung tâm tài chính',
    },
  },
  {
    name: 'Indonesia',
    path: 'M340,500 L360,510 L380,520 L400,530 Z',
    info: {
      population: '280 triệu',
      language: 'Tiếng Indonesia',
      culture: 'Quần đảo đa dạng với hơn 700 ngôn ngữ',
    },
  },
  {
    name: 'Philippines',
    path: 'M420,420 L430,410 L440,420 L430,430 Z',
    info: {
      population: '115 triệu',
      language: 'Tiếng Philippines, Anh',
      culture: 'Ảnh hưởng Tây Ban Nha và Mỹ, tôn giáo đậm nét',
    },
  },
];

let active = null;

const svg = document.getElementById('map');
const g = document.createElementNS('http://www.w3.org/2000/svg', 'g');
svg.appendChild(g);

countries.forEach((c) => {
  const group = document.createElementNS('http://www.w3.org/2000/svg', 'g');
  group.classList.add('country');
  group.setAttribute('data-name', c.name);

  const p = document.createElementNS('http://www.w3.org/2000/svg', 'path');
  p.setAttribute('d', c.path);
  group.appendChild(p);

  group.addEventListener('click', () => openModal(c, group));
  group.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') openModal(c, group); });
  group.setAttribute('tabindex', '0');
  group.setAttribute('role', 'button');
  group.setAttribute('aria-label', 'Xem thông tin ' + c.name);

  g.appendChild(group);
});

function openModal(country, element){
  // activate bounce
  if (active) active.classList.remove('active');
  document.querySelectorAll('.country').forEach(el => {
    if (el !== element) el.classList.add('dimmed');
    else el.classList.remove('dimmed');
  });
  element.classList.add('active');
  active = element;

  // fill modal
  document.getElementById('modal-title').textContent = country.name;
  document.getElementById('info-population').textContent = country.info.population;
  document.getElementById('info-language').textContent = country.info.language;
  document.getElementById('info-culture').textContent = country.info.culture;

  const modal = document.getElementById('modal');
  modal.classList.remove('hidden');
  modal.setAttribute('aria-hidden', 'false');
}

function closeModal(){
  const modal = document.getElementById('modal');
  modal.classList.add('hidden');
  modal.setAttribute('aria-hidden', 'true');
  document.querySelectorAll('.country').forEach(el => el.classList.remove('dimmed'));
}

document.querySelectorAll('[data-close]').forEach(btn => btn.addEventListener('click', closeModal));
document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });
