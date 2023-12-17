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

function partTwo(): number {
  return -1;
}

console.log(partOne());
console.log(partTwo());
