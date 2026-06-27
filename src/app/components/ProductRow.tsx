import { useState } from 'react';
import { Product, Unidad } from '../types';
import { TableRow, TableCell, Typography, Box, Avatar, IconButton, Tooltip } from '@mui/material';
import { DeleteOutline, BrokenImage, ErrorOutline } from '@mui/icons-material';
import { QuantityStepper, UnitSelect } from './shared';
import { PriceCompare } from './PriceCompare';
import { formatMXN } from '../utils/format';
import { bestLineTotal } from '../utils/pricing';

// ── Store brand badges ────────────────────────────────────────────────────────
// Brand colours + initials. (Logo image assets aren't bundled in this export, so
// we render clean coloured badges with the store's initials — no broken imports.)

const STORE_BRANDS: Record<string, { label: string; bg: string; color: string }> = {
  Walmart: { label: 'Walmart', bg: '#0071CE', color: '#fff' },
  'City Market': { label: 'City Market', bg: '#CC0000', color: '#fff' },
  GNC: { label: 'GNC', bg: '#F7941D', color: '#fff' },
  'La Europea': { label: 'La Europea', bg: '#1b1b2f', color: '#d4af37' },
  Starbucks: { label: 'Starbucks', bg: '#00704A', color: '#fff' },
  Farmacia: { label: 'Farmacia', bg: '#0a9396', color: '#fff' },
  'Farmacias del Ahorro': { label: 'F. del Ahorro', bg: '#e4002b', color: '#fff' },
  'Farmacia San Pablo': { label: 'San Pablo', bg: '#0057a8', color: '#fff' },
  WhatsApp: { label: 'WhatsApp', bg: '#25D366', color: '#fff' },
  Edificio: { label: 'Edificio', bg: '#4a5568', color: '#fff' },
  'Tintorería City Market': { label: 'Tintorería', bg: '#CC0000', color: '#fff' },
};

function StoreInitials({ label }: { label: string }) {
  const initials = label.replace(/[^A-Za-z]/g, '').slice(0, 2).toUpperCase() || '??';
  return (
    <Box
      sx={{
        width: 18,
        height: 18,
        borderRadius: '3px',
        bgcolor: 'rgba(255,255,255,0.22)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: 8,
        fontWeight: 900,
        color: 'inherit',
        flexShrink: 0,
      }}
    >
      {initials}
    </Box>
  );
}

function StoreBadge({ name }: { name: string }) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {name
        .split('/')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((store) => {
          const b = STORE_BRANDS[store];
          return (
            <Box
              key={store}
              sx={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: 0.6,
                pl: 0.5,
                pr: 1,
                py: 0.4,
                borderRadius: '8px',
                bgcolor: b?.bg ?? '#718096',
                color: b?.color ?? '#fff',
                fontSize: 10,
                fontWeight: 700,
                whiteSpace: 'nowrap',
                boxShadow: '0 1px 3px rgba(0,0,0,0.18)',
              }}
            >
              <StoreInitials label={b?.label ?? store} />
              {b?.label ?? store}
            </Box>
          );
        })}
    </Box>
  );
}

// ── Product thumbnail ─────────────────────────────────────────────────────────

export function ProductThumb({
  src,
  alt,
  size = 50,
}: {
  src?: string;
  alt: string;
  size?: number;
}) {
  const [imgError, setImgError] = useState(false);
  const ok = !imgError && !!src;
  return (
    <Avatar
      src={ok ? src : undefined}
      alt={alt}
      variant="rounded"
      onError={() => setImgError(true)}
      sx={{
        width: size,
        height: size,
        flexShrink: 0,
        borderRadius: 2,
        bgcolor: '#fff',
        border: '1px solid rgba(0,0,0,0.07)',
        boxShadow: '0 1px 4px rgba(15,23,42,0.10)',
        '& img': { objectFit: 'cover' },
      }}
    >
      {!ok && <BrokenImage sx={{ fontSize: size * 0.42, color: '#cbd5e0' }} />}
    </Avatar>
  );
}

// ── ProductRow ────────────────────────────────────────────────────────────────

interface ProductRowProps {
  product: Product;
  categoryId: string;
  onQuantityChange: (categoryId: string, productId: string, value: number) => void;
  onPriceChange: (categoryId: string, productId: string, store: string, value: number) => void;
  onFieldChange: (
    categoryId: string,
    productId: string,
    field: 'unidad' | 'critico',
    value: Unidad | boolean,
  ) => void;
  onDelete: () => void;
}

