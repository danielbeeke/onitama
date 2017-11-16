import {EventEmitter} from '/javascript/core/EventEmitter.js';
import {cards} from '/data/cards.js';
import {Helpers} from '/javascript/core/Helpers.js';
import {Player} from '/javascript/game/Player.js';

export class State extends EventEmitter {

	/**
	 * You can initiate a state with a correct ontima string notation. If so it gets validated, else it will be a blank board.
	 *
	 * First dots and spaces are removed.
	 * The characters 1 and 2 from the left are reserved for cards of player 1.
	 * The characters 3 and 4 from the left are reserved for cards of player 2.
	 * The character 5 from the left are reserved for the spare card.
	 * After that the pieces come.
	 * They come in blocks of 10 for each player, first player 1 and than player 2.
   * The last number is the player that has the turn.
	 */
	constructor (board, onitamaStringNotation = 'abcde.axbxcXdxex.uxvxwXxxyx.1') {
		super();
		this.board = board;
		let parsedState = this.parseNotation(onitamaStringNotation);
		this.applyStateObject(parsedState);
	}

	applyStateObject (stateObject) {
    Object.assign(this, stateObject);
    this.cards = [];

    this.player1 = new Player(1, this);
    this.player2 = new Player(2, this);

    let initPlayer = (data, id) => {
      data.pieces.forEach((pieceType, pieceTile) => {
        let tileCoordinates = Helpers.tileNumberToXandY(pieceTile);
        this['player' + id].addPiece(pieceType, tileCoordinates.x, tileCoordinates.y);
      });

      data.cards.forEach((cardData) => {
        let card = this['player' + id].addCard(cardData);
        this.cards.push(card);
      });
    };

    initPlayer(stateObject.player1, 1);
    initPlayer(stateObject.player2, 2);

    let oppositeTurnPlayerId = stateObject.turnPlayer === 1 ? 2 : 1;
    let swapCard = this['player' + oppositeTurnPlayerId].addCard(stateObject.swapCard);
    swapCard.swap();
    this.cards.push(swapCard);
  }

	/**
	 * Parses an onitama string notation.
	 */
	parseNotation (onitamaStringNotation) {
		onitamaStringNotation = onitamaStringNotation
			.replace(/\./g, '')
			.replace(/ /g, '');

		let cardCharacters = onitamaStringNotation.substr(0, 5).split('');
		let selectedCards = cards.filter(card => cardCharacters.includes(card.id));

		let player1Pieces = onitamaStringNotation.substr(15, 10);
		let player2Pieces = onitamaStringNotation.substr(5, 10);

		let convertPlayerPieces = (onitamaStringNotationPlayerPart) => {
			let piecesMap = new Map();
			let chunks = onitamaStringNotationPlayerPart.match(/.{1,2}/g);
			
			chunks.forEach((chunk) => {
				let tileNumber = chunk.charCodeAt(0) - 96;
				let pieceChar = chunk.substr(1);
				let pieceType = pieceChar === pieceChar.toUpperCase() ? 'master' : 'monk';
				piecesMap.set(tileNumber, pieceType);
			});

			return piecesMap;
		};

		let player1PiecesMap = convertPlayerPieces(player1Pieces);
		let player2PiecesMap = convertPlayerPieces(player2Pieces);
		let turnPlayerId = onitamaStringNotation.substr(25, 1);

		return {
      turnPlayer: parseInt(turnPlayerId),
			player1: {
				cards: selectedCards.slice(0, 2),
				pieces: player1PiecesMap
			}, 
			player2: {
				cards: selectedCards.slice(2, 4),
				pieces: player2PiecesMap
			},
			swapCard: selectedCards.slice(4)[0],
		}
	}


  /**
   * Serializes the game state into an object.
   */
  serialize () {
    let state = {};

    state.turnPlayer = this.turnPlayer;

    this.cards.forEach((card) => {
      if (!card.player) {
        state.swapCard = card.id;
      }
    });

    let convertPlayer = (player) => {
      let pieces = new Map();

      player.pieces.forEach((piece) => {
        pieces.set(Helpers.xAndYToTileNumber(piece.x, piece.y), piece.type);
      });

      return {
        cards: [player.cards[0].id, player.cards[1].id],
        pieces: pieces
      }
    };

    state.player1 = convertPlayer(this.player1);
    state.player2 = convertPlayer(this.player2);

    return state;
  }
}