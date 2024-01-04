import { range } from "./util.ts";

type Grid = readonly string[];
type Position = [number, number];

function parseInput(): Grid {
  const originalGrid = Deno.readTextFileSync("inputs/day_11.txt").split("\n");

  const emptyRowIndexes = range(0, originalGrid.length).filter((i) =>
    originalGrid[i].split("").every((char) => char == ".")
  );
  const emptyColumnIndexes = range(0, originalGrid[0].length).filter((i) =>
    originalGrid.every((row) => row[i] == ".")
  );

  const tallerGrid = originalGrid.flatMap((row, index) => {
    if (emptyRowIndexes.includes(index)) {
      return [row, row];
    } else {
      return [row];
    }
  });

  return tallerGrid.map((row) =>
    row.split("").flatMap((columnValue, columnIndex) => {
      if (emptyColumnIndexes.includes(columnIndex)) {
        return [".", "."];
      } else {
        return [columnValue];
      }
    }).join("")
  );
}

function findPositionsOfGalaxies(grid: Grid): readonly Position[] {
  const result: Position[] = [];
  for (const y of range(0, grid.length)) {
    for (const x of range(0, grid[0].length)) {
      if (grid[y][x] == "#") {
        result.push([x, y]);
      }
    }
  }
  return result;
}

function findPathBetweenGalaxies(
  galaxyOne: Position,
  galaxyTwo: Position,
): Position[] {
  const path: Position[] = [];
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
    path.push(position);
  }

  return path;
}

function partOne(): number {
  const input = parseInput();
  const positions = findPositionsOfGalaxies(input);

  const paths = [];
  for (const [i, positionOne] of positions.entries()) {
    for (const positionTwo of positions.slice(i + 1)) {
      paths.push(findPathBetweenGalaxies(positionOne, positionTwo));
    }
  }

  return paths.reduce((acc, path) => acc + path.length, 0);
}

function partTwo(): number {
  return -1;
}

console.log(partOne());
console.log(partTwo());