export function ProductRow({
  product,
  categoryId,
  onQuantityChange,
  onPriceChange,
  onFieldChange,
  onDelete,
}: ProductRowProps) {
  const [deleteArmed, setDeleteArmed] = useState(false);
  const needed = product.cantidad > 0;
  const subtotal = bestLineTotal(product);

  const armDelete = () => {
    setDeleteArmed(true);
    setTimeout(() => setDeleteArmed(false), 3000);
  };

  return (
    <TableRow
      sx={{
        bgcolor:
          product.critico && needed
            ? 'rgba(239,68,68,0.07)'
            : needed
              ? 'rgba(74,222,128,0.07)'
              : 'background.paper',
        '&:hover': {
          bgcolor:
            product.critico && needed
              ? 'rgba(239,68,68,0.12)'
              : needed
                ? 'rgba(74,222,128,0.12)'
                : 'action.hover',
        },
        transition: 'background-color 0.15s',
        borderLeft: product.critico ? '3px solid #ef4444' : '3px solid transparent',
      }}
    >
      {/* Quantity + unit */}
      <TableCell sx={{ py: 1, width: 165 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
          <QuantityStepper
            value={product.cantidad}
            onChange={(v) => onQuantityChange(categoryId, product.id, v)}
          />
          <UnitSelect
            value={product.unidad ?? 'piezas'}
            onChange={(v) => onFieldChange(categoryId, product.id, 'unidad', v)}
          />
        </Box>
      </TableCell>

      {/* Image + name + critical toggle */}
      <TableCell sx={{ py: 0.75 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
          <ProductThumb src={product.imagen} alt={product.nombre} />
          <Box sx={{ flexGrow: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
              <Typography
                variant="body2"
                sx={{ fontWeight: 600, color: needed ? '#276749' : 'text.primary' }}
              >
                {product.nombre}
              </Typography>
              <Tooltip title={product.critico ? 'Crítico — quitar flag' : 'Marcar como crítico'}>
                <IconButton
                  size="small"
                  onClick={() => onFieldChange(categoryId, product.id, 'critico', !product.critico)}
                  sx={{
                    p: 0.2,
                    color: product.critico ? '#ef4444' : '#cbd5e0',
                    '&:hover': { color: '#ef4444' },
                  }}
                >
                  <ErrorOutline sx={{ fontSize: 13 }} />
                </IconButton>
              </Tooltip>
            </Box>
            {product.especificacion && (
              <Typography variant="caption" color="text.secondary" sx={{ lineHeight: 1.3 }}>
                {product.especificacion}
              </Typography>
            )}
          </Box>
        </Box>
      </TableCell>

      <TableCell sx={{ py: 0.75 }}>
        <Typography variant="body2" color="text.secondary">
          {product.minimo}
        </Typography>
      </TableCell>
      <TableCell sx={{ py: 0.75 }}>
        <Typography variant="body2" sx={{ fontWeight: 600, color: '#2c5282' }}>
          {product.comprar}
        </Typography>
      </TableCell>
      {/* Price comparison + line subtotal */}
      <TableCell sx={{ py: 0.75 }}>
        <PriceCompare
          product={product}
          onPriceChange={(store, v) => onPriceChange(categoryId, product.id, store, v)}
        />
        {needed && subtotal > 0 && (
          <Typography sx={{ fontSize: 10.5, fontWeight: 700, color: '#16a34a', pl: 0.5, mt: 0.25 }}>
            = {formatMXN(subtotal)}
          </Typography>
        )}
      </TableCell>
      <TableCell sx={{ py: 0.75 }}>
        <StoreBadge name={product.tienda} />
      </TableCell>
      <TableCell sx={{ py: 0.75 }}>
        {product.notas && (
          <Typography
            variant="caption"
            color="text.secondary"
            sx={{ fontStyle: 'italic', lineHeight: 1.4 }}
          >
            {product.notas}
          </Typography>
        )}
      </TableCell>
      <TableCell sx={{ py: 0.75, px: 0.5 }}>
        <Tooltip title={deleteArmed ? 'Clic de nuevo para confirmar' : 'Eliminar'}>
          <IconButton
            size="small"
            onClick={deleteArmed ? onDelete : armDelete}
            sx={{
              p: 0.5,
              color: deleteArmed ? 'error.main' : 'transparent',
              '&:hover': { color: deleteArmed ? 'error.dark' : 'error.main' },
              transition: 'color 0.2s',
            }}
          >
            <DeleteOutline sx={{ fontSize: 16 }} />
          </IconButton>
        </Tooltip>
      </TableCell>
    </TableRow>
  );
}
