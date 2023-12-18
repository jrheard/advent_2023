import { parseInts } from "./util.ts";

const LOOP_MARKER_CHAR = "☃";

function replaceCharacterAt(str: string, index: number, replacement: string) {
  return str.substring(0, index) + replacement +
    str.substring(index + replacement.length);
}

type Input = string[];
type Position = [number, number];

function parseInput(): Input {
  return Deno.readTextFileSync("inputs/day_10.txt").split("\n");
}

function findPositionOfStartTile(input: Input): Position {
  for (const [y, row] of input.entries()) {
    if (row.includes("S")) {
      return [row.indexOf("S"), y];
    }
  }
  throw new Error("no start tile found");
}

function findConnectedTiles(
  input: Input,
  [x, y]: Position,
): Position[] {
  const value = input[y][x];
  const result: Position[] = [];

  if (value == "S") {
    // North
    if (y > 0 && ["|", "7", "F"].includes(input[y - 1][x])) {
      result.push([x, y - 1]);
    }
    // East
    if (x < input[0].length - 1 && ["7", "-", "J"].includes(input[y][x + 1])) {
      result.push([x + 1, y]);
    }
    // South
    if (y < input.length - 1 && ["|", "J", "L"].includes(input[y + 1][x])) {
      result.push([x, y + 1]);
    }
    // West
    if (x > 0 && ["-", "F", "L"].includes(input[y][x - 1])) {
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

function discoverLoop(input: Input): readonly Position[] {
  const startTile = findPositionOfStartTile(input);

  const result: Position[] = [startTile];

  // Intentionally only use one of the connected tiles so that we discover the loop in one direction
  // instead of discovering it in both directions at once (makes assembling an ordered `result` easier).
  const tilesToProcess = [findConnectedTiles(input, startTile)[0]];

  const seenTiles = new Set([
    startTile.toString(),
    tilesToProcess[0].toString(),
  ]);

  while (tilesToProcess.length > 0) {
    const tile = tilesToProcess.pop()!;
    result.push(tile);

    for (const neighbor of findConnectedTiles(input, tile)) {
      if (!seenTiles.has(neighbor.toString())) {
        tilesToProcess.push(neighbor);
        seenTiles.add(neighbor.toString());
      }
    }
  }

  return result;
}

function partOne(): number {
  const input = parseInput();
  const loop = discoverLoop(input);
  return loop.length / 2;
}

function findNeighborsForGrouping(
  [x, y]: Position,
  input: Input,
  loop: readonly Position[],
): readonly Position[] {
  // TODO deal with squeezing through pipes
  return [];
}

function findContiguousNonLoopTiles(
  startTile: Position,
  input: Input,
  loop: readonly Position[],
): [readonly Position[], boolean] {
  const group: Set<Position> = new Set();
  let groupIsEnclosed = true;

  const tilesToProcess = [startTile];
  while (tilesToProcess.length > 0) {
    const tile = tilesToProcess.pop()!;
    group.add(tile);

    for (const neighbor of findNeighborsForGrouping(tile, input, loop)) {
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
        neighbor[0] == input[0].length - 1 || neighbor[1] == input.length - 1
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
function expandGrid(input: Input, loop: readonly Position[]): Input {
  // Step 1: Expand the input grid by 2x in width+height.
  const rawExpandedGrid = input.flatMap((line) => [
    Array.from(line).map((char) => char + " ").join(""),
    " ".repeat(line.length * 2),
  ]);

  // Step 2: Expand the loop so that it covers the relevant newly-inserted tiles.
  for (const [x, y] of loop) {
    let positionsToReplace: Position[] = [];

    switch (input[y][x]) {
      case "|": {
        positionsToReplace = [[x, y - 1], [x, y + 1]];
        break;
      }
      case "-": {
        positionsToReplace = [[x - 1, y], [x + 1, y]];
        break;
      }
      case "L": {
        positionsToReplace = [[x, y - 1], [x + 1, y]];
        break;
      }
      case "J": {
        positionsToReplace = [[x - 1, y], [x, y - 1]];
        break;
      }
      case "7": {
        positionsToReplace = [[x - 1, y], [x, y + 1]];
        break;
      }
      case "F": {
        positionsToReplace = [[x + 1, y], [x, y + 1]];
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
        throw new Error(`unexpected value ${input[y][x]} at ${x}, ${y}`);
      }
    }

    positionsToReplace.push([x, y]);

    for (const [xx, yy] of positionsToReplace) {
      rawExpandedGrid[yy] = replaceCharacterAt(
        input[yy * 2],
        xx * 2,
        LOOP_MARKER_CHAR,
      );
    }
  }

  /*
  | is a vertical pipe connecting north and south.
- is a horizontal pipe connecting east and west.
L is a 90-degree bend connecting north and east.
J is a 90-degree bend connecting north and west.
7 is a 90-degree bend connecting south and west.
F is a 90-degree bend connecting south and east.
. is ground; there is no pipe in this tile.
S is the starting position of the animal; there is a pipe on this tile, but your sketch doesn't show what shape the pipe has.


  */

  return input;
}

function partTwo(): number {
  const input = parseInput();
  const loop = discoverLoop(input);

  const tilesToExamine = new Set(
    input.flatMap((row, y) =>
      Array.from(row).map((_v, x) => [x, y].toString())
    ),
  );

  for (const tile of loop) {
    tilesToExamine.delete(tile.toString());
  }

  let result = 0;

  while (true) {
    const tilesToExamineArray = Array.from(tilesToExamine);
    if (tilesToExamineArray.length == 0) {
      return result;
    }

    const tile = parseInts(tilesToExamineArray.pop()!.split(",")) as Position;
    const [group, isEnclosed] = findContiguousNonLoopTiles(tile, input, loop);

    if (isEnclosed) {
      result += group.length;
    }

    for (const tile of group) {
      tilesToExamine.delete(tile.toString());
    }
  }
}

console.log(partOne());
console.log(partTwo());
