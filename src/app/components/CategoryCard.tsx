import { useState } from 'react';
import { Category, Product, Unidad } from '../types';
import { ProductRow, ProductThumb } from './ProductRow';
import { QuantityStepper, UnitSelect } from './shared';
import { PriceCompare } from './PriceCompare';
import { formatMXN } from '../utils/format';
import { bestLineTotal } from '../utils/pricing';
import {
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  Button,
  Collapse,
  IconButton,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  Tooltip,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import { Add, ExpandMore, ExpandLess, Warning, ErrorOutline } from '@mui/icons-material';

const TIENDAS = ['City Market', 'Walmart', 'GNC', 'La Europea', 'Starbucks', 'Farmacia', 'Otra'];

const CATEGORY_COLORS: Record<string, string> = {
  bebidas: '#1a4780',
  'frutas-verduras': '#276749',
  'carnes-proteina': '#7b341e',
  despensa: '#744210',
  limpieza: '#2c4a7c',
  suplementos: '#44337a',
  'aseo-personal': '#155e75',
  farmacia: '#9d174d',
  extras: '#285e61',
  servicios: '#2d3748',
};

interface CategoryCardProps {
  category: Category;
  onQuantityChange: (categoryId: string, productId: string, value: number) => void;
  onPriceChange: (categoryId: string, productId: string, store: string, value: number) => void;
  onFieldChange: (
    categoryId: string,
    productId: string,
    field: 'unidad' | 'critico',
    value: Unidad | boolean,
  ) => void;
  onAddProduct: (product: Omit<Product, 'id'>) => void;
  onDeleteProduct: (productId: string) => void;
}

const EMPTY: Omit<Product, 'id'> = {
  nombre: '',
  especificacion: '',
  minimo: '',
  comprar: '',
  tienda: '',
  notas: '',
  cantidad: 0,
  unidad: 'piezas',
  critico: false,
  imagen: '',
};

function ProgressRing({ pct, size = 30 }: { pct: number; size?: number }) {
  const r = (size - 4) / 2;
  const circ = 2 * Math.PI * r;
  const dash = (pct / 100) * circ;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', flexShrink: 0 }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth={3} />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={r}
        fill="none"
        stroke="rgba(255,255,255,0.85)"
        strokeWidth={3}
        strokeDasharray={`${dash} ${circ}`}
        strokeLinecap="round"
        style={{ transition: 'stroke-dasharray 0.4s ease' }}
      />
      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="central"
        style={{
          transform: 'rotate(90deg)',
          transformOrigin: '50% 50%',
          fontSize: 8,
          fontWeight: 700,
          fill: 'white',
        }}
      >
        {pct}%
      </text>
    </svg>
  );
}

function MobileProductCard({
  product,
  categoryId,
  onQuantityChange,
  onPriceChange,
  onFieldChange,
  onDelete,
}: {
  product: Product;
  categoryId: string;
  onQuantityChange: (a: string, b: string, v: number) => void;
  onPriceChange: (a: string, b: string, store: string, v: number) => void;
  onFieldChange: (a: string, b: string, f: 'unidad' | 'critico', v: Unidad | boolean) => void;
  onDelete: () => void;
}) {
  const theme = useTheme();
  const [deleteArmed, setDeleteArmed] = useState(false);
  const needed = product.cantidad > 0;
  const dark = theme.palette.mode === 'dark';
  const subtotal = bestLineTotal(product);

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        gap: 1.5,
        px: 2,
        py: 1.25,
        borderLeft: product.critico ? '3px solid #ef4444' : '3px solid transparent',
        bgcolor:
          product.critico && needed
            ? dark
              ? 'rgba(239,68,68,0.1)'
              : '#fff8f8'
            : needed
              ? dark
                ? 'rgba(74,222,128,0.07)'
                : '#f0fff4'
              : 'transparent',
        borderBottom: `1px solid ${theme.palette.divider}`,
        '&:last-child': { borderBottom: 'none' },
        transition: 'background-color 0.15s',
      }}
    >
      <ProductThumb src={product.imagen} alt={product.nombre} size={48} />

      <Box sx={{ flexGrow: 1, minWidth: 0 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
          {product.critico && <ErrorOutline sx={{ fontSize: 12, color: '#ef4444', flexShrink: 0 }} />}
          <Typography
            variant="body2"
            sx={{
              fontWeight: 700,
              color: needed ? '#16a34a' : 'text.primary',
              overflow: 'hidden',
              textOverflow: 'ellipsis',
              whiteSpace: 'nowrap',
            }}
          >
            {product.nombre}
          </Typography>
        </Box>
        <Typography
          variant="caption"
          color="text.secondary"
          sx={{
            display: 'block',
            lineHeight: 1.3,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {product.especificacion}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.25, flexWrap: 'wrap' }}>
          <UnitSelect
            value={product.unidad}
            onChange={(v) => onFieldChange(categoryId, product.id, 'unidad', v)}
          />
          <PriceCompare
            product={product}
            onPriceChange={(store, v) => onPriceChange(categoryId, product.id, store, v)}
          />
          {needed && subtotal > 0 && (
            <Typography sx={{ fontSize: 11, fontWeight: 700, color: '#16a34a' }}>
              = {formatMXN(subtotal)}
            </Typography>
          )}
          <Tooltip title={product.critico ? 'Quitar crítico' : 'Marcar crítico'}>
            <IconButton
              size="small"
              onClick={() => onFieldChange(categoryId, product.id, 'critico', !product.critico)}
              sx={{
                p: 0.25,
                color: product.critico ? '#ef4444' : 'text.disabled',
                '&:hover': { color: '#ef4444' },
              }}
            >
              <ErrorOutline sx={{ fontSize: 11 }} />
            </IconButton>
          </Tooltip>
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-end',
          gap: 0.5,
          flexShrink: 0,
        }}
      >
        <QuantityStepper
          value={product.cantidad}
          onChange={(v) => onQuantityChange(categoryId, product.id, v)}
        />
        <IconButton
          size="small"
          onClick={() => {
            if (deleteArmed) {
              onDelete();
            } else {
              setDeleteArmed(true);
              setTimeout(() => setDeleteArmed(false), 3000);
            }
          }}
          sx={{
            p: 0.25,
            color: deleteArmed ? 'error.main' : 'transparent',
            '&:hover': { color: 'error.main' },
            transition: 'color 0.2s',
          }}
        >
          <ExpandMore sx={{ fontSize: 12, transform: 'rotate(45deg)' }} />
        </IconButton>
      </Box>
    </Box>
  );
}

