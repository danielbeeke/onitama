import {Connection} from '/javascript/connection/Connection.js';
import {Game} from '/javascript/game/Game.js';

let connection = new Connection();
let game;

connection.on('started', () => {
  if (connection.role === 'initiator') {
    game = new Game('#board');

    connection.sendMessage('startGame', {
      state: game.serialize()
    });
  }
});

let commands = {
  startGame: (options) => {
    game = new Game('#board', {
      state: options.state
  });
  }
};

connection.on('message', (message) => {
  if (message.command && message.options && commands[message.command]) {
    commands[message.command](message.options);
  }
});