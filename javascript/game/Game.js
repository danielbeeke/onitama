import {EventEmitter} from '/javascript/core/EventEmitter.js';
import {Helpers} from '/javascript/core/Helpers.js';
import {Board} from '/javascript/game/Board.js';
import {State} from '/javascript/game/State.js';

export class Game extends EventEmitter {
  constructor (selector) {
    super();

    this.element = document.querySelector(selector);
    if (!this.element) { throw 'No element found for the onitama game'; }
    this.element.classList.add('onitama');

    this.boardElement = document.createElement('div');
    this.element.appendChild(this.boardElement);
    this.board = new Board(this.boardElement);

    let emptyState = new State();
    this.board.setState(emptyState);
  }
}