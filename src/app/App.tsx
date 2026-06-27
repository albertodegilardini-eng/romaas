import { useState, useMemo } from 'react';
import { ShoppingList } from './components/ShoppingList';
import {
  Container,
  Typography,
  Box,
  ThemeProvider,
  createTheme,
  CssBaseline,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Tabs,
  Tab,
  IconButton,
  Tooltip,
  Chip,
} from '@mui/material';
import {
  Add,
  PlaylistAdd,
  DeleteOutline,
  CalendarToday,
  AutoAwesome,
  DarkMode,
  LightMode,
} from '@mui/icons-material';
import { categorias } from './data/products';
import { ShoppingListData } from './types';
// shared.tsx suppresses the Figma data-fg* prop warning at module-load time

function buildTheme(mode: 'light' | 'dark') {
  const light = mode === 'light';
  return createTheme({
    palette: {
      mode,
      primary: { main: '#2563eb', light: '#3b82f6', dark: '#1d4ed8' },
      secondary: { main: '#0ea5e9' },
      success: { main: '#16a34a', light: '#22c55e', dark: '#15803d' },
      error: { main: '#dc2626' },
      warning: { main: '#d97706' },
      background: {
        default: light ? '#eef2f7' : '#0b1120',
        paper: light ? '#ffffff' : '#111827',
      },
      text: {
        primary: light ? '#0f172a' : '#e5e7eb',
        secondary: light ? '#64748b' : '#94a3b8',
      },
      divider: light ? 'rgba(15,23,42,0.08)' : 'rgba(255,255,255,0.08)',
    },
    shape: { borderRadius: 12 },
    typography: {
      fontFamily: '"Inter", system-ui, -apple-system, sans-serif',
      h6: { fontWeight: 700, letterSpacing: '-0.01em' },
      subtitle1: { fontWeight: 700 },
      subtitle2: { fontWeight: 700 },
      body2: { letterSpacing: '-0.005em' },
      button: { textTransform: 'none', fontWeight: 600, letterSpacing: 0 },
    },
    components: {
      MuiPaper: { styleOverrides: { root: { backgroundImage: 'none' } } },
      MuiCard: {
        styleOverrides: {
          root: {
            backgroundImage: 'none',
            border: `1px solid ${light ? 'rgba(15,23,42,0.06)' : 'rgba(255,255,255,0.06)'}`,
            boxShadow: light
              ? '0 1px 2px rgba(16,24,40,0.04), 0 12px 28px -16px rgba(16,24,40,0.22)'
              : '0 1px 2px rgba(0,0,0,0.4)',
          },
        },
      },
      MuiButton: {
        defaultProps: { disableElevation: true },
        styleOverrides: {
          root: { borderRadius: 10, fontWeight: 600 },
          containedPrimary: { boxShadow: '0 6px 16px -8px rgba(37,99,235,0.65)' },
        },
      },
      MuiChip: { styleOverrides: { root: { fontWeight: 600, borderRadius: 8 } } },
      MuiOutlinedInput: { styleOverrides: { root: { borderRadius: 10 } } },
      MuiTooltip: {
        styleOverrides: {
          tooltip: {
            borderRadius: 8,
            fontSize: 11,
            fontWeight: 600,
            padding: '6px 10px',
            background: 'rgba(15,23,42,0.92)',
          },
        },
      },
      MuiTableCell: {
        styleOverrides: {
          root: { borderColor: light ? 'rgba(15,23,42,0.06)' : 'rgba(255,255,255,0.06)' },
        },
      },
      MuiDialog: { styleOverrides: { paper: { borderRadius: 16 } } },
    },
  });
}

function makeList(nombre: string): ShoppingListData {
  return {
    id: `list-${Date.now()}-${Math.random().toString(36).slice(2)}`,
    nombre,
    fechaCreacion: new Date().toLocaleDateString('es-MX', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }),
    presupuesto: 3000,
    categorias: JSON.parse(JSON.stringify(categorias)),
  };
}

const INITIAL_LIST = makeList('Lista Semana 1');
INITIAL_LIST.id = 'list-default';

