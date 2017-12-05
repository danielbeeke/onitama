import {Game} from '/javascript/game/Game.js';
import {EventEmitter} from '/javascript/core/EventEmitter.js';

import {Connection} from '/javascript/connection/Connection.js';
import {Helpers} from '/javascript/core/Helpers.js';

class App {
  constructor () {
    this.emitter = new EventEmitter();
    location.pathname === '/board-debug' ? this.boardDebug() : this.multiPlayerGame();
  }

  /**
   * This starts the connection logic and the onitama board.0
   */
  multiPlayerGame () {
    this.game = null;
    this.connection = new Connection();

    this.connection.on('started', () => this.onStarted());
    this.connection.on('message', (message) => this.onMessage(message));
  }

  /**
   * A simple board without connection, for debugging css.
   */
  boardDebug () {
    this.game = new Game('#game', this.emitter);
  }

  /**
   * If the connection has a message, we try to execute it.
   */
  onMessage (message) {
    if (message.command && message.options) {
      this.executeCommand(message.command, message.options);
    }
  }

  /**
   * When the game starts.
   */
  onStarted () {
    if (this.connection.role === 'initiator') {
      this.game = new Game('#game', this.emitter);

      let onitamaNotation = this.game.state.serialize();
      // onitamaNotation = Helpers.flipPlayerInNotation(onitamaNotation);
      this.emitter.on('turn', (piece, tile, card, oldX, oldY, isExternal) => this.onTurn(piece, tile, card, oldX, oldY, isExternal));
      this.connection.sendMessage('startGame', onitamaNotation);
    }
  }

  /**
   * Send the turn to the other peer.
   */
  onTurn (piece, tile, card, oldX, oldY, isExternal) {
    if (!isExternal) {
      this.connection.sendMessage('turn', {
        pieceX: (oldX),
        pieceY: (oldY),
        tileX: (tile.x),
        tileY: (tile.y),
        card: card.name,
        player: piece.player.id
      });
    }
  }

  /**
   * Execute p2p command.
   */
  executeCommand (command, options) {
    let commands = {
      startGame: (onitamaNotation) => {
        this.game = new Game('#game', this.emitter, onitamaNotation);
        this.emitter.on('turn', (piece, tile, card, oldX, oldY, isExternal) => this.onTurn(piece, tile, card, oldX, oldY, isExternal));
      },
      turn: (turnData) => {
        this.game.externalTurn(turnData);
      }
    };

    if (commands[command]) {
      commands[command](options);
    }
  }
}

new App();