import { parseInts, range } from "./util.ts";

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
  return range(0, time + 1).map((durationToHoldButton) =>
    (time - durationToHoldButton) * durationToHoldButton
  ).filter((distanceTraveled) => distanceTraveled > distanceToBeat).length;
}

function partOne(): number {
  const input = parseInput();
  return input.times.map((time, i) => numWaysToWin(time, input.distances[i]))
    .reduce((acc, num) => acc * num, 1);
}

console.log(partOne());
