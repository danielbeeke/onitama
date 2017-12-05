import {Tile} from '/javascript/game/Tile.js';

export class Board {
  /**
   * A board holds the physical together. It makes the tiles and lets them emit to the main emitter.
   */
	constructor (element, emitter) {
		this.emitter = emitter;
		this.gameElement = element;
    this.gameElement.classList.add('board-wrapper');

    this.element = document.createElement('div');
    this.element.classList.add('board');
    this.gameElement.appendChild(this.element);

		this.createTiles();
    this.createDecks();
  }

  /**
   * Create the divs that hold the player cards.
   */
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

  /**
   * Create the tiles.
   */
	createTiles () {
		this.tiles = new Map();
	    for (let y = 1; y < 6; y++) {
			for (let x = 1; x < 6; x++) {
				let tile = new Tile(x, y, this);
				this.tiles.set(x + '-' + y, tile);
			}
		}
	}

  /**
   * Attach the state to the board.
   */
  setState (state) {
    this.state = state;
    this.emitter.emit('state.change', state);
  }
}