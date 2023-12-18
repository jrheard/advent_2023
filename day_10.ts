import { parseInts } from "./util.ts";

const LOOP_MARKER_CHAR = "☃";

function replaceCharacterAt(str: string, index: number, replacement: string) {
  return str.substring(0, index) + replacement +
    str.substring(index + replacement.length);
}

type Grid = string[];
type Position = [number, number];

function parseInput(): Grid {
  return Deno.readTextFileSync("inputs/day_10.txt").split("\n");
}

function findPositionOfStartTile(grid: Grid): Position {
  for (const [y, row] of grid.entries()) {
    if (row.includes("S")) {
      return [row.indexOf("S"), y];
    }
  }
  throw new Error("no start tile found");
}

function findConnectedTiles(
  grid: Grid,
  [x, y]: Position,
): Position[] {
  const value = grid[y][x];
  const result: Position[] = [];

  if (value == "S") {
    // North
    if (y > 0 && ["|", "7", "F"].includes(grid[y - 1][x])) {
      result.push([x, y - 1]);
    }
    // East
    if (x < grid[0].length - 1 && ["7", "-", "J"].includes(grid[y][x + 1])) {
      result.push([x + 1, y]);
    }
    // South
    if (y < grid.length - 1 && ["|", "J", "L"].includes(grid[y + 1][x])) {
      result.push([x, y + 1]);
    }
    // West
    if (x > 0 && ["-", "F", "L"].includes(grid[y][x - 1])) {
      result.push([x - 1, y]);
    }

    if (result.length != 2) {
      throw new Error(`${result} doesn't have length 2`);
    }
    return result;
  }

  switch (value) {
    case "|": {
      return [[x, y + 1], [x, y - 1]];
    }
    case "-": {
      return [[x + 1, y], [x - 1, y]];
    }
    case "L": {
      return [[x, y - 1], [x + 1, y]];
    }
    case "J": {
      return [[x, y - 1], [x - 1, y]];
    }
    case "7": {
      return [[x - 1, y], [x, y + 1]];
    }
    case "F": {
      return [[x, y + 1], [x + 1, y]];
    }
    case ".": {
      throw new Error("ground tile");
    }
    default: {
      throw new Error(`unexpected value ${value} at ${[x, y]}`);
    }
  }
}

function discoverLoop(grid: Grid): readonly Position[] {
  const startTile = findPositionOfStartTile(grid);

  const result: Position[] = [startTile];

  // Intentionally only use one of the connected tiles so that we discover the loop in one direction
  // instead of discovering it in both directions at once (makes assembling an ordered `result` easier).
  const tilesToProcess = [findConnectedTiles(grid, startTile)[0]];

  const seenTiles = new Set([
    startTile.toString(),
    tilesToProcess[0].toString(),
  ]);

  while (tilesToProcess.length > 0) {
    const tile = tilesToProcess.pop()!;
    result.push(tile);

    for (const neighbor of findConnectedTiles(grid, tile)) {
      if (!seenTiles.has(neighbor.toString())) {
        tilesToProcess.push(neighbor);
        seenTiles.add(neighbor.toString());
      }
    }
  }

  return result;
}

function partOne(): number {
  const grid = parseInput();
  const loop = discoverLoop(grid);
  return loop.length / 2;
}

function findNeighborsForGrouping(
  [x, y]: Position,
  grid: Grid,
): readonly Position[] {
  return [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]].filter(([xx, yy]) =>
    xx >= 0 && xx < grid[0].length && yy >= 0 && yy < grid.length &&
    grid[yy][xx] != LOOP_MARKER_CHAR
  ) as Position[];
}

function findContiguousNonLoopTiles(
  startTile: Position,
  grid: Grid,
): [readonly Position[], boolean] {
  const group: Set<string> = new Set();
  let groupIsEnclosed = true;

  const tilesToProcess = [startTile];

  while (tilesToProcess.length > 0) {
    const tile = tilesToProcess.pop()!;
    group.add(tile.toString());

    for (const [x, y] of findNeighborsForGrouping(tile, grid)) {
      const neighbor: Position = [x, y];
      if (
        !group.has(neighbor.toString()) &&
        (tilesToProcess.find((position) =>
          position[0] == x && position[1] == y
        ) == undefined)
      ) {
        tilesToProcess.push(neighbor);
      }

      if (
        x == 0 || y == 0 ||
        x == grid[0].length - 1 || y == grid.length - 1
      ) {
        groupIsEnclosed = false;
      }
    }
  }

  return [
    Array.from(group).map((position) =>
      parseInts(position.split(",")) as Position
    ),
    groupIsEnclosed,
  ];
}

