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

function countPossibleArrangements(record: ConditionRecord): number {
  // Start by trimming .s from the left and right of the string because we don't have to consider them.
  const trimmedData = record.data.replace(/^\.+/, "").replace(/\.+$/, "");

  const chunk = trimmedData.slice(
    0,
    Math.max(trimmedData.indexOf("."), trimmedData.length),
  );

  return -1;
}

function partOne(): number {
  console.log(parseInput());
  for (const record of parseInput()) {
    console.log(countPossibleArrangements(record));
  }
  return -1;
}

function partTwo(): number {
  return -1;
}

console.log(partOne());
console.log(partTwo());
