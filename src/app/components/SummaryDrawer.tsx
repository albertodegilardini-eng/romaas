import {
  Drawer,
  Box,
  Typography,
  Button,
  IconButton,
  Chip,
  Tooltip,
} from '@mui/material';
import { Close, PictureAsPdf, WhatsApp, Print, ErrorOutline } from '@mui/icons-material';
import { ShoppingListData, Product } from '../types';
import { formatMXN } from '../utils/format';
import { bestStore, bestLineTotal, effectivePrice, savingsOf } from '../utils/pricing';
import { STORE_COLORS, getStoreBrand } from './storeBrands';

// ── Helpers ───────────────────────────────────────────────────────────────────

type Item = { product: Product; category: string };
type StoreGroup = { store: string; items: Item[] };

function groupByStore(list: ShoppingListData): StoreGroup[] {
  const map = new Map<string, Item[]>();
  for (const cat of list.categorias) {
    for (const p of cat.productos) {
      if (p.cantidad <= 0) continue;
      // Group each item under its cheapest store so the trip buys at best price.
      const store = bestStore(p)?.store ?? p.tienda.split('/')[0].trim();
      if (!map.has(store)) map.set(store, []);
      map.get(store)!.push({ product: p, category: cat.nombre });
    }
  }
  return Array.from(map.entries()).map(([store, items]) => ({
    store,
    items: [...items].sort(
      (a, b) => (b.product.critico ? 1 : 0) - (a.product.critico ? 1 : 0),
    ),
  }));
}

function totalUnits(list: ShoppingListData) {
  return list.categorias.reduce(
    (t, c) => t + c.productos.reduce((s, p) => s + p.cantidad, 0),
    0,
  );
}

function totalMoney(list: ShoppingListData) {
  return list.categorias.reduce(
    (t, c) => t + c.productos.reduce((s, p) => s + bestLineTotal(p), 0),
    0,
  );
}

function totalSavings(list: ShoppingListData) {
  return list.categorias.reduce(
    (t, c) => t + c.productos.reduce((s, p) => s + savingsOf(p), 0),
    0,
  );
}

function groupMoney(g: StoreGroup) {
  return g.items.reduce((s, i) => s + bestLineTotal(i.product), 0);
}

// ── PDF via print window ──────────────────────────────────────────────────────

