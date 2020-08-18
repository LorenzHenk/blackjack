export enum Value {
  Ace,
  Two,
  Three,
  Four,
  Five,
  Six,
  Seven,
  Eight,
  Nine,
  Ten,
  Jack,
  Queen = 12,
  King = 13,
}

export enum Suit {
  Spades,
  Hearts,
  Diamonds,
  Clubs,
}

export interface Card {
  value: Value;
  suit: Suit;
}

const START_POINT = 0x1f0a1;

const STEP = 0x0010;

const PLAYING_CARD_BACK = 0x1f0a0;

export const PLAYING_CARD_BACK_EMOJI = String.fromCodePoint(PLAYING_CARD_BACK);

export function getCardEmoji(card: Card) {
  return String.fromCodePoint(START_POINT + card.suit * STEP + card.value);
}
