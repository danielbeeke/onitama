import {EventEmitter} from '/javascript/core/EventEmitter.js';

export class Piece extends EventEmitter {
	constructor (type, x, y, state, player) {
		super();

		this.data = {};

		this.type = type;
		this.state = state;
    this.element = document.createElement('div');
    this.player = player;
    this.element.classList.add('piece');
    this.element.classList.add(this.type);
    this.x = x;
    this.y = y;

    ['click', 'mouseenter', 'mouseleave'].forEach((eventName) => {
      this.element.addEventListener(eventName, (event) => {
        this.state.board.emit('piece.' + eventName, this);
      });
    });

    this.state.board.element.appendChild(this.element);
	}

	set player (player) {
	  this.data.player = player;
    this.element.classList.add('owner-' + this.player.id);
  }

  get player () {
	  return this.data.player;
  }

  get x () {
	  return this.data.x;
  }

	set x (x) {
    this.data.x = x;
    this.element.style = `grid-area: ${this.data.y} / ${this.data.x} / ${this.data.y} / ${this.data.x};`;
  }

  get y () {
    return this.data.y;
  }

  set y (y) {
    this.data.y = y;
    this.element.style = `grid-area: ${this.data.y} / ${this.data.x} / ${this.data.y} / ${this.data.x};`;
  }

  select () {
	  this.player.activePiece = this;
    this.data.selected = true;
    this.element.dataset.selected = true;
  }

  deselect () {
    this.player.activePiece = false;
    this.data.selected = false;
    this.element.dataset.selected = false;
  }
}