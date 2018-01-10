export class Piece {

  /**
   * A piece can be a monk or a master.
   */
	constructor (type, x, y, state, player) {
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
        this.state.emitter.emit('piece.' + eventName, this);
      });
    });

    this.state.board.element.appendChild(this.element);
	}

  /**
   * Set the owner of the piece.
   */
	set player (player) {
	  this.data.player = player;
    this.element.classList.add('owner-' + this.player.id);
  }

  /**
   * Return the owner.
   */
  get player () {
	  return this.data.player;
  }

  /**
   * Return the x coordinate of the tile the piece is on.
   */
  get x () {
	  return this.data.x;
  }

  /**
   * Set the x coordinate of the tile the piece is on.
   * Also update the style.
   */
  set x (x) {
    this.data.x = x;
    this.updateCss();
  }

  /**
   * Return the y coordinate of the tile the piece is on.
   */
  get y () {
    return this.data.y;
  }

  /**
   * Set the y coordinate of the tile the piece is on.
   * Also update the style.
   */
  set y (y) {
    this.data.y = y;
    this.updateCss();
  }

  updateCss () {
    this.element.style = `left: ${(this.data.x - 1) * 20}%; top: ${(this.data.y - 1) * 20}%;`;
    this.element.classList.add('moving');

    setTimeout(() => {
      this.element.classList.remove('moving');
    }, 500);
  }

  /**
   * Select this piece, update that state into the player.
   */
  select () {
	  this.player.activePiece = this;
    this.data.selected = true;
    this.element.dataset.selected = true;
  }

  /**
   * Deselect this piece, update that state into the player.
   */
  deselect () {
    this.player.activePiece = false;
    this.data.selected = false;
    this.element.dataset.selected = false;
  }

  capture () {
    this.x = -1;
    this.y = -1;
    this.element.remove();

    if (this.type === 'master') {
      this.state.emitter.emit('player.defeated', this.player);
    }
  }
}