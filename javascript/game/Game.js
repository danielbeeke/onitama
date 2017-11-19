import {Board} from '/javascript/game/Board.js';
import {State} from '/javascript/game/State.js';

export class Game {

  /**
   * Start a new game with a div selector and an outside emitter.
   * This way we can recycle the emitter for all things inside this app.
   */
  constructor (selector, emitter, onitamaStringNotation = null) {
    this.emitter = emitter;
    this.element = document.querySelector(selector);
    if (!this.element) { throw 'No element found for the onitama game'; }
    this.element.classList.add('onitama');
    this.boardElement = document.createElement('div');
    this.element.appendChild(this.boardElement);
    this.board = new Board(this.boardElement, this.emitter);

    if (onitamaStringNotation) {
      this.state = new State(this.board, this.emitter, onitamaStringNotation);
    }
    else {
      this.state = new State(this.board, this.emitter);
    }
    this.board.setState(this.state);

    this.attachEvents();
  }

  externalTurn (onitamaStringNotation) {
    this.state.transition(onitamaStringNotation);
  }

  /**
   * Reacts on the emitter. This is the main game logic.
   */
  attachEvents () {

    // Tiles.
    this.emitter.on('tile.click', (tile) => {
      if (tile.highlighted === true) {
        this.state.player1.activePiece.y = tile.y;
        this.state.player1.activePiece.x = tile.x;

        this.state.player1.activePiece.deselect();
        this.state.player1.activeCard.swap();
        this.state.player1.activeCard.deselect();

        this.state.player1.activeCard = false;
        this.state.player1.activePiece = false;

        this.state.turnPlayer = this.state.turnPlayer === 1 ? 2 : 1;
        this.updateHighLights();

        this.emitter.emit('turn');
      }
    });

    this.emitter.on('tile.mouseenter', (tile) => {
      // console.log(tile)
    });

    this.emitter.on('tile.mouseleave', (tile) => {
      // console.log(tile)
    });

    // Pieces.
    this.emitter.on('piece.click', (piece) => {
      if (this.state.turnPlayer === piece.player.id) {
        piece.player.pieces.forEach((innerPiece) => {
          if (innerPiece !== piece) { innerPiece.deselect() }
        });
        piece.data.selected === true ? piece.deselect() : piece.select();
        this.updateHighLights();
      }
    });

    this.emitter.on('piece.mouseenter', (piece) => {
      if (this.state.turnPlayer === piece.player.id) {
        if (!piece.player.activePiece) {
          piece.player.activePiece = piece;
        }
        this.updateHighLights();
      }
    });

    this.emitter.on('piece.mouseleave', (piece) => {
      if (this.state.turnPlayer === piece.player.id) {
        if (piece.player.activePiece === piece && !piece.data.selected) {
          piece.player.activePiece = false;
        }
        this.updateHighLights();
      }
    });

    // Cards.
    this.emitter.on('card.click', (card) => {
      if (this.state.turnPlayer === card.player.id && !card.data.swap) {
        this.state.cards.forEach((innerCard) => {
          if (innerCard !== card) { innerCard.deselect() }
        });
        card.data.selected === true ? card.deselect() : card.select();
        this.updateHighLights();
      }
    });

    this.emitter.on('card.mouseenter', (card) => {
      if (this.state.turnPlayer === card.player.id && !card.data.swap) {
        if (!card.player.activeCard) {
          card.player.activeCard = card;
        }
        this.updateHighLights();
      }
    });

    this.emitter.on('card.mouseleave', (card) => {
      if (card.player.activeCard === card && !card.data.selected) {
        card.player.activeCard = false;
      }
      this.updateHighLights();
    });
  }

  /**
   * This gets called a lot after events, it updates the highlighted tiles.
   */
  updateHighLights () {
    this.board.tiles.forEach((tile) => {
      if (tile.highlighted === true) {
        tile.dim();
      }
    });

    let activePlayer = this.state['player' + this.state.turnPlayer];

    if (activePlayer.activePiece && activePlayer.activeCard) {
      let tilesToHighLight = this.getHighlightTilesByPieceAndCard(activePlayer.activePiece, activePlayer.activeCard);

      tilesToHighLight.forEach((tile) => {
        tile.highlight();
      });
    }
  }

  /**
   * A card has possible moves. This returns the tiles that need to be highlighted by a card.
   */
  getHighlightTilesByPieceAndCard (piece, card) {
    let highlightTiles = [];
    let activePlayer = this.state['player' + this.state.turnPlayer];

    card.sets.forEach((set) => {
      let setX = piece.x + set.x;
      let setY = piece.y + set.y;

      // When on the board.
      if (setX > 0 && setY > 0 && setX < 6 && setY < 6) {
        let isValid = true;
        activePlayer.pieces.forEach((piece) => {
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