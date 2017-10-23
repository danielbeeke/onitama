import {CardDeck} from '/javascript/CardDeck.js';


export class GameState {
  constructor (state = {}) {
    this.cardDeck = new CardDeck();
    this.boardFlip = false;
    this.bankCard = this.cards.selectedCards[4].name;
    this.players = [
      {
        id: 'player1',
        positions: [
          { x: 1, y: 1, type: 'Monk' },
          { x: 2, y: 1, type: 'Monk' },
          { x: 3, y: 1, type: 'Master' },
          { x: 4, y: 1, type: 'Monk' },
          { x: 5, y: 1, type: 'Monk' }
        ],
        cards: [this.cards.selectedCards[0].name, this.cards.selectedCards[1].name]
      },
      {
        id: 'player2',
        positions: [
          { x: 1, y: 5, type: 'Monk' },
          { x: 2, y: 5, type: 'Monk' },
          { x: 3, y: 5, type: 'Master' },
          { x: 4, y: 5, type: 'Monk' },
          { x: 5, y: 5, type: 'Monk' }
        ],
        cards: [this.cards.selectedCards[2].name, this.cards.selectedCards[3].name]
      }
    ];

    Object.assign(this, state);
  }
}