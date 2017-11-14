import {EventEmitter} from '/javascript/core/EventEmitter.js';

export class Card extends EventEmitter {

	constructor (data, board, player) {
		super();
		Object.assign(this, data);
    this.element = document.createElement('div');
    this.element.classList.add('card');
    this.element.classList.add(this.name.toLowerCase());
    this.board = board;

    this.data = {};
		this.sets = new Set(data.sets);
		this.player = player;

    ['click', 'mouseenter', 'mouseleave'].forEach((eventName) => {
      this.element.addEventListener(eventName, (event) => {
        this.board.emit('card.' + eventName, this);
      });
    });
	}

	swap () {
    let oppositePlayerId = this.player.id === 1 ? 2 : 1;
    this.player = this.board['player' + oppositePlayerId];
    this.element.dataset.swap = true;

    this.board.cards.forEach((card) => {
      if (card !== this) {
        card.element.dataset.swap = false;
      }
    });
  }

	set player (player) {
	  this.data.player = player;
    this.element.dataset.owner = this.player.id;
    this.board['player' + this.player.id + 'Deck'].appendChild(this.element);
  }

  get player () {
	  return this.data.player;
  }
}