import {EventEmitter} from '/javascript/core/EventEmitter.js';
import {Piece} from '/javascript/game/Piece.js';
import {Card} from '/javascript/game/Card.js';

export class Player extends EventEmitter {
  constructor (id, board) {
    super();
    this.board = board;
    this.id = id;
    this.pieces = [];
    this.cards = [];
  }

  addPiece (type, x = false, y = false) {
    let piece = new Piece(type, x, y, this.board, this);
    this.pieces.push(piece);
  }

  addCard (cardData) {
    let card = new Card(cardData, this.board, this);
    this.cards.push(card);
    return card;
  }
}