export default function App() {
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    const saved = localStorage.getItem('wga-dark');
    return saved !== null
      ? saved === 'true'
      : (window.matchMedia?.('(prefers-color-scheme: dark)').matches ?? false);
  });

  const theme = useMemo(() => buildTheme(darkMode ? 'dark' : 'light'), [darkMode]);

  const toggleDark = () =>
    setDarkMode((d) => {
      localStorage.setItem('wga-dark', String(!d));
      return !d;
    });

  const [lists, setLists] = useState<ShoppingListData[]>([INITIAL_LIST]);
  const [activeListId, setActiveListId] = useState(INITIAL_LIST.id);
  const [newListDialog, setNewListDialog] = useState(false);
  const [newListName, setNewListName] = useState('');
  const [deleteDialog, setDeleteDialog] = useState(false);
  const [listToDelete, setListToDelete] = useState<string | null>(null);

  const activeList = lists.find((l) => l.id === activeListId) ?? lists[0];

  const handleCreateList = () => {
    if (!newListName.trim()) return;
    const nl = makeList(newListName.trim());
    setLists((prev) => [...prev, nl]);
    setActiveListId(nl.id);
    setNewListName('');
    setNewListDialog(false);
  };

  const handleDeleteList = (id: string) => {
    setListToDelete(id);
    setDeleteDialog(true);
  };

  const confirmDelete = () => {
    if (!listToDelete) return;
    setLists((prev) => {
      const rem = prev.filter((l) => l.id !== listToDelete);
      if (activeListId === listToDelete && rem.length > 0) setActiveListId(rem[0].id);
      return rem;
    });
    setDeleteDialog(false);
    setListToDelete(null);
  };

  const handleListUpdate = (updated: ShoppingListData) =>
    setLists((prev) => prev.map((l) => (l.id === updated.id ? updated : l)));

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <Box
        sx={{
          bgcolor: 'background.default',
          minHeight: '100vh',
          pb: 6,
          backgroundImage: darkMode
            ? 'none'
            : 'radial-gradient(1200px 420px at 50% -160px, rgba(37,99,235,0.08), transparent 70%)',
        }}
      >
        {/* Header */}
        <Box
          sx={{
            background: darkMode
              ? 'linear-gradient(135deg, #020817 0%, #0f172a 50%, #1e3a5f 100%)'
              : 'linear-gradient(135deg, #0a1628 0%, #1a2f5e 40%, #1e3a8a 75%, #1d4ed8 100%)',
            color: 'white',
            pt: { xs: 2.5, md: 4 },
            pb: { xs: 2, md: 3.5 },
            px: 2,
            boxShadow: '0 8px 32px -8px rgba(10,22,60,0.5)',
            borderRadius: '0 0 28px 28px',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          <Box
            sx={{
              position: 'absolute',
              top: -40,
              right: 80,
              width: 200,
              height: 200,
              borderRadius: '50%',
              bgcolor: 'rgba(99,179,237,0.07)',
              filter: 'blur(40px)',
              pointerEvents: 'none',
            }}
          />
          <Container maxWidth="lg" sx={{ position: 'relative' }}>
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
              <Box
                sx={{
                  width: { xs: 42, md: 54 },
                  height: { xs: 42, md: 54 },
                  borderRadius: '14px',
                  background: 'linear-gradient(135deg, #3b82f6 0%, #6366f1 100%)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                  boxShadow: '0 0 0 2px rgba(255,255,255,0.15), 0 8px 24px rgba(59,130,246,0.4)',
                }}
              >
                <AutoAwesome sx={{ fontSize: { xs: 22, md: 28 }, color: 'white' }} />
              </Box>
              <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      letterSpacing: '-0.5px',
                      lineHeight: 1.15,
                      fontSize: { xs: '1.2rem', md: '1.9rem' },
                    }}
                  >
                    Weekly Grocery
                  </Typography>
                  <Typography
                    sx={{
                      fontWeight: 800,
                      letterSpacing: '-0.5px',
                      lineHeight: 1.15,
                      fontSize: { xs: '1.2rem', md: '1.9rem' },
                      background: 'linear-gradient(90deg, #60a5fa, #a78bfa)',
                      WebkitBackgroundClip: 'text',
                      WebkitTextFillColor: 'transparent',
                    }}
                  >
                    AI
                  </Typography>
                </Box>
                <Typography
                  variant="body2"
                  sx={{ opacity: 0.6, mt: 0.3, fontSize: { xs: 11, md: 13 } }}
                >
                  Smart weekly shopping checklist
                </Typography>
              </Box>
              <Tooltip title={darkMode ? 'Modo claro' : 'Modo oscuro'}>
                <IconButton
                  onClick={toggleDark}
                  sx={{
                    color: 'white',
                    bgcolor: 'rgba(255,255,255,0.12)',
                    borderRadius: 2,
                    '&:hover': { bgcolor: 'rgba(255,255,255,0.22)' },
                  }}
                >
                  {darkMode ? <LightMode /> : <DarkMode />}
                </IconButton>
              </Tooltip>
            </Box>
          </Container>
        </Box>

        {/* List tabs */}
        <Box
          sx={{
            position: 'sticky',
            top: 0,
            zIndex: 5,
            mt: 1.5,
            bgcolor: darkMode ? 'rgba(17,24,39,0.85)' : 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(8px)',
            borderBottom: 1,
            borderColor: 'divider',
            boxShadow: '0 4px 16px -8px rgba(15,23,42,0.18)',
          }}
        >
          <Container maxWidth="lg">
            <Box sx={{ display: 'flex', alignItems: 'center' }}>
              <Tabs
                value={activeListId}
                onChange={(_, v) => setActiveListId(v)}
                variant="scrollable"
                scrollButtons="auto"
                sx={{
                  flexGrow: 1,
                  '& .MuiTab-root': {
                    textTransform: 'none',
                    minHeight: 50,
                    fontSize: { xs: 12, md: 14 },
                  },
                }}
              >
                {lists.map((list) => (
                  <Tab
                    key={list.id}
                    value={list.id}
                    label={
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.75 }}>
                        <span>{list.nombre}</span>
                        <Chip
                          label={list.fechaCreacion}
                          size="small"
                          icon={<CalendarToday sx={{ fontSize: '10px !important' }} />}
                          sx={{ height: 18, fontSize: 9, display: { xs: 'none', sm: 'flex' } }}
                        />
                        {lists.length > 1 && (
                          <IconButton
                            size="small"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteList(list.id);
                            }}
                            sx={{
                              p: 0.2,
                              opacity: 0.4,
                              '&:hover': { opacity: 1, color: 'error.main' },
                            }}
                          >
                            <DeleteOutline sx={{ fontSize: 13 }} />
                          </IconButton>
                        )}
                      </Box>
                    }
                  />
                ))}
              </Tabs>
              <Tooltip title="Nueva lista">
                <Button
                  startIcon={<PlaylistAdd />}
                  onClick={() => setNewListDialog(true)}
                  size="small"
                  variant="contained"
                  sx={{ mx: { xs: 1, md: 2 }, flexShrink: 0, height: 34 }}
                >
                  <Box component="span" sx={{ display: { xs: 'none', sm: 'inline' } }}>
                    Nueva lista
                  </Box>
                  <Box component="span" sx={{ display: { xs: 'inline', sm: 'none' } }}>
                    +
                  </Box>
                </Button>
              </Tooltip>
            </Box>
          </Container>
        </Box>

        {/* Main */}
        <Container maxWidth="lg" sx={{ mt: { xs: 2, md: 3 }, px: { xs: 1.5, md: 3 } }}>
          {activeList && <ShoppingList list={activeList} onListChange={handleListUpdate} />}
        </Container>
      </Box>

      {/* New list dialog */}
      <Dialog
        open={newListDialog}
        onClose={() => setNewListDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700, pb: 1 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Add color="primary" />
            Nueva lista
          </Box>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Copia completa del checklist con todos los productos.
          </Typography>
          <TextField
            autoFocus
            fullWidth
            label="Nombre de la lista"
            value={newListName}
            onChange={(e) => setNewListName(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCreateList()}
          />
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setNewListDialog(false)} color="inherit">
            Cancelar
          </Button>
          <Button
            onClick={handleCreateList}
            variant="contained"
            disabled={!newListName.trim()}
            startIcon={<Add />}
          >
            Crear
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete list dialog */}
      <Dialog
        open={deleteDialog}
        onClose={() => setDeleteDialog(false)}
        maxWidth="xs"
        fullWidth
        PaperProps={{ sx: { borderRadius: 3 } }}
      >
        <DialogTitle sx={{ fontWeight: 700 }}>¿Eliminar esta lista?</DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary">
            Esta acción no se puede deshacer.
          </Typography>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 3 }}>
          <Button onClick={() => setDeleteDialog(false)} color="inherit">
            Cancelar
          </Button>
          <Button onClick={confirmDelete} variant="contained" color="error">
            Eliminar
          </Button>
        </DialogActions>
      </Dialog>
    </ThemeProvider>
  );
}
