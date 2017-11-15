import {EventEmitter} from '/javascript/core/EventEmitter.js';

export class Tile extends EventEmitter {
	constructor (x, y, board) {
		super();
		this.board = board;

	    this.element = document.createElement('div');
	    this.element.classList.add('tile');
	    this.element.classList.add('tile-' + x + '-' + y);

	    this.element.style = `grid-area: ${y} / ${x} / ${y} / ${x};`;

	    ['click', 'mouseenter', 'mouseleave'].forEach((eventName) => {
		    this.element.addEventListener(eventName, (event) => {
          this.board.emit('tile.' + eventName, this);
		    });
	    });

	    this.board.element.appendChild(this.element);
	}

	highlight () {
	  this.highlighted = true;
    this.element.classList.add('highlight');
  }

  dim () {
    this.highlighted = false;
    this.element.classList.remove('highlight');
  }
}