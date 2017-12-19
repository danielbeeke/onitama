import {Game} from '/javascript/game/Game.js';
import {EventEmitter} from '/javascript/core/EventEmitter.js';

import {Connection} from '/javascript/connection/Connection.js';

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

    let element = document.querySelector('#game');

    if (location.pathname === '/') {
      element.innerHTML = `<div class="board-wrapper"><div class="waiting-message">
        <h2>Welcome to Onitama!</h2>
        <h4>Please create a room to play:</h4>
        <input type="text" class="room-name-input"><br><br>
        <a class="goto-link" href="${location}"></a>
        </div></div>`;

      document.querySelector('.room-name-input').addEventListener('keydown', function (event) {
        if ((event.keyCode  < 65 || event.keyCode > 90 || event.shiftKey) && ![8, 9, 32, 46, 173].includes(event.keyCode)) {
          event.preventDefault();
        }
        else {
          document.querySelector('.goto-link').innerHTML = `${location.origin}/${this.value}`;
        }
      });

      document.querySelector('.room-name-input').addEventListener('keyup', function (event) {
        if (this.value) {
          document.querySelector('.goto-link').innerHTML = `${location.origin}/${this.value}`;
          document.querySelector('.goto-link').href = `${location.origin}/${this.value}`;
        }
        else {
          document.querySelector('.goto-link').innerHTML = '';
        }
      });
    }
    else {
      element.innerHTML = `<div class="board-wrapper"><div class="waiting-message">
        <h2>Welcome to Onitama!</h2>
        <h4>Please wait till an other player joins.</h4>
        <h4>You can send the following link:</h4>
        <a class="copy-link" href="${location}" target="_blank">${location}</a>
        </div></div>`;

      this.connection = new Connection(location.pathname.substr(1));
      this.connection.on('started', () => this.onStarted());
      this.connection.on('message', (message) => this.onMessage(message));
    }
  }

  /**
   * A simple board without connection, for debugging css.
   */
  boardDebug () {
    this.game = new Game('#game', this.emitter, 'initiator');
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
      this.game = new Game('#game', this.emitter, this.connection.role);
      let onitamaNotation = this.game.state.serialize();
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
        this.game = new Game('#game', this.emitter, this.connection.role, onitamaNotation);
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