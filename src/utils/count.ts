import { Card, Value } from "./card";
import { Deck } from "./deck";

export const CARD_TO_COUNT_VALUE_MAPPING = {
  high: [Value.Ace, Value.King, Value.Queen, Value.Jack, Value.Ten],
  neutral: [Value.Seven, Value.Eight, Value.Nine],
  low: [Value.Six, Value.Five, Value.Four, Value.Three, Value.Two],
};

export function getCardCountValue(card: Card): -1 | 0 | 1 {
  if (CARD_TO_COUNT_VALUE_MAPPING.high.includes(card.value)) {
    return -1;
  } else if (CARD_TO_COUNT_VALUE_MAPPING.neutral.includes(card.value)) {
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
