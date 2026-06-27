import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

const Q = 'auto=compress&cs=tinysrgb&w=900&h=900&fit=crop&dpr=2';
const U = (id) => `https://images.unsplash.com/photo-${id}?${Q}`;
const P = (id) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?${Q}`;

/** 66 unique, product-accurate photos — every item gets its own image. */
const SOURCES = {
  // BEBIDAS
  'coca-cola': P(19504042),
  'corona-light': U('1639513473133-dc1e5f12f83e'),
  michelob: P(1267325),
  'agua-tonica': P(6029762),
  'agua-bonafont': P(416528),
  'cafe-fruta': U('1509042239860-f550ce710b93'),

  // FRUTAS Y VERDURAS
  toronjas: U('1587735243475-37f3d32a68c3'),
  pepinos: U('1568702846914-96b305d2aaeb'),
  limones: U('1582476803820-9e9e218e65b9'),
  'mini-zanahorias': U('1598170845058-32b9d6a5da37'),
  nopales: U('1559181567-c3190ca9959b'),
  'verdura-general': U('1557844352-761f2565b576'),

  // CARNES
  bisteces: U('1558030006-450675393462'),
  'carne-asar': U('1529193591184-b1d58069ecdd'),
  'pollo-asar': U('1604908176997-125f25cc6f3d'),
  'jamon-pavo': U('1559847844-5315695dadae'),
  'salchichas-pavo': U('1485921720978-9fca4e2c1a14'),
  huevo: P(248412),

  // DESPENSA
  espagueti: U('1551892374-ecf8754cf8b0'),
  arroz: U('1536304929831-ee1ca9d44906'),
  pan: U('1509440159596-0249088772ff'),
  aceite: U('1474979266404-7eaacbcd87c5'),
  'sal-condimentos': U('1585032226651-759b368d7246'),
  tortillas: U('1565299585323-38d6b0865b47'),
  'salsas-aderezos': U('1571942676516-bcab84649e44'),

  // LIMPIEZA
  'bolsas-grandes': P(3997380),
  'bolsas-chicas': P(4217770),
  cloro: P(3828883),
  'jabon-trastes': P(4065158),
  pinol: P(48889),
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

  // ASEO PERSONAL
  shampoo: P(3782125),
  acondicionador: U('1608245449333-f02da94cd5a6'),
  'gel-bano': P(4467687),
  desodorante: U('1620916565345-364f1a0e32ab'),
  'pasta-dental': P(6626113),
  'cepillo-dental': P(5836969),
  'enjuague-bucal': P(6502631),
  rastrillos: P(4549418),
  'crema-afeitar': P(3998379),
  'hilo-dental': P(6626116),

  // FARMACIA
  'receta-medica': P(4386467),
  paracetamol: U('1584308665914-d65811c7805d'),
  ibuprofeno: U('1471864190282-a93a3070b9ec'),
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

// Fallbacks for any primary URL that 404s
const FALLBACKS = {
  'verdura-general': U('1557844352-761f2565b576'),
  'agua-bonafont': P(2930269),
  pinol: U('1585771724684-38269d6639fd'),
  acondicionador: U('1608245449333-f02da94cd5a6'),
  desodorante: U('1620916565345-364f1a0e32ab'),
  paracetamol: U('1584308665914-d65811c7805d'),
  'corona-light': P(995330),
  'coca-cola': U('1629203851122-3726ecdf080e'),
};

const outDir = join(process.cwd(), 'public', 'products');
mkdirSync(outDir, { recursive: true });

async function download(id, url) {
  const res = await fetch(url, { headers: { 'User-Agent': 'weekly-grocery-ai/2.0' } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 5000) throw new Error('too small');
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

console.log(`\nDone: ${ok}/${Object.keys(SOURCES).length} ok`);
if (failed.length) console.error('Failed:', failed.join(', '));
process.exit(failed.length ? 1 : 0);