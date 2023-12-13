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

function walkPathForGhosts(input: Input): number {
  let currentNodes = Object.keys(input.network).filter((k) => k.at(-1) == "A");
  let distance = 0;

  while (!currentNodes.every((node) => node.at(-1) == "Z")) {
    if (distance % 10000 == 0) {
      console.log(distance);
    }

    const direction = input.directions[distance % input.directions.length];

    currentNodes = currentNodes.map((node) => {
      const [left, right] = input.network[node];
      return direction == "L" ? left : right;
    });

    distance++;
  }

  return distance;
}

function partTwo(): number {
  const input = parseInput();
  return walkPathForGhosts(input);
}

console.log(partOne());
console.log(partTwo());
