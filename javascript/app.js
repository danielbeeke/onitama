import {Game} from '/javascript/game/Game.js';
import {EventEmitter} from '/javascript/core/EventEmitter.js';

import {Connection} from '/javascript/connection/Connection.js';
import {Helpers} from '/javascript/core/Helpers.js';

class App {
  constructor () {
    this.emitter = new EventEmitter();
    location.pathname === '/board-debug' ? this.boardDebug() : this.multiPlayerGame();
  }

  multiPlayerGame () {
    this.game = null;
    this.connection = new Connection();

    this.connection.on('started', () => this.onStarted());
    this.connection.on('message', (message) => this.onMessage(message));
  }

  boardDebug () {
    this.game = new Game('#game', this.emitter);
  }

  onMessage (message) {
    if (message.command && message.options) {
      this.executeCommand(message.command, message.options);
    }
  }

  onStarted () {
    if (this.connection.role === 'initiator') {
      this.game = new Game('#game', this.emitter);

      let onitamaNotation = this.game.state.serialize();
      onitamaNotation = Helpers.flipPlayerInNotation(onitamaNotation);
      this.emitter.on('turn', (definition) => this.onTurn(definition));
      this.connection.sendMessage('startGame', onitamaNotation);
    }
  }

  onTurn () {
    let onitamaNotation = this.game.state.serialize();
    onitamaNotation = Helpers.flipPlayerInNotation(onitamaNotation);
    this.connection.sendMessage('turn', onitamaNotation);
  }

  executeCommand (command, options) {
    let commands = {
      startGame: (onitamaNotation) => {
        this.game = new Game('#game', this.emitter, onitamaNotation);
        this.emitter.on('turn', () => this.onTurn());
      },
      turn: (onitamaNotation) => {
        this.game.externalTurn(onitamaNotation);
      }
    };

    if (commands[command]) {
      commands[command](options);
    }
  }
}

new App();