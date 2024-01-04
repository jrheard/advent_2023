import { range } from "./util.ts";

type Grid = {
  data: readonly string[];
  emptyRowIndexes: readonly number[];
  emptyColumnIndexes: readonly number[];
};
type Position = [number, number];

function parseInput(): Grid {
  const originalGrid = Deno.readTextFileSync("inputs/day_11.txt").split("\n");

  const emptyRowIndexes = range(0, originalGrid.length).filter((i) =>
    originalGrid[i].split("").every((char) => char == ".")
  );
  const emptyColumnIndexes = range(0, originalGrid[0].length).filter((i) =>
    originalGrid.every((row) => row[i] == ".")
  );

  return {
    data: originalGrid,
    emptyRowIndexes,
    emptyColumnIndexes,
  };
}

function findPositionsOfGalaxies(grid: Grid): readonly Position[] {
  const result: Position[] = [];
  for (const y of range(0, grid.data.length)) {
    for (const x of range(0, grid.data[0].length)) {
      if (grid.data[y][x] == "#") {
        result.push([x, y]);
      }
    }
  }
  return result;
}

function findPathLengthBetweenGalaxies(
  grid: Grid,
  galaxyOne: Position,
  galaxyTwo: Position,
  emptyLineDistance: number,
): number {
  let result = 0;
  let position = galaxyOne;

  while (position[0] != galaxyTwo[0] || position[1] != galaxyTwo[1]) {
    const [[x1, y1], [x2, y2]] = [position, galaxyTwo];

    if (x1 < x2) {
      position = [x1 + 1, y1];
    } else if (x1 > x2) {
      position = [x1 - 1, y1];
    } else if (y1 < y2) {
      position = [x1, y1 + 1];
    } else {
      position = [x1, y1 - 1];
    }

    if (x1 != position[0] && grid.emptyColumnIndexes.includes(position[0])) {
      result += emptyLineDistance;
    } else if (
      y1 != position[1] && grid.emptyRowIndexes.includes(position[1])
    ) {
      result += emptyLineDistance;
    } else {
      result += 1;
    }
  }

  return result;
}

function partOne(): number {
  const grid = parseInput();
  const positions = findPositionsOfGalaxies(grid);

  let result = 0;
  for (const [i, positionOne] of positions.entries()) {
    for (const positionTwo of positions.slice(i + 1)) {
      result += findPathLengthBetweenGalaxies(
        grid,
        positionOne,
        positionTwo,
        2,
      );
    }
  }

  return result;
}

function partTwo(): number {
  const grid = parseInput();
  const positions = findPositionsOfGalaxies(grid);

  let result = 0;
  for (const [i, positionOne] of positions.entries()) {
    for (const positionTwo of positions.slice(i + 1)) {
      result += findPathLengthBetweenGalaxies(
        grid,
        positionOne,
        positionTwo,
        1_000_000,
      );
    }
  }

  return result;
}

console.log(partOne());
console.log(partTwo());
