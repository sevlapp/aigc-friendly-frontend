// src/app/providers/theme-constants.ts

export type FontScale = 'compact' | 'standard' | 'comfortable';

export const FONT_SCALE_CONFIG: Record<
  FontScale,
  { antdFontSize: number; htmlFontSize: string; label: string }
> = {
  compact: { antdFontSize: 14, htmlFontSize: '16px', label: '紧凑' },
  standard: { antdFontSize: 16, htmlFontSize: '18px', label: '标准' },
  comfortable: { antdFontSize: 18, htmlFontSize: '20px', label: '舒适' },
};

export const FONT_SCALE_OPTIONS: { label: string; value: FontScale }[] = [
  { label: '紧凑', value: 'compact' },
  { label: '标准', value: 'standard' },
  { label: '舒适', value: 'comfortable' },
];
