// src/app/theme/index.ts

import { theme as antdTheme, type ThemeConfig } from 'antd';

type AppThemeConfigInput = {
  fontSize: number;
  isDark: boolean;
};

export function createAppThemeConfig({ fontSize, isDark }: AppThemeConfigInput): ThemeConfig {
  return {
    algorithm: isDark ? antdTheme.darkAlgorithm : antdTheme.defaultAlgorithm,
    cssVar: {},
    token: {
      borderRadius: 8,
      borderRadiusLG: 10,
      borderRadiusSM: 4,
      fontSize,
    },
  };
}
