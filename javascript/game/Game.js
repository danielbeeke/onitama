import {EventEmitter} from '/javascript/core/EventEmitter.js';
import {cards} from '/data/cards.js';
import {Piece} from '/javascript/game/Piece.js';
import {Card} from '/javascript/game/Card.js';
import {Player} from '/javascript/game/Player.js';

export class Game extends EventEmitter {
  constructor () {
    super();
    this.init();
  }

  /**
   * Fisher-Yates (aka Knuth) Shuffle.
   * @param array
   * @returns {*}
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

  getCard (cardName) {
    return this.cards.filter((card) => card.name === cardName)[0];
  }

  init () {
    // Sort cards.
    this.shuffleCards(cards);

    // Pick five cards.
    this.cards = cards.slice(0, 5).map((cardData) => new Card(cardData));
    this.swapCard = this.cards.slice(0, 1);

    // Initiate players.
    this.player1 = new Player(1, [
      new Piece('monk', 1, 1),
      new Piece('monk', 2, 1),
      new Piece('master', 3, 1),
      new Piece('monk', 4, 1),
      new Piece('monk', 5, 1)
    ], this.cards.slice(0, 2));

    this.player2 = new Player(2, [
      new Piece('monk', 1, 5),
      new Piece('monk', 2, 5),
      new Piece('master', 3, 5),
      new Piece('monk', 4, 5),
      new Piece('monk', 5, 5)
    ], this.cards.slice(0, 2));
  }

  transition (definition) {
    let piece = this['player' + definition.player].pieces[definition.piece];
    let currentX = piece.x;
    let currentY = piece.y;

    let sets = this.getCard(definition.card).sets;

    sets.forEach((set) => {
      console.log(set)
    });

    this['player' + definition.player].pieces[definition.piece].setPosition(definition.x, definition.y);
  }
}