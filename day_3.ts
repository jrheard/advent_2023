// via https://stackoverflow.com/questions/36947847/how-to-generate-range-of-numbers-from-0-to-n-in-es2015-only
const range = (start: number, end: number): readonly number[] =>
  Array.from({ length: (end - start) }, (_v, k) => k + start);

function isDigit(char: string): boolean {
  return char >= "0" && char <= "9";
}

function isSymbol(char: string): boolean {
  return !isDigit(char) && char != ".";
}

function coordinateToString([x, y]: Coordinates): string {
  return `${x},${y}`;
}

type Coordinates = readonly [number, number];

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

  neighborCoordinates(x: number, y: number): readonly Coordinates[] {
    const result: Coordinates[] = [];
    for (const xx of range(x - 1, x + 2)) {
      for (const yy of range(y - 1, y + 2)) {
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

interface Number {
  value: number;
  coordinates: readonly Coordinates[];
}

function findNumbersInLine(
  line: string,
  y: number,
  grid: Grid,
): readonly Number[] {
  const result = [];

  let currentlyParsingNumber = false;
  let currentNumber = "";
  let currentNumberCoordinates: Coordinates[] = [];
  for (const x of range(0, line.length)) {
    const value = grid.valueAt(x, y);

    if (isDigit(value) && currentlyParsingNumber) {
      currentNumberCoordinates.push([x, y]);
      currentNumber += value;
    } else if (isDigit(value) && !currentlyParsingNumber) {
      currentlyParsingNumber = true;
      currentNumberCoordinates.push([x, y]);
      currentNumber = value;
    } else if (!isDigit(value) && currentlyParsingNumber) {
      result.push({
        value: parseInt(currentNumber),
        coordinates: currentNumberCoordinates,
      });
      currentlyParsingNumber = false;
      currentNumber = "";
      currentNumberCoordinates = [];
    }
  }

  if (currentlyParsingNumber) {
    result.push({
      value: parseInt(currentNumber),
      coordinates: currentNumberCoordinates,
    });
  }

  return result;
}

function findNumbersInGrid(grid: Grid): Map<string, Number> {
  const numbers = Array.from(grid.data.entries()).flatMap(([y, line]) =>
    findNumbersInLine(line, y, grid)
  );

  const result = new Map();
  for (const num of numbers) {
    for (const coord of num.coordinates) {
      result.set(coordinateToString(coord), num);
    }
  }

  return result;
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

  const numbersByCoordinate = findNumbersInGrid(grid);

  const partNumbers = new Set<Number>();
  for (const coord of potentialPartNumberCoordinates) {
    if (numbersByCoordinate.has(coordinateToString(coord))) {
      partNumbers.add(numbersByCoordinate.get(coordinateToString(coord))!);
    }
  }

  return Array.from(partNumbers).reduce((acc, num) => acc + num.value, 0);
}

function partTwo(): number {
  const grid = loadGrid();

  const numbersByCoordinate = findNumbersInGrid(grid);

  const gearCoordinates = [...Array(grid.width * grid.height).keys()].map(
    (i) => [i % grid.width, Math.floor(i / grid.height)],
  ).filter(([x, y]) => grid.valueAt(x, y) == "*");

  let result = 0;

  for (const [x, y] of gearCoordinates) {
    const partNumbers = new Set<Number>();
    for (const coord of grid.neighborCoordinates(x, y)) {
      if (numbersByCoordinate.has(coordinateToString(coord))) {
        partNumbers.add(numbersByCoordinate.get(coordinateToString(coord))!);
      }
    }

    if (partNumbers.size == 2) {
      result += Array.from(partNumbers).reduce(
        (acc, num) => acc * num.value,
        1,
      );
    }
  }

  return result;
}

console.log(partOne());
console.log(partTwo());
