import { ReactNode } from 'react';
import { Box } from '@mui/material';

export type StoreBrand = {
  label: string;
  bg: string;
  color: string;
  accent?: string;
  Logo: (props: { size?: number }) => ReactNode;
};

function LogoBox({
  size = 18,
  bg,
  children,
}: {
  size?: number;
  bg: string;
  children: ReactNode;
}) {
  return (
    <Box
      sx={{
        width: size,
        height: size,
        borderRadius: '4px',
        bgcolor: bg,
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        flexShrink: 0,
        overflow: 'hidden',
        boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.18)',
      }}
    >
      {children}
    </Box>
  );
}

const logos = {
  walmart: ({ size = 18 }: { size?: number }) => (
    <LogoBox size={size} bg="#FFC220">
      <svg width={size * 0.72} height={size * 0.72} viewBox="0 0 24 24" fill="none">
        <path
          d="M12 2.5l1.8 5.5H19l-4.6 3.3 1.8 5.5L12 13.5 7.8 16.8l1.8-5.5L5 8h5.2L12 2.5z"
          fill="#0071CE"
        />
      </svg>
    </LogoBox>
  ),
  cityMarket: ({ size = 18 }: { size?: number }) => (
    <LogoBox size={size} bg="#fff">
      <svg width={size * 0.8} height={size * 0.8} viewBox="0 0 24 24" fill="none">
        <rect x="2" y="4" width="20" height="16" rx="3" fill="#CC0000" />
        <path
          d="M7 9h2.2l1.1 3.2L11.4 9H13l-1.8 5.5H10L7 9zm6.2 0h2.1l2.2 3.6V9h1.8v5.5h-2.1l-2.2-3.6V14.5H13V9z"
          fill="#fff"
        />
      </svg>
    </LogoBox>
  ),
  gnc: ({ size = 18 }: { size?: number }) => (
    <LogoBox size={size} bg="#F7941D">
      <svg width={size * 0.82} height={size * 0.82} viewBox="0 0 24 24" fill="none">
        <text
          x="12"
          y="16"
          textAnchor="middle"
          fill="#fff"
          fontSize="11"
          fontWeight="900"
          fontFamily="Arial Black, sans-serif"
        >
          GNC
        </text>
      </svg>
    </LogoBox>
  ),
  laEuropea: ({ size = 18 }: { size?: number }) => (
    <LogoBox size={size} bg="#1b1b2f">
      <svg width={size * 0.7} height={size * 0.7} viewBox="0 0 24 24" fill="none">
        <path
          d="M8 4h8c2.2 0 4 1.8 4 4v8c0 2.2-1.8 4-4 4H8c-2.2 0-4-1.8-4-4V8c0-2.2 1.8-4 4-4z"
          fill="none"
          stroke="#d4af37"
          strokeWidth="1.5"
        />
        <path
          d="M9 17V9c0-1.1.9-2 2-2h2c1.1 0 2 .9 2 2v8"
          stroke="#d4af37"
          strokeWidth="1.6"
          strokeLinecap="round"
        />
        <ellipse cx="12" cy="8" rx="2.5" ry="1.2" fill="#d4af37" />
      </svg>
    </LogoBox>
  ),
  starbucks: ({ size = 18 }: { size?: number }) => (
    <LogoBox size={size} bg="#00704A">
      <svg width={size * 0.72} height={size * 0.72} viewBox="0 0 24 24" fill="none">
        <circle cx="12" cy="12" r="8.5" fill="#00704A" stroke="#fff" strokeWidth="1.2" />
        <circle cx="12" cy="12" r="5.5" fill="none" stroke="#fff" strokeWidth="1.1" />
        <path
          d="M12 7.5c-2 1.8-2.5 3.6-2.5 4.5s.5 2.7 2.5 4.5c2-1.8 2.5-3.6 2.5-4.5s-.5-2.7-2.5-4.5z"
          fill="#fff"
        />
      </svg>
    </LogoBox>
  ),
  farmacia: ({ size = 18 }: { size?: number }) => (
    <LogoBox size={size} bg="#fff">
      <svg width={size * 0.72} height={size * 0.72} viewBox="0 0 24 24" fill="none">
        <rect x="3" y="3" width="18" height="18" rx="4" fill="#0a9396" />
        <rect x="10.5" y="6.5" width="3" height="11" rx="1" fill="#fff" />
        <rect x="6.5" y="10.5" width="11" height="3" rx="1" fill="#fff" />
      </svg>
    </LogoBox>
  ),
  farmaciasAhorro: ({ size = 18 }: { size?: number }) => (
    <LogoBox size={size} bg="#e4002b">
      <svg width={size * 0.72} height={size * 0.72} viewBox="0 0 24 24" fill="none">
        <text x="12" y="15.5" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="900">
          FA
        </text>
      </svg>
    </LogoBox>
  ),
  sanPablo: ({ size = 18 }: { size?: number }) => (
    <LogoBox size={size} bg="#0057a8">
      <svg width={size * 0.72} height={size * 0.72} viewBox="0 0 24 24" fill="none">
        <text x="12" y="15.5" textAnchor="middle" fill="#fff" fontSize="9" fontWeight="900">
          SP
        </text>
      </svg>
    </LogoBox>
  ),
  whatsapp: ({ size = 18 }: { size?: number }) => (
    <LogoBox size={size} bg="#25D366">
      <svg width={size * 0.72} height={size * 0.72} viewBox="0 0 24 24" fill="#fff">
        <path d="M17.5 6.5A7.5 7.5 0 0 0 6.8 17.1L5 19l1.9-.6A7.5 7.5 0 1 0 17.5 6.5z" />
        <path
          d="M9.2 8.8c-.2-.5-.4-.5-.7-.5h-.6c-.2 0-.5.1-.7.4-.2.3-.9.9-.9 2.1s.9 2.4 1 2.6c.1.2 1.8 2.8 4.4 3.8 2.2.9 2.6.7 3.1.7.5 0 1.6-.6 1.8-1.2.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.5-.3-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.7.9-.1.2-.3.2-.5.1-.2-.1-1-.4-1.9-1.2-.7-.6-1.2-1.4-1.3-1.6-.1-.2 0-.3.1-.4.1-.1.2-.3.3-.4.1-.1.1-.2.2-.3.1-.1 0-.2 0-.3 0-.1-.5-1.3-.7-1.8z"
          fill="#25D366"
        />
      </svg>
    </LogoBox>
  ),
  edificio: ({ size = 18 }: { size?: number }) => (
    <LogoBox size={size} bg="#4a5568">
      <svg width={size * 0.72} height={size * 0.72} viewBox="0 0 24 24" fill="#fff">
        <path d="M5 20V6l7-3 7 3v14H5zm2-2h10V8.2l-5-2.1-5 2.1V18zm2-2h2v-2H9v2zm0-3h2v-2H9v2zm4 3h2v-2h-2v2zm0-3h2v-2h-2v2z" />
      </svg>
    </LogoBox>
  ),
  tintoreria: ({ size = 18 }: { size?: number }) => (
    <LogoBox size={size} bg="#CC0000">
      <svg width={size * 0.72} height={size * 0.72} viewBox="0 0 24 24" fill="none">
        <path
          d="M8 5h8l-1.5 3H9.5L8 5zm-1 5h10l-1 9H8l-1-9z"
          stroke="#fff"
          strokeWidth="1.5"
          strokeLinejoin="round"
        />
        <path d="M10 5V3h4v2" stroke="#fff" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </LogoBox>
  ),
  generic: ({ size = 18 }: { size?: number }) => (
    <LogoBox size={size} bg="rgba(255,255,255,0.22)">
      <svg width={size * 0.6} height={size * 0.6} viewBox="0 0 24 24" fill="#fff">
        <path d="M7 7h10v2H7V7zm0 4h10v2H7v-2zm0 4h7v2H7v-2z" />
      </svg>
    </LogoBox>
  ),
};

