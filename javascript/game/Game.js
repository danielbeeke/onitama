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
    this.state = emptyState;

    this.attachEvents();
  }

  attachEvents () {

    // Tiles.
    this.board.on('tile.click', (tile) => {
      // console.log(tile)
    });

    this.board.on('tile.mouseenter', (tile) => {
      // console.log(tile)
    });

    this.board.on('tile.mouseleave', (tile) => {
      // console.log(tile)
    });

    // Pieces.
    this.board.on('piece.click', (piece) => {
      if (this.state.turnPlayer === 1 && piece.player.id === 1) {
        this.board.player1.pieces.forEach((innerPiece) => {
          if (innerPiece !== piece) { innerPiece.deselect() }
        });
        piece.data.selected === true ? piece.deselect() : piece.select();
        this.updateHighLights();
      }
    });

    this.board.on('piece.mouseenter', (piece) => {
      if (this.state.turnPlayer === 1 && piece.player.id === 1) {
        if (!this.board.player1.activePiece) {
          this.board.player1.activePiece = piece;
        }
        this.updateHighLights();
      }
    });

    this.board.on('piece.mouseleave', (piece) => {
      if (this.state.turnPlayer === 1 && piece.player.id === 1) {
        if (this.board.player1.activePiece === piece && !piece.data.selected) {
          this.board.player1.activePiece = false;
        }
        this.updateHighLights();
      }
    });

    // Cards.
    this.board.on('card.click', (card) => {
      if (this.state.turnPlayer === 1 && card.player.id === 1 && !card.data.swap) {
        this.board.cards.forEach((innerCard) => {
          if (innerCard !== card) { innerCard.deselect() }
        });
        card.data.selected === true ? card.deselect() : card.select();
        this.updateHighLights();
      }
    });

    this.board.on('card.mouseenter', (card) => {
      if (this.state.turnPlayer === 1 && card.player.id === 1 && !card.data.swap) {
        if (!this.board.player1.activeCard) {
          this.board.player1.activeCard = card;
        }
        this.updateHighLights();
      }
    });

    this.board.on('card.mouseleave', (card) => {
      if (this.board.player1.activeCard === card && !card.data.selected) {
        this.board.player1.activeCard = false;
      }
      this.updateHighLights();
    });
  }

  updateHighLights () {
    this.board.tiles.forEach((tile) => {
      if (tile.highlighted === true) {
        tile.dim();
      }
    });

    if (this.board.player1.activePiece && this.board.player1.activeCard) {
      let tilesToHighLight = this.getHighlightTilesByPieceAndCard(this.board.player1.activePiece, this.board.player1.activeCard);

      tilesToHighLight.forEach((tile) => {
        tile.highlight();
      });
    }
  }

  getHighlightTilesByPieceAndCard (piece, card) {
    let highlightTiles = [];

    card.sets.forEach((set) => {
      let setX = piece.x + set.x;
      let setY = piece.y + set.y;

      if (piece.player.id === 1) {
        setX = Helpers.flipCoordinate(setX);
        setY = Helpers.flipCoordinate(setY);
      }

      // When on the board.
      if (setX > 0 && setY > 0 && setX < 6 && setY < 6) {
        let isValid = true;
        this.board.player1.pieces.forEach((piece) => {
          if (piece.x === setX && piece.y === setY) {
            isValid = false;
          }
        });

        if (isValid) {
          highlightTiles.push(this.board.tiles.get(setX + '-' + setY));
        }
      }
    });

    return highlightTiles;
  }
}