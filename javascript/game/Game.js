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

  init () {
    // Sort cards.
    this.shuffleCards(cards);

    // Pick five cards.
    this.cards = cards.slice(0, 5).map((cardData) => new Card(cardData));
    this.swapCard = this.cards.slice(0, 1);

    // Initiate players.
    this.player1 = new Player(1, [
      new Piece('monk', 1),
      new Piece('monk', 2),
      new Piece('master', 3),
      new Piece('monk', 4),
      new Piece('monk', 5)
    ], this.cards.slice(0, 2));

    this.player2 = new Player(2, [
      new Piece('monk', 21),
      new Piece('monk', 22),
      new Piece('master', 23),
      new Piece('monk', 24),
      new Piece('monk', 25)
    ], this.cards.slice(0, 2));
  }

  transition (definition) {
    console.log(definition.card)
    this['player' + definition.player].pieces[definition.piece].setTile(definition.tile);
  }
}