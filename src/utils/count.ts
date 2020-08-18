import { Card, Value } from "./card";
import { Deck } from "./deck";

export function getCardCountValue(card: Card): -1 | 0 | 1 {
  if (
    [Value.Ace, Value.King, Value.Queen, Value.Jack, Value.Ten].includes(
      card.value
    )
  ) {
    return -1;
  } else if ([Value.Seven, Value.Eight, Value.Nine].includes(card.value)) {
    return 0;
  } else {
    return 1;
  }
}

const INITIAL_DECK_COUNT_VALUE = 0;

export function getDeckCountValue(deck: Deck): number {
  return deck.reduce(
    (acc, next) => acc + getCardCountValue(next),
    INITIAL_DECK_COUNT_VALUE
  );
}
