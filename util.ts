export function parseInts(numberStrings: readonly string[]) {
  return numberStrings.map((x) => parseInt(x, 10));
}

// via https://stackoverflow.com/questions/36947847/how-to-generate-range-of-numbers-from-0-to-n-in-es2015-only
export function range(start: number, end: number): readonly number[] {
  return Array.from({ length: (end - start) }, (_v, k) => k + start);
}

// THESE LCM AND GCD FUNCTIONS CAME FROM GOOGLE'S GEN AI SEARCH RESULT RESPONSE
// I think that's OK because I'd use a builtin or library lcm() function if it was readily available,
// just wanted to put up a disclaimer that I didn't write these two functions.
export function lcm(numbers: number[]): number {
  // Check if the array is empty
  if (numbers.length === 0) {
    throw new Error("The array is empty");
  }

  // Initialize the LCM to the first number in the array
  let lcm = numbers[0];

  // Iterate over the remaining numbers in the array
  for (let i = 1; i < numbers.length; i++) {
    // Find the LCM of the current number and the LCM
    lcm = lcm * numbers[i] / gcd(lcm, numbers[i]);
  }

  // Return the LCM
  return lcm;
}

export function gcd(a: number, b: number): number {
  // If b is 0, then the GCD is a
  if (b === 0) {
    return a;
  }

  // Otherwise, the GCD is the GCD of b and the remainder of a divided by b
  return gcd(b, a % b);
}
