export class Player {
  constructor (id, pieces, cards) {
    this.id = id;
    this.pieces = pieces;
    this.cards = cards;
  }

  piece (name) {
    return this.pieces[name];
  }
}