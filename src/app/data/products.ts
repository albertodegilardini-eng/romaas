import { Category, ShoppingListData } from '../types';

/**
 * Product photos live in /public/products/{id}.jpg (800×800, bundled with the app).
 * Override any item via the in-app "URL de imagen" field.
 */
const productPhoto = (id: string) => `/products/${id}.jpg?v=4`;

export const categorias: Category[] = [
  {
    id: 'bebidas',
    nombre: 'BEBIDAS',
    productos: [
      {
        id: 'coca-cola',
        nombre: 'Coca-Cola Zero',
        especificacion: 'Sin azúcar, 6 latas 355 ml',
        minimo: '1 rejilla / 2 six',
        comprar: '1 rejilla (12)',
        tienda: 'City Market',
        notas: 'Nunca comprar la regular.',
        cantidad: 0, unidad: 'latas', critico: false,
      },
      {
        id: 'corona-light',
        nombre: 'Cerveza Corona Light',
        especificacion: 'Caja 12 latas',
        minimo: '1 six',
        comprar: '1 six / 12',
        tienda: 'City Market',
        cantidad: 0, unidad: 'latas', critico: false,
      },
      {
        id: 'michelob',
        nombre: 'Cerveza Michelob Ultra',
        especificacion: 'En lata',
        minimo: '1 six',
        comprar: '1 six',
        tienda: 'City Market',
        cantidad: 0, unidad: 'latas', critico: false,
      },
      {
        id: 'agua-tonica',
        nombre: 'Agua tónica Peñafiel',
        especificacion: '296 ml, original',
        minimo: 'Según consumo',
        comprar: 'Según falte',
        tienda: 'City Market',
        notas: 'Para gin tonic.',
        cantidad: 0, unidad: 'latas', critico: false,
      },
      {
        id: 'agua-bonafont',
        nombre: 'Agua Bonafont',
        especificacion: 'Garrafón 10 L',
        minimo: '2 garrafones',
        comprar: '2 garrafones',
        tienda: 'City Market / Walmart',
        notas: 'Revisar antes de que quede 1.',
        cantidad: 0, unidad: 'L', critico: true,
      },
      {
        id: 'cafe-fruta',
        nombre: 'Café / vasos de fruta',
        especificacion: 'Starbucks o fruta fresca',
        minimo: '3–4',
        comprar: '3–4 vasos',
        tienda: 'Starbucks / City Market',
        notas: 'El de siempre.',
        cantidad: 0, unidad: 'piezas', critico: false,
      },
    ],
  },
  {
    id: 'frutas-verduras',
    nombre: 'FRUTAS Y VERDURAS',
    productos: [
      {
        id: 'toronjas',
        nombre: 'Toronjas',
        especificacion: 'Rojas, frescas',
        minimo: '4 piezas',
        comprar: '4 piezas',
        tienda: 'City Market',
        cantidad: 0, unidad: 'piezas', critico: false,
      },
      {
        id: 'pepinos',
        nombre: 'Pepinos',
        especificacion: 'Firmes',
        minimo: '3 piezas',
        comprar: '3 piezas',
        tienda: 'City Market',
        cantidad: 0, unidad: 'piezas', critico: false,
      },
      {
        id: 'limones',
        nombre: 'Limones',
        especificacion: 'Verdes',
        minimo: '1 bolsa',
        comprar: '1 bolsa',
        tienda: 'City Market',
        cantidad: 0, unidad: 'bolsas', critico: false,
      },
      {
        id: 'mini-zanahorias',
        nombre: 'Mini zanahorias',
        especificacion: 'NO las de rayas',
        minimo: '2 bolsas',
        comprar: '2 bolsas',
        tienda: 'City Market',
        notas: 'Validar etiqueta.',
        cantidad: 0, unidad: 'bolsas', critico: false,
      },
      {
        id: 'nopales',
        nombre: 'Nopales',
        especificacion: 'Frescos',
        minimo: 'Según consumo',
        comprar: 'Según indique',
        tienda: 'City Market',
        cantidad: 0, unidad: 'piezas', critico: false,
      },
      {
        id: 'verdura-general',
        nombre: 'Verdura / fruta general',
        especificacion: 'Para la semana',
        minimo: '3 días',
        comprar: 'Según menú',
        tienda: 'City Market / Walmart',
        notas: 'Anotar faltantes concretos.',
        cantidad: 0, unidad: 'piezas', critico: false,
      },
    ],
  },
  {
    id: 'carnes-proteina',
    nombre: 'CARNES Y PROTEÍNA',
    productos: [
      {
        id: 'bisteces',
        nombre: 'Bisteces de res',
        especificacion: 'Como la vez pasada',
        minimo: '2 paquetes',
        comprar: '2 paquetes',
        tienda: 'City Market',
        notas: 'Si duda del corte, foto antes de pagar.',
        cantidad: 0, unidad: 'paquetes', critico: false,
      },
      {
        id: 'carne-asar',
        nombre: 'Carne para asar',
        especificacion: 'Igual que bisteces',
        minimo: '2 paquetes',
        comprar: '2 paquetes',
        tienda: 'City Market',
        cantidad: 0, unidad: 'paquetes', critico: false,
      },
      {
        id: 'pollo-asar',
        nombre: 'Pollo para asar',
        especificacion: 'Marca Gus',
        minimo: '3 paquetes',
        comprar: '3 paquetes',
        tienda: 'City Market',
        cantidad: 0, unidad: 'paquetes', critico: false,
      },
      {
        id: 'jamon-pavo',
        nombre: 'Jamón pechuga de pavo',
        especificacion: 'San Rafael Balance',
        minimo: '1 paquete',
        comprar: '1–2 paquetes',
        tienda: 'City Market',
        notas: 'No pavo común; preguntar si hay duda.',
        cantidad: 0, unidad: 'paquetes', critico: false,
      },
      {
        id: 'salchichas-pavo',
        nombre: 'Salchichas de pavo',
        especificacion: 'San Rafael',
        minimo: '1 paquete',
        comprar: '1 paquete',
        tienda: 'City Market',
        cantidad: 0, unidad: 'paquetes', critico: false,
      },
      {
        id: 'huevo',
        nombre: 'Huevo',
        especificacion: 'Blanco o libre pastoreo',
        minimo: '1 cartera',
        comprar: '1 cartera',
        tienda: 'Walmart / City Market',
        cantidad: 0, unidad: 'piezas', critico: false,
      },
    ],
  },
  {
    id: 'despensa',
    nombre: 'DESPENSA',
    productos: [
      {
        id: 'espagueti',
        nombre: 'Espagueti',
        especificacion: 'Barilla',
        minimo: '2 paquetes',
        comprar: '2 paquetes',
        tienda: 'City Market / Walmart',
        cantidad: 0, unidad: 'paquetes', critico: false,
      },
      {
        id: 'arroz',
        nombre: 'Arroz',
        especificacion: 'Verde Valle',
        minimo: '2 bolsas',
        comprar: '2 bolsas',
        tienda: 'City Market / Walmart',
        cantidad: 0, unidad: 'bolsas', critico: false,
      },
      {
        id: 'pan',
        nombre: 'Pan',
        especificacion: 'Oroweat multigrano',
        minimo: '1 paquete',
        comprar: '1 paquete',
        tienda: 'City Market / Walmart',
        notas: 'Revisar caducidad.',
        cantidad: 0, unidad: 'paquetes', critico: false,
      },
      {
        id: 'aceite',
        nombre: 'Aceite de cocina',
        especificacion: 'Estándar',
        minimo: '1 botella',
        comprar: '1 botella',
        tienda: 'Walmart / City Market',
        cantidad: 0, unidad: 'L', critico: false,
      },
      {
        id: 'sal-condimentos',
        nombre: 'Sal / condimentos',
        especificacion: 'Básicos',
        minimo: 'Reserva mínima',
        comprar: 'Según falte',
        tienda: 'Walmart / City Market',
        cantidad: 0, unidad: 'envases', critico: false,
      },
      {
        id: 'tortillas',
        nombre: 'Tortillas',
        especificacion: 'Según uso',
        minimo: '1 paquete',
        comprar: '1 paquete',
        tienda: 'Walmart / City Market',
        cantidad: 0, unidad: 'paquetes', critico: false,
      },
      {
        id: 'salsas-aderezos',
        nombre: 'Salsas / aderezos',
        especificacion: 'Según consumo',
        minimo: '1 reserva',
        comprar: 'Según falte',
        tienda: 'Walmart / City Market',
        cantidad: 0, unidad: 'envases', critico: false,
      },
    ],
  },
  {
    id: 'limpieza',
    nombre: 'LIMPIEZA',
    productos: [
      {
        id: 'bolsas-grandes',
        nombre: 'Bolsas de basura grandes',
        especificacion: 'Costalitos',
        minimo: '4 paquetes',
        comprar: '4 paquetes',
        tienda: 'Walmart / City Market',
        cantidad: 0, unidad: 'paquetes', critico: false,
      },
      {
        id: 'bolsas-chicas',
        nombre: 'Bolsas de basura chicas',
        especificacion: 'Costalitos',
        minimo: '4 paquetes',
        comprar: '4 paquetes',
        tienda: 'Walmart / City Market',
        cantidad: 0, unidad: 'paquetes', critico: false,
      },
      {
        id: 'cloro',
        nombre: 'Cloro',
        especificacion: 'Cloralex',
        minimo: '1 botella',
        comprar: '1 botella',
        tienda: 'Walmart',
        cantidad: 0, unidad: 'L', critico: false,
      },
      {
        id: 'jabon-trastes',
        nombre: 'Jabón para trastes',
        especificacion: 'Salvo limón',
        minimo: '1 envase',
        comprar: '1 envase',
        tienda: 'Walmart',
        cantidad: 0, unidad: 'envases', critico: false,
      },
      {
        id: 'pinol',
        nombre: 'Pinol / multiusos',
        especificacion: 'Limpiador de pisos',
        minimo: '1 botella',
        comprar: '1 botella',
        tienda: 'Walmart',
        cantidad: 0, unidad: 'L', critico: false,
      },
      {
        id: 'limpiador-bano',
        nombre: 'Limpiador de baño',
        especificacion: 'Antisarro / desinfectante',
        minimo: '1 botella',
        comprar: '1 botella',
        tienda: 'Walmart',
        cantidad: 0, unidad: 'L', critico: false,
      },
      {
        id: 'detergente',
        nombre: 'Detergente de ropa',
        especificacion: 'Líquido o cápsulas',
        minimo: '1 envase',
        comprar: '1 envase',
        tienda: 'Walmart',
        cantidad: 0, unidad: 'envases', critico: false,
      },
      {
        id: 'suavizante',
        nombre: 'Suavizante',
        especificacion: 'Downy Intense',
        minimo: '1 envase',
        comprar: '1 envase',
        tienda: 'Walmart',
        cantidad: 0, unidad: 'envases', critico: false,
      },
      {
        id: 'papel-higienico',
        nombre: 'Papel higiénico',
        especificacion: 'Cottonelle Elegance',
        minimo: '1 paquete',
        comprar: '1 paquete',
        tienda: 'Walmart',
        notas: 'Artículo crítico.',
        cantidad: 0, unidad: 'paquetes', critico: true,
      },
      {
        id: 'servitoallas',
        nombre: 'Servitoallas',
        especificacion: 'Kleenex / cocina',
        minimo: '2 rollos',
        comprar: '1 paquete',
        tienda: 'Walmart',
        cantidad: 0, unidad: 'rollos', critico: false,
      },
      {
        id: 'toallas-humedas',
        nombre: 'Toallas húmedas',
        especificacion: 'Huggies Supreme',
        minimo: '1 paquete',
        comprar: '1 paquete',
        tienda: 'Walmart',
        cantidad: 0, unidad: 'paquetes', critico: false,
      },
      {
        id: 'esponjas',
        nombre: 'Esponjas / fibras',
        especificacion: 'Cocina y baño separadas',
        minimo: '2 nuevas',
        comprar: '1 paquete',
        tienda: 'Walmart',
        notas: 'No mezclar cocina y baño.',
        cantidad: 0, unidad: 'paquetes', critico: false,
      },
      {
        id: 'guantes',
        nombre: 'Guantes',
        especificacion: 'Cocina / limpieza',
        minimo: '1 par',
        comprar: '1 paquete',
        tienda: 'Walmart',
        cantidad: 0, unidad: 'piezas', critico: false,
      },
      {
        id: 'aromatizante',
        nombre: 'Aromatizante / difusor',
        especificacion: 'Baño y áreas comunes',
        minimo: '1 reserva',
        comprar: 'Según falte',
        tienda: 'Walmart / City Market',
        cantidad: 0, unidad: 'piezas', critico: false,
      },
      {
        id: 'papel-aluminio',
        nombre: 'Papel aluminio / film',
        especificacion: 'Cocina',
        minimo: '1 rollo',
        comprar: '1 rollo',
        tienda: 'Walmart',
        cantidad: 0, unidad: 'rollos', critico: false,
      },
    ],
  },
  {
    id: 'aseo-personal',
    nombre: 'ASEO PERSONAL',
    productos: [
      {
        id: 'shampoo',
        nombre: 'Shampoo',
        especificacion: 'El de siempre',
        minimo: '1 botella',
        comprar: '1 botella',
        tienda: 'Walmart / City Market',
        cantidad: 0, unidad: 'envases', critico: false,
      },
      {
        id: 'acondicionador',
        nombre: 'Acondicionador',
        especificacion: 'A juego con shampoo',
        minimo: '1 botella',
        comprar: '1 botella',
        tienda: 'Walmart / City Market',
        cantidad: 0, unidad: 'envases', critico: false,
      },
      {
        id: 'gel-bano',
        nombre: 'Jabón / gel de baño',
        especificacion: 'Corporal',
        minimo: '1 envase',
        comprar: '1 envase',
        tienda: 'Walmart',
        cantidad: 0, unidad: 'envases', critico: false,
      },
      {
        id: 'desodorante',
        nombre: 'Desodorante',
        especificacion: 'El de siempre',
        minimo: '1 pieza',
        comprar: '1 pieza',
        tienda: 'Walmart',
        cantidad: 0, unidad: 'piezas', critico: false,
      },
      {
        id: 'pasta-dental',
        nombre: 'Pasta dental',
        especificacion: 'Colgate / Crest',
        minimo: '1 tubo',
        comprar: '1 tubo',
        tienda: 'Walmart',
        cantidad: 0, unidad: 'piezas', critico: false,
      },
      {
        id: 'cepillo-dental',
        nombre: 'Cepillo de dientes',
        especificacion: 'Cerdas suaves',
        minimo: '1 pieza',
        comprar: '1 pieza',
        tienda: 'Walmart',
        cantidad: 0, unidad: 'piezas', critico: false,
      },
      {
        id: 'enjuague-bucal',
        nombre: 'Enjuague bucal',
        especificacion: 'Listerine',
        minimo: '1 botella',
        comprar: '1 botella',
        tienda: 'Walmart',
        cantidad: 0, unidad: 'envases', critico: false,
      },
      {
        id: 'rastrillos',
        nombre: 'Rastrillos / navajas',
        especificacion: 'Gillette',
        minimo: '1 paquete',
        comprar: '1 paquete',
        tienda: 'Walmart',
        cantidad: 0, unidad: 'paquetes', critico: false,
      },
      {
        id: 'crema-afeitar',
        nombre: 'Crema / gel para afeitar',
        especificacion: 'Estándar',
        minimo: '1 envase',
        comprar: '1 envase',
        tienda: 'Walmart',
        cantidad: 0, unidad: 'envases', critico: false,
      },
      {
        id: 'hilo-dental',
        nombre: 'Hilo dental',
        especificacion: 'Encerado',
        minimo: '1 pieza',
        comprar: '1 pieza',
        tienda: 'Walmart',
        cantidad: 0, unidad: 'piezas', critico: false,
      },
    ],
  },
  {
    id: 'farmacia',
    nombre: 'FARMACIA / MEDICAMENTOS',
    productos: [
      {
        id: 'receta-medica',
        nombre: 'Receta médica (pendiente)',
        especificacion: 'Agregar medicamentos de tu receta',
        minimo: 'Según receta',
        comprar: 'Según receta',
        tienda: 'Farmacia',
        notas: 'Pendiente: envíame tu receta y lo agrego con dosis y marca.',
        cantidad: 0, unidad: 'piezas', critico: true,
      },
      {
        id: 'paracetamol',
        nombre: 'Paracetamol',
        especificacion: 'Tempra / Tylenol 500 mg',
        minimo: '1 caja',
        comprar: '1 caja',
        tienda: 'Farmacia',
        notas: 'Analgésico / fiebre.',
        cantidad: 0, unidad: 'piezas', critico: false,
      },
      {
        id: 'ibuprofeno',
        nombre: 'Ibuprofeno',
        especificacion: 'Advil 400 mg',
        minimo: '1 caja',
        comprar: '1 caja',
        tienda: 'Farmacia',
        notas: 'Antiinflamatorio.',
        cantidad: 0, unidad: 'piezas', critico: false,
      },
      {
        id: 'electrolitos',
        nombre: 'Electrolitos / suero',
        especificacion: 'Electrolit / Suerox',
        minimo: '2 piezas',
        comprar: '2 piezas',
        tienda: 'Farmacia',
        cantidad: 0, unidad: 'piezas', critico: false,
      },
      {
        id: 'vitaminas',
        nombre: 'Multivitamínico',
        especificacion: 'Diario',
        minimo: '1 frasco',
        comprar: '1 frasco',
        tienda: 'Farmacia / GNC',
        cantidad: 0, unidad: 'envases', critico: false,
      },
      {
        id: 'alcohol-antiseptico',
        nombre: 'Alcohol / antiséptico',
        especificacion: 'Botella + gel',
        minimo: '1 botella',
        comprar: '1 botella',
        tienda: 'Farmacia',
        cantidad: 0, unidad: 'L', critico: false,
      },
      {
        id: 'curitas',
        nombre: 'Curitas / banditas',
        especificacion: 'Surtidas',
        minimo: '1 caja',
        comprar: '1 caja',
        tienda: 'Farmacia',
        cantidad: 0, unidad: 'paquetes', critico: false,
      },
      {
        id: 'antiacido',
        nombre: 'Antiácido',
        especificacion: 'Pepto / Melox',
        minimo: '1 pieza',
        comprar: '1 pieza',
        tienda: 'Farmacia',
        cantidad: 0, unidad: 'piezas', critico: false,
      },
      {
        id: 'cubrebocas',
        nombre: 'Cubrebocas',
        especificacion: 'Caja',
        minimo: '1 caja',
        comprar: '1 caja',
        tienda: 'Farmacia',
        cantidad: 0, unidad: 'paquetes', critico: false,
      },
    ],
  },
  {
    id: 'suplementos',
    nombre: 'SUPLEMENTOS',
    productos: [
      {
        id: 'lean-shake',
        nombre: 'Lean Shake',
        especificacion: 'GNC, fresa o vainilla',
        minimo: '4 piezas',
        comprar: '4–5',
        tienda: 'GNC',
        notas: 'Comprar en GNC, no en City Market.',
        cantidad: 0, unidad: 'piezas', critico: false,
      },
      {
        id: 'barras-proteina',
        nombre: 'Barras de proteína',
        especificacion: 'GNC frutas / mixtas / toronja',
        minimo: '10 barras',
        comprar: '5+3+2',
        tienda: 'GNC',
        cantidad: 0, unidad: 'barras', critico: false,
      },
    ],
  },
  {
    id: 'extras',
    nombre: 'EXTRAS / INVITADOS',
    productos: [
      {
        id: 'hielo-duros',
        nombre: 'Hielo + duros rojos',
        especificacion: 'Para gin tonic',
        minimo: '1 bolsa',
        comprar: '1 bolsa',
        tienda: 'City Market / Walmart',
        notas: 'Solo si hay invitados.',
        cantidad: 0, unidad: 'bolsas', critico: false,
      },
      {
        id: 'vinos-licores',
        nombre: 'Vinos / licores',
        especificacion: 'Confirmar tipo antes',
        minimo: '—',
        comprar: 'Según autorización',
        tienda: 'La Europea / City Market',
        notas: 'Compra solo con instrucción expresa.',
        cantidad: 0, unidad: 'piezas', critico: false,
      },
    ],
  },
  {
    id: 'servicios',
    nombre: 'SERVICIOS / CONTROL',
    productos: [
      {
        id: 'tintoreria',
        nombre: 'Tintorería',
        especificacion: 'Prendas / tickets',
        minimo: 'Bolsa pendiente',
        comprar: 'Según prendas',
        tienda: 'Tintorería City Market',
        notas: 'Contar prendas, revisar daño, foto del ticket.',
        cantidad: 0, unidad: 'piezas', critico: false,
      },
      {
        id: 'paquetes',
        nombre: 'Recepción de paquetes',
        especificacion: 'Rappi / Amazon / DHL',
        minimo: 'Revisión diaria',
        comprar: 'N/A',
        tienda: 'Edificio',
        notas: 'Verificar nombre, depto y código.',
        cantidad: 0, unidad: 'piezas', critico: false,
      },
      {
        id: 'foto-ticket',
        nombre: 'Foto de ticket',
        especificacion: 'Por cada compra',
        minimo: '100% tickets',
        comprar: 'N/A',
        tienda: 'WhatsApp',
        notas: 'Enviar el mismo día.',
        cantidad: 0, unidad: 'piezas', critico: true,
      },
    ],
  },
];

