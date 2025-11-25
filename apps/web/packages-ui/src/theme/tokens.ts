import tokensJson from '../../../tokens/colors.json';

export type ColorTokenFile = typeof tokensJson;
export type ColorPalette = keyof ColorTokenFile['color'];
export type ColorShade = keyof ColorTokenFile['color']['primary'];

export const designTokens = tokensJson;

export const getColorHex = (palette: ColorPalette, shade: ColorShade) =>
  designTokens.color[palette][shade];

export const getOnColorHex = (palette: keyof ColorTokenFile['onColor']) =>
  designTokens.onColor[palette];

export const getTextHex = (variant: keyof ColorTokenFile['text']) => designTokens.text[variant];

export const getSurfaceHex = (variant: keyof ColorTokenFile['surface']) =>
  designTokens.surface[variant];

export const getFocusHex = () => designTokens.focus.ring;

export const hexToRgb = (hex: string): [number, number, number] => {
  const normalized = hex.replace('#', '');
  if (normalized.length !== 6) {
    throw new Error(`Invalid hex color ${hex}`);
  }
  const bigint = parseInt(normalized, 16);
  const r = (bigint >> 16) & 255;
  const g = (bigint >> 8) & 255;
  const b = bigint & 255;
  return [r, g, b];
};

export const hexToRgbTupleString = (hex: string) => hexToRgb(hex).join(' ');

const srgbToLinear = (value: number) => {
  const channel = value / 255;
  return channel <= 0.04045 ? channel / 12.92 : Math.pow((channel + 0.055) / 1.055, 2.4);
};

export const relativeLuminance = (hex: string) => {
  const [r, g, b] = hexToRgb(hex);
  const rLin = srgbToLinear(r);
  const gLin = srgbToLinear(g);
  const bLin = srgbToLinear(b);
  return 0.2126 * rLin + 0.7152 * gLin + 0.0722 * bLin;
};

export const contrastRatio = (foregroundHex: string, backgroundHex: string) => {
  const l1 = relativeLuminance(foregroundHex);
  const l2 = relativeLuminance(backgroundHex);
  const lighter = Math.max(l1, l2);
  const darker = Math.min(l1, l2);
  return Number(((lighter + 0.05) / (darker + 0.05)).toFixed(2));
};
