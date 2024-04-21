import { useAccessibility } from '../context/AccessibilityContext';
import { useMemo } from 'react';

export const useTheme = () => {
  const { textScale, highContrast } = useAccessibility();

  return useMemo(() => {
    const baseColors = {
      primary: '#0066CC',
      background: highContrast ? '#000000' : '#FFFFFF',
      text: highContrast ? '#FFFFFF' : '#000000',
      secondaryText: highContrast ? '#CCCCCC' : '#666666',
      border: highContrast ? '#444444' : '#E0E0E0',
    };

    const baseTypography = {
      heading: {
        fontSize: 20,
        fontWeight: '600',
        lineHeight: 28,
      },
      body: {
        fontSize: 16,
        fontWeight: '400',
        lineHeight: 24,
      },
    };

    return {
      colors: baseColors,
      typography: {
        ...baseTypography,
        heading: {
          ...baseTypography.heading,
          fontSize: baseTypography.heading.fontSize * textScale,
        },
        body: {
          ...baseTypography.body,
          fontSize: baseTypography.body.fontSize * textScale,
        },
      },
    };
  }, [textScale, highContrast]);
};