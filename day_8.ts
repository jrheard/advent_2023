import { lcm } from "./util.ts";

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
