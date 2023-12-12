const parseInts = (numberStrings: readonly string[]) =>
  numberStrings.map((x) => parseInt(x, 10));

interface MapRange {
  sourceRangeStart: number;
  destinationRangeStart: number;
  length: number;
}

interface PuzzleInput {
  seeds: readonly number[];
  seedToSoil: readonly MapRange[];
  soilToFertilizer: readonly MapRange[];
  fertilizerToWater: readonly MapRange[];
  waterToLight: readonly MapRange[];
  lightToTemperature: readonly MapRange[];
  temperatureToHumidity: readonly MapRange[];
  humidityToLocation: readonly MapRange[];
}

// Takes a string like "50 98 2", returns a MapRange.
function parseMapRange(line: string): MapRange {
  const [destinationRangeStart, sourceRangeStart, length] = parseInts(
    line.split(
      " ",
    ),
  );

  return {
    destinationRangeStart,
    sourceRangeStart,
    length,
  };
}

function parseMapRangesFromInput(
  input: readonly string[],
  rangeTitle: string,
): readonly MapRange[] {
  const startIndex = input.indexOf(rangeTitle) + 1;
  let endIndex = input.slice(startIndex).indexOf("");
  if (endIndex == -1) {
    endIndex = input.length - startIndex;
  }
  return input.slice(startIndex, startIndex + endIndex).map(parseMapRange);
}

function parseInput(): PuzzleInput {
  const lines = Deno.readTextFileSync("inputs/day_5.txt").split("\n");
  const seeds = parseInts(lines[0].substring(7).split(" "));

  return {
    seeds,
    seedToSoil: parseMapRangesFromInput(lines, "seed-to-soil map:"),
    soilToFertilizer: parseMapRangesFromInput(lines, "soil-to-fertilizer map:"),
    fertilizerToWater: parseMapRangesFromInput(
      lines,
      "fertilizer-to-water map:",
    ),
    waterToLight: parseMapRangesFromInput(lines, "water-to-light map:"),
    lightToTemperature: parseMapRangesFromInput(
      lines,
      "light-to-temperature map:",
    ),
    temperatureToHumidity: parseMapRangesFromInput(
      lines,
      "temperature-to-humidity map:",
    ),
    humidityToLocation: parseMapRangesFromInput(
      lines,
      "humidity-to-location map:",
    ),
  };
}

function mapId(id: number, ranges: readonly MapRange[]): number {
  for (const range of ranges) {
    if (
      id >= range.sourceRangeStart && id < range.sourceRangeStart + range.length
    ) {
      return range.destinationRangeStart + id - range.sourceRangeStart;
    }
  }

  return id;
}

function partOne(): number {
  const input = parseInput();

  const locations = input.seeds.map((seed) => {
    const soil = mapId(seed, input.seedToSoil);
    const fertilizer = mapId(soil, input.soilToFertilizer);
    const water = mapId(fertilizer, input.fertilizerToWater);
    const light = mapId(water, input.waterToLight);
    const temperature = mapId(light, input.lightToTemperature);
    const humidity = mapId(temperature, input.temperatureToHumidity);
    return mapId(humidity, input.humidityToLocation);
  });

  return Math.min(...locations);
}

console.log(partOne());
