function main(): number {
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

console.log(main());
