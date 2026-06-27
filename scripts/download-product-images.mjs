import { mkdirSync, writeFileSync } from 'fs';
import { join } from 'path';

/** Product-id → high-quality Pexels/Unsplash direct URLs (product-accurate). */
const SOURCES = {
  // BEBIDAS
  'coca-cola': 'https://images.pexels.com/photos/50567/coca-cola-calculator-bottle-50567.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  'corona-light': 'https://images.pexels.com/photos/83725/pexels-photo-83725.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  'michelob': 'https://images.pexels.com/photos/995330/pexels-photo-995330.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  'agua-tonica': 'https://images.pexels.com/photos/6029762/pexels-photo-6029762.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  'agua-bonafont': 'https://images.pexels.com/photos/2930269/pexels-photo-2930269.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  'cafe-fruta': 'https://images.pexels.com/photos/302899/pexels-photo-302899.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',

  // FRUTAS Y VERDURAS
  toronjas: 'https://images.pexels.com/photos/143133/pexels-photo-143133.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  pepinos: 'https://images.pexels.com/photos/2329440/pexels-photo-2329440.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  limones: 'https://images.pexels.com/photos/1414129/pexels-photo-1414129.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  'mini-zanahorias': 'https://images.pexels.com/photos/1435899/pexels-photo-1435899.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  nopales: 'https://images.pexels.com/photos/36009/pexels-photo-36009.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  'verdura-general': 'https://images.pexels.com/photos/128420/pexels-photo-128420.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',

  // CARNES
  bisteces: 'https://images.pexels.com/photos/361184/pexels-photo-361184.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  'carne-asar': 'https://images.pexels.com/photos/769289/pexels-photo-769289.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  'pollo-asar': 'https://images.pexels.com/photos/60616/pexels-photo-60616.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  'jamon-pavo': 'https://images.pexels.com/photos/2232/pexels-photo-2232.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  'salchichas-pavo': 'https://images.pexels.com/photos/4518841/pexels-photo-4518841.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  huevo: 'https://images.pexels.com/photos/162712/pexels-photo-162712.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',

  // DESPENSA
  espagueti: 'https://images.pexels.com/photos/1438677/pexels-photo-1438677.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  arroz: 'https://images.pexels.com/photos/33406/pexels-photo-33406.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  pan: 'https://images.pexels.com/photos/1775043/pexels-photo-1775043.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  aceite: 'https://images.pexels.com/photos/33783/pexels-photo-33783.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  'sal-condimentos': 'https://images.pexels.com/photos/3692876/pexels-photo-3692876.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  tortillas: 'https://images.pexels.com/photos/2098085/pexels-photo-2098085.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  'salsas-aderezos': 'https://images.pexels.com/photos/5873633/pexels-photo-5873633.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',

  // LIMPIEZA
  'bolsas-grandes': 'https://images.pexels.com/photos/3997380/pexels-photo-3997380.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  'bolsas-chicas': 'https://images.pexels.com/photos/4099237/pexels-photo-4099237.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  cloro: 'https://images.pexels.com/photos/3828883/pexels-photo-3828883.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  'jabon-trastes': 'https://images.pexels.com/photos/4065158/pexels-photo-4065158.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  pinol: 'https://images.pexels.com/photos/48889/pexels-photo-48889.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  'limpiador-bano': 'https://images.pexels.com/photos/6195127/pexels-photo-6195127.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  detergente: 'https://images.pexels.com/photos/5591743/pexels-photo-5591743.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  suavizante: 'https://images.pexels.com/photos/5591741/pexels-photo-5591741.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  'papel-higienico': 'https://images.pexels.com/photos/3962285/pexels-photo-3962285.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  servitoallas: 'https://images.pexels.com/photos/6195824/pexels-photo-6195824.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  'toallas-humedas': 'https://images.pexels.com/photos/6195144/pexels-photo-6195144.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  esponjas: 'https://images.pexels.com/photos/6195128/pexels-photo-6195128.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  guantes: 'https://images.pexels.com/photos/6195125/pexels-photo-6195125.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  aromatizante: 'https://images.pexels.com/photos/6580705/pexels-photo-6580705.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  'papel-aluminio': 'https://images.pexels.com/photos/4099237/pexels-photo-4099237.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',

  // ASEO PERSONAL
  shampoo: 'https://images.pexels.com/photos/3782125/pexels-photo-3782125.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  acondicionador: 'https://images.pexels.com/photos/4041397/pexels-photo-4041397.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  'gel-bano': 'https://images.pexels.com/photos/4467687/pexels-photo-4467687.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  desodorante: 'https://images.pexels.com/photos/4041396/pexels-photo-4041396.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  'pasta-dental': 'https://images.pexels.com/photos/6626113/pexels-photo-6626113.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  'cepillo-dental': 'https://images.pexels.com/photos/5836969/pexels-photo-5836969.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  'enjuague-bucal': 'https://images.pexels.com/photos/6502631/pexels-photo-6502631.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  rastrillos: 'https://images.pexels.com/photos/4549418/pexels-photo-4549418.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  'crema-afeitar': 'https://images.pexels.com/photos/3998379/pexels-photo-3998379.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  'hilo-dental': 'https://images.pexels.com/photos/6626116/pexels-photo-6626116.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',

  // FARMACIA
  'receta-medica': 'https://images.pexels.com/photos/4386467/pexels-photo-4386467.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  paracetamol: 'https://images.pexels.com/photos/159211/pexels-photo-159211.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  ibuprofeno: 'https://images.pexels.com/photos/40568/pexels-photo-40568.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  electrolitos: 'https://images.pexels.com/photos/50594/pexels-photo-50594.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  vitaminas: 'https://images.pexels.com/photos/3683080/pexels-photo-3683080.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  'alcohol-antiseptico': 'https://images.pexels.com/photos/3828883/pexels-photo-3828883.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  curitas: 'https://images.pexels.com/photos/5998474/pexels-photo-5998474.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  antiacido: 'https://images.pexels.com/photos/3683073/pexels-photo-3683073.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  cubrebocas: 'https://images.pexels.com/photos/3786126/pexels-photo-3786126.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',

  // SUPLEMENTOS
  'lean-shake': 'https://images.pexels.com/photos/3738089/pexels-photo-3738089.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  'barras-proteina': 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',

  // EXTRAS
  'hielo-duros': 'https://images.pexels.com/photos/326410/pexels-photo-326410.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  'vinos-licores': 'https://images.pexels.com/photos/6029795/pexels-photo-6029795.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',

  // SERVICIOS
  tintoreria: 'https://images.pexels.com/photos/3991882/pexels-photo-3991882.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  paquetes: 'https://images.pexels.com/photos/4483610/pexels-photo-4483610.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
  'foto-ticket': 'https://images.pexels.com/photos/6863332/pexels-photo-6863332.jpeg?auto=compress&cs=tinysrgb&w=800&h=800&fit=crop',
};

const outDir = join(process.cwd(), 'public', 'products');
mkdirSync(outDir, { recursive: true });

let ok = 0;
let fail = 0;

for (const [id, url] of Object.entries(SOURCES)) {
  const dest = join(outDir, `${id}.jpg`);
  try {
    const res = await fetch(url, { headers: { 'User-Agent': 'weekly-grocery-ai/1.0' } });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const buf = Buffer.from(await res.arrayBuffer());
    writeFileSync(dest, buf);
    console.log(`✓ ${id} (${Math.round(buf.length / 1024)}KB)`);
    ok++;
  } catch (e) {
    console.error(`✗ ${id}: ${e.message}`);
    fail++;
  }
}

console.log(`\nDone: ${ok} ok, ${fail} failed`);