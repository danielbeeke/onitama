import {EventEmitter} from '/javascript/core/EventEmitter.js';

export class Card extends EventEmitter {

	constructor (data, board, player) {
		super();
		Object.assign(this, data);
    this.element = document.createElement('div');
    this.element.classList.add('card');
    this.element.classList.add(this.name.toLowerCase());


    let inner = `<div class="mini-board"><div class="self" style="grid-area: 3 / 3 / 3 / 3;"></div>`;
    this.element.classList.add(this.color);

    this.sets.forEach((set) => {
      let x = set.x + 3;
      let y = set.y + 3;
      inner += `<div class="set" data-x="${x}" data-y="${y}" style="grid-area: ${y} / ${x} / ${y} / ${x};"></div>`;
    });

    inner += `</div><h4 class="title">${this.name}</h4>`;
    this.element.innerHTML = inner;


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

    this.board = board;

    this.data = {};
		this.sets = new Set(data.sets);
		this.player = player;

    ['click', 'mouseenter', 'mouseleave'].forEach((eventName) => {
      this.element.addEventListener(eventName, (event) => {
        this.board.emit('card.' + eventName, this);
      });
    });
	}

	swap () {
    let oppositePlayerId = this.player.id === 1 ? 2 : 1;
    this.player = this.board['player' + oppositePlayerId];
    this.element.dataset.swap = true;
    this.data.swap = true;

    this.board.cards.forEach((card) => {
      if (card.id !== this.id) {
        card.element.dataset.swap = false;
        card.data.swap = false;
      }
      else {
        card.element.dataset.swap = true;
        card.data.swap = true;
      }
    });
  }

	set player (player) {
	  this.data.player = player;
    this.element.dataset.owner = this.player.id;
    this.board['player' + this.player.id + 'Deck'].insertBefore(this.element, this.board['player' + this.player.id + 'Deck'].firstChild);
  }

  get player () {
	  return this.data.player;
  }

  select () {
	  this.player.activeCard = this;
    this.data.selected = true;
    this.element.dataset.selected = true;
  }

  deselect () {
    this.player.activeCard = false;
	  this.data.selected = false;
    this.element.dataset.selected = false;
  }
}