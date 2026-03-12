/**
 * snake_case のオブジェクトキーを camelCase に変換
 */
export function snakeToCamel(str: string): string {
  return str.replace(/_([a-z])/g, (_, letter) => letter.toUpperCase());
}

export function transformKeys<T>(obj: unknown): T {
  if (obj === null || obj === undefined) return obj as T;
  if (Array.isArray(obj)) return obj.map((item) => transformKeys(item)) as T;
  if (typeof obj !== 'object') return obj as T;

  const result: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
    const camelKey = snakeToCamel(key);
    result[camelKey] = typeof value === 'object' ? transformKeys(value) : value;
  }
  return result as T;
}
