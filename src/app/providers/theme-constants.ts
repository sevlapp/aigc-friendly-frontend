// src/app/providers/theme-constants.ts

export type FontScale = 'compact' | 'standard' | 'comfortable';

export const FONT_SCALE_CONFIG: Record<
  FontScale,
  { antdFontSize: number; htmlFontSize: string; label: string }
> = {
  compact: { antdFontSize: 14, htmlFontSize: '16px', label: 'Compact' },
  standard: { antdFontSize: 16, htmlFontSize: '18px', label: 'Standard' },
  comfortable: { antdFontSize: 18, htmlFontSize: '20px', label: 'Comfort' },
};

export const FONT_SCALE_OPTIONS: { label: string; value: FontScale }[] = [
  { label: 'Compact', value: 'compact' },
  { label: 'Standard', value: 'standard' },
  { label: 'Comfort', value: 'comfortable' },
];
