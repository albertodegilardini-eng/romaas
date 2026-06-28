import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const Q = 'auto=compress&cs=tinysrgb&w=1000&h=1000&fit=crop&crop=center&dpr=2';
const U = (id) => `https://images.unsplash.com/photo-${id}?${Q}`;
const P = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?${Q}`;

/** Round 2 — sharper, unique, product-accurate photo per item. */
const SOURCES = {
  // BEBIDAS
  'coca-cola': P(19504042),
  'corona-light': U('1608270586620-866526ca0788'),
  michelob: P(1267325),
  'agua-tonica': P(6029762),
  'agua-bonafont': P(2930269),
  'cafe-fruta': P(302899),

  // FRUTAS Y VERDURAS
  toronjas: P(143133),
  pepinos: P(2329440),
  limones: P(1414129),
  'mini-zanahorias': P(1435899),
  nopales: U('1559181567-c3190ca9959b'),
  'verdura-general': P(128420),

  // CARNES
  bisteces: U('1558030006-450675393462'),
  'carne-asar': U('1529193591184-b1d58069ecdd'),
  'pollo-asar': U('1604908176997-125f25cc6f3d'),
  'jamon-pavo': U('1559847844-5315695dadae'),
  'salchichas-pavo': P(4518841),
  huevo: P(248412),

  // DESPENSA
  espagueti: P(1438677),
  arroz: P(33406),
  pan: P(1775043),
  aceite: P(33783),
  'sal-condimentos': P(3692876),
  tortillas: P(2098085),
  'salsas-aderezos': P(5873633),

  // LIMPIEZA
  'bolsas-grandes': P(3997380),
  'bolsas-chicas': P(4217770),
  cloro: P(3828883),
  'jabon-trastes': P(4065158),
  pinol: U('1585771724684-38269d6639fd'),
  'limpiador-bano': P(6195127),
  detergente: P(5591743),
  suavizante: P(5591741),
  'papel-higienico': P(3962285),
  servitoallas: P(6195824),
  'toallas-humedas': U('1584634731339-252c581abfc5'),
  esponjas: P(6195128),
  guantes: P(6195125),
  aromatizante: P(6580705),
  'papel-aluminio': P(4099237),

  // ASEO PERSONAL — each unique
  shampoo: P(3782125),
  acondicionador: P(4041397),
  'gel-bano': P(4467687),
  desodorante: P(4041396),
  'pasta-dental': P(6626113),
  'cepillo-dental': P(5836969),
  'enjuague-bucal': P(6502631),
  rastrillos: P(4549418),
  'crema-afeitar': P(3998379),
  'hilo-dental': P(6626116),

  // FARMACIA — each unique
  'receta-medica': P(4386467),
  paracetamol: P(3683073),
  ibuprofeno: P(40568),
  electrolitos: U('1551024709-8f23befc6f87'),
  vitaminas: P(3683080),
  'alcohol-antiseptico': U('1584017911766-d451b3c7d993'),
  curitas: P(5998474),
  antiacido: U('1666210032544-f1bafb9d4f4b'),
  cubrebocas: P(3786126),

  // SUPLEMENTOS
  'lean-shake': P(3738089),
  'barras-proteina': P(1640777),

  // EXTRAS
  'hielo-duros': P(326410),
  'vinos-licores': P(6029795),

  // SERVICIOS
  tintoreria: P(3991882),
  paquetes: P(4483610),
  'foto-ticket': P(6863332),
};

const FALLBACKS = {
  'corona-light': U('1639513473133-dc1e5f12f83e'),
  'coca-cola': U('1629203851122-3726ecdf080e'),
  nopales: P(36009),
  'agua-bonafont': P(416528),
  arroz: U('1536304929831-ee1ca9d44906'),
  aceite: U('1474979266404-7eaacbcd87c5'),
  pinol: P(48889),
  acondicionador: U('1608245449333-f02da94cd5a6'),
  desodorante: P(4467687),
  paracetamol: P(4386467),
  ibuprofeno: P(3683073),
  'alcohol-antiseptico': P(3828883),
  antiacido: P(3683080),
  electrolitos: P(50594),
  tortillas: U('1565299585323-38d6b0865b47'),
  'salsas-aderezos': U('1571942676516-bcab84649e44'),
  'bolsas-chicas': P(4099237),
};

const outDir = join(process.cwd(), 'public', 'products');
mkdirSync(outDir, { recursive: true });

async function download(id, url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'weekly-grocery-ai/3.0' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 8000) throw new Error('too small');
  writeFileSync(join(outDir, `${id}.jpg`), buf);
  return buf.length;
}

let ok = 0;
const failed = [];

for (const [id, url] of Object.entries(SOURCES)) {
  try {
    const size = await download(id, url);
    console.log(`✓ ${id} (${Math.round(size / 1024)}KB)`);
    ok++;
  } catch (e) {
    const fb = FALLBACKS[id];
    if (fb) {
      try {
        const size = await download(id, fb);
        console.log(`✓ ${id} fallback (${Math.round(size / 1024)}KB)`);
        ok++;
        continue;
      } catch {}
    }
    console.error(`✗ ${id}: ${e.message}`);
    failed.push(id);
  }
}

console.log(`\nDone: ${ok}/${Object.keys(SOURCES).length}`);
if (failed.length) {
  console.error('Failed:', failed.join(', '));
  process.exit(1);
}