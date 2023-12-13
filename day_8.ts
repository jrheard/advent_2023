type Network = { [key: string]: [string, string] };

interface Input {
  directions: string;
  network: Network;
}

function parseInput(): Input {
  const lines = Deno.readTextFileSync("inputs/day_8.txt").split("\n");

  return {
    directions: lines[0],
    network: lines.slice(2).reduce((acc, line) => {
      const [key, options] = line.split(" = ");
      const [left, right] = options.substring(1, 9).split(", ");
      acc[key] = [left, right];
      return acc;
    }, {} as Network),
  };
}

function walkPath(input: Input): number {
  let currentNode = "AAA";
  let distance = 0;

  while (currentNode != "ZZZ") {
    const [left, right] = input.network[currentNode];
    const direction = input.directions[distance % input.directions.length];

    currentNode = direction == "L" ? left : right;
    distance++;
  }

  return distance;
}

function partOne(): number {
  const input = parseInput();
  return walkPath(input);
}

function walkPathUntilAnyEnd(input: Input, startNode: string): number {
  let currentNode = startNode;

  let distance = 0;

  while (currentNode.at(-1) != "Z") {
    const [left, right] = input.network[currentNode];
    const direction = input.directions[distance % input.directions.length];

    currentNode = direction == "L" ? left : right;

    distance++;
  }

  return distance;
}

// THESE LCM AND GCD FUNCTIONS CAME FROM GOOGLE'S GEN AI SEARCH RESULT RESPONSE
// I think that's OK because I'd use a builtin or library lcm() function if it was readily available,
// just wanted to put up a disclaimer that I didn't write these two functions.
function lcm(numbers: number[]): number {
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

function gcd(a: number, b: number): number {
  // If b is 0, then the GCD is a
  if (b === 0) {
    return a;
  }

  // Otherwise, the GCD is the GCD of b and the remainder of a divided by b
  return gcd(b, a % b);
}

function partTwo(): number {
  const input = parseInput();

  const startNodes = Object.keys(input.network).filter((node) =>
    node.at(-1) == "A"
  );
  const distances = startNodes.map((node) => walkPathUntilAnyEnd(input, node));

  return lcm(distances);
}

console.log(partOne());
console.log(partTwo());
