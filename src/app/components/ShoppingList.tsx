import { useState, useEffect } from 'react';
import { CategoryCard } from './CategoryCard';
import { SummaryDrawer } from './SummaryDrawer';
import {
  TextField,
  Box,
  Button,
  Typography,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  MenuItem,
  Select,
  FormControl,
  InputLabel,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Search,
  FilterList,
  Add,
  ListAlt,
  RestartAlt,
  AccountBalanceWallet,
  Edit as EditIcon,
  SearchOff,
} from '@mui/icons-material';
import { ShoppingListData, Product, Category, Unidad } from '../types';
import { formatMXN } from '../utils/format';
import { bestLineTotal, savingsOf } from '../utils/pricing';

interface ShoppingListProps {
  list: ShoppingListData;
  onListChange: (updated: ShoppingListData) => void;
}

const TIENDAS = ['City Market', 'Walmart', 'GNC', 'La Europea', 'Starbucks', 'Farmacia', 'Otra'];

const EMPTY_PRODUCT: Omit<Product, 'id'> = {
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

export function ShoppingList({ list, onListChange }: ShoppingListProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMode, setFilterMode] = useState<'all' | 'needed'>('all');
  const [addDialog, setAddDialog] = useState(false);
  const [newProduct, setNewProduct] = useState(EMPTY_PRODUCT);
  const [targetCategory, setTargetCategory] = useState(list.categorias[0]?.id ?? '');
  const [newCategoryName, setNewCategoryName] = useState('');
  const [addCategoryMode, setAddCategoryMode] = useState(false);
  const [summaryOpen, setSummaryOpen] = useState(false);
  const [resetDialog, setResetDialog] = useState(false);
  const [budgetDialog, setBudgetDialog] = useState(false);
  const [budgetDraft, setBudgetDraft] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  // localStorage persistence
  useEffect(() => {
    const saved = localStorage.getItem(`wga-list-${list.id}`);
    if (saved) {
      try {
        const parsed = JSON.parse(saved) as ShoppingListData;
        if (parsed.id === list.id) onListChange(parsed);
      } catch {}
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [list.id]);

  useEffect(() => {
    localStorage.setItem(`wga-list-${list.id}`, JSON.stringify(list));
  }, [list]);

  const handleQuantityChange = (categoryId: string, productId: string, value: number) => {
    onListChange({
      ...list,
      categorias: list.categorias.map((cat) =>
        cat.id !== categoryId
          ? cat
          : {
              ...cat,
              productos: cat.productos.map((p) =>
                p.id !== productId ? p : { ...p, cantidad: value },
              ),
            },
      ),
    });
  };

  const handleFieldChange = (
    categoryId: string,
    productId: string,
    field: 'unidad' | 'critico',
    value: Unidad | boolean,
  ) => {
    onListChange({
      ...list,
      categorias: list.categorias.map((cat) =>
        cat.id !== categoryId
          ? cat
          : {
              ...cat,
              productos: cat.productos.map((p) =>
                p.id !== productId ? p : { ...p, [field]: value },
              ),
            },
      ),
    });
  };

  const handlePriceChange = (
    categoryId: string,
    productId: string,
    store: string,
    value: number,
  ) => {
    onListChange({
      ...list,
      categorias: list.categorias.map((cat) =>
        cat.id !== categoryId
          ? cat
          : {
              ...cat,
              productos: cat.productos.map((p) =>
                p.id !== productId
                  ? p
                  : { ...p, precios: { ...(p.precios ?? {}), [store]: value } },
              ),
            },
      ),
    });
  };

  const handleSetBudget = () => {
    const n = parseFloat(budgetDraft.replace(/[^0-9.]/g, ''));
    onListChange({ ...list, presupuesto: !isNaN(n) && n > 0 ? n : undefined });
    setBudgetDialog(false);
  };

  const handleAddProduct = (categoryId: string, product: Omit<Product, 'id'>) => {
    const id = `prod-${Date.now()}-${Math.random().toString(36).slice(2)}`;
    onListChange({
      ...list,
      categorias: list.categorias.map((cat) =>
        cat.id !== categoryId ? cat : { ...cat, productos: [...cat.productos, { ...product, id }] },
      ),
    });
  };

  const handleDeleteProduct = (categoryId: string, productId: string) => {
    onListChange({
      ...list,
      categorias: list.categorias.map((cat) =>
        cat.id !== categoryId
          ? cat
          : { ...cat, productos: cat.productos.filter((p) => p.id !== productId) },
      ),
    });
  };

  const handleConfirmAdd = () => {
    if (!newProduct.nombre.trim()) return;
    if (addCategoryMode) {
      if (!newCategoryName.trim()) return;
      const id = `prod-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      const newCat: Category = {
        id: `cat-${Date.now()}`,
        nombre: newCategoryName.toUpperCase().trim(),
        productos: [{ ...newProduct, id }],
      };
      onListChange({ ...list, categorias: [...list.categorias, newCat] });
    } else {
      handleAddProduct(targetCategory, newProduct);
    }
    setAddDialog(false);
    setNewProduct(EMPTY_PRODUCT);
  };

  const handleReset = () => {
    onListChange({
      ...list,
      categorias: list.categorias.map((cat) => ({
        ...cat,
        productos: cat.productos.map((p) => ({ ...p, cantidad: 0 })),
      })),
    });
    setResetDialog(false);
  };

  const filteredCategories = list.categorias
    .map((cat) => ({
      ...cat,
      productos: cat.productos.filter((p) => {
        const matchesSearch =
          p.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
          p.especificacion.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesFilter = filterMode === 'all' || p.cantidad > 0;
        return matchesSearch && matchesFilter;
      }),
    }))
    .filter((cat) => cat.productos.length > 0);

  const totalUnits = list.categorias.reduce(
    (t, c) => t + c.productos.reduce((s, p) => s + p.cantidad, 0),
    0,
  );
  const totalProducts = list.categorias.reduce((t, c) => t + c.productos.length, 0);
  const criticalPending = list.categorias.reduce(
    (t, c) => t + c.productos.filter((p) => p.critico && p.cantidad === 0).length,
    0,
  );
  const totalSpent = list.categorias.reduce(
    (t, c) => t + c.productos.reduce((s, p) => s + bestLineTotal(p), 0),
    0,
  );
  const totalSavings = list.categorias.reduce(
    (t, c) => t + c.productos.reduce((s, p) => s + savingsOf(p), 0),
    0,
  );
  const budget = list.presupuesto ?? 0;
  const hasBudget = budget > 0;
  const pctBudget = hasBudget ? Math.min(100, Math.round((totalSpent / budget) * 100)) : 0;
  const overBudget = hasBudget && totalSpent > budget;
  const nearBudget = hasBudget && !overBudget && totalSpent >= budget * 0.85;
  const budgetColor = overBudget ? '#dc2626' : nearBudget ? '#d97706' : '#16a34a';

  return (
    <Box>
      {/* Stats bar */}
      <Box
        sx={{
          display: 'flex',
          gap: { xs: 1, md: 2 },
          flexWrap: 'wrap',
          alignItems: 'center',
          mb: 2.5,
          p: { xs: 1.5, md: 2.5 },
          bgcolor: 'background.paper',
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 1px 2px rgba(16,24,40,0.04), 0 10px 24px -16px rgba(16,24,40,0.2)',
        }}
      >
        <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap', flexGrow: 1 }}>
          <Chip label={`${totalProducts} productos`} variant="outlined" size="small" />
          <Chip
            label={`${totalUnits} uds.`}
            size="small"
            sx={{
              bgcolor: 'rgba(22,163,74,0.1)',
              color: '#16a34a',
              border: '1px solid rgba(22,163,74,0.3)',
              fontWeight: 600,
            }}
          />
          {totalSpent > 0 && (
            <Chip
              label={`Total ${formatMXN(totalSpent)}`}
              size="small"
              sx={{
                bgcolor: 'rgba(37,99,235,0.1)',
                color: '#1e40af',
                border: '1px solid rgba(37,99,235,0.3)',
                fontWeight: 700,
              }}
            />
          )}
          {criticalPending > 0 && (
            <Chip
              label={`⚠ ${criticalPending}`}
              size="small"
              sx={{
                bgcolor: 'rgba(220,38,38,0.08)',
                color: '#dc2626',
                border: '1px solid rgba(220,38,38,0.25)',
                fontWeight: 600,
              }}
            />
          )}
        </Box>
        <Box sx={{ display: 'flex', gap: 0.75, flexShrink: 0, flexWrap: 'wrap' }}>
          <Button
            variant="outlined"
            color="error"
            startIcon={<RestartAlt />}
            onClick={() => setResetDialog(true)}
            size={isMobile ? 'small' : 'medium'}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            {isMobile ? 'Reset' : 'Limpiar'}
          </Button>
          <Button
            variant="outlined"
            startIcon={<ListAlt />}
            onClick={() => setSummaryOpen(true)}
            size={isMobile ? 'small' : 'medium'}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            {isMobile ? 'PDF' : 'Ver resumen'}
          </Button>
          <Button
            variant="contained"
            startIcon={<Add />}
            size={isMobile ? 'small' : 'medium'}
            onClick={() => {
              setTargetCategory(list.categorias[0]?.id ?? '');
              setNewProduct(EMPTY_PRODUCT);
              setAddCategoryMode(false);
              setNewCategoryName('');
              setAddDialog(true);
            }}
            sx={{ textTransform: 'none' }}
          >
            {isMobile ? '' : 'Agregar'}
          </Button>
        </Box>
      </Box>

      {/* Budget bar */}
      <Box
        sx={{
          mb: 2.5,
          p: { xs: 1.75, md: 2.25 },
          bgcolor: 'background.paper',
          borderRadius: 3,
          border: '1px solid',
          borderColor: 'divider',
          boxShadow: '0 1px 2px rgba(16,24,40,0.04), 0 10px 24px -16px rgba(16,24,40,0.2)',
        }}
      >
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, mb: hasBudget ? 1.25 : 0 }}>
          <AccountBalanceWallet sx={{ fontSize: 20, color: budgetColor }} />
          <Typography sx={{ fontWeight: 700, fontSize: 14, flexGrow: 1 }}>Presupuesto</Typography>
          {hasBudget ? (
            <Typography sx={{ fontWeight: 800, fontSize: 14, color: budgetColor }}>
              {formatMXN(totalSpent)}{' '}
              <Box component="span" sx={{ color: 'text.secondary', fontWeight: 600 }}>
                / {formatMXN(budget)}
              </Box>
            </Typography>
          ) : (
            <Typography variant="body2" color="text.secondary">
              Sin definir
            </Typography>
          )}
          <Button
            size="small"
            startIcon={<EditIcon sx={{ fontSize: '14px !important' }} />}
            onClick={() => {
              setBudgetDraft(budget ? String(budget) : '');
              setBudgetDialog(true);
            }}
            sx={{ textTransform: 'none', minWidth: 0 }}
          >
            {hasBudget ? 'Editar' : 'Definir'}
          </Button>
        </Box>
        {hasBudget && (
          <>
            <Box sx={{ height: 10, borderRadius: 5, bgcolor: 'action.hover', overflow: 'hidden' }}>
              <Box
                sx={{
                  height: '100%',
                  width: `${pctBudget}%`,
                  bgcolor: budgetColor,
                  borderRadius: 5,
                  transition: 'width 0.4s ease',
                }}
              />
            </Box>
            <Typography sx={{ mt: 0.75, fontSize: 12, fontWeight: 600, color: budgetColor }}>
              {overBudget
                ? `⚠ Excedido por ${formatMXN(totalSpent - budget)}`
                : `Restante ${formatMXN(budget - totalSpent)} · ${pctBudget}% usado`}
            </Typography>
          </>
        )}
        {totalSavings > 0 && (
          <Box
            sx={{
              mt: 1.25,
              display: 'flex',
              alignItems: 'center',
              gap: 0.75,
              px: 1.25,
              py: 0.75,
              borderRadius: 2,
              bgcolor: 'rgba(16,185,129,0.1)',
              border: '1px solid rgba(16,185,129,0.25)',
            }}
          >
            <Typography sx={{ fontSize: 12.5, fontWeight: 700, color: '#059669' }}>
              💸 Ahorras {formatMXN(totalSavings)} comprando cada producto en su tienda más barata
            </Typography>
          </Box>
        )}
      </Box>

      {/* Search & filter */}
      <Box sx={{ mb: 2.5, display: 'flex', gap: 1.5, flexWrap: 'wrap', alignItems: 'center' }}>
        <TextField
          variant="outlined"
          placeholder="Buscar productos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: <Search sx={{ mr: 1, color: 'text.secondary', fontSize: 20 }} />,
          }}
          size="small"
          sx={{ maxWidth: 360, flexGrow: 1, bgcolor: 'background.paper', borderRadius: 2 }}
        />
        <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
          <FilterList sx={{ color: 'text.secondary', fontSize: 20 }} />
          {(['all', 'needed'] as const).map((mode) => (
            <Button
              key={mode}
              variant={filterMode === mode ? 'contained' : 'outlined'}
              onClick={() => setFilterMode(mode)}
              size="small"
              sx={{ minWidth: 72 }}
            >
              {mode === 'all' ? 'Todos' : 'Con cantidad'}
            </Button>
          ))}
        </Box>
      </Box>

      {/* Category cards */}
      {filteredCategories.length === 0 ? (
        <Box
          sx={{
            textAlign: 'center',
            py: 8,
            px: 2,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 1,
          }}
        >
          <SearchOff sx={{ fontSize: 48, color: 'text.disabled' }} />
          <Typography variant="h6" color="text.secondary">
            No se encontraron productos
          </Typography>
          <Typography variant="body2" color="text.disabled">
            Prueba con otra búsqueda o cambia el filtro.
          </Typography>
        </Box>
      ) : (
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {filteredCategories.map((category) => (
            <CategoryCard
              key={category.id}
              category={category}
              onQuantityChange={handleQuantityChange}
              onPriceChange={handlePriceChange}
              onFieldChange={handleFieldChange}
              onAddProduct={(prod) => handleAddProduct(category.id, prod)}
              onDeleteProduct={(productId) => handleDeleteProduct(category.id, productId)}
            />
          ))}
        </Box>
      )}

      {/* Global add dialog */}
      <Dialog
        open={addDialog}
        onClose={() => setAddDialog(false)}
        maxWidth="sm"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Add color="primary" /> Agregar producto
          </Box>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 1 }}>
            <Box sx={{ display: 'flex', gap: 1 }}>
              <Button
                variant={!addCategoryMode ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setAddCategoryMode(false)}
              >
                Categoría existente
              </Button>
              <Button
                variant={addCategoryMode ? 'contained' : 'outlined'}
                size="small"
                onClick={() => setAddCategoryMode(true)}
              >
                Nueva categoría
              </Button>
            </Box>
            {addCategoryMode ? (
              <TextField
                label="Nombre de la nueva categoría"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
                fullWidth
                size="small"
              />
            ) : (
              <FormControl fullWidth size="small">
                <InputLabel>Categoría</InputLabel>
                <Select
                  value={targetCategory}
                  label="Categoría"
                  onChange={(e) => setTargetCategory(e.target.value)}
                >
                  {list.categorias.map((cat) => (
                    <MenuItem key={cat.id} value={cat.id}>
                      {cat.nombre}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            )}
            <TextField
              label="Nombre del producto *"
              value={newProduct.nombre}
              onChange={(e) => setNewProduct((p) => ({ ...p, nombre: e.target.value }))}
              fullWidth
              size="small"
            />
            <TextField
              label="Especificación / marca"
              value={newProduct.especificacion}
              onChange={(e) => setNewProduct((p) => ({ ...p, especificacion: e.target.value }))}
              fullWidth
              size="small"
            />
            <Box sx={{ display: 'flex', gap: 2 }}>
              <TextField
                label="Mínimo"
                value={newProduct.minimo}
                onChange={(e) => setNewProduct((p) => ({ ...p, minimo: e.target.value }))}
                fullWidth
                size="small"
              />
              <TextField
                label="Cantidad a comprar"
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
            onClick={handleConfirmAdd}
            variant="contained"
            disabled={!newProduct.nombre.trim() || (addCategoryMode && !newCategoryName.trim())}
            startIcon={<Add />}
          >
            Agregar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Budget dialog */}
      <Dialog
        open={budgetDialog}
        onClose={() => setBudgetDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <AccountBalanceWallet color="primary" /> Presupuesto de la lista
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Define el tope de gasto (MXN). Aparece en la barra de presupuesto y en el PDF /
            WhatsApp que envías. Deja en blanco para quitarlo.
          </Typography>
          <TextField
            autoFocus
            fullWidth
            label="Presupuesto (MXN)"
            value={budgetDraft}
            onChange={(e) => setBudgetDraft(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSetBudget()}
            placeholder="3000"
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setBudgetDialog(false)} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleSetBudget} variant="contained">
            Guardar
          </Button>
        </DialogActions>
      </Dialog>

      {/* Summary drawer */}
      <SummaryDrawer open={summaryOpen} onClose={() => setSummaryOpen(false)} list={list} />

      {/* Reset confirmation */}
      <Dialog
        open={resetDialog}
        onClose={() => setResetDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>¿Limpiar todas las cantidades?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Se pondrán a cero todas las cantidades de esta lista. Los productos, notas y flags
            críticos se conservan.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setResetDialog(false)} color="inherit">
            Cancelar
          </Button>
          <Button onClick={handleReset} variant="contained" color="error" startIcon={<RestartAlt />}>
            Limpiar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
