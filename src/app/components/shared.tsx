import { useState } from 'react';
import { Box, IconButton, Typography, Input, Select, MenuItem } from '@mui/material';
import { Add, Remove } from '@mui/icons-material';
import { Unidad } from '../types';
import { formatMXN } from '../utils/format';

/** Inline-editable unit price. Click the amount to type a new value. */
export function PriceInput({
  value,
  onChange,
}: {
  value: number | undefined;
  onChange: (v: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const has = (value ?? 0) > 0;

  const commit = () => {
    const n = parseFloat(draft.replace(/[^0-9.]/g, ''));
    onChange(!isNaN(n) && n >= 0 ? n : 0);
    setEditing(false);
  };

  if (editing) {
    return (
      <Input
        autoFocus
        value={draft}
        onChange={(e) => setDraft(e.target.value)}
        onBlur={commit}
        onKeyDown={(e) => {
          if (e.key === 'Enter') commit();
          if (e.key === 'Escape') setEditing(false);
        }}
        startAdornment={<span style={{ fontSize: 12, color: '#94a3b8', marginRight: 2 }}>$</span>}
        disableUnderline
        sx={{
          width: 78,
          height: 28,
          px: 0.75,
          borderRadius: '8px',
          border: '1.5px solid #93c5fd',
          bgcolor: 'rgba(59,130,246,0.06)',
          fontSize: 13,
          fontWeight: 700,
        }}
        inputProps={{ style: { padding: 0, fontSize: 13, fontWeight: 700, color: '#1e40af' } }}
      />
    );
  }

  return (
    <Box
      role="button"
      onClick={() => {
        setDraft(value ? String(value) : '');
        setEditing(true);
      }}
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 64,
        height: 28,
        px: 1,
        borderRadius: '8px',
        border: '1.5px dashed',
        borderColor: has ? 'rgba(37,99,235,0.35)' : 'rgba(0,0,0,0.15)',
        bgcolor: has ? 'rgba(37,99,235,0.06)' : 'transparent',
        cursor: 'text',
        fontSize: 13,
        fontWeight: 700,
        color: has ? '#1e40af' : 'text.disabled',
        transition: 'all 0.15s',
        '&:hover': { borderColor: '#3b82f6', color: '#1e40af' },
      }}
    >
      {has ? formatMXN(value!) : '$ —'}
    </Box>
  );
}

export const UNIDADES: Unidad[] = [
  'piezas',
  'kg',
  'L',
  'paquetes',
  'latas',
  'bolsas',
  'rollos',
  'envases',
  'barras',
];

export function QuantityStepper({
  value,
  onChange,
}: {
  value: number;
  onChange: (v: number) => void;
}) {
  const [editing, setEditing] = useState(false);
  const [draft, setDraft] = useState('');
  const active = value > 0;

  const commit = () => {
    const n = parseInt(draft, 10);
    if (!isNaN(n) && n >= 0) onChange(n);
    setEditing(false);
  };

  return (
    <Box
      sx={{
        display: 'inline-flex',
        alignItems: 'center',
        height: 32,
        borderRadius: '8px',
        border: `1.5px solid ${active ? '#68d391' : 'rgba(0,0,0,0.12)'}`,
        bgcolor: active ? 'rgba(74,222,128,0.08)' : 'action.hover',
        overflow: 'hidden',
        transition: 'border-color 0.15s, background 0.15s',
        userSelect: 'none',
      }}
    >
      <IconButton
        size="small"
        onClick={() => onChange(Math.max(0, value - 1))}
        disabled={value === 0}
        sx={{
          borderRadius: 0,
          width: 28,
          height: 32,
          color: value === 0 ? 'text.disabled' : '#38a169',
          '&:hover': { bgcolor: 'rgba(74,222,128,0.15)' },
        }}
      >
        <Remove sx={{ fontSize: 13 }} />
      </IconButton>

      {editing ? (
        <Input
          autoFocus
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onBlur={commit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') commit();
            if (e.key === 'Escape') setEditing(false);
          }}
          disableUnderline
          inputProps={{
            style: {
              width: 36,
              textAlign: 'center',
              fontSize: 13,
              fontWeight: 700,
              padding: 0,
              color: '#276749',
            },
          }}
        />
      ) : (
        <Typography
          onClick={() => {
            setDraft(String(value));
            setEditing(true);
          }}
          sx={{
            width: 36,
            textAlign: 'center',
            fontSize: 13,
            fontWeight: 700,
            lineHeight: '32px',
            color: active ? '#276749' : 'text.disabled',
            cursor: 'text',
            '&:hover': { color: '#38a169' },
          }}
        >
          {value}
        </Typography>
      )}

      <IconButton
        size="small"
        onClick={() => onChange(value + 1)}
        sx={{
          borderRadius: 0,
          width: 28,
          height: 32,
          color: '#38a169',
          '&:hover': { bgcolor: 'rgba(74,222,128,0.15)' },
        }}
      >
        <Add sx={{ fontSize: 13 }} />
      </IconButton>
    </Box>
  );
}

export function UnitSelect({
  value,
  onChange,
}: {
  value: Unidad;
  onChange: (v: Unidad) => void;
}) {
  return (
    <Select
      value={value}
      onChange={(e) => onChange(e.target.value as Unidad)}
      size="small"
      variant="standard"
      disableUnderline
      sx={{
        fontSize: 10,
        color: 'text.secondary',
        fontWeight: 600,
        '& .MuiSelect-select': { py: 0, pl: 0.25 },
      }}
    >
      {UNIDADES.map((u) => (
        <MenuItem key={u} value={u} sx={{ fontSize: 11 }}>
          {u}
        </MenuItem>
      ))}
    </Select>
  );
}
