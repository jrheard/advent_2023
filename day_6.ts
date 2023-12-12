import { parseInts } from "./util.ts";

interface Input {
  times: readonly number[];
  distances: readonly number[];
}

function parseInput(): Input {
  const lines = Deno.readTextFileSync("inputs/day_6.txt").split("\n");

  return {
    times: parseInts(lines[0].substring(5).trim().split(/\s+/)),
    distances: parseInts(lines[1].substring(9).trim().split(/\s+/)),
  };
}

function numWaysToWin(time: number, distanceToBeat: number): number {
  let result = 0;
  for (let i = 0; i <= time; i++) {
    if ((time - i) * i > distanceToBeat) {
      result += 1;
    }
  }
  return result;
}

function partOne(): number {
  const input = parseInput();
  return input.times.map((time, i) => numWaysToWin(time, input.distances[i]))
    .reduce((acc, num) => acc * num, 1);
}

function partTwo(): number {
  const lines = Deno.readTextFileSync("inputs/day_6.txt").split("\n");
  const time = parseInt(
    lines[0].substring(5).trim().split(/\s+/).reduce((acc, x) => acc + x),
  );
  const distance = parseInt(
    lines[1].substring(9).trim().split(/\s+/).reduce((acc, x) => acc + x),
  );

  return numWaysToWin(time, distance);
}

console.log(partOne());
console.log(partTwo());
