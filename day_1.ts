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

  // Replace first occurrence
  lines = lines.map((line) =>
    line.replace(
      /one|two|three|four|five|six|seven|eight|nine/,
      (match) => digitWords[match as keyof typeof digitWords],
    )
  );

  // Replace last occurrence
  lines = lines.map((line) => {
    console.log(line);
    let highestIndex = -1;
    let farthestRightDigitWord = "";
    let digit = "";

    for (const [k, v] of Object.entries(digitWords)) {
      console.log(k, v);
      const index = line.lastIndexOf(k);

      if (index > highestIndex) {
        console.log(index, highestIndex);
        highestIndex = index;
        farthestRightDigitWord = k;
        digit = v;
      }
    }

    if (highestIndex == -1) {
      return line;
    }

    console.log(line.replaceAll(farthestRightDigitWord, digit));
    return line.replaceAll(farthestRightDigitWord, digit);
  });

  const digits = lines.map((line) =>
    line.split("").filter((char) => char >= "0" && char <= "9")
  );

  console.log(digits);

  //console.log(digits[0]);
  //console.log(digits[1]);
  //console.log(digits[113]);
  //console.log(digits.at(-2));
  //console.log(digits.at(-1));

  const calibrationValues = digits.map((line) =>
    parseInt(line[0] + line.at(-1))
  );

  return calibrationValues.reduce((sum, value) => sum + value);
}

console.log(partOne());
// TODO number too high - why?
console.log(partTwo());
