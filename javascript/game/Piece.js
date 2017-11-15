import {EventEmitter} from '/javascript/core/EventEmitter.js';

export class Piece extends EventEmitter {
	constructor (type, x, y, board, player) {
		super();

		this.data = {};

		this.type = type;
		this.board = board;
    this.element = document.createElement('div');
    this.player = player;
    this.element.classList.add('piece');
    this.element.classList.add(this.type);
    this.x = x;
    this.y = y;

    ['click', 'mouseenter', 'mouseleave'].forEach((eventName) => {
      this.element.addEventListener(eventName, (event) => {
        this.board.emit('piece.' + eventName, this);
      });
    });

    this.board.element.appendChild(this.element);
	}

	set player (player) {
	  this.data.player = player;
    this.element.classList.add('owner-' + this.player.id);
  }

  get player () {
	  return this.data.player;
  }

	set x (x) {
    this.data.x = x;
    this.element.style = `grid-area: ${this.data.y} / ${this.data.x} / ${this.data.y} / ${this.data.x};`;
  }

  set y (y) {
    this.data.y = y;
    this.element.style = `grid-area: ${this.data.y} / ${this.data.x} / ${this.data.y} / ${this.data.x};`;
  }
}