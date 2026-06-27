// Currency + number formatting helpers (Mexican peso).

const MXN = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  maximumFractionDigits: 0,
});

/** Format a number as MXN with no decimals, e.g. 1234 -> "$1,234". */
export function formatMXN(value: number): string {
  return MXN.format(Math.round(value || 0));
}

/** Line total for a product = unit price × quantity. */
export function lineTotal(precio: number | undefined, cantidad: number): number {
  return (precio ?? 0) * (cantidad ?? 0);
}
