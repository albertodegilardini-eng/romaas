import { useState } from 'react';
import { Box, Typography, Popover, Chip } from '@mui/material';
import { Compare } from '@mui/icons-material';
import { Product } from '../types';
import { PriceInput } from './shared';
import { getStoreBrand } from './storeBrands';
import { storesOf, bestStore } from '../utils/pricing';
import { formatMXN } from '../utils/format';

/**
 * Shows a product's best (cheapest) price + which store it's at. Tap to open a
 * popover comparing every candidate store, with the cheapest flagged and each
 * price editable.
 */
export function PriceCompare({
  product,
  onPriceChange,
}: {
  product: Product;
  onPriceChange: (store: string, value: number) => void;
}) {
  const [anchor, setAnchor] = useState<HTMLElement | null>(null);
  const stores = storesOf(product);
  const best = bestStore(product);
  const multi = stores.length > 1;

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.25, alignItems: 'flex-start' }}>
      <Box
        role="button"
        onClick={(e) => setAnchor(e.currentTarget)}
        sx={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: 0.5,
          minWidth: 64,
          height: 28,
          px: 1,
          borderRadius: '8px',
          border: '1.5px dashed',
          borderColor: best ? 'rgba(37,99,235,0.35)' : 'rgba(0,0,0,0.15)',
          bgcolor: best ? 'rgba(37,99,235,0.06)' : 'transparent',
          cursor: 'pointer',
          fontSize: 13,
          fontWeight: 700,
          color: best ? '#1e40af' : 'text.disabled',
          transition: 'all 0.15s',
          '&:hover': { borderColor: '#3b82f6', color: '#1e40af' },
        }}
      >
        {best ? formatMXN(best.price) : '$ —'}
        {multi && <Compare sx={{ fontSize: 13, opacity: 0.7 }} />}
      </Box>

      {best && multi && (
        <Typography sx={{ fontSize: 10, fontWeight: 700, color: '#16a34a', pl: 0.5 }}>
          ↘ {best.store}
        </Typography>
      )}

      <Popover
        open={!!anchor}
        anchorEl={anchor}
        onClose={() => setAnchor(null)}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: 'left' }}
        slotProps={{ paper: { sx: { borderRadius: 2, boxShadow: '0 8px 28px rgba(15,23,42,0.18)' } } }}
      >
        <Box sx={{ p: 1.75, minWidth: 240 }}>
          <Typography sx={{ fontWeight: 700, fontSize: 12, mb: 1.25, color: 'text.secondary' }}>
            Precio por tienda · {product.nombre}
          </Typography>
          {stores.length === 0 && (
            <Typography variant="caption" color="text.secondary">
              Sin tienda asignada.
            </Typography>
          )}
          {stores.map((s) => {
            const isBest = best?.store === s && multi;
            const brand = getStoreBrand(s);
            return (
              <Box key={s} sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: 1 }}>
                <brand.Logo size={20} />
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography
                    sx={{
                      fontSize: 12.5,
                      fontWeight: isBest ? 800 : 500,
                      color: isBest ? '#16a34a' : 'text.primary',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                  >
                    {brand.label}
                  </Typography>
                </Box>
                {isBest && (
                  <Chip
                    label="Mejor"
                    size="small"
                    sx={{
                      height: 18,
                      fontSize: 9,
                      fontWeight: 800,
                      bgcolor: '#dcfce7',
                      color: '#166534',
                    }}
                  />
                )}
                <PriceInput
                  value={product.precios?.[s] ?? product.precio}
                  onChange={(v) => onPriceChange(s, v)}
                />
              </Box>
            );
          })}
        </Box>
      </Popover>
    </Box>
  );
}
