const parseNum = (numString: string) => parseInt(numString.trim());

interface Card {
  winningNumbers: Set<number>;
  actualNumbers: number[];
  copies: number;
}

function loadInput(): readonly Card[] {
  const lines = Deno.readTextFileSync("inputs/day_4.txt").split("\n");
  return lines.map((line) => {
    const content = line.substring(line.indexOf(":") + 2);
    const [winning, actual] = content.split(" | ");

    return {
      winningNumbers: new Set(winning.trim().split(/\s+/).map(parseNum)),
      actualNumbers: actual.trim().split(/\s+/).map(parseNum),
      copies: 1,
    };
  });
}

function scoreCard(card: Card): number {
  const numWins =
    card.actualNumbers.filter((num) => card.winningNumbers.has(num)).length;

  if (numWins == 0) {
    return 0;
  }

  return 2 ** (numWins - 1);
}

function partOne(): number {
  const cards = loadInput();
  return cards.map(scoreCard).reduce((acc, num) => acc + num);
}

function partTwo(): number {
  const cards = loadInput();

  for (const [i, card] of cards.entries()) {
    const numWins = card.actualNumbers.filter((num) =>
      card.winningNumbers.has(num)
    ).length;

    for (const wonCard of cards.slice(i + 1, i + 1 + numWins)) {
      wonCard.copies += card.copies;
    }
  }

  return cards.reduce((acc, card) => acc + card.copies, 0);
}

console.log(partOne());
console.log(partTwo());