export const STORE_BRANDS: Record<string, StoreBrand> = {
  Walmart: { label: 'Walmart', bg: '#0071CE', color: '#fff', accent: '#FFC220', Logo: logos.walmart },
  'City Market': { label: 'City Market', bg: '#CC0000', color: '#fff', Logo: logos.cityMarket },
  GNC: { label: 'GNC', bg: '#F7941D', color: '#fff', Logo: logos.gnc },
  'La Europea': { label: 'La Europea', bg: '#1b1b2f', color: '#d4af37', Logo: logos.laEuropea },
  Starbucks: { label: 'Starbucks', bg: '#00704A', color: '#fff', Logo: logos.starbucks },
  Farmacia: { label: 'Farmacia', bg: '#0a9396', color: '#fff', Logo: logos.farmacia },
  'Farmacias del Ahorro': {
    label: 'F. del Ahorro',
    bg: '#e4002b',
    color: '#fff',
    Logo: logos.farmaciasAhorro,
  },
  'Farmacia San Pablo': { label: 'San Pablo', bg: '#0057a8', color: '#fff', Logo: logos.sanPablo },
  WhatsApp: { label: 'WhatsApp', bg: '#25D366', color: '#fff', Logo: logos.whatsapp },
  Edificio: { label: 'Edificio', bg: '#4a5568', color: '#fff', Logo: logos.edificio },
  'Tintorería City Market': {
    label: 'Tintorería',
    bg: '#CC0000',
    color: '#fff',
    Logo: logos.tintoreria,
  },
};

export const STORE_COLORS: Record<string, string> = Object.fromEntries(
  Object.entries(STORE_BRANDS).map(([k, v]) => [k, v.bg]),
);

export function getStoreBrand(store: string): StoreBrand {
  return (
    STORE_BRANDS[store] ?? {
      label: store,
      bg: '#718096',
      color: '#fff',
      Logo: logos.generic,
    }
  );
}

export function StoreBadge({
  name,
  size = 'md',
}: {
  name: string;
  size?: 'sm' | 'md';
}) {
  const logoSize = size === 'sm' ? 16 : 18;
  const fontSize = size === 'sm' ? 9.5 : 10;

  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {name
        .split('/')
        .map((s) => s.trim())
        .filter(Boolean)
        .map((store) => {
          const b = getStoreBrand(store);
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
                bgcolor: b.bg,
                color: b.color,
                fontSize,
                fontWeight: 700,
                whiteSpace: 'nowrap',
                boxShadow: '0 1px 4px rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.12)',
              }}
            >
              <b.Logo size={logoSize} />
              {b.label}
            </Box>
          );
        })}
    </Box>
  );
}