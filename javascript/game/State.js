import {EventEmitter} from '/javascript/core/EventEmitter.js';
import {cards} from '/data/cards.js';
import {Card} from '/javascript/game/Card.js';

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
	 */
	constructor (onitamaStringNotation = 'abcde.axbxcXdxex.uxvxwXxxyx') {
		super();
		let parsedState = this.parseNotation(onitamaStringNotation);
		Object.assign(this, parsedState);
	}

	/**
	 * Parses an onitama string notation.
	 */
	parseNotation (onitamaStringNotation) {
		onitamaStringNotation = onitamaStringNotation
			.replace(/\./g, '')
			.replace(/ /g, '');

		let cardCharacters = onitamaStringNotation.substr(0, 5).split('');
		let selectedCardItems = cards.filter(card => cardCharacters.includes(card.id));
		let selectedCards = [];

		selectedCardItems.forEach((cardData) => {
			selectedCards.push(new Card(cardData));
		});

		let player1Pieces = onitamaStringNotation.substr(5, 10);
		let player2Pieces = onitamaStringNotation.substr(15, 10);

		let convertPlayerPieces = (onitamaStringNotationPlayerPart) => {
			let piecesMap = new Map();
			let chunks = onitamaStringNotationPlayerPart.match(/.{1,2}/g);
			
			chunks.forEach((chunk) => {
				let tileNumber = chunk.charCodeAt(0) - 96;
				let pieceChar = chunk.substr(1)
				let pieceType = pieceChar === pieceChar.toUpperCase() ? 'master' : 'monk';
				piecesMap.set(tileNumber, pieceType);
			});

			return piecesMap;
		};

		let player1PiecesMap = convertPlayerPieces(player1Pieces);
		let player2PiecesMap = convertPlayerPieces(player2Pieces);
		
		return {
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
}