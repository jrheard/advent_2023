const parseNum = (numString: string) => parseInt(numString.trim());

interface Card {
  winningNumbers: Set<number>;
  actualNumbers: number[];
}

function loadInput(): Card[] {
  const lines = Deno.readTextFileSync("inputs/day_4.txt").split("\n");
  return lines.map((line) => {
    const content = line.substring(line.indexOf(":") + 2);
    console.log(content.split(" | "));
    const [winning, actual] = content.split(" | ");

    return {
      winningNumbers: new Set(winning.trim().split(/\s+/).map(parseNum)),
      actualNumbers: actual.trim().split(/\s+/).map(parseNum),
    };
  });
}

function partOne(): number {
  console.log(loadInput());
  return -1;
}

console.log(partOne());
