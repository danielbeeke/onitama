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
      this.game.emit('tile.click', this);
    });

    this.board.appendChild(this.element);
  }

  setStateClass (key, value) {
    if (value) {
      this.element.classList.add(key);
    }
    else {
      this.element.classList.remove(key);
    }
  }

  set hasPiece (boolean) {
    this.setStateClass('has-piece', boolean);
  }

  set hasHover (boolean) {
    this.setStateClass('hover', boolean);
  }

  set hasHighlight (boolean) {
    this.setStateClass('highlight', boolean);
  }
}