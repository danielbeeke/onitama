export class Piece {
  constructor (type, tile) {
    this.type = type;
    this.tile = tile;
  }

  setTile(tile) {
    this.tile = tile;
  }
}