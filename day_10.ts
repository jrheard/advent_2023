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
): readonly Position[] {
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
  }
}

function partOne(): number {
  const input = parseInput();

  const startTile = findPositionOfStartTile(input);
  console.log(startTile);
  console.log(findConnectedTiles(input, startTile));
  return -1;
}

function partTwo(): number {
  return -1;
}

console.log(partOne());
console.log(partTwo());
