import {EventEmitter} from '/javascript/core/EventEmitter.js';

export class Player extends EventEmitter {
  constructor (id) {
    super();
    this.id = id;
    this.pieces = [];
  }

  addPiece (type, x = false, y = false) {

  }
}