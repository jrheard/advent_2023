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
  const result: Position[] = [];

  for (let xx = x - 1; xx <= x + 1; xx++) {
    for (let yy = y - 1; yy <= y + 1; yy++) {
      if (
        xx >= 0 && xx < grid[0].length && yy >= 0 && yy < grid.length &&
        (xx != x || yy != y) && grid[yy][xx] != LOOP_MARKER_CHAR
      ) {
        result.push([xx, yy]);
      }
    }
  }

  return result;
}

function findContiguousNonLoopTiles(
  startTile: Position,
  grid: Grid,
): [readonly Position[], boolean] {
  const group: Set<Position> = new Set();
  let groupIsEnclosed = true;

  const tilesToProcess = [startTile];
  while (tilesToProcess.length > 0) {
    const tile = tilesToProcess.pop()!;
    group.add(tile);

    for (const neighbor of findNeighborsForGrouping(tile, grid)) {
      if (
        !group.has(neighbor) &&
        (tilesToProcess.find((position) =>
          position[0] == neighbor[0] && position[1] == neighbor[1]
        ) == undefined)
      ) {
        tilesToProcess.push(neighbor);
      }

      if (
        neighbor[0] == 0 || neighbor[1] == 0 ||
        neighbor[0] == grid[0].length - 1 || neighbor[1] == grid.length - 1
      ) {
        groupIsEnclosed = false;
      }
    }
  }
  return [Array.from(group), groupIsEnclosed];
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
  /*
  for (const line of expandedGrid) {
    console.log(line);
  }
  */

  // Find the positions of all of the '.' tiles in the expanded grid.
  const tilesToExamine = new Set(
    expandedGrid.flatMap((row, y) =>
      Array.from(row).map((v, x) => [v, x]).filter(([v, _x]) => v == ".").map((
        _v,
        x,
      ) => [x, y].toString())
    ),
  );

  const groups: [readonly Position[], boolean][] = [];

  // Do a series of flood fills to discover which groups of '.' tiles are contained by the loop.
  while (true) {
    const tilesToExamineArray = Array.from(tilesToExamine);
    if (tilesToExamineArray.length == 0) {
      break;
    }

    const tile = parseInts(tilesToExamineArray.pop()!.split(",")) as Position;

    const [group, isEnclosed] = findContiguousNonLoopTiles(tile, grid);
    groups.push([group, isEnclosed]);

    for (const tile of group) {
      tilesToExamine.delete(tile.toString());
    }
  }

  console.log(groups);

  // TODO filter for only groups where isEnclosed=true
  // TODO count the number of coordinates in each group whose x and y are both divisible by 2

  return -1;
}

console.log(partOne());
console.log(partTwo());
