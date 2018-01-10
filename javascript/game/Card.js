export class Card {

  /**
   * A card must be initiated with the data out of cards.js. It has possible sets.
   */
	constructor (data, state, player) {
		Object.assign(this, data);
    this.element = document.createElement('div');
    this.element.classList.add('card');
    this.element.classList.add(this.color);
    this.element.classList.add(this.name.toLowerCase());

    let inner = `<div class="mini-board"><div class="self" style="grid-area: 3 / 3 / 3 / 3;"></div>`;

    this.sets.forEach((set) => {
      let x = set.x + 3;
      let y = set.y + 3;
      inner += `<div class="set" data-x="${x}" data-y="${y}" style="grid-area: ${y} / ${x} / ${y} / ${x};"></div>`;
    });

    inner += `</div>`;
    inner += `<h4 class="title">${this.name}</h4>`;
    this.element.innerHTML = inner;

    this.createMiniBoard();
    this.state = state;

    this.data = {};
		this.sets = new Set(data.sets);
		if (player) {
      this.player = player;
    }

    ['click', 'mouseenter', 'mouseleave'].forEach((eventName) => {
      this.element.addEventListener(eventName, (event) => {
        this.state.emitter.emit('card.' + eventName, this);
      });
    });
	}

  /**
   * Creates the tiles for displaying the possible sets.
   */
	createMiniBoard () {
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
  }

  /**
   * When a card is played the card gets swapped to the other player.
   */
  unswap (player, position) {
    this.element.dataset.swap = false;
    this.data.swap = false;
    this.state.swapCard = false;

    this.data.player = player;
    this.element.dataset.owner = this.player.id;
    this.data.player.cards.push(this);

    let deck = this.state.board['player' + this.player.id + 'Deck'];

    if (position === 0) {
      deck.insertBefore(this.element, deck.firstChild);
    }
    else {
      deck.appendChild(this.element);
    }
  }

  /**
   * When a card is played the card gets swapped to the other player.
   */
	swap () {
    this.element.dataset.swap = true;
    this.data.swap = true;
    this.state.swapCard = this;

    if (this.player) {
      this.player.cards.forEach((card, delta) => {
        if (card === this) {
          this.player.cards.splice(delta, 1);
        }
      });
    }

    this.player = false;
  }

  /**
   * Sets the owner of this card.
   */
	set player (player) {
	  this.data.player = player;
    this.element.dataset.owner = this.player.id;

    let deck = null;

    if (this.data.swap === true) {
      deck = this.state.board['swapDeck'];
    }
    else {
      deck = this.state.board['player' + this.player.id + 'Deck'];
    }

    if (deck) {
      deck.insertBefore(this.element, deck.firstChild);
    }
  }

  /**
   * Returns the owner of this card.
   */
  get player () {
	  return this.data.player;
  }

  /**
   * Selects the card and updates that state to the player.
   */
  select () {
	  this.player.activeCard = this;
    this.data.selected = true;
    this.element.dataset.selected = true;
  }

  /**
   * Deselects the card and updates that state to the player.
   */
  deselect () {
    if (this.player) {
      this.player.activeCard = false;
    }
	  this.data.selected = false;
    this.element.dataset.selected = false;
  }
}