const cardOrder = [
  "A",
  "K",
  "Q",
  "J",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
];

const cardOrderJokersWild = [
  "A",
  "K",
  "Q",
  "T",
  "9",
  "8",
  "7",
  "6",
  "5",
  "4",
  "3",
  "2",
  "J",
];

const handTypeOrder = [
  "five of a kind",
  "four of a kind",
  "full house",
  "three of a kind",
  "two pair",
  "one pair",
  "high card",
] as const;

type HandType = (typeof handTypeOrder)[number];

interface HandAndBid {
  hand: string;
  bid: number;
}

function parseInput(): HandAndBid[] {
  const lines = Deno.readTextFileSync("inputs/day_7.txt").split("\n");
  return lines.map((line) => {
    const [hand, bid] = line.split(" ");
    return {
      hand,
      bid: parseInt(bid),
    };
  });
}

function getHandType(hand: string, jokersWild: boolean): HandType {
  const counts: { [card: string]: number } = {};
  for (const card of hand) {
    counts[card] = counts[card] ? counts[card] + 1 : 1;
  }

  let values = [];
  if (jokersWild) {
    const jokers = counts.J ?? 0;
    delete counts.J;

    values = Object.values(counts);

    const indexOfMax = values.indexOf(Math.max(...values));
    values[indexOfMax] += jokers;
  } else {
    values = Object.values(counts);
  }

  // I want to use a switch/case, but can't compare against arrays like [5], [2, 3], etc,
  // because javascript does equality checking by reference instead of value.
  if (values.includes(5)) {
    return "five of a kind";
  } else if (values.includes(4)) {
    return "four of a kind";
  } else if (values.includes(3) && values.includes(2)) {
    return "full house";
  } else if (values.includes(3)) {
    return "three of a kind";
  } else if (values.filter((x) => x == 2).length == 2) {
    return "two pair";
  } else if (values.includes(2)) {
    return "one pair";
  } else {
    return "high card";
  }
}

function compareHands(a: string, b: string, jokersWild: boolean): number {
  const aRank = handTypeOrder.indexOf(getHandType(a, jokersWild));
  const bRank = handTypeOrder.indexOf(getHandType(b, jokersWild));

  if (aRank < bRank) {
    return 1;
  } else if (bRank < aRank) {
    return -1;
  } else {
    for (let i = 0; i < a.length; i++) {
      const order = jokersWild ? cardOrderJokersWild : cardOrder;

      const aCardRank = order.indexOf(a[i]);
      const bCardRank = order.indexOf(b[i]);

      if (aCardRank < bCardRank) {
        return 1;
      } else if (aCardRank > bCardRank) {
        return -1;
      }
    }
  }

  return 0;
}

function partOne(): number {
  const input = parseInput();
  const sortedHands = input.toSorted((a, b) =>
    compareHands(a.hand, b.hand, false)
  );

  return sortedHands.map((handAndBid, i) => handAndBid.bid * (i + 1))
    .reduce((
      acc,
      val,
    ) => acc + val);
}

function partTwo(): number {
  const input = parseInput();
  const sortedHands = input.toSorted((a, b) =>
    compareHands(a.hand, b.hand, true)
  );

  return sortedHands.map((handAndBid, i) => handAndBid.bid * (i + 1))
    .reduce((
      acc,
      val,
    ) => acc + val);
}

console.log(partOne());
console.log(partTwo());
