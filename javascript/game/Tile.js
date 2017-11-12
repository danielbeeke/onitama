import {EventEmitter} from '/javascript/core/EventEmitter.js';

export class Tile extends EventEmitter {
  constructor (x, y, game) {
    super();

    this.game = game;
    this.board = this.game.board;

    this.element = document.createElement('div');
    this.element.dataset.x = x;
    this.element.dataset.y = y;
    this.element.classList.add('tile');
    this.element.style = `grid-area: ${y} / ${x} / ${y} / ${x};`;
    this.element.addEventListener('click', (event) => {
      this.game.emit('tile-click', this.element);
    });

    this.board.appendChild(this.element);
  }

  set hasPiece (boolean) {
    if (boolean) {
      this.element.classList.add('has-piece');
    }
    else {
      this.element.classList.remove('has-piece');
    }
  }

  set hasHover (boolean) {
    if (boolean) {
      this.element.classList.add('hover');
    }
    else {
      this.element.classList.remove('hover');
    }
  }

  set hasHighlight (boolean) {
    if (boolean) {
      this.element.classList.add('highlight');
    }
    else {
      this.element.classList.remove('highlight');
    }
  }
}