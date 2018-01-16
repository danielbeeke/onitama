import {cards} from './../../data/cards.js';
import {Helpers} from './../core/Helpers.js';
import {Player} from './Player.js';
import {Card} from './Card.js';

export class State {

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
	constructor (board, emitter, onitamaStringNotation = 'abcde.axbxcXdxex.uxvxwXxxyx.1') {
		this.emitter = emitter;
		this.board = board;
		this.deserialize(onitamaStringNotation);
	}

  /**
   * Parse an onitama string notation.
   */
  parseNotation (onitamaStringNotation) {
    onitamaStringNotation = onitamaStringNotation
    .replace(/\./g, '')
    .replace(/ /g, '');

    let cardCharacters = onitamaStringNotation.substr(0, 5).split('');
    let selectedCards = [];

    cardCharacters.forEach((cardCharacter) => {
      let selectedCard = cards.filter(card => card.id === cardCharacter)[0];

      if (selectedCard) {
        selectedCards.push(selectedCard);
      }
    });

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
    };
  }

	/**
	 * Applies an onitama string notation.
	 */
	deserialize (onitamaStringNotation) {
    let stateObject = this.parseNotation(onitamaStringNotation);
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

    this.turnPlayer = stateObject.turnPlayer;
    this.emitter.emit('turn.set', this.turnPlayer);
    this.swapCard = new Card(stateObject.swapCard, this, false);

    this.cards.push(this.swapCard);
    this.swapCard.swap();
	}

	toggleTurnPlayer () {
    this.turnPlayer = this.turnPlayer === 1 ? 2 : 1;
    this.emitter.emit('turn.set', this.turnPlayer);
  }

  /**
   * Serializes the game state into an object.
   */
  serialize () {
    let stateObject = {};

    stateObject.turnPlayer = this.turnPlayer;

    this.cards.forEach((card) => {
      if (card.data.swap) {
        stateObject.swapCard = card.id;
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

    stateObject.player1 = convertPlayer(this.player1);
    stateObject.player2 = convertPlayer(this.player2);

    let onitamaStringNotation = stateObject.player1.cards[0] + stateObject.player1.cards[1];
    onitamaStringNotation += stateObject.player2.cards[0] + stateObject.player2.cards[1];
    onitamaStringNotation += stateObject.swapCard + '.';

    let createPlayerString = (player) => {
      let playerString = '';

      player.pieces.forEach((type, tile) => {
        let typeChar = type === 'master' ? 'X' : 'x';
        playerString += String.fromCharCode(96 + tile) + typeChar;
      });

      return playerString;
    };

    onitamaStringNotation += createPlayerString(stateObject.player2) + '.';
    onitamaStringNotation += createPlayerString(stateObject.player1) + '.' + stateObject.turnPlayer;

    return onitamaStringNotation;
  }
}