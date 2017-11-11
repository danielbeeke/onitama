import {EventEmitter} from '/javascript/core/EventEmitter.js';
import {cards} from '/data/cards.js';
import {Card} from '/javascript/game/Card.js';
import {Player} from '/javascript/game/Player.js';
import {Helpers} from '/javascript/core/Helpers.js';

export class Game extends EventEmitter {
  constructor (selector, options = {}) {
    super();
    this.element = document.querySelector(selector);

    this.tiles = {};

    this.board = document.createElement('div');
    this.board.classList.add('board-grid');
    this.element.appendChild(this.board);

    this.turn = document.createElement('h4');
    this.turn.innerText = 'Your turn';
    this.turn.classList.add('turn-text');
    this.turn.classList.add('player2');
    this.element.appendChild(this.turn);

    this.turn = document.createElement('h4');
    this.turn.innerText = 'Opponents turn';
    this.turn.classList.add('turn-text');
    this.turn.classList.add('player1');
    this.element.appendChild(this.turn);


    for (let y = 1; y < 6; y++) {
      for (let x = 1; x < 6; x++) {
        let tile = document.createElement('div');
        tile.dataset.x = x;
        tile.dataset.y = y;
        tile.classList.add('tile');
        tile.style = `grid-area: ${y} / ${x} / ${y} / ${x};`;
        this.board.appendChild(tile);
        tile.addEventListener('click', (event) => {
          this.emit('tile-click', tile);
        });
        this.tiles[x + '-' + y] = tile;
      }
    }

    if (options.state) {
      this.deserialize(options.state);
    }
    else {
      this.newGame();
    }
  }

  newGame () {
    // Sort cards.
    Helpers.fisherYatesShuffle(cards);

    this.cards = cards.slice(0, 5).map((cardData) => new Card(cardData.name, cardData.sets, cardData.color, this));
    this.cards.slice(4, 5)[0].setOwner(false);

    this.activePlayer = 2;
    document.body.dataset.activePlayer = this.activePlayer;

    // Initiate players.
    this.player1 = new Player(1, this.cards.slice(0, 2), this);
    this.player1.addPieces([
      { type: 'monk', x: 5, y: 1 },
      { type: 'monk', x: 4, y: 1 },
      { type: 'master', x: 3, y: 1 },
      { type: 'monk', x: 2, y: 1 },
      { type: 'monk', x: 1, y: 1 },
    ]);

    this.player2 = new Player(2, this.cards.slice(2, 4), this);
    this.player2.addPieces([
      { type: 'monk', x: 1, y: 5 },
      { type: 'monk', x: 2, y: 5 },
      { type: 'master', x: 3, y: 5 },
      { type: 'monk', x: 4, y: 5 },
      { type: 'monk', x: 5, y: 5 },
    ]);
  }


  /**
   * Triggered by a player action.
   */
  transition (definition) {
    let piece = this['player' + definition.player].pieces[definition.piece];
    let currentX = piece.x;
    let currentY = piece.y;

    let sets = this.getCard(definition.card).sets;

    let transitionIsValid = true;

    sets.forEach((set) => {
      let setX = currentX + set.x;
      let setY = currentY + set.y;

      if (definition.player === 1) {
        setX = Helpers.flipCoordinate(setX);
        setY = Helpers.flipCoordinate(setY);
      }

      if (setX === definition.x && setY === definition.y) {
        transitionIsValid = true;
      }
    });

    if (transitionIsValid) {
      this['player' + definition.player].activeCard = this.getCard(definition.card);
      this['player' + definition.player].activePiece = piece;
      this['player' + definition.player].pieces[definition.piece].setPosition(definition.x, definition.y);

      let otherPlayer = definition.player === 2 ? 1 : 2;

      this['player' + otherPlayer].pieces.forEach((piece) => {
        if (piece.x === definition.x && piece.y === definition.y) {
          piece.capture();
        }
      });

      this.activePlayer = this.activePlayer === 2 ? 1 : 2;
      document.body.dataset.activePlayer = this.activePlayer;
      this.emit('transition', definition);
    }
  }

  /**
   * Serializes the game state into an object.
   */
  serialize () {
    let state = {};

    state.activePlayer = this.activePlayer;

    this.cards.forEach((card) => {
      if (!card.ownerId) {
        state.houseCard = card.name;
      }
    });

    state.player1 = {
      card1: this.player1.cards[0].name,
      card2: this.player1.cards[1].name,
      pieces: []
    };

    this.player1.pieces.forEach((piece) => {
      state.player1.pieces.push({
        type: piece.type,
        x: piece.x,
        y: piece.y,
        index: piece.index,
      });
    });

    state.player2 = {
      card1: this.player2.cards[0].name,
      card2: this.player2.cards[1].name,
      pieces: []
    };

    this.player2.pieces.forEach((piece) => {
      state.player2.pieces.push({
        type: piece.type,
        x: piece.x,
        y: piece.y,
        index: piece.index,
      });
    });

    return state;
  }

  /**
   * Flips the players needed for network play.
   */
  flipState (state) {
    // We need to flip al the player things.
    let player2Card1 = state.player1.card1;
    let player2Card2 = state.player1.card2;

    state.player1.card1 = state.player2.card1;
    state.player1.card2 = state.player2.card2;

    state.player2.card1 = player2Card1;
    state.player2.card2 = player2Card2;

    state.activePlayer = state.activePlayer === 2 ? 1 : 2;
  }

  /**
   * Deserialize the game state.
   */
  deserialize (state) {
    this.cards = [];
    let cardData1 = cards.filter((cardData) => cardData.name === state.player1.card1)[0];
    let cardData2 = cards.filter((cardData) => cardData.name === state.player1.card2)[0];
    let cardData3 = cards.filter((cardData) => cardData.name === state.player2.card1)[0];
    let cardData4 = cards.filter((cardData) => cardData.name === state.player2.card2)[0];
    let cardData5 = cards.filter((cardData) => cardData.name === state.houseCard)[0];

    this.cards.push(new Card(cardData1.name, cardData1.sets, cardData1.color, this));
    this.cards.push(new Card(cardData2.name, cardData2.sets, cardData2.color, this));
    this.cards.push(new Card(cardData3.name, cardData3.sets, cardData3.color, this));
    this.cards.push(new Card(cardData4.name, cardData4.sets, cardData4.color, this));
    this.cards.push(new Card(cardData5.name, cardData5.sets, cardData5.color, this));

    this.cards.slice(4, 5)[0].setOwner(false);
    this.activePlayer = state.activePlayer;
    document.body.dataset.activePlayer = this.activePlayer;

    // Initiate players.
    this.player1 = new Player(1, this.cards.slice(0, 2), this);
    this.player1.addPieces(state.player1.pieces);

    this.player2 = new Player(2, this.cards.slice(2, 4), this);
    this.player2.addPieces(state.player2.pieces);
  }

  swapCard (cardToSwap) {
    let oldOwner = cardToSwap.ownerId;
    let oldDelta = cardToSwap.delta;

    this.cards.forEach((card) => {
      if (!card.ownerId) {
        card.setOwner(this['player' + oldOwner]);
        card.setDelta(oldDelta);
      }
    });

    cardToSwap.setOwner(false);
    cardToSwap.setDelta(false);
  }

  /**
   * Returns a card by name.
   */
  getCard (cardName) {
    return this.cards.filter((card) => card.name === cardName)[0];
  }

}