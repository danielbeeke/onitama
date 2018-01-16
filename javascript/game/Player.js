import {Piece} from '/javascript/game/Piece.js';
import {Card} from '/javascript/game/Card.js';

export class Player {

  /**
   * Create a new player with an ID.
   */
  constructor (id, state) {
    this.state = state;
    this.id = id;
    this.pieces = [];
    this.cards = [];
  }

  /**
   * Add a piece to this player.
   */
  addPiece (type, x = false, y = false) {
    let piece = new Piece(type, x, y, this.state, this);
    this.pieces.push(piece);
  }

  /**
   * Add a card to this player.
   */
  addCard (cardData) {
    let card = new Card(cardData, this.state, this);
    this.cards.push(card);
    return card;
  }
}