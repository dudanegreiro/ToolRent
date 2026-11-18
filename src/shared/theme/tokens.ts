export const tokens = {
  colors: {
    background: '#FFFFFF',
    surface: '#FFFFFF',
    border: '#D5DCE3',
    text: '#1F3D4A',
    supportingText: '#6B7280',
    action: '#E85D04',
    onAction: '#FFFFFF',
    alert: '#B42318',
  },
  spacing: {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
  },
  radii: {
    sm: 4,
    md: 8,
    lg: 12,
    xl: 16,
    pill: 999,
  },
  typography: {
    fontSize: {
      caption: 12,
      bodySmall: 14,
      body: 16,
      headingSmall: 20,
      heading: 24,
      display: 30,
    },
    fontWeight: {
      regular: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  alvoMinimo: 48,
  larguraMaximaConteudo: 640,
} as const;
