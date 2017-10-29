export class Card {
  constructor (name, sets, game) {
    this.name = name;
    this.sets = sets;
    this.game = game;
    this.ownerId = false;
    this.delta = false;

    this.element = document.createElement('div');
    let inner = `<h3 class="title">${this.name}</h3><div class="mini-board"><div class="self" style="grid-area: 3 / 3 / 3 / 3;"></div>`;

    this.sets.forEach((set) => {
      let x = set.x + 3;
      let y = set.y + 3;

      inner += `<div class="set" data-x="${x}" data-y="${y}" style="grid-area: ${y} / ${x} / ${y} / ${x};"></div>`;
    });

    inner += '</div>';

    this.element.innerHTML = inner;
    this.element.classList.add('card');

    this.game.element.appendChild(this.element);
    let miniBoard = this.element.querySelector('.mini-board');

    for (let y = 1; y < 6; y++) {
      for (let x = 1; x < 6; x++) {
        let tile = document.createElement('div');
        tile.dataset.x = x;
        tile.dataset.y = y;
        tile.classList.add('tile');
        tile.style = `grid-area: ${y} / ${x} / ${y} / ${x};`;
        miniBoard.appendChild(tile);
      }
    }

    this.element.addEventListener('click', () => {
      // Only if the cards is owned the local player.
      if (this.ownerId === this.game.activePlayer) {
        this.game['player' + this.ownerId].cards.forEach((card) => {
          if (card.name !== this.name) {
            card.element.classList.remove('selected');
          }
        });

        // Clicking to deselect.
        if (this.game['player' + this.ownerId].activeCard === this) {
          this.element.classList.remove('selected');
          this.game['player' + this.ownerId].activeCard = false;
        }

        // Selected a new card.
        else {
          this.game['player' + this.ownerId].activeCard = this;
          this.element.classList.add('selected');
        }
      }
    });
  }

  setDelta (delta = false) {
    this.delta = delta;
    this.element.dataset.delta = this.delta;
  }

  setOwner (owner = false) {
    if (owner) {
      this.ownerId = owner.id;
    }
    else {
      this.ownerId = false;
    }

    this.element.dataset.owner = this.ownerId;
  }
}