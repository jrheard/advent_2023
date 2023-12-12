export function parseInts(numberStrings: readonly string[]) {
  return numberStrings.map((x) => parseInt(x, 10));
}

// via https://stackoverflow.com/questions/36947847/how-to-generate-range-of-numbers-from-0-to-n-in-es2015-only
export function range(start: number, end: number): readonly number[] {
  return Array.from({ length: (end - start) }, (_v, k) => k + start);
}
