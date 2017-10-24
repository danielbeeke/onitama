/*
import {Connection} from '/javascript/Connection.js';

let connection = new Connection();

connection.on('started', () => {
  console.log('woop woop');
});
*/

import {Game} from '/javascript/game/Game.js';

let game = new Game();

game.transition({
  player: 2,
  piece: 3,
  card: game.player2.cards[0].name,
  x: 3,
  y: 3
});
