import {EventEmitter} from '/javascript/core/EventEmitter.js';
import {cards} from '/data/cards.js';
import {Card} from '/javascript/game/Card.js';
import {Player} from '/javascript/game/Player.js';

export class Game extends EventEmitter {
  constructor (selector) {
    super();
    this.element = document.querySelector(selector);

    this.desk1 = document.createElement('div');
    this.desk1.classList.add('desk');
    this.desk1.classList.add('player1');
    this.element.appendChild(this.desk1);

    this.board = document.createElement('div');
    this.board.classList.add('board-grid');
    this.element.appendChild(this.board);

    this.desk2 = document.createElement('div');
    this.desk2.classList.add('desk');
    this.desk2.classList.add('player2');
    this.element.appendChild(this.desk2);

    // Sort cards.
    this.shuffleCards(cards);

    // Pick five cards.
    this.cards = cards.slice(0, 5).map((cardData) => new Card(cardData.name, cardData.sets, this));
    this.swapCard = this.cards.slice(0, 1);

    // Initiate players.
    this.player1 = new Player(1, this.cards.slice(0, 2), this);
    this.player1.addPieces([
      { type: 'monk', x: 1, y: 1 },
      { type: 'monk', x: 2, y: 1 },
      { type: 'master', x: 3, y: 1 },
      { type: 'monk', x: 4, y: 1 },
      { type: 'monk', x: 5, y: 1 },
    ]);

    this.player2 = new Player(2, this.cards.slice(0, 2), this);
    this.player2.addPieces([
      { type: 'monk', x: 1, y: 5 },
      { type: 'monk', x: 2, y: 5 },
      { type: 'master', x: 3, y: 5 },
      { type: 'monk', x: 4, y: 5 },
      { type: 'monk', x: 5, y: 5 },
    ]);


    for (let y = 1; y < 6; y++) {
      for (let x = 1; x < 6; x++) {
        let tile = document.createElement('div');
        tile.dataset.x = x;
        tile.dataset.y = y;
        tile.classList.add('tile');
        tile.style = `grid-area: ${y} / ${x} / ${y} / ${x};`;
        this.board.appendChild(tile);
      }
    }
  }

  /**
   * Triggered by a player action.
   */
  transition (definition) {
    let piece = this['player' + definition.player].pieces[definition.piece];
    let currentX = piece.x;
    let currentY = piece.y;

    let sets = this.getCard(definition.card).sets;

    let transitionIsValid = false;

    sets.forEach((set) => {
      let setX = currentX + set.x;
      let setY = currentY + set.y;

      if (setX === definition.x && setY === definition.y) {
        transitionIsValid = true;
      }
    });

    if (transitionIsValid) {
      this['player' + definition.player].pieces[definition.piece].setPosition(definition.x, definition.y);
    }
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