// via https://stackoverflow.com/questions/36947847/how-to-generate-range-of-numbers-from-0-to-n-in-es2015-only
const range = (start: number, end: number): number[] =>
  Array.from({ length: (end - start) }, (_v, k) => k + start);

function isDigit(char: string): boolean {
  return char >= "0" && char <= "9";
}

function isSymbol(char: string): boolean {
  return !isDigit(char) && char != ".";
}

class Grid {
  data: string[];
  width: number;
  height: number;

  constructor(text: string) {
    const data = text.split("\n");
    this.data = data;
    this.width = data[0].length;
    this.height = data.length;
  }

  valueAt(x: number, y: number): string {
    return this.data[y][x];
  }

  neighborCoordinates(x: number, y: number): number[][] {
    const result = [];
    for (const xx of range(x - 1, x + 1)) {
      for (const yy of range(y - 1, y + 1)) {
        if (
          xx >= 0 && xx < this.width && yy >= 0 && yy < this.height &&
          !(xx == x && yy == y)
        ) {
          result.push([xx, yy]);
        }
      }
    }
    return result;
  }
}

function loadGrid(): Grid {
  const text = Deno.readTextFileSync("inputs/day_3.txt");
  return new Grid(text);
}

function partOne(): number {
  const grid = loadGrid();

  // Find the coordinates of each non-digit, non-period character.
  const symbolCoordinates = [...Array(grid.width * grid.height).keys()].map(
    (i) => [i % grid.width, Math.floor(i / grid.height)],
  ).filter(([x, y]) => isSymbol(grid.valueAt(x, y)));

  const potentialPartNumberCoordinates = new Set(
    symbolCoordinates.flatMap(([x, y]) => grid.neighborCoordinates(x, y)),
  );

  // XXXX this doesn't work, because "number" in this problem means "contiguous set of digits", not individual digits
  // XXX TODO
  return Array.from(potentialPartNumberCoordinates).filter(([x, y]) =>
    isDigit(grid.valueAt(x, y))
  ).reduce((acc, [x, y]) => acc + parseInt(grid.valueAt(x, y)), 0);
}

console.log(partOne());