function buildPrintHTML(list: ShoppingListData, groups: StoreGroup[]): string {
  const total = totalUnits(list);
  const date = new Date().toLocaleDateString('es-MX', {
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  const storeSection = (g: StoreGroup) => {
    const color = STORE_COLORS[g.store] ?? '#4a5568';
    const rows = g.items
      .map(({ product }) => {
        const unit = effectivePrice(product);
        const sub = bestLineTotal(product);
        return `
      <tr class="${product.critico ? 'critical' : ''}">
        <td><strong>${product.critico ? '⚠ ' : ''}${product.nombre}</strong></td>
        <td>${product.especificacion}</td>
        <td class="center num">${product.cantidad}</td>
        <td class="center">${product.unidad}</td>
        <td class="center">${unit ? formatMXN(unit) : '—'}</td>
        <td class="center money">${sub ? formatMXN(sub) : '—'}</td>
        <td class="note">${product.notas ?? ''}</td>
      </tr>`;
      })
      .join('');

    return `
      <div class="store-block">
        <div class="store-header" style="background:${color}">
          ${g.store.toUpperCase()}
          <span class="store-total">${g.items.reduce(
            (s, i) => s + i.product.cantidad,
            0,
          )} uds. · ${formatMXN(groupMoney(g))}</span>
        </div>
        <table>
          <thead>
            <tr>
              <th>Producto</th><th>Especificación</th>
              <th class="center">Cant.</th><th class="center">Unidad</th>
              <th class="center">Precio</th><th class="center">Importe</th><th>Notas</th>
            </tr>
          </thead>
          <tbody>${rows}</tbody>
        </table>
      </div>`;
  };

  const grand = totalMoney(list);
  const budget = list.presupuesto ?? 0;
  const budgetLine = budget
    ? `<div class="budget ${grand > budget ? 'over' : 'ok'}">
         Presupuesto: ${formatMXN(budget)} &nbsp;·&nbsp; Estimado (mejor precio): ${formatMXN(grand)} &nbsp;·&nbsp;
         ${grand > budget ? `Excedido por ${formatMXN(grand - budget)}` : `Restante ${formatMXN(budget - grand)}`}
       </div>`
    : `<div class="budget ok">Total estimado (mejor precio): ${formatMXN(grand)}</div>`;
  const saved = totalSavings(list);
  const savingsLine =
    saved > 0
      ? `<div class="budget ok">💸 Ahorro comprando cada producto en su tienda más barata: ${formatMXN(saved)}</div>`
      : '';

  return `<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8"/>
  <title>Weekly Grocery AI — ${list.nombre}</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:'Helvetica Neue',Arial,sans-serif;font-size:11px;color:#111;padding:16mm 14mm}
    .header{background:#0a1628;color:#fff;padding:12px 16px;border-radius:6px;margin-bottom:16px}
    .header h1{font-size:18px;font-weight:800;letter-spacing:-0.3px}
    .header p{font-size:10px;opacity:.75;margin-top:3px}
    .store-block{margin-bottom:18px;page-break-inside:avoid}
    .store-header{color:#fff;font-weight:800;font-size:11px;letter-spacing:.8px;
      padding:6px 10px;border-radius:4px 4px 0 0;display:flex;justify-content:space-between}
    .store-total{font-weight:700;opacity:.9}
    table{width:100%;border-collapse:collapse;border:1px solid #e5e7eb;border-top:none}
    thead tr{background:#f1f5f9}
    th{padding:5px 8px;text-align:left;font-size:9px;font-weight:700;color:#475569;text-transform:uppercase;letter-spacing:.4px}
    td{padding:5px 8px;border-top:1px solid #e5e7eb;vertical-align:middle}
    tr:nth-child(even) td{background:#f8fafc}
    tr.critical td:first-child{color:#dc2626;font-weight:700}
    .center{text-align:center}
    .num{font-weight:700;font-size:13px}
    .money{font-weight:800;color:#16a34a}
    .note{color:#64748b;font-style:italic;font-size:10px}
    .budget{margin:0 0 16px;padding:9px 14px;border-radius:6px;font-weight:800;font-size:12px}
    .budget.ok{background:#dcfce7;color:#166534}
    .budget.over{background:#fee2e2;color:#b91c1c}
    .footer{margin-top:20px;text-align:center;font-size:9px;color:#94a3b8;border-top:1px solid #e5e7eb;padding-top:8px}
    @media print{body{padding:8mm 10mm}@page{margin:10mm}}
  </style>
</head>
<body>
  <div class="header">
    <h1>Weekly Grocery AI</h1>
    <p>${list.nombre} &nbsp;·&nbsp; ${list.fechaCreacion} &nbsp;·&nbsp; ${total} unidades &nbsp;·&nbsp; Generado: ${date}</p>
  </div>
  ${budgetLine}
  ${savingsLine}
  ${groups.map(storeSection).join('')}
  <div class="footer">Weekly Grocery AI &nbsp;·&nbsp; ${list.nombre} &nbsp;·&nbsp; ${date}</div>
</body>
</html>`;
}

function exportPDF(list: ShoppingListData, groups: StoreGroup[]) {
  const html = buildPrintHTML(list, groups);
  const win = window.open('', '_blank', 'width=900,height=700');
  if (!win) return;
  win.document.write(html);
  win.document.close();
  win.focus();
  // Small delay so styles render before print dialog
  setTimeout(() => {
    win.print();
  }, 400);
}

// ── Component ─────────────────────────────────────────────────────────────────

interface SummaryDrawerProps {
  open: boolean;
  onClose: () => void;
  list: ShoppingListData;
}

export function SummaryDrawer({ open, onClose, list }: SummaryDrawerProps) {
  const groups = groupByStore(list);
  const total = totalUnits(list);
  const grand = totalMoney(list);
  const budget = list.presupuesto ?? 0;
  const overBudget = budget > 0 && grand > budget;
  const saved = totalSavings(list);

  const shareWhatsApp = () => {
    let msg = `*Weekly Grocery AI — ${list.nombre}*\n📅 ${list.fechaCreacion}\n\n`;
    for (const g of groups) {
      msg += `*🏪 ${g.store}* (${formatMXN(groupMoney(g))})\n`;
      for (const { product } of g.items) {
        const sub = bestLineTotal(product);
        msg += `${product.critico ? '⚠️ ' : '• '}${product.cantidad} ${product.unidad} — ${product.nombre}${sub ? ` · ${formatMXN(sub)}` : ''}\n`;
      }
      msg += '\n';
    }
    msg += `_Total (mejor precio): ${total} uds. · ${formatMXN(grand)}_`;
    if (budget > 0) {
      msg += overBudget
        ? `\n⚠️ _Presupuesto ${formatMXN(budget)} — excedido por ${formatMXN(grand - budget)}_`
        : `\n💰 _Presupuesto ${formatMXN(budget)} — restante ${formatMXN(budget - grand)}_`;
    }
    if (saved > 0) msg += `\n💸 _Ahorro vs tienda más cara: ${formatMXN(saved)}_`;
    window.open(`https://wa.me/?text=${encodeURIComponent(msg)}`, '_blank');
  };

  return (
    <Drawer
      anchor="right"
      open={open}
      onClose={onClose}
      PaperProps={{
        sx: { width: { xs: '100vw', sm: 420 }, display: 'flex', flexDirection: 'column' },
      }}
    >
      {/* Header */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0a1628 0%, #1a2f5e 100%)',
          color: 'white',
          px: 3,
          py: 2.5,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
        }}
      >
        <Box>
          <Typography variant="h6" sx={{ fontWeight: 700 }}>
            Resumen de compra
          </Typography>
          <Typography variant="caption" sx={{ opacity: 0.7 }}>
            {list.nombre} · {total} uds. · {formatMXN(grand)} en {groups.length} tienda
            {groups.length !== 1 ? 's' : ''}
          </Typography>
        </Box>
        <IconButton onClick={onClose} sx={{ color: 'white' }}>
          <Close />
        </IconButton>
      </Box>

      {/* Action buttons */}
      <Box sx={{ display: 'flex', gap: 1, p: 2, borderBottom: '1px solid #e2e8f0' }}>
        <Button
          fullWidth
          variant="contained"
          startIcon={<PictureAsPdf />}
          onClick={() => exportPDF(list, groups)}
          sx={{
            bgcolor: '#dc2626',
            '&:hover': { bgcolor: '#b91c1c' },
            textTransform: 'none',
            borderRadius: 2,
          }}
        >
          Exportar PDF
        </Button>
        <Button
          fullWidth
          variant="contained"
          startIcon={<WhatsApp />}
          onClick={shareWhatsApp}
          sx={{
            bgcolor: '#25D366',
            '&:hover': { bgcolor: '#1da851' },
            textTransform: 'none',
            borderRadius: 2,
          }}
        >
          WhatsApp
        </Button>
        <Tooltip title="Imprimir">
          <IconButton
            onClick={() => exportPDF(list, groups)}
            sx={{ border: '1px solid #e2e8f0', borderRadius: 2, px: 1.5 }}
          >
            <Print />
          </IconButton>
        </Tooltip>
      </Box>

      {/* Items grouped by store */}
      <Box sx={{ flexGrow: 1, overflowY: 'auto', p: 2 }}>
        {groups.length === 0 ? (
          <Box sx={{ textAlign: 'center', py: 8, color: 'text.secondary' }}>
            <Typography variant="body1">Ningún producto tiene cantidad asignada.</Typography>
            <Typography variant="caption">Usa los controles + / − en cada producto.</Typography>
          </Box>
        ) : (
          groups.map((group) => {
            const color = STORE_COLORS[group.store] ?? '#4a5568';
            const brand = getStoreBrand(group.store);
            return (
              <Box key={group.store} sx={{ mb: 3 }}>
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    mb: 1,
                    px: 1.5,
                    py: 0.75,
                    borderRadius: 2,
                    bgcolor: color,
                    color: '#fff',
                  }}
                >
                  <brand.Logo size={22} />
                  <Typography
                    variant="subtitle2"
                    sx={{ fontWeight: 700, flexGrow: 1, letterSpacing: 0.5 }}
                  >
                    {brand.label.toUpperCase()}
                  </Typography>
                  <Chip
                    label={`${group.items.reduce((s, i) => s + i.product.cantidad, 0)} uds. · ${formatMXN(groupMoney(group))}`}
                    size="small"
                    sx={{
                      bgcolor: 'rgba(255,255,255,0.2)',
                      color: '#fff',
                      fontWeight: 700,
                      height: 20,
                    }}
                  />
                </Box>

                {group.items.map(({ product, category }) => (
                  <Box
                    key={product.id}
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1.5,
                      px: 1.5,
                      py: 1,
                      borderRadius: 1.5,
                      mb: 0.75,
                      bgcolor: product.critico ? '#fff8f8' : '#f9fafb',
                      border: `1px solid ${product.critico ? '#fecaca' : '#e5e7eb'}`,
                    }}
                  >
                    {product.imagen && (
                      <Box
                        component="img"
                        src={product.imagen}
                        alt={product.nombre}
                        sx={{
                          width: 40,
                          height: 40,
                          borderRadius: 1.5,
                          objectFit: 'cover',
                          flexShrink: 0,
                          border: '1px solid rgba(0,0,0,0.06)',
                        }}
                      />
                    )}
                    <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                        {product.critico && (
                          <ErrorOutline sx={{ fontSize: 14, color: '#ef4444' }} />
                        )}
                        <Typography variant="body2" sx={{ fontWeight: 600 }} noWrap>
                          {product.nombre}
                        </Typography>
                      </Box>
                      <Typography variant="caption" color="text.secondary" noWrap>
                        {category} · {product.especificacion}
                      </Typography>
                    </Box>
                    <Box
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'flex-end',
                        gap: 0.25,
                        flexShrink: 0,
                      }}
                    >
                      <Box
                        sx={{
                          display: 'flex',
                          alignItems: 'baseline',
                          gap: 0.4,
                          bgcolor: '#dcfce7',
                          borderRadius: 1.5,
                          px: 1,
                          py: 0.25,
                        }}
                      >
                        <Typography variant="body2" sx={{ fontWeight: 800, color: '#166534' }}>
                          {product.cantidad}
                        </Typography>
                        <Typography variant="caption" sx={{ color: '#16a34a', fontWeight: 600 }}>
                          {product.unidad}
                        </Typography>
                      </Box>
                      {bestLineTotal(product) > 0 && (
                        <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#1e40af' }}>
                          {formatMXN(bestLineTotal(product))}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                ))}
              </Box>
            );
          })
        )}
      </Box>

      {/* Footer total */}
      {groups.length > 0 && (
        <Box
          sx={{
            borderTop: '1px solid #e2e8f0',
            px: 3,
            py: 2,
            bgcolor: '#f9fafb',
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
            <Typography variant="body2" color="text.secondary">
              Total estimado · {total} uds.
            </Typography>
            <Typography
              variant="h6"
              sx={{ fontWeight: 800, color: overBudget ? '#dc2626' : '#276749' }}
            >
              {formatMXN(grand)}
            </Typography>
          </Box>
          {budget > 0 && (
            <Typography
              sx={{
                mt: 0.5,
                fontSize: 12,
                fontWeight: 700,
                textAlign: 'right',
                color: overBudget ? '#dc2626' : '#16a34a',
              }}
            >
              Presupuesto {formatMXN(budget)} ·{' '}
              {overBudget
                ? `excedido ${formatMXN(grand - budget)}`
                : `restante ${formatMXN(budget - grand)}`}
            </Typography>
          )}
          {saved > 0 && (
            <Typography
              sx={{ mt: 0.5, fontSize: 12, fontWeight: 700, textAlign: 'right', color: '#059669' }}
            >
              💸 Ahorro al mejor precio: {formatMXN(saved)}
            </Typography>
          )}
        </Box>
      )}
    </Drawer>
  );
}
