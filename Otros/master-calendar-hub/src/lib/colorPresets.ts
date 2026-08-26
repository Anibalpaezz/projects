export interface ColorPreset {
  name: string;
  value: string;
  textColor: string; // For accessibility
  isRainbow?: boolean;
}

// Rainbow color presets (ROYGBIV)
export const rainbowColorPresets: ColorPreset[] = [
  { name: 'Red', value: '#EF4444', textColor: '#FFFFFF', isRainbow: true },
  { name: 'Orange', value: '#F97316', textColor: '#FFFFFF', isRainbow: true },
  { name: 'Yellow', value: '#EAB308', textColor: '#000000', isRainbow: true },
  { name: 'Green', value: '#22C55E', textColor: '#FFFFFF', isRainbow: true },
  { name: 'Blue', value: '#3B82F6', textColor: '#FFFFFF', isRainbow: true },
  { name: 'Indigo', value: '#6366F1', textColor: '#FFFFFF', isRainbow: true },
  { name: 'Violet', value: '#8B5CF6', textColor: '#FFFFFF', isRainbow: true },
];

// Additional color presets
export const colorPresets: ColorPreset[] = [
  ...rainbowColorPresets,
  { name: 'Emerald', value: '#059669', textColor: '#FFFFFF' },
  { name: 'Teal', value: '#14B8A6', textColor: '#FFFFFF' },
  { name: 'Cyan', value: '#06B6D4', textColor: '#FFFFFF' },
  { name: 'Pink', value: '#EC4899', textColor: '#FFFFFF' },
  { name: 'Rose', value: '#F43F5E', textColor: '#FFFFFF' },
  { name: 'Amber', value: '#F59E0B', textColor: '#FFFFFF' },
  { name: 'Lime', value: '#84CC16', textColor: '#FFFFFF' },
  { name: 'Sky', value: '#0EA5E9', textColor: '#FFFFFF' },
  { name: 'Slate', value: '#475569', textColor: '#FFFFFF' }
];

// Convert hex to RGB
export const hexToRgb = (hex: string): { r: number; g: number; b: number } | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result ? {
    r: parseInt(result[1], 16),
    g: parseInt(result[2], 16),
    b: parseInt(result[3], 16)
  } : null;
};

// Calculate relative luminance
export const getLuminance = (r: number, g: number, b: number): number => {
  const [rs, gs, bs] = [r, g, b].map(c => {
    c = c / 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs;
};

// Calculate contrast ratio for accessibility
export const getContrastRatio = (color1: string, color2: string): number => {
  const rgb1 = hexToRgb(color1);
  const rgb2 = hexToRgb(color2);
  
  if (!rgb1 || !rgb2) return 1;
  
  const lum1 = getLuminance(rgb1.r, rgb1.g, rgb1.b);
  const lum2 = getLuminance(rgb2.r, rgb2.g, rgb2.b);
  
  const brightest = Math.max(lum1, lum2);
  const darkest = Math.min(lum1, lum2);
  
  return (brightest + 0.05) / (darkest + 0.05);
};

// Check if color meets WCAG AA standards
export const meetsAccessibilityStandards = (backgroundColor: string, textColor: string): boolean => {
  return getContrastRatio(backgroundColor, textColor) >= 4.5;
};

// Get appropriate text color for background
export const getTextColor = (backgroundColor: string): string => {
  const whiteContrast = getContrastRatio(backgroundColor, '#FFFFFF');
  const blackContrast = getContrastRatio(backgroundColor, '#000000');
  
  return whiteContrast > blackContrast ? '#FFFFFF' : '#000000';
};

// Convert HSL to hex
export const hslToHex = (h: number, s: number, l: number): string => {
  l /= 100;
  const a = s * Math.min(l, 1 - l) / 100;
  const f = (n: number) => {
    const k = (n + h / 30) % 12;
    const color = l - a * Math.max(Math.min(k - 3, 9 - k, 1), -1);
    return Math.round(255 * color).toString(16).padStart(2, '0');
  };
  return `#${f(0)}${f(8)}${f(4)}`;
};