import { parseInts } from "./util.ts";

type ConditionRecord = {
  data: string;
  damagedGroupSizes: readonly number[];
};

type Input = readonly ConditionRecord[];

function parseInput(): Input {
  return Deno.readTextFileSync("inputs/day_12.txt").split("\n").map((line) => {
    const [data, groups] = line.split(" ");
    return {
      data,
      damagedGroupSizes: parseInts(groups.split(",")),
    };
  });
}

function partOne(): number {
  console.log(parseInput());
  return -1;
}

function partTwo(): number {
  return -1;
}

console.log(partOne());
console.log(partTwo());
