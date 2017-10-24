export class Piece {
  constructor (type, x, y, player) {
    this.type = type;
    this.x = x;
    this.y = y;
    this.player = player;
  }

  setPosition(x, y) {
    this.x = x;
    this.y = y;
  }
}