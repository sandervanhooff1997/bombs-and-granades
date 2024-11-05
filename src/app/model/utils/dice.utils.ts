import { DiceSides, IDice } from '../dice';

export function randomDiceSide(): DiceSides {
  const enumValues = Object.values(DiceSides); // Get all enum values as an array
  const randomIndex = Math.floor(Math.random() * enumValues.length); // Generate a random index
  return enumValues[randomIndex] as DiceSides; // Return a random enum value
}

export function sortDice(dices: IDice[]): void {
  dices.sort(
    (a, b) =>
      dices.map((d) => d.side).indexOf(a.side) -
      dices.map((d) => d.side).indexOf(b.side)
  );

  dices.sort((a, b) => {
    if (!a.rollable && b.rollable) {
      return -1;
    }

    if (a.rollable && !b.rollable) {
      return 1;
    }

    return (
      dices.map((d) => d.side).indexOf(a.side) -
      dices.map((d) => d.side).indexOf(b.side)
    );
  });
}

export function groupAndCountBySide(
  diceArray: IDice[]
): Map<DiceSides, { count: number; item: IDice }> {
  return diceArray
    .filter((d) => d.picked)
    .reduce((map, currentDice) => {
      const sideKey = currentDice.side;
      const existingEntry = map.get(sideKey);

      map.set(sideKey, {
        count: (existingEntry?.count || 0) + 1,
        item: currentDice,
      });

      return map;
    }, new Map<DiceSides, { count: number; item: IDice }>());
}
