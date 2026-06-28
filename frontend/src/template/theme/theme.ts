import { createTheme, type Theme, alpha } from '@mui/material/styles';
import type { SiteConfig } from '@/types/builder';

/**
 * Formule YIQ pour déterminer si une couleur est sombre ou claire
 */
function isColorDark(hex: string): boolean {
  if (!hex) return false;
  const color = hex.replace('#', '');
  if (color.length !== 6 && color.length !== 3) return false;
  const r = parseInt(color.length === 3 ? color[0] + color[0] : color.substring(0, 2), 16);
  const g = parseInt(color.length === 3 ? color[1] + color[1] : color.substring(2, 4), 16);
  const b = parseInt(color.length === 3 ? color[2] + color[2] : color.substring(4, 6), 16);
  const yiq = ((r * 299) + (g * 587) + (b * 114)) / 1000;
  return yiq < 128;
}

/**
 * Thème statique par défaut (conservé pour compatibilité)
 */
const defaultTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#1a1a1a',
      contrastText: '#ffffff',
      transparent: alpha('#1a1a1a', 0.15),
    },
    background: {
      default: '#ffffff',
      paper: '#ffffff',
    },
    text: {
      primary: '#1a1a1a',
      secondary: '#79747e',
    },
    divider: '#c4c7c5',
  },
  typography: {
    fontFamily: '"Inter", "sans-serif"',
    h1: {
      fontFamily: '"Playfair Display"',
    },
    h2: {
      fontFamily: '"Playfair Display"',
    },
    h3: {
      fontFamily: '"Playfair Display"',
    },
    h4: {
      fontFamily: '"Playfair Display"',
    },
    h5: {
      fontFamily: '"Playfair Display"',
    },
    h6: {
      fontFamily: '"Playfair Display"',
    },
    button: {
      textTransform: 'none',
      fontWeight: 700,
    },
  },
});

/**
 * Créer un thème MUI dynamique à partir de la configuration du site
 */
export function createThemeFromConfig(config: SiteConfig): Theme {
  const primaryColor = config.primaryColor || '#1a1a1a';
  const backgroundColor = config.backgroundColor || '#ffffff';
  const secondaryColor = config.secondaryColor || '#f5f5f5';

  const isBgDark = isColorDark(backgroundColor);
  const mode = isBgDark ? 'dark' : 'light';

  // Fallbacks automatiques si les valeurs ne sont pas renseignées
  const defaultText = isBgDark ? '#ffffff' : '#1a1a1a';
  const defaultSubtitle = isBgDark ? '#a1a1aa' : '#79747e';

  const textColor = config.textColor || defaultText;
  const subtitleColor = config.subtitleColor || defaultSubtitle;

  const isPrimaryDark = isColorDark(primaryColor);
  const primaryContrastText = isPrimaryDark ? '#ffffff' : '#181811';

  const isSecondaryDark = isColorDark(secondaryColor);
  const secondaryContrastText = isSecondaryDark ? '#ffffff' : '#181811';

  const primaryFontVal = config.primaryFont ? `"${config.primaryFont}", "serif"` : '"Playfair Display", serif';
  const secondaryFontVal = config.secondaryFont ? `"${config.secondaryFont}", "sans-serif"` : '"Inter", "sans-serif"';

  return createTheme({
    palette: {
      mode,
      primary: {
        main: primaryColor,
        contrastText: primaryContrastText,
        transparent: alpha(primaryColor, 0.15),
      },
      secondary: {
        main: secondaryColor,
        contrastText: secondaryContrastText,
      },
      background: {
        default: backgroundColor,
        paper: isBgDark ? '#121212' : '#ffffff',
      },
      text: {
        primary: textColor,
        secondary: subtitleColor,
      },
      divider: isBgDark ? 'rgba(255, 255, 255, 0.12)' : '#c4c7c5',
    },
    typography: {
      fontFamily: secondaryFontVal,
      h1: {
        fontFamily: primaryFontVal,
      },
      h2: {
        fontFamily: primaryFontVal,
      },
      h3: {
        fontFamily: primaryFontVal,
      },
      h4: {
        fontFamily: primaryFontVal,
      },
      h5: {
        fontFamily: primaryFontVal,
      },
      h6: {
        fontFamily: primaryFontVal,
      },
      button: {
        textTransform: 'none',
        fontWeight: 700,
      },
    },
    components: {
      MuiButton: {
        styleOverrides: {
          root: {
            borderRadius: '4px',
          },
        },
      },
      MuiCard: {
        styleOverrides: {
          root: {
            borderRadius: '4px',
          },
        },
      },
      MuiChip: {
        styleOverrides: {
          root: {
            borderRadius: '8px',
          },
        },
      },
    },
  });
}

export default defaultTheme;
