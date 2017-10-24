export class Piece {
  constructor (type, x, y, player, board) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.player = player;
    this.board = board;

    this.element = document.createElement('div');
    this.element.dataset.x = x;
    this.element.dataset.y = y;
    this.element.classList.add('piece');
    this.element.classList.add(this.type);
    this.element.style = `grid-area: ${y} / ${x} / ${y} / ${x};`;
    this.board.element.appendChild(this.element);
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
    this.element.style = `grid-area: ${y} / ${x} / ${y} / ${x};`;
  }
}