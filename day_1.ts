function partOne(): number {
  const text: string = Deno.readTextFileSync("inputs/day_1.txt");
  const lines = text.split("\n");
  const digits = lines.map((line) =>
    line.split("").filter((char) => char >= "0" && char <= "9")
  );

  const calibrationValues = digits.map((line) =>
    parseInt(line[0] + line.at(-1))
  );

  return calibrationValues.reduce((sum, value) => sum + value);
}

function partTwo(): number {
  const text: string = Deno.readTextFileSync("inputs/day_1.txt");
  let lines = text.split("\n");

  const digitWords = {
    "one": "1",
    "two": "2",
    "three": "3",
    "four": "4",
    "five": "5",
    "six": "6",
    "seven": "7",
    "eight": "8",
    "nine": "9",
  };

  lines = lines.map((line) => {
    for (const [k, v] of Object.entries(digitWords)) {
      line = line.replaceAll(k, k + v + k);
    }

    return line;
  });

  const digits = lines.map((line) =>
    line.split("").filter((char) => char >= "0" && char <= "9")
  );

  const calibrationValues = digits.map((line) =>
    parseInt(line[0] + line.at(-1))
  );

  return calibrationValues.reduce((sum, value) => sum + value);
}

console.log(partOne());
console.log(partTwo());
