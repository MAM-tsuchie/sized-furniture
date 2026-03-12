import type { SizeUnit } from '@/types';

/**
 * cm を inch に変換
 */
export function cmToInch(cm: number): number {
  return Math.round((cm / 2.54) * 10) / 10;
}

/**
 * inch を cm に変換
 */
export function inchToCm(inch: number): number {
  return Math.round(inch * 2.54 * 10) / 10;
}

/**
 * サイズを指定した単位にフォーマット
 */
export function formatSize(
  value: number,
  fromUnit: SizeUnit,
  toUnit: SizeUnit
): { value: number; display: string } {
  if (fromUnit === toUnit) {
    return { value, display: `${value}${toUnit}` };
  }

  const converted = fromUnit === 'cm' ? cmToInch(value) : inchToCm(value);
  return { value: converted, display: `${converted}${toUnit}` };
}

/**
 * サイズ範囲を表示用文字列に変換
 */
export function formatSizeRange(
  min: number | null,
  max: number | null,
  unit: SizeUnit
): string {
  if (min === null && max === null) return '';
  if (min !== null && max !== null) {
    return `${min}〜${max}${unit}`;
  }
  if (min !== null) {
    return `${min}${unit}以上`;
  }
  return `${max}${unit}以下`;
}

/**
 * 商品サイズを表示用にフォーマット
 */
export function formatProductSize(
  width: number | null | undefined,
  depth: number | null | undefined,
  height: number | null | undefined,
  unit: SizeUnit = 'cm'
): string {
  const parts: string[] = [];
  
  if (width != null) parts.push(`W${width}`);
  if (depth != null) parts.push(`D${depth}`);
  if (height != null) parts.push(`H${height}`);
  
  if (parts.length === 0) return 'サイズ不明';
  
  return `${parts.join(' × ')} ${unit}`;
}

/**
 * サイズが指定範囲内かチェック
 */
export function isSizeInRange(
  size: number | null,
  min: number | null,
  max: number | null,
  tolerance: number = 0
): boolean {
  if (size === null) return false;
  
  const adjustedMin = min !== null ? min - tolerance : null;
  const adjustedMax = max !== null ? max + tolerance : null;
  
  if (adjustedMin !== null && size < adjustedMin) return false;
  if (adjustedMax !== null && size > adjustedMax) return false;
  
  return true;
}