export function CategoryCard({
  category,
  onQuantityChange,
  onPriceChange,
  onFieldChange,
  onAddProduct,
  onDeleteProduct,
}: CategoryCardProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [collapsed, setCollapsed] = useState(false);
  const [addDialog, setAddDialog] = useState(false);
  const [newProduct, setNewProduct] = useState(EMPTY);

  const bgColor = CATEGORY_COLORS[category.id] ?? '#2c5282';
  const totalUnits = category.productos.reduce((s, p) => s + p.cantidad, 0);
  const categoryTotal = category.productos.reduce((s, p) => s + bestLineTotal(p), 0);
  const withQty = category.productos.filter((p) => p.cantidad > 0).length;
  const pct =
    category.productos.length > 0
      ? Math.round((withQty / category.productos.length) * 100)
      : 0;
  const criticalPending = category.productos.filter((p) => p.critico && p.cantidad === 0).length;

  const handleAdd = () => {
    if (!newProduct.nombre.trim()) return;
    onAddProduct(newProduct);
    setNewProduct(EMPTY);
    setAddDialog(false);
  };

  return (
    <>
      <Card
        elevation={0}
        sx={{
          borderRadius: 3,
          overflow: 'hidden',
          bgcolor: 'background.paper',
          transition: 'transform 0.2s ease, box-shadow 0.2s ease',
          '&:hover': {
            transform: 'translateY(-2px)',
            boxShadow:
              '0 2px 4px rgba(16,24,40,0.06), 0 20px 44px -20px rgba(16,24,40,0.38)',
          },
        }}
      >
        <Box
          sx={{
            background: `linear-gradient(135deg, ${bgColor} 0%, color-mix(in srgb, ${bgColor} 70%, #0b1120) 100%)`,
            color: 'white',
            px: { xs: 1.5, md: 3 },
            py: 1.5,
            display: 'flex',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <ProgressRing pct={pct} size={isMobile ? 26 : 30} />
          <Typography
            sx={{
              fontWeight: 700,
              flexGrow: 1,
              letterSpacing: 0.4,
              fontSize: { xs: 12, md: 15 },
            }}
          >
            {category.nombre}
          </Typography>
          <Box sx={{ display: 'flex', gap: 0.5, alignItems: 'center' }}>
            {criticalPending > 0 && (
              <Chip
                icon={<Warning sx={{ fontSize: '11px !important', color: '#fef08a !important' }} />}
                label={criticalPending}
                size="small"
                sx={{
                  bgcolor: 'rgba(239,68,68,0.35)',
                  color: 'white',
                  fontWeight: 700,
                  height: 20,
                  '& .MuiChip-label': { px: 0.5 },
                }}
              />
            )}
            {categoryTotal > 0 && (
              <Chip
                label={formatMXN(categoryTotal)}
                size="small"
                sx={{
                  bgcolor: 'rgba(255,255,255,0.22)',
                  color: 'white',
                  fontWeight: 800,
                  height: 20,
                  '& .MuiChip-label': { px: 0.75 },
                }}
              />
            )}
            {totalUnits > 0 && (
              <Chip
                label={totalUnits}
                size="small"
                sx={{
                  bgcolor: 'rgba(104,211,145,0.35)',
                  color: 'white',
                  fontWeight: 700,
                  height: 20,
                  '& .MuiChip-label': { px: 0.5 },
                }}
              />
            )}
            <IconButton
              size="small"
              onClick={() => setAddDialog(true)}
              sx={{
                color: 'white',
                bgcolor: 'rgba(255,255,255,0.15)',
                '&:hover': { bgcolor: 'rgba(255,255,255,0.25)' },
                p: 0.5,
                borderRadius: 1.5,
              }}
            >
              <Add sx={{ fontSize: 15 }} />
            </IconButton>
            <IconButton
              size="small"
              onClick={() => setCollapsed((v) => !v)}
              sx={{ color: 'white', p: 0.5 }}
            >
              {collapsed ? <ExpandMore sx={{ fontSize: 15 }} /> : <ExpandLess sx={{ fontSize: 15 }} />}
            </IconButton>
          </Box>
        </Box>

        <Box sx={{ height: 3, bgcolor: 'action.hover' }}>
          <Box
            sx={{
              height: '100%',
              width: `${pct}%`,
              bgcolor: bgColor,
              opacity: 0.5,
              transition: 'width 0.4s ease',
            }}
          />
        </Box>

        <Collapse in={!collapsed}>
          <CardContent sx={{ p: 0 }}>
            {isMobile ? (
              <Box>
                {category.productos.map((p) => (
                  <MobileProductCard
                    key={p.id}
                    product={p}
                    categoryId={category.id}
                    onQuantityChange={onQuantityChange}
                    onPriceChange={onPriceChange}
                    onFieldChange={onFieldChange}
                    onDelete={() => onDeleteProduct(p.id)}
                  />
                ))}
              </Box>
            ) : (
              <TableContainer>
                <Table size="small">
                  <TableHead>
                    <TableRow
                      sx={{
                        bgcolor:
                          theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.03)' : '#f7fafc',
                      }}
                    >
                      <TableCell sx={{ fontWeight: 700, width: 165, fontSize: 11, color: 'text.secondary' }}>
                        Cantidad
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, fontSize: 11, color: 'text.secondary' }}>
                        Producto
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, width: 100, fontSize: 11, color: 'text.secondary' }}>
                        Mínimo
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, width: 110, fontSize: 11, color: 'text.secondary' }}>
                        Comprar
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, width: 120, fontSize: 11, color: 'text.secondary' }}>
                        Precio
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, width: 160, fontSize: 11, color: 'text.secondary' }}>
                        Tienda
                      </TableCell>
                      <TableCell sx={{ fontWeight: 700, width: 180, fontSize: 11, color: 'text.secondary' }}>
                        Notas
                      </TableCell>
                      <TableCell sx={{ width: 36 }} />
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {category.productos.map((p) => (
                      <ProductRow
                        key={p.id}
                        product={p}
                        categoryId={category.id}
                        onQuantityChange={onQuantityChange}
                        onPriceChange={onPriceChange}
                        onFieldChange={onFieldChange}
                        onDelete={() => onDeleteProduct(p.id)}
                      />
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            )}
          </CardContent>
        </Collapse>
      </Card>

      <Dialog
        open={addDialog}
        onClose={() => setAddDialog(false)}
        maxWidth="xs"
        fullWidth
        fullScreen={isMobile}
        PaperProps={{ sx: { borderRadius: isMobile ? 0 : 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Add sx={{ color: bgColor }} /> Agregar a {category.nombre}
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <TextField
              autoFocus
              label="Nombre *"
              value={newProduct.nombre}
              onChange={(e) => setNewProduct((p) => ({ ...p, nombre: e.target.value }))}
              fullWidth
              size="small"
              onKeyDown={(e) => e.key === 'Enter' && handleAdd()}
            />
            <TextField
              label="Especificación / marca"
              value={newProduct.especificacion}
              onChange={(e) => setNewProduct((p) => ({ ...p, especificacion: e.target.value }))}
              fullWidth
              size="small"
            />
            <Box sx={{ display: 'flex', gap: 1.5 }}>
              <TextField
                label="Mínimo"
                value={newProduct.minimo}
                onChange={(e) => setNewProduct((p) => ({ ...p, minimo: e.target.value }))}
                fullWidth
                size="small"
              />
              <TextField
                label="A comprar"
                value={newProduct.comprar}
                onChange={(e) => setNewProduct((p) => ({ ...p, comprar: e.target.value }))}
                fullWidth
                size="small"
              />
            </Box>
            <FormControl fullWidth size="small">
              <InputLabel>Tienda</InputLabel>
              <Select
                value={newProduct.tienda}
                label="Tienda"
                onChange={(e) => setNewProduct((p) => ({ ...p, tienda: e.target.value }))}
              >
                {TIENDAS.map((t) => (
                  <MenuItem key={t} value={t}>
                    {t}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <TextField
              label="Notas (opcional)"
              value={newProduct.notas}
              onChange={(e) => setNewProduct((p) => ({ ...p, notas: e.target.value }))}
              fullWidth
              size="small"
              multiline
              rows={2}
            />
            <TextField
              label="URL de imagen (opcional)"
              value={newProduct.imagen}
              onChange={(e) => setNewProduct((p) => ({ ...p, imagen: e.target.value }))}
              fullWidth
              size="small"
              placeholder="https://..."
            />
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setAddDialog(false)} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleAdd}
            variant="contained"
            disabled={!newProduct.nombre.trim()}
            startIcon={<Add />}
          >
            Agregar
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
