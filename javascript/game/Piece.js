export class Piece {
  constructor (type, x, y) {
    this.type = type;
    this.x = x;
    this.y = y;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }
}