// Takes the input grid and expands it to be 2x its original width and height.
// Expands the `loop` to cover the relevant new tiles, but otherwise leaves the new tiles
// as ' ' characters. Replaces loop tiles with a '☃' character, replaces preexisting non-loop tiles
// with a '.' character.
function expandGrid(grid: Grid, loop: readonly Position[]): Grid {
  // Step 1: Expand the input grid by 2x in width+height.
  const result = grid.flatMap((line) => [
    Array.from(line).map((char) => char + " ").join(""),
    " ".repeat(line.length * 2),
  ]);

  // Step 2: Expand the loop so that it covers the relevant newly-inserted tiles.
  for (const [x, y] of loop) {
    let positionsToReplace: Position[] = [];

    switch (grid[y][x]) {
      case "|": {
        positionsToReplace = [[x * 2, y * 2 - 1], [x * 2, y * 2 + 1]];
        break;
      }
      case "-": {
        positionsToReplace = [[x * 2 - 1, y * 2], [x * 2 + 1, y * 2]];
        break;
      }
      case "L": {
        positionsToReplace = [[x * 2, y * 2 - 1], [x * 2 + 1, y * 2]];
        break;
      }
      case "J": {
        positionsToReplace = [[x * 2 - 1, y * 2], [x * 2, y * 2 - 1]];
        break;
      }
      case "7": {
        positionsToReplace = [[x * 2 - 1, y * 2], [x * 2, y * 2 + 1]];
        break;
      }
      case "F": {
        positionsToReplace = [[x * 2 + 1, y * 2], [x * 2, y * 2 + 1]];
        break;
      }
      case "S": {
        // The S tile's [x, y] will automatically be replaced right after this switch statement,
        // and the tiles that it's connected to will have their new extensions handled
        // by this switch statement, so we don't need to e.g. carefully detect what shape
        // S should have been and handle its newly-connected tiles manually.
        break;
      }
      default: {
        throw new Error(`unexpected value ${grid[y][x]} at ${x}, ${y}`);
      }
    }

    positionsToReplace.push([x * 2, y * 2]);

    for (const [xx, yy] of positionsToReplace) {
      result[yy] = replaceCharacterAt(
        result[yy],
        xx,
        LOOP_MARKER_CHAR,
      );
    }
  }

  // Step 3: replace all preexisting non-loop tiles with a '.' character.
  for (const [i, line] of result.entries()) {
    if (i % 2 == 0) {
      result[i] = line.replaceAll(/\||-|L|J|7|F/g, ".");
    }
  }

  return result;
}

function partTwo(): number {
  const grid = parseInput();
  const loop = discoverLoop(grid);

  const expandedGrid = expandGrid(grid, loop);

  // Find the positions of all of the '.' tiles in the expanded grid.
  const tilesToExamine = new Set<string>();
  for (const [y, row] of expandedGrid.entries()) {
    for (const [x, char] of Array.from(row).entries()) {
      if (char == ".") {
        tilesToExamine.add([x, y].toString());
      }
    }
  }

  const groups: [readonly Position[], boolean][] = [];

  // Do a series of flood fills to discover which groups of non-loop tiles are contained by the loop.
  while (true) {
    const tilesToExamineArray = Array.from(tilesToExamine);
    if (tilesToExamineArray.length == 0) {
      break;
    }

    const tile = parseInts(tilesToExamineArray.pop()!.split(",")) as Position;

    const [group, isEnclosed] = findContiguousNonLoopTiles(tile, expandedGrid);
    groups.push([group, isEnclosed]);

    for (const tile of group) {
      tilesToExamine.delete(tile.toString());
    }
  }

  // Return the number of enclosed coordinates whose x and y are both divisible by 2,
  // which indicates that the coordinate is from the original, non-expanded grid.
  return groups.filter(([_group, isEnclosed]) => isEnclosed).reduce((
    acc,
    [group, _],
  ) => acc + group.filter(([x, y]) => x % 2 == 0 && y % 2 == 0).length, 0);
}

console.log(partOne());
console.log(partTwo());
