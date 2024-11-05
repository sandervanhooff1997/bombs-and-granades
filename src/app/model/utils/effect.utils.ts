import { ICardDeck } from '../card';
import { IDice } from '../dice';
import { cardEffectMap, Effect, IEffect } from '../effect';

export const getCardEffect = (dices: IDice[], cardDeck: ICardDeck): IEffect => {
  const effect = cardEffectMap.get(cardDeck.currentCard!.type);
  if (!effect) {
    alert('Unable to process this card effect');
    return new Effect();
  }

  return effect!(dices);
};