/**
 * Seed unit prices in MXN (rough estimates — edit in-app to match real receipts).
 * Service/control items have no price (they're tasks, not purchases).
 */
const PRECIOS: Record<string, number> = {
  // Bebidas
  'coca-cola': 200, 'corona-light': 230, michelob: 250, 'agua-tonica': 20,
  'agua-bonafont': 45, 'cafe-fruta': 90,
  // Frutas y verduras
  toronjas: 15, pepinos: 12, limones: 35, 'mini-zanahorias': 40, nopales: 12,
  'verdura-general': 60,
  // Carnes y proteína
  bisteces: 180, 'carne-asar': 200, 'pollo-asar': 150, 'jamon-pavo': 95,
  'salchichas-pavo': 75, huevo: 70,
  // Despensa
  espagueti: 35, arroz: 45, pan: 60, aceite: 55, 'sal-condimentos': 30,
  tortillas: 20, 'salsas-aderezos': 45,
  // Limpieza
  'bolsas-grandes': 60, 'bolsas-chicas': 50, cloro: 35, 'jabon-trastes': 30,
  pinol: 45, 'limpiador-bano': 50, detergente: 120, suavizante: 90,
  'papel-higienico': 180, servitoallas: 40, 'toallas-humedas': 70, esponjas: 35,
  guantes: 40, aromatizante: 90, 'papel-aluminio': 45,
  // Aseo personal
  shampoo: 90, acondicionador: 90, 'gel-bano': 70, desodorante: 60,
  'pasta-dental': 45, 'cepillo-dental': 35, 'enjuague-bucal': 75, rastrillos: 120,
  'crema-afeitar': 70, 'hilo-dental': 40,
  // Farmacia
  'receta-medica': 0, paracetamol: 55, ibuprofeno: 65, electrolitos: 25,
  vitaminas: 250, 'alcohol-antiseptico': 40, curitas: 45, antiacido: 60,
  cubrebocas: 80,
  // Suplementos
  'lean-shake': 120, 'barras-proteina': 45,
  // Extras
  'hielo-duros': 50, 'vinos-licores': 400,
  // Servicios (sin precio)
  tintoreria: 0, paquetes: 0, 'foto-ticket': 0,
};

