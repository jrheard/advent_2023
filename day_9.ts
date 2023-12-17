import { parseInts } from "./util.ts";

function parseInput(): readonly number[][] {
  const lines = Deno.readTextFileSync("inputs/day_9.txt").split("\n");
  return lines.map((line) => parseInts(line.split(" ")));
}

function differences(sequence: readonly number[]): readonly number[] {
  return sequence.slice(0, sequence.length - 1).map((num, i) =>
    sequence[i + 1] - num
  );
}

function isAllZeroes(sequence: readonly number[]): boolean {
  const differentValues = Array.from(new Set(sequence));
  return differentValues.length == 1 && differentValues[0] == 0;
}

function nextValueInSequence(sequence: readonly number[]): number {
  let currentSequence = sequence;
  const sequenceStack = [];

  while (true) {
    if (isAllZeroes(currentSequence)) {
      let currentEndValue = 0;

      while (sequenceStack.length > 0) {
        const previousSequenceEndValue = sequenceStack.pop()!.at(-1)!;
        currentEndValue += previousSequenceEndValue;
      }

      return currentEndValue;
    } else {
      sequenceStack.push(currentSequence);
      currentSequence = differences(currentSequence);
    }
  }
}

function previousValueInSequence(sequence: readonly number[]): number {
  let currentSequence = sequence;
  const sequenceStack = [];

  while (true) {
    if (isAllZeroes(currentSequence)) {
      let currentStartValue = 0;

      while (sequenceStack.length > 0) {
        const previousSequenceStartValue = sequenceStack.pop()![0];
        currentStartValue = previousSequenceStartValue - currentStartValue;
      }

      return currentStartValue;
    } else {
      sequenceStack.push(currentSequence);
      currentSequence = differences(currentSequence);
    }
  }
}

function partOne(): number {
  const input = parseInput();
  return input.map(nextValueInSequence).reduce((acc, val) => acc + val);
}

function partTwo(): number {
  const input = parseInput();
  return input.map(previousValueInSequence).reduce((acc, val) => acc + val);
}

console.log(partOne());
console.log(partTwo());
