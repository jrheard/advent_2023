import { range } from "./util.ts";

type Grid = readonly string[];

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

function findPositionsOfGalaxies(grid: Grid): readonly [number, number][] {
  return grid.flatMap((row, y) =>
    row.split("").reduce((acc, col, x) => {
      if (col == "#") {
        acc.push([x, y]);
      }
      return acc;
    }, [] as [number, number][])
  );
}

function partOne(): number {
  const input = parseInput();
  console.log(findPositionsOfGalaxies(input));
  return -1;
}

function partTwo(): number {
  return -1;
}

console.log(partOne());
console.log(partTwo());
