/** Returns a value that must exist, or throws an error that names it. */
export function required<T>(
  value: T | null | undefined,
  description: string,
): T {
  if (value == null) throw new Error(`Missing ${description}`);
  return value;
}
