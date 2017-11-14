import {EventEmitter} from '/javascript/core/EventEmitter.js';
import {Piece} from '/javascript/game/Piece.js';

export class Player extends EventEmitter {
  constructor (id, board) {
    super();
    this.board = board;
    this.id = id;
    this.pieces = [];
  }

  addPiece (type, x = false, y = false) {
    this.pieces.push(new Piece(type, x, y, this.board, this));
  }
}