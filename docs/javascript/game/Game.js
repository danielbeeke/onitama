import {EventEmitter} from '/javascript/core/EventEmitter.js';
import {cards} from '/data/cards.js';
import {Card} from '/javascript/game/Card.js';
import {Player} from '/javascript/game/Player.js';

export class Game extends EventEmitter {
  constructor (selector, options = {}) {
    super();
    this.element = document.querySelector(selector);

    this.tiles = {};

    this.board = document.createElement('div');
    this.board.classList.add('board-grid');
    this.element.appendChild(this.board);

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
    this.shuffleCards(cards);

    this.cards = cards.slice(0, 5).map((cardData) => new Card(cardData.name, cardData.sets, this));
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

  mirrorCoordinate (coordinate) {
    switch (coordinate) {
      case 1:
        coordinate = 5;
        break;
      case 2:
        coordinate = 4;
        break;
      case 4:
        coordinate = 2;
        break;
      case 5:
        coordinate = 1;
        break;
    }

    return coordinate;
  }

  /**
   * Triggered by a player action.
   */
  transition (definition) {
    console.log(definition.player, this);

    let piece = this['player' + definition.player].pieces[definition.piece];
    let currentX = piece.x;
    let currentY = piece.y;

    let sets = this.getCard(definition.card).sets;

    let transitionIsValid = true;

    sets.forEach((set) => {
      let setX = currentX + set.x;
      let setY = currentY + set.y;

      if (definition.player === 1) {
        setX = this.mirrorCoordinate(setX);
        setY = this.mirrorCoordinate(setY);
      }

      if (setX === definition.x && setY === definition.y) {
        transitionIsValid = true;
      }
    });

    if (transitionIsValid) {
      this['player' + definition.player].activeCard = this.getCard(definition.card);
      this['player' + definition.player].activePiece = piece;
      this['player' + definition.player].pieces[definition.piece].setPosition(definition.x, definition.y);
      this.activePlayer = this.activePlayer === 2 ? 1 : 2;
      document.body.dataset.activePlayer = this.activePlayer;
      this.emit('transition', definition);
    }
    else {
      console.log('invalid definition', definition);
      console.log(piece);
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
   * Deserialize the game state.
   */
  deserialize (state) {
    this.cards = [];
    let cardData1 = cards.filter((cardData) => cardData.name === state.player1.card1)[0];
    let cardData2 = cards.filter((cardData) => cardData.name === state.player1.card2)[0];
    let cardData3 = cards.filter((cardData) => cardData.name === state.player2.card1)[0];
    let cardData4 = cards.filter((cardData) => cardData.name === state.player2.card2)[0];
    let cardData5 = cards.filter((cardData) => cardData.name === state.houseCard)[0];

    this.cards.push(new Card(cardData1.name, cardData1.sets, this));
    this.cards.push(new Card(cardData2.name, cardData2.sets, this));
    this.cards.push(new Card(cardData3.name, cardData3.sets, this));
    this.cards.push(new Card(cardData4.name, cardData4.sets, this));
    this.cards.push(new Card(cardData5.name, cardData5.sets, this));

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
   * Fisher-Yates Shuffle.
   */
  shuffleCards (array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  }

  /**
   * Returns a card by name.
   */
  getCard (cardName) {
    return this.cards.filter((card) => card.name === cardName)[0];
  }

}