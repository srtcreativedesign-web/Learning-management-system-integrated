/**
 * Design tokens. One brand ramp, one type scale, one radius scale.
 * Direction: "field ops console" — deep brand header, content floating over it,
 * data-forward numbers, status carried by color rails instead of grey outlines.
 */
export const COLORS = {
  // Brand ramp
  brandDeep: '#0F4F68',
  brandDark: '#2C7B9E',
  primary: '#419CC3',
  primaryLight: '#EFF8FC',
  primaryBorder: '#BEE3F2',

  // Surfaces
  background: '#F4F7FA',
  surface: '#FFFFFF',
  surfaceSunken: '#EDF2F7',

  // Text
  textMain: '#0B1C30',
  textSecondary: '#5A6C82',
  textMuted: '#94A3B8',
  onBrand: '#FFFFFF',
  onBrandMuted: 'rgba(255,255,255,0.72)',

  // Lines
  border: '#E4EBF2',
  divider: '#F1F5F9',

  // Status
  success: '#059669',
  successLight: '#ECFDF5',
  warningDeep: '#B45309',
  warning: '#F59E0B',
  warningLight: '#FFF8EB',
  danger: '#DC2626',
  dangerLight: '#FEF2F2',
  info: '#0284C7',
};

/** Grade colors are used in the tab bar, lists, and the assessment sheet — keep them in one place. */
export const GRADE_COLOR: Record<string, string> = {
  SB: COLORS.success,
  B: COLORS.info,
  C: COLORS.warning,
  K: COLORS.danger,
};

export const RADIUS = { sm: 10, md: 14, lg: 20, xl: 28, pill: 999 };

/** Cards float with shadow instead of being outlined — the outlines are what read as "admin panel". */
export const SHADOW = {
  card: {
    shadowColor: '#0B1C30',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 3,
  },
  raised: {
    shadowColor: '#0B1C30',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.12,
    shadowRadius: 24,
    elevation: 8,
  },
} as const;

/** Type scale — the old UI ran everything at 11-13px, so nothing had hierarchy. */
export const TYPE = {
  display: { fontSize: 30, fontWeight: '800', letterSpacing: -0.8 },
  h1: { fontSize: 22, fontWeight: '700', letterSpacing: -0.5 },
  h2: { fontSize: 17, fontWeight: '700', letterSpacing: -0.3 },
  h3: { fontSize: 15, fontWeight: '700', letterSpacing: -0.2 },
  body: { fontSize: 14, fontWeight: '500' },
  label: { fontSize: 12.5, fontWeight: '600' },
  micro: { fontSize: 11, fontWeight: '700', letterSpacing: 0.3 },
} as const;

/** Minimum comfortable touch target (Android 48dp is the stricter of the two platforms). */
export const TOUCH_MIN = 48;
