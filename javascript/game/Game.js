import {Board} from '/javascript/game/Board.js';
import {State} from '/javascript/game/State.js';
import {Audio} from '/javascript/game/Audio.js';
import {TextScreen} from '/javascript/game/TextScreen.js';

export class Game {

  /**
   * Start a new game with a div selector and an outside emitter.
   * This way we can recycle the emitter for all things inside this app.
   */
  constructor (selector, emitter, role, onitamaStringNotation = null) {
    this.emitter = emitter;
    this.role = role;
    this.localPlayerId = this.role === 'answerer' ? 2 : 1;

    this.element = document.querySelector(selector);
    this.element.innerHTML = '';
    if (!this.element) { throw 'No element found for the onitama game'; }
    this.element.classList.add('onitama');
    this.boardElement = document.createElement('div');
    this.element.appendChild(this.boardElement);
    this.board = new Board(this.boardElement, this.emitter);
    this.audio = new Audio(this.emitter);

    if (onitamaStringNotation) {
      this.state = new State(this.board, this.emitter, onitamaStringNotation);
    }
    else {
      this.state = new State(this.board, this.emitter);
    }
    this.board.setState(this.state);

    this.attachEvents();
  }

  externalTurn (turnData) {
    let usedTile = this.board.tiles.get(turnData.tileX + '-' + turnData.tileY);
    let activePlayer = this.state['player' + this.state.turnPlayer];
    let usedPiece = activePlayer.pieces.find(piece => piece.x === turnData.pieceX && piece.y === turnData.pieceY);
    let usedCard = activePlayer.cards.find(card => card.name === turnData.card);

    if (usedCard && usedPiece && usedTile) {
      usedCard.select();
      usedPiece.select();
      usedTile.highlight();
      this.emitter.emit('tile.click', usedTile, true);
    }
  }

  winner () {
    new TextScreen('Winner!', 1000,'textscreen', () => {
      window.location.reload(false);
    });
  }

  loser () {
    new TextScreen('Loser!', 1000, 'textscreen', () => {
      window.location.reload(false);
    });
  }

