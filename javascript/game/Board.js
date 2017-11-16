import {EventEmitter} from '/javascript/core/EventEmitter.js';
import {State} from '/javascript/game/State.js';
import {Tile} from '/javascript/game/Tile.js';
import {Helpers} from '/javascript/core/Helpers.js';
import {Player} from '/javascript/game/Player.js';

export class Board extends EventEmitter {
	constructor (element) {
		super();

		this.gameElement = element;
    this.gameElement.classList.add('board-wrapper');

    this.element = document.createElement('div');
    this.element.classList.add('board');
    this.gameElement.appendChild(this.element);

		this.createTiles();

    this.createDecks();
  }

  createDecks () {
    this.player2Deck = document.createElement('div');
    this.player2Deck.classList.add('deck');
    this.player2Deck.classList.add('player2');
    this.gameElement.insertBefore(this.player2Deck, this.gameElement.firstChild);

    this.player1Deck = document.createElement('div');
    this.player1Deck.classList.add('deck');
    this.player1Deck.classList.add('player1');
    this.gameElement.appendChild(this.player1Deck);
  }

	createTiles () {
		this.tiles = new Map();
	    for (let y = 1; y < 6; y++) {
			for (let x = 1; x < 6; x++) {
				let tile = new Tile(x, y, this);
				this.tiles.set(x + '-' + y, tile);
			}
		}
	}

  setState (state) {
    this.state = state;
    this.emit('state.change', state);
  }
}