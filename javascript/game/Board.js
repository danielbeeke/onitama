import {EventEmitter} from '/javascript/core/EventEmitter.js';
import {State} from '/javascript/game/State.js';
import {Tile} from '/javascript/game/Tile.js';
import {Helpers} from '/javascript/core/Helpers.js';
import {Player} from '/javascript/game/Player.js';

export class Board extends EventEmitter {
	constructor (element) {
		super();

		this.element = element;
		this.element.classList.add('board');
		this.createTiles();
		this.player1 = new Player(1, this);
    this.player2 = new Player(2, this);
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
		let initPlayer = (data, id) => {
      data.pieces.forEach((pieceType, pieceTile) => {
        let tileCoordinates = Helpers.tileNumberToXandY(pieceTile);
        this['player' + id].addPiece(pieceType, tileCoordinates.x, tileCoordinates.y);

      });
    };

    initPlayer(state.player1, 1);
    initPlayer(state.player2, 2);

	}
}