  /**
   * Reacts on the emitter. This is the main game logic.
   */
  attachEvents () {
    // On turn set.
    this.emitter.on('turn.set', (activePlayerId) => {
      this.boardElement.dataset.activePlayer = activePlayerId;
    });

    this.emitter.on('turn', (usedPiece, tile, usedCard, oldX, oldY, isExternal) => {
      if (tile.x === 3 && tile.y === 1) {
        if (usedPiece.player.id === this.localPlayerId) {
          this.winner();
        }
        else {
          this.loser();
        }
      }

      if (tile.x === 3 && tile.y === 5) {
        if (usedPiece.player.id === this.localPlayerId) {
          this.winner();
        }
        else {
          this.loser();
        }
      }
    });

    this.emitter.on('player.defeated', (piece) => {
      if (piece.player.id === this.localPlayerId) {
        this.loser();
      }

      else {
        this.winner();
      }
    });

    this.emitter.on('piece.captured', (piece) => {
      if (piece.player.id === this.localPlayerId) {
        new TextScreen('Oops!', 300, 'capture');
      }

      else {
        new TextScreen('Woop woop!', 300, 'capture');
      }
    });

    // Tiles.
    this.emitter.on('tile.click', (tile, isExternal = false) => {
      if (tile.highlighted === true) {
        let activePlayer = this.state['player' + this.state.turnPlayer];
        let usedCard;

        if (activePlayer.activeCard) {
          usedCard = activePlayer.activeCard;
          this.animateCardSwap(activePlayer.activeCard);
          activePlayer.activeCard.deselect();
          activePlayer.activeCard = false;
        }

        // This reduces the turn clicks from three to two.
        else {
          let overLeapingCards = 0;
          let possibleCard = null;
          activePlayer.cards.forEach((card) => {
            if (!card.data.swap) {
              let tilesToHighLight = this.getHighlightTilesByPieceAndCard(activePlayer.activePiece, card);

              tilesToHighLight.forEach((tileToHighLight) => {
                if (tileToHighLight === tile) {
                  overLeapingCards++;
                  possibleCard = card;
                }
              });
            }
          });

          // The used tiles was possible with both cards.
          if (overLeapingCards > 1) {
            this.openChoosePopup(tile);
            return;
          }
          else {
            usedCard = possibleCard;
            this.animateCardSwap(possibleCard);
          }
        }

        // Check if a piece was captured.
        let oppositePlayerId = this.state.turnPlayer === 1 ? 2 : 1;
        let oppositePlayer = this.state['player' + oppositePlayerId];

        oppositePlayer.pieces.forEach((piece) => {
          if (piece.x === tile.x && piece.y === tile.y) {
            piece.capture();
          }
        });

        let usedPiece = activePlayer.activePiece;

        let oldX = usedPiece.x;
        let oldY = usedPiece.y;

        activePlayer.activePiece.y = tile.y;
        activePlayer.activePiece.x = tile.x;
        activePlayer.activePiece.deselect();
        activePlayer.activePiece = false;

        this.updateHighLights();

        this.emitter.emit('turn', usedPiece, tile, usedCard, oldX, oldY, isExternal);

        this.state.toggleTurnPlayer();
      }
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
   * When only using a selected piece and a click on a tile to move, it can happen both cards can get the piece there.
   * Than we use this wizard to let the player choose.
   */
  openChoosePopup (tile) {
    let activePlayer = this.state['player' + this.state.turnPlayer];
    let wizard = document.createElement('div');
    wizard.classList.add('card-choose-wizard');
    wizard.classList.add('fade-in');

    activePlayer.cards.forEach((card) => {
      if (!card.data.swap) {
        let cardClone = card.element.cloneNode(true);
        cardClone.style = `
          width: ${card.element.offsetWidth}px; 
          height: ${card.element.offsetHeight}px;
        `;

        wizard.appendChild(cardClone);

        cardClone.addEventListener('click', () => {
          activePlayer.activeCard = card;
          wizard.classList.add('fade-in');

          setTimeout(() => {
            this.emitter.emit('tile.click', tile);
            wizard.remove();
          }, 300);
        });
      }
    });

    this.board.element.appendChild(wizard);
    setTimeout(() => {
      wizard.classList.remove('fade-in');
    }, 200);
  }

  /**
   * This animates the swapping of a card.
   */
  animateCardSwap (card) {
    let transition = 'transition: all .4s ease-in-out';
    let swapDeck = this.board.swapDeck;
    let activePlayer = this.state['player' + this.state.turnPlayer];
    let playerDeck = this.board['player' + this.state.turnPlayer + 'Deck'];

    let swapPosition = 0;

    playerDeck.childNodes.forEach((deckCard, delta) => {
      if (deckCard === card.element) {
        swapPosition = delta;
      }
    });

    let temporaryPlaceholder1 = document.createElement('div');
    temporaryPlaceholder1.classList.add('card');
    temporaryPlaceholder1.classList.add('invisible');
    temporaryPlaceholder1.classList.add('item-1');
    card.element.parentNode.insertBefore(temporaryPlaceholder1, card.element);

    card.element.classList.add('animating');

    card.element.remove();

    let position1 = temporaryPlaceholder1.getBoundingClientRect();

    card.element.style = `
      top: ${position1.top}px; 
      left: ${position1.left}px;
      width: ${position1.width}px; 
      height: ${position1.height}px;
      ${transition};
      position: fixed;
    ` + (this.state.turnPlayer === 1 && this.role === 'initiator' || this.state.turnPlayer === 2 && this.role === 'answerer' ? 'transform: rotate(0deg);' : 'transform: rotate(180deg);');

    this.boardElement.appendChild(card.element);

    let temporaryPlaceholder2 = document.createElement('div');
    temporaryPlaceholder2.classList.add('card');
    temporaryPlaceholder2.classList.add('invisible');
    temporaryPlaceholder2.classList.add('item-2');
    swapDeck.insertBefore(temporaryPlaceholder2, swapDeck.firstChild);

    this.state.swapCard.element.classList.add('animating');
    this.state.swapCard.element.remove();

    let position2 = temporaryPlaceholder2.getBoundingClientRect();

    this.state.swapCard.element.style = `
      top: ${position2.top}px;
      left: ${position2.left}px;
      width: ${position2.width}px;
      height: ${position2.height}px;
      ${transition};
      position: fixed;
    ` + (this.state.turnPlayer === 1 && this.role === 'initiator' || this.state.turnPlayer === 2 && this.role === 'answerer' ? 'transform: rotate(0deg);' : 'transform: rotate(180deg);');

    this.boardElement.appendChild(this.state.swapCard.element);

    setTimeout(() => {
      let onTransitionEnd = () => {
        this.state.swapCard.element.removeEventListener('transitionend', onTransitionEnd);
        swapDeck.appendChild(card.element);
        playerDeck.appendChild(this.state.swapCard.element);

        temporaryPlaceholder1.remove();
        temporaryPlaceholder2.remove();

        card.element.classList.remove('animating');
        this.state.swapCard.element.classList.remove('animating');
        card.element.style = '';
        this.state.swapCard.element.style = '';

        this.state.swapCard.unswap(activePlayer, swapPosition);
        card.swap();

        card.player = false;
      };

      this.state.swapCard.element.addEventListener('transitionend', onTransitionEnd);

      card.element.style = `
      top: ${position2.top}px; 
      left: ${position2.left}px;
      width: ${position2.width}px; 
      height: ${position2.height}px;
      ${transition};
      position: fixed;
    ` + (this.state.turnPlayer === 1 && this.role === 'initiator' || this.state.turnPlayer === 2 && this.role === 'answerer' ? 'transform: rotate(0deg);' : 'transform: rotate(180deg);');

      this.state.swapCard.element.style = `
      top: ${position1.top}px;
      left: ${position1.left}px;
      width: ${position1.width}px;
      height: ${position1.height}px;
      ${transition};
      position: fixed;
    ` + (this.state.turnPlayer === 1 && this.role === 'initiator' || this.state.turnPlayer === 2 && this.role === 'answerer' ? 'transform: rotate(180deg);' : 'transform: rotate(0deg);');

    }, 100);
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

    // This reduces the turn clicks from three to two.
    else if (activePlayer.activePiece && !activePlayer.activeCard) {
      activePlayer.cards.forEach((card) => {
        if (!card.data.swap) {
          let tilesToHighLight = this.getHighlightTilesByPieceAndCard(activePlayer.activePiece, card);

          tilesToHighLight.forEach((tile) => {
            tile.highlight();
          });
        }
      });
    }
  }

  /**
   * A card has possible moves. This returns the tiles that need to be highlighted by a card.
   */
  getHighlightTilesByPieceAndCard (piece, card) {
    let highlightTiles = [];
    let activePlayer = piece.player;

    card.sets.forEach((set) => {
      let setX = piece.x + set.x;
      let setY = piece.y + set.y;

      if (activePlayer.id === 2) {
        setY = piece.y - set.y;
        setX = piece.x - set.x;
      }

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