export class Piece {
  constructor (type, x, y, player, game, index) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.player = player;
    this.game = game;
    this.index = index;

    this.element = document.createElement('div');
    this.element.dataset.x = x;
    this.element.dataset.y = y;
    this.element.classList.add('piece');
    this.element.classList.add(this.type);
    this.element.style = `grid-area: ${y} / ${x} / ${y} / ${x};`;
    this.game.board.appendChild(this.element);

    this.game.on('tile-click', (tile) => {
      if (this.player.activePiece === this && this.player.activeCard) {
        this.player.activeCard.sets.forEach((set) => {
          let x = this.x + set.x;
          let y = this.y + set.y;

          if (parseInt(tile.dataset.x) === x && parseInt(tile.dataset.y) === y) {
            this.game.transition({
              player: this.player.id,
              piece: this.index,
              card: this.player.activeCard.name,
              x: x,
              y: y
            });
          }
        });
      }
    });

    this.element.addEventListener('mouseenter', () => {
      if (this.game.activePlayer !== player.id) { return; }

      // Hover actions while having no selected piece but a selected card.
      if (!this.player.activePiece && this.player.activeCard) {
        this.highlightCard(this.player.activeCard);
      }
    });

    this.element.addEventListener('mouseleave', () => {
      if (!this.player.activePiece) {
        this.removeHoverAndHighlights();
      }
    });

    this.element.addEventListener('click', () => {
      // Click to remove selection.
      if (this.player.activePiece && this.player.activePiece === this) {
        this.clickToRemoveSelection();
      }
      else {
        // Clean up dangling highlights.
        this.removeHoverAndHighlights();

        if (this.player.activeCard) {
          this.highlightCard(this.player.activeCard);
        }

        // Cleaning up old active piece.
        if (this.player.activePiece) {
          this.player.activePiece.element.classList.remove('selected');
        }

        // Setting the new context.
        this.player.activePiece = this;
        this.element.classList.add('selected');
      }
    });
  }

  clickToRemoveSelection () {
    this.player.activePiece.element.classList.remove('selected');
    this.player.activePiece = false;
    this.removeHoverAndHighlights();
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
    this.element.style = `grid-area: ${y} / ${x} / ${y} / ${x};`;
    this.removeHoverAndHighlights();
    if (this.player.activeCard) {
      this.player.activeCard.element.classList.remove('selected');
      this.game.swapCard(this.player.activeCard);
      this.player.activeCard = false;
    }

    if (this.player.activePiece) {
      this.player.activePiece.element.classList.remove('selected');
      this.player.activePiece = false;
    }
  }

  highlightCard (card) {
    this.game.tiles[this.x + '-' + this.y].classList.add('hover');

    card.sets.forEach((set) => {
      let x = this.x + set.x;
      let y = this.y + set.y;

      // When on the board.
      if (x > 0 && y > 0 && x < 6 && y < 6) {
        this.game.tiles[x + '-' + y].classList.add('highlight');
      }
    });
  }

  removeHoverAndHighlights() {
    let tiles = this.game.board.querySelectorAll('.tile');

    Array.from(tiles).forEach((tile) => {
      tile.classList.remove('hover');
      tile.classList.remove('highlight');
    })
  }
}