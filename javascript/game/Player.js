import {Piece} from '/javascript/game/Piece.js';

export class Player {
  constructor (id, cards, board) {
    this.id = id;
    this.cards = cards;
    this.board = board;
    this.pieces = [];
  }

  addPieces (pieces) {
    pieces.forEach((piece) => {
      this.pieces.push(new Piece(piece.type, piece.x, piece.y, this))
    });
  }
}