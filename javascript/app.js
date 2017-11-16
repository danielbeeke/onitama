import {Game} from '/javascript/game/Game.js';
import {EventEmitter} from '/javascript/core/EventEmitter.js';

import {Connection} from '/javascript/connection/Connection.js';
import {Helpers} from '/javascript/core/Helpers.js';

let emitter = new EventEmitter();
let game = new Game('#game', emitter);

/*
let connection = new Connection();
let game = null;

let onTransition = function (definition) {
  if (!definition.isReceived) {
    // We need to flip al the player things.
    definition.player = definition.player === 1 ? 2 : 1;
    definition.x = Helpers.flipCoordinate(definition.x);
    definition.y = Helpers.flipCoordinate(definition.y);
    connection.sendMessage('transition', definition);
  }
};

connection.on('started', () => {
  if (connection.role === 'initiator') {
    game = new Game('#game');

    let state = game.state.serialize();
    game.flipState(state);

    game.on('transition', (definition) => {
      onTransition(definition);
    });

    // connection.sendMessage('startGame', {
    //   state: state
    // });
  }
});

let commands = {
  startGame: (options) => {
    game = new Game('#board', {
      state: options.state
    });

    game.on('transition', onTransition);
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

*/