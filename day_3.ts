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
}

function loadGrid(): Grid {
  const text = Deno.readTextFileSync("inputs/day_3.txt");
  return new Grid(text);
}

function partOne(): number {
  const grid = loadGrid();

  const symbolCoordinates = [...Array(grid.width * grid.height).keys()].map(
    (i) => [i % grid.width, Math.floor(i / grid.height)],
  ).filter(([x, y]) =>
    !(grid.valueAt(x, y) >= "0" && grid.valueAt(x, y) <= "9") &&
    grid.valueAt(x, y) != "."
  );

  console.log(symbolCoordinates);

  //const symbolCoordinates =

  // find each non-digit, non-period character
  // get the coordinates of all of its neighbors incl diagonals, put them in a set
  // sum the set

  return -1;
}

console.log(partOne());
