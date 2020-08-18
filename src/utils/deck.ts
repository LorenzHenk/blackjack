import { Card, Suit, Value } from "./card";
import shuffle from "shuffle-array";

export type Deck = Card[];

const defaultDeck: Deck = [];
for (const suit of [Suit.Spades, Suit.Hearts, Suit.Diamonds, Suit.Clubs]) {
  for (const value of [
    Value.Ace,
    Value.Two,
    Value.Three,
    Value.Four,
    Value.Five,
    Value.Six,
    Value.Seven,
    Value.Eight,
    Value.Nine,
    Value.Ten,
    Value.Jack,
    Value.Queen,
    Value.King,
  ]) {
    defaultDeck.push({ suit, value });
  }
}

interface CreateDeckOptions {
  /**
   * the number of decks used - cardAmountFactor * 52 is the number of cards used
   */
  cardAmountFactor?: number;
}

export function createDeck(options?: CreateDeckOptions) {
  const { cardAmountFactor = 1 } = options ?? {};

  const deck: Deck = [];

  for (let i = 0; i < cardAmountFactor; i++) {
    deck.push(...defaultDeck);
  }

  shuffle(deck);

  return deck;
}
