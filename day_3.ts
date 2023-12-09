interface Grid {
  data: string[];
  width: number;
  height: number;
}

function loadGrid(): Grid {
  const text = Deno.readTextFileSync("inputs/day_3.txt");
  const data = text.split("\n");
  return {
    data,
    width: data[0].length,
    height: data.length,
  };
}

function valueAt(grid: Grid, x: number, y: number): string {
  return grid.data[y][x];
}

function partOne(): number {
  const grid = loadGrid();

  const symbolCoordinates = [...Array(grid.width * grid.height).keys()].map(
    (i) => [i % grid.width, Math.floor(i / grid.height)],
  ).filter(([x, y]) =>
    !(valueAt(grid, x, y) >= "0" && valueAt(grid, x, y) <= "9") &&
    valueAt(grid, x, y) != "."
  );

  console.log(symbolCoordinates);

  //const symbolCoordinates =

  // find each non-digit, non-period character
  // get the coordinates of all of its neighbors incl diagonals, put them in a set
  // sum the set

  return -1;
}

console.log(partOne());
