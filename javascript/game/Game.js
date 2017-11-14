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

    this.player1Deck = document.createElement('div');
    this.player1Deck.classList.add('deck');
    this.player1Deck.classList.add('player1');
    this.element.appendChild(this.player1Deck);

    this.player2Deck = document.createElement('div');
    this.player2Deck.classList.add('deck');
    this.player2Deck.classList.add('player2');
    this.element.appendChild(this.player2Deck);

    let emptyState = new State();
    this.board.setState(emptyState);
  }
}