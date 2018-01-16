export class Tile {

  /**
   * Tiles are on a board. They belong to a board.
   */
	constructor (x, y, board) {
		this.board = board;

    this.element = document.createElement('div');
    this.element.classList.add('tile');
    this.element.classList.add('tile-' + x + '-' + y);
    this.x = x;
    this.y = y;

    this.element.style = `grid-area: ${y} / ${x} / ${y} / ${x};`;

    ['click', 'mouseenter', 'mouseleave'].forEach((eventName) => {
      this.element.addEventListener(eventName, (event) => {
        this.board.emitter.emit('tile.' + eventName, this);
      });
    });

    this.board.element.appendChild(this.element);
	}

  /**
   * Highlight the tile.
   */
	highlight () {
	  this.highlighted = true;
    this.element.classList.add('highlight');
  }

  /**
   * Dim the tile.
   */
  dim () {
    this.highlighted = false;
    this.element.classList.remove('highlight');
  }
}