for (const c of categorias) {
  for (const p of c.productos) {
    if (PRECIOS[p.id] !== undefined) p.precio = PRECIOS[p.id];
  }
}

/**
 * Seed per-store prices so the comparison view has something to show.
 * These are rough relative estimates (Walmart cheaper, specialty pricier);
 * real numbers come from editing in-app / receipts later.
 */
const STORE_MULT: Record<string, number> = {
  Walmart: 0.9,
  'City Market': 1.12,
  'La Europea': 1.05,
  GNC: 1.0,
  Starbucks: 1.0,
  Farmacia: 1.0,
  Otra: 1.0,
};

for (const c of categorias) {
  for (const p of c.productos) {
    if (!p.precio) continue;
    const stores = p.tienda
      .split('/')
      .map((s) => s.trim())
      .filter(Boolean);
    const precios: Record<string, number> = {};
    for (const s of stores) {
      const mult = STORE_MULT[s] ?? 1.0;
      precios[s] = Math.max(5, Math.round((p.precio * mult) / 5) * 5);
    }
    if (Object.keys(precios).length) p.precios = precios;
  }
}

// Wire every product to its bundled photo in /public/products/
for (const c of categorias) {
  for (const p of c.productos) {
    p.imagen = productPhoto(p.id);
  }
}

