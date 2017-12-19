import {Tile} from '/javascript/game/Tile.js';

export class Board {
  /**
   * A board holds the physical together. It makes the tiles and lets them emit to the main emitter.
   */
	constructor (element, emitter) {
		this.emitter = emitter;
		this.gameElement = element;
    this.gameElement.classList.add('board-wrapper');

    this.middleWrapper = document.createElement('div');
    this.middleWrapper.classList.add('left-wrapper');
    this.gameElement.appendChild(this.middleWrapper);

    this.element = document.createElement('div');
    this.element.classList.add('board');
    this.middleWrapper.appendChild(this.element);

    this.createTiles();
    this.createDecks();

    this.createInlineStyle();

    window.addEventListener('resize', () => {
      this.createInlineStyle();
    })
  }

  /**
   * Create the divs that hold the player cards.
   */
  createDecks () {
    this.player2Deck = document.createElement('div');
    this.player2Deck.classList.add('deck');
    this.player2Deck.classList.add('player2');
    this.middleWrapper.insertBefore(this.player2Deck, this.middleWrapper.firstChild);

    this.swapDeck = document.createElement('div');
    this.swapDeck.classList.add('deck');
    this.swapDeck.classList.add('swap');
    this.gameElement.appendChild(this.swapDeck);

    this.player1Deck = document.createElement('div');
    this.player1Deck.classList.add('deck');
    this.player1Deck.classList.add('player1');
    this.middleWrapper.appendChild(this.player1Deck);
  }

  /**
   * A bit of styling is dynamic.
   */
  createInlineStyle () {
    let cardWidth, cardHeight, boardWidth, boardHeight;

    console.log(window.innerWidth / window.innerHeight)

    // Huge width.
    if (window.innerWidth / window.innerHeight > 0.9) {
      boardHeight = window.innerHeight * .6;
      boardWidth = window.innerHeight * .6;

      cardWidth = boardWidth / 2.3;
      cardHeight = cardWidth / 1.61803398875;
    }

    // Huge height.
    else {
      boardWidth = window.innerWidth * .64;
      boardHeight = window.innerWidth * .64;

      cardHeight = boardWidth / 1.8;
      cardWidth = cardHeight / 1.61803398875;
    }


    let css = `
      .card { 
        width: ${cardWidth}px;
        height: ${cardHeight}px; 
      }
    
      .board { 
        width: ${boardWidth}px;
        height: ${boardHeight}px; 
      }
    `;
    let style = document.createElement('style');
    style.type = 'text/css';
    style.appendChild(document.createTextNode(css));
    document.head.appendChild(style);
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