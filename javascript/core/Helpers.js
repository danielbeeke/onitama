export class Helpers {

  /**
   * Fisher-Yates Shuffle.
   */
  static fisherYatesShuffle (array) {
    let currentIndex = array.length, temporaryValue, randomIndex;

    // While there remain elements to shuffle...
    while (0 !== currentIndex) {

      // Pick a remaining element...
      randomIndex = Math.floor(Math.random() * currentIndex);
      currentIndex -= 1;

      // And swap it with the current element.
      temporaryValue = array[currentIndex];
      array[currentIndex] = array[randomIndex];
      array[randomIndex] = temporaryValue;
    }
  }

  /**
   * Generates a GUID.
   * @returns {string}
   */
  static guid() {
    let s4 = function () {
      return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
    };

    return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
  }

  static flipPlayerInNotation (onitamaStringNotation) {
    onitamaStringNotation = onitamaStringNotation
    .replace(/\./g, '')
    .replace(/ /g, '');

    let player1Cards = onitamaStringNotation.substr(0, 2);
    let player2Cards = onitamaStringNotation.substr(2, 2);
    let swapCard = onitamaStringNotation.substr(4, 1);
    let player1Pieces = onitamaStringNotation.substr(5, 10);
    let player2Pieces = onitamaStringNotation.substr(15, 10);
    let turn = parseInt(onitamaStringNotation.substr(25, 1));
    let flippedTurn = turn === 1 ? 2 : 1;

    return player2Cards + player1Cards + swapCard + '.' + player2Pieces + '.' + player1Pieces + '.' + flippedTurn;
  }

  /**
   * Flips a coordinate on the board.
   */
  static flipCoordinate (coordinate) {
    switch (coordinate) {
      case 1:
        coordinate = 5;
        break;
      case 2:
        coordinate = 4;
        break;
      case 4:
        coordinate = 2;
        break;
      case 5:
        coordinate = 1;
        break;
    }

    return coordinate;
  }

  /**
   * Returns the coordinates for a tile.
   */
  static tileNumberToXandY (number) {
    return {
      x: ((number - 1) % 5) + 1,
      y: Math.ceil(number / 5)
    }
  }

  /**
   * Returns the tile number for coordinates.
   */
  static xAndYToTileNumber (x, y) {
    return ((y - 1) * 5) + x;
  }
}