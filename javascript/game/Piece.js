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
      if (this.player.activeCard) {
        this.player.activeCard.sets.forEach((set) => {
          let x = this.x + set.x;
          let y = this.y + set.y;

          // When on the board.
          if (x > 0 && y > 0 && x < 6 && y < 6) {
            this.game.tiles[x + '-' + y].classList.add('hover');
          }
        });
      }
    });

    this.element.addEventListener('mouseleave', () => {
      let hoverTiles = this.game.board.querySelectorAll('.tile.hover');

      Array.from(hoverTiles).forEach((hoverTile) => {
        hoverTile.classList.remove('hover');
      })
    });

    this.element.addEventListener('click', () => {
      // console.log('leave')
    });
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
    this.element.style = `grid-area: ${y} / ${x} / ${y} / ${x};`;
  }
}