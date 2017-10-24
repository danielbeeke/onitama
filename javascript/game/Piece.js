export class Piece {
  constructor (type, x, y, player, game) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.player = player;
    this.game = game;

    this.element = document.createElement('div');
    this.element.dataset.x = x;
    this.element.dataset.y = y;
    this.element.classList.add('piece');
    this.element.classList.add(this.type);
    this.element.style = `grid-area: ${y} / ${x} / ${y} / ${x};`;
    this.game.board.appendChild(this.element);

    this.element.addEventListener('mouseenter', () => {
      // console.log('enter')
    });

    this.element.addEventListener('mouseleave', () => {
      // console.log('leave')
    });
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
    this.element.style = `grid-area: ${y} / ${x} / ${y} / ${x};`;
  }
}