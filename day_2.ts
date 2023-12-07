interface Round {
  red: number;
  blue: number;
  green: number;
}

interface Game {
  id: number;
  rounds: Round[];
}

// Takes a string like "13 red, 2 green", returns a Round like {red: 13, green: 2, blue: 0}
function parseRound(str: string): Round {
  let [red, green, blue] = [0, 0, 0];
  if (str.includes("red")) {
    red = parseInt((str.match(/(\d+) red/) as string[])[1]);
  }
  if (str.includes("green")) {
    green = parseInt((str.match(/(\d+) green/) as string[])[1]);
  }
  if (str.includes("blue")) {
    blue = parseInt((str.match(/(\d+) blue/) as string[])[1]);
  }

  return { red, green, blue };
}

function parseInput(): Game[] {
  const text = Deno.readTextFileSync("inputs/day_2.txt");
  const lines = text.split("\n");

  return lines.map((line) => {
    // `line` looks like "Game 5: 19 red, 1 green; 7 red, 1 green, 1 blue; 7 red; 13 red, 2 green"
    const id = parseInt(line.substring(5, line.indexOf(":")));
    const rounds = line.substring(line.indexOf(":") + 2).split("; ");

    return {
      id: id,
      rounds: rounds.map(parseRound),
    };
  });
}

function partOne(): number {
  const input = parseInput();

  // "The Elf would first like to know which games would have been possible if
  // the bag contained only 12 red cubes, 13 green cubes, and 14 blue cubes?"
  const validGames = input.filter((game) => {
    return game.rounds.every((round) =>
      round.red <= 12 && round.green <= 13 && round.blue <= 14
    );
  });

  // "What is the sum of the IDs of those games?"
  return validGames.reduce((acc, game) => acc + game.id, 0);
}

console.log(partOne());
