import {Game} from '/javascript/game/Game.js';
import {EventEmitter} from '/javascript/core/EventEmitter.js';

import {Connection} from '/javascript/connection/Connection.js';
import {Helpers} from '/javascript/core/Helpers.js';

let emitter = new EventEmitter();

let connection = new Connection();
let game = null;

let onTurn = function () {
  // if (!definition.isReceived) {
  //   // We need to flip al the player things.
  //   definition.player = definition.player === 1 ? 2 : 1;
  //   definition.x = Helpers.flipCoordinate(definition.x);
  //   definition.y = Helpers.flipCoordinate(definition.y);
  // }

  // connection.sendMessage('transition', definition);

  console.log('yo')

};

connection.on('started', () => {
  if (connection.role === 'initiator') {
    game = new Game('#game', emitter);

    let onitamaNotation = game.state.serialize();

    onitamaNotation = Helpers.flipPlayerInNotation(onitamaNotation);

    emitter.on('turn', (definition) => {
      onTurn(definition);
    });

    connection.sendMessage('startGame', {
      state: onitamaNotation
    });
  }
});

let commands = {
  startGame: (options) => {
    game = new Game('#game', emitter, options.state);
    emitter.on('turn', onTurn);
  },
  transition: (definition) => {
    definition.isReceived = true;
    game.transition(definition);
  }
};

connection.on('message', (message) => {
  if (message.command && message.options && commands[message.command]) {
    commands[message.command](message.options);
  }
});