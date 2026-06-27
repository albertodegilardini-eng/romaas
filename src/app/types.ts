export type Unidad =
  | 'piezas'
  | 'kg'
  | 'L'
  | 'paquetes'
  | 'latas'
  | 'bolsas'
  | 'rollos'
  | 'envases'
  | 'barras';

export interface Product {
  id: string;
  nombre: string;
  especificacion: string;
  minimo: string;
  comprar: string;
  tienda: string;
  notas?: string;
  cantidad: number;
  unidad: Unidad;
  critico: boolean;
  imagen?: string;
  /** Estimated base unit price in MXN (fallback when no per-store price). */
  precio?: number;
  /** Per-store unit prices in MXN, e.g. { "Walmart": 90, "City Market": 110 }. */
  precios?: Record<string, number>;
}

export interface Category {
  id: string;
  nombre: string;
  productos: Product[];
}

export interface ShoppingListData {
  id: string;
  nombre: string;
  fechaCreacion: string;
  categorias: Category[];
  /** Spending cap for this list in MXN. */
  presupuesto?: number;
}