/** Merge saved list state with the latest catalog (photos, names, new items). */
export function syncListWithCatalog(saved: ShoppingListData): ShoppingListData {
  const savedCatMap = new Map(saved.categorias.map((c) => [c.id, c]));

  const mergedCats = categorias.map((catalogCat) => {
    const savedCat = savedCatMap.get(catalogCat.id);
    const savedProdMap = new Map((savedCat?.productos ?? []).map((p) => [p.id, p]));

    const productos = catalogCat.productos.map((fresh) => {
      const savedProd = savedProdMap.get(fresh.id);
      if (!savedProd) return { ...fresh };

      const customImage =
        !!savedProd.imagen &&
        savedProd.imagen.startsWith('http') &&
        !savedProd.imagen.includes('unsplash.com') &&
        !savedProd.imagen.includes('pexels.com') &&
        !savedProd.imagen.includes('loremflickr.com');

      return {
        ...fresh,
        cantidad: savedProd.cantidad,
        unidad: savedProd.unidad,
        critico: savedProd.critico,
        precio: savedProd.precio ?? fresh.precio,
        precios: savedProd.precios ?? fresh.precios,
        imagen: customImage ? savedProd.imagen : fresh.imagen,
      };
    });

    const catalogIds = new Set(catalogCat.productos.map((p) => p.id));
    const extras = (savedCat?.productos ?? []).filter((p) => !catalogIds.has(p.id));

    return { ...catalogCat, productos: [...productos, ...extras] };
  });

  const catalogCatIds = new Set(categorias.map((c) => c.id));
  const extraCats = saved.categorias.filter((c) => !catalogCatIds.has(c.id));

  return { ...saved, categorias: [...mergedCats, ...extraCats] };
}
