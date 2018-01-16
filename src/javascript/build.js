(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.onitama = global.onitama || {})));
}(this, (function (exports) { 'use strict';

var _classCallCheck = (function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
});

var _createClass = (function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
})();

var Tile = function () {

  /**
   * Tiles are on a board. They belong to a board.
   */
  function Tile(x, y, board) {
    var _this = this;

    _classCallCheck(this, Tile);

    this.board = board;

    this.element = document.createElement('div');
    this.element.classList.add('tile');
    this.element.classList.add('tile-' + x + '-' + y);
    this.x = x;
    this.y = y;

    this.element.style = 'grid-area: ' + y + ' / ' + x + ' / ' + y + ' / ' + x + ';';

    ['click', 'mouseenter', 'mouseleave'].forEach(function (eventName) {
      _this.element.addEventListener(eventName, function (event) {
        _this.board.emitter.emit('tile.' + eventName, _this);
      });
    });

    this.board.element.appendChild(this.element);
  }

  /**
   * Highlight the tile.
   */

  _createClass(Tile, [{
    key: 'highlight',
    value: function highlight() {
      this.highlighted = true;
      this.element.classList.add('highlight');
    }

    /**
     * Dim the tile.
     */

  }, {
    key: 'dim',
    value: function dim() {
      this.highlighted = false;
      this.element.classList.remove('highlight');
    }
  }]);

  return Tile;
}();

var Board = function () {
  /**
   * A board holds the physical together. It makes the tiles and lets them emit to the main emitter.
   */
  function Board(element, emitter) {
    _classCallCheck(this, Board);

    this.emitter = emitter;
    this.gameElement = element;
    this.gameElement.classList.add('board-wrapper');

    this.middleWrapper = document.createElement('div');
    this.middleWrapper.classList.add('left-wrapper');
    this.gameElement.appendChild(this.middleWrapper);

    this.element = document.createElement('div');
    this.element.classList.add('board');
    this.middleWrapper.appendChild(this.element);

    this.createTiles();
    this.createDecks();
  }

  /**
   * Create the divs that hold the player cards.
   */

  _createClass(Board, [{
    key: 'createDecks',
    value: function createDecks() {
      this.player2Deck = document.createElement('div');
      this.player2Deck.classList.add('deck');
      this.player2Deck.classList.add('player2');
      this.middleWrapper.insertBefore(this.player2Deck, this.middleWrapper.firstChild);

      this.swapDeck = document.createElement('div');
      this.swapDeck.classList.add('deck');
      this.swapDeck.classList.add('swap');
      this.gameElement.appendChild(this.swapDeck);

      this.player1Deck = document.createElement('div');
      this.player1Deck.classList.add('deck');
      this.player1Deck.classList.add('player1');
      this.middleWrapper.appendChild(this.player1Deck);
    }

    /**
     * Create the tiles.
     */

  }, {
    key: 'createTiles',
    value: function createTiles() {
      this.tiles = new Map();
      for (var y = 1; y < 6; y++) {
        for (var x = 1; x < 6; x++) {
          var tile = new Tile(x, y, this);
          this.tiles.set(x + '-' + y, tile);
        }
      }
    }

    /**
     * Attach the state to the board.
     */

  }, {
    key: 'setState',
    value: function setState(state) {
      this.state = state;
      this.emitter.emit('state.change', state);
    }
  }]);

  return Board;
}();

var cards = [{
  "name": "Rabbit",
  "sets": [{ "x": 1, "y": -1 }, { "x": 2, "y": 0 }, { "x": -1, "y": 1 }],
  "color": "green",
  "id": "a"
}, {
  "name": "Frog",
  "sets": [{ "x": -2, "y": 0 }, { "x": -1, "y": -1 }, { "x": 1, "y": 1 }],
  "color": "green",
  "id": "b"
}, {
  "name": "Mantis",
  "sets": [{ "x": -1, "y": -1 }, { "x": 1, "y": -1 }, { "x": 0, "y": 1 }],
  "color": "green",
  "id": "c"
}, {
  "name": "Boar",
  "sets": [{ "x": 0, "y": -1 }, { "x": -1, "y": 0 }, { "x": 1, "y": 0 }],
  "color": "green",
  "id": "d"
}, {
  "name": "Crane",
  "sets": [{ "x": 0, "y": -1 }, { "x": -1, "y": 1 }, { "x": 1, "y": 1 }],
  "color": "green",
  "id": "e"
}, {
  "name": "Tiger",
  "sets": [{ "x": 0, "y": -2 }, { "x": 0, "y": 1 }],
  "color": "red",
  "id": "f"
}, {
  "name": "Horse",
  "sets": [{ "x": 0, "y": -1 }, { "x": 0, "y": 1 }, { "x": -1, "y": 0 }],
  "color": "red",
  "id": "g"
}, {
  "name": "Rooster",
  "sets": [{ "x": 1, "y": -1 }, { "x": -1, "y": 0 }, { "x": -1, "y": 1 }],
  "color": "red",
  "id": "h"
}, {
  "name": "Ox",
  "sets": [{ "x": 0, "y": -1 }, { "x": 1, "y": 0 }, { "x": 0, "y": 1 }],
  "color": "red",
  "id": "i"
}, {
  "name": "Dragon",
  "sets": [{ "x": -2, "y": -1 }, { "x": 2, "y": -1 }, { "x": -1, "y": 1 }, { "x": 1, "y": 1 }],
  "color": "red",
  "id": "j"
}, {
  "name": "Cobra",
  "sets": [{ "x": 1, "y": -1 }, { "x": -1, "y": 0 }, { "x": 1, "y": 1 }],
  "color": "red",
  "id": "k"
}, {
  "name": "Monkey",
  "sets": [{ "x": -1, "y": -1 }, { "x": 1, "y": -1 }, { "x": 1, "y": 1 }, { "x": -1, "y": 1 }],
  "color": "blue",
  "id": "l"
}, {
  "name": "Elephant",
  "sets": [{ "x": -1, "y": 1 }, { "x": 1, "y": -1 }, { "x": 1, "y": 0 }, { "x": -1, "y": 0 }],
  "color": "blue",
  "id": "m"
}, {
  "name": "Crab",
  "sets": [{ "x": 0, "y": -1 }, { "x": -2, "y": 0 }, { "x": 2, "y": 0 }],
  "color": "blue",
  "id": "n"
}, {
  "name": "Eel",
  "sets": [{ "x": -1, "y": -1 }, { "x": 1, "y": 0 }, { "x": -1, "y": 1 }],
  "color": "blue",
  "id": "o"
}, {
  "name": "Goose",
  "sets": [{ "x": -1, "y": -1 }, { "x": -1, "y": 0 }, { "x": 1, "y": 0 }],
  "color": "blue",
  "id": "p"
}];

var Helpers = function () {
  function Helpers() {
    _classCallCheck(this, Helpers);
  }

  _createClass(Helpers, null, [{
    key: 'fisherYatesShuffle',

    /**
     * Fisher-Yates Shuffle.
     */
    value: function fisherYatesShuffle(array) {
      var currentIndex = array.length,
          temporaryValue = void 0,
          randomIndex = void 0;

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

  }, {
    key: 'guid',
    value: function guid() {
      var s4 = function s4() {
        return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
      };

      return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
    }
  }, {
    key: 'flipPlayerInNotation',
    value: function flipPlayerInNotation(onitamaStringNotation) {
      onitamaStringNotation = onitamaStringNotation.replace(/\./g, '').replace(/ /g, '');

      var player1Cards = onitamaStringNotation.substr(0, 2);
      var player2Cards = onitamaStringNotation.substr(2, 2);
      var swapCard = onitamaStringNotation.substr(4, 1);
      var player1Pieces = onitamaStringNotation.substr(5, 10);
      var player2Pieces = onitamaStringNotation.substr(15, 10);
      var turn = parseInt(onitamaStringNotation.substr(25, 1));
      var oppositeTurn = turn === 1 ? 2 : 1;

      return player2Cards + player1Cards + swapCard + '.' + player2Pieces + '.' + player1Pieces + '.' + oppositeTurn;
    }

    /**
     * Flips a coordinate on the board.
     */

  }, {
    key: 'flipCoordinate',
    value: function flipCoordinate(coordinate) {
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

  }, {
    key: 'tileNumberToXandY',
    value: function tileNumberToXandY(number) {
      return {
        x: (number - 1) % 5 + 1,
        y: Math.ceil(number / 5)
      };
    }

    /**
     * Returns the tile number for coordinates.
     */

  }, {
    key: 'xAndYToTileNumber',
    value: function xAndYToTileNumber(x, y) {
      return (y - 1) * 5 + x;
    }
  }]);

  return Helpers;
}();

var Piece = function () {

  /**
   * A piece can be a monk or a master.
   */
  function Piece(type, x, y, state, player) {
    var _this = this;

    _classCallCheck(this, Piece);

    this.data = {};

    this.type = type;
    this.state = state;
    this.element = document.createElement('div');
    this.player = player;
    this.element.classList.add('piece');
    this.element.classList.add(this.type);
    this.x = x;
    this.y = y;

    ['click', 'mouseenter', 'mouseleave'].forEach(function (eventName) {
      _this.element.addEventListener(eventName, function (event) {
        _this.state.emitter.emit('piece.' + eventName, _this);
      });
    });

    this.state.board.element.appendChild(this.element);
  }

  /**
   * Set the owner of the piece.
   */

  _createClass(Piece, [{
    key: 'updateCss',
    value: function updateCss() {
      var _this2 = this;

      this.element.style = 'left: ' + (this.data.x - 1) * 20 + '%; top: ' + (this.data.y - 1) * 20 + '%;';
      this.element.classList.add('moving');

      setTimeout(function () {
        _this2.element.classList.remove('moving');
      }, 500);
    }

    /**
     * Select this piece, update that state into the player.
     */

  }, {
    key: 'select',
    value: function select() {
      this.player.activePiece = this;
      this.data.selected = true;
      this.element.dataset.selected = true;
    }

    /**
     * Deselect this piece, update that state into the player.
     */

  }, {
    key: 'deselect',
    value: function deselect() {
      this.player.activePiece = false;
      this.data.selected = false;
      this.element.dataset.selected = false;
    }
  }, {
    key: 'capture',
    value: function capture() {
      this.x = -1;
      this.y = -1;
      this.element.remove();

      if (this.type === 'master') {
        this.state.emitter.emit('player.defeated', this);
      } else {
        this.state.emitter.emit('piece.captured', this);
      }
    }
  }, {
    key: 'player',
    set: function set(player) {
      this.data.player = player;
      this.element.classList.add('owner-' + this.player.id);
    }

    /**
     * Return the owner.
     */

    , get: function get() {
      return this.data.player;
    }

    /**
     * Return the x coordinate of the tile the piece is on.
     */

  }, {
    key: 'x',
    get: function get() {
      return this.data.x;
    }

    /**
     * Set the x coordinate of the tile the piece is on.
     * Also update the style.
     */

    , set: function set(x) {
      this.data.x = x;
      this.updateCss();
    }

    /**
     * Return the y coordinate of the tile the piece is on.
     */

  }, {
    key: 'y',
    get: function get() {
      return this.data.y;
    }

    /**
     * Set the y coordinate of the tile the piece is on.
     * Also update the style.
     */

    , set: function set(y) {
      this.data.y = y;
      this.updateCss();
    }
  }]);

  return Piece;
}();

var Card = function () {

  /**
   * A card must be initiated with the data out of cards.js. It has possible sets.
   */
  function Card(data, state, player) {
    var _this = this;

    _classCallCheck(this, Card);

    Object.assign(this, data);
    this.element = document.createElement('div');
    this.element.classList.add('card');
    this.element.classList.add(this.color);
    this.element.classList.add(this.name.toLowerCase());

    var inner = '<div class="mini-board"><div class="self" style="grid-area: 3 / 3 / 3 / 3;"></div>';

    this.sets.forEach(function (set) {
      var x = set.x + 3;
      var y = set.y + 3;
      inner += '<div class="set" data-x="' + x + '" data-y="' + y + '" style="grid-area: ' + y + ' / ' + x + ' / ' + y + ' / ' + x + ';"></div>';
    });

    inner += '</div>';
    inner += '<h4 class="title">' + this.name + '</h4>';
    this.element.innerHTML = inner;

    this.createMiniBoard();
    this.state = state;

    this.data = {};
    this.sets = new Set(data.sets);
    if (player) {
      this.player = player;
    }

    ['click', 'mouseenter', 'mouseleave'].forEach(function (eventName) {
      _this.element.addEventListener(eventName, function (event) {
        _this.state.emitter.emit('card.' + eventName, _this);
      });
    });
  }

  /**
   * Creates the tiles for displaying the possible sets.
   */

  _createClass(Card, [{
    key: 'createMiniBoard',
    value: function createMiniBoard() {
      var miniBoard = this.element.querySelector('.mini-board');

      for (var y = 1; y < 6; y++) {
        for (var x = 1; x < 6; x++) {
          var tile = document.createElement('div');
          tile.dataset.x = x;
          tile.dataset.y = y;
          tile.classList.add('tile');
          tile.style = 'grid-area: ' + y + ' / ' + x + ' / ' + y + ' / ' + x + ';';
          miniBoard.appendChild(tile);
        }
      }
    }

    /**
     * When a card is played the card gets swapped to the other player.
     */

  }, {
    key: 'unswap',
    value: function unswap(player, position) {
      this.element.dataset.swap = false;
      this.data.swap = false;
      this.state.swapCard = false;

      this.data.player = player;
      this.element.dataset.owner = this.player.id;
      this.data.player.cards.push(this);

      var deck = this.state.board['player' + this.player.id + 'Deck'];

      if (position === 0) {
        deck.insertBefore(this.element, deck.firstChild);
      } else {
        deck.appendChild(this.element);
      }
    }

    /**
     * When a card is played the card gets swapped to the other player.
     */

  }, {
    key: 'swap',
    value: function swap() {
      var _this2 = this;

      this.element.dataset.swap = true;
      this.data.swap = true;
      this.state.swapCard = this;

      if (this.player) {
        this.player.cards.forEach(function (card, delta) {
          if (card === _this2) {
            _this2.player.cards.splice(delta, 1);
          }
        });
      }

      this.player = false;
    }

    /**
     * Sets the owner of this card.
     */

  }, {
    key: 'select',

    /**
     * Selects the card and updates that state to the player.
     */
    value: function select() {
      this.player.activeCard = this;
      this.data.selected = true;
      this.element.dataset.selected = true;
    }

    /**
     * Deselects the card and updates that state to the player.
     */

  }, {
    key: 'deselect',
    value: function deselect() {
      if (this.player) {
        this.player.activeCard = false;
      }
      this.data.selected = false;
      this.element.dataset.selected = false;
    }
  }, {
    key: 'player',
    set: function set(player) {
      this.data.player = player;
      this.element.dataset.owner = this.player.id;

      var deck = null;

      if (this.data.swap === true) {
        deck = this.state.board['swapDeck'];
      } else {
        deck = this.state.board['player' + this.player.id + 'Deck'];
      }

      if (deck) {
        deck.insertBefore(this.element, deck.firstChild);
      }
    }

    /**
     * Returns the owner of this card.
     */

    , get: function get() {
      return this.data.player;
    }
  }]);

  return Card;
}();

var Player = function () {

  /**
   * Create a new player with an ID.
   */
  function Player(id, state) {
    _classCallCheck(this, Player);

    this.state = state;
    this.id = id;
    this.pieces = [];
    this.cards = [];
  }

  /**
   * Add a piece to this player.
   */

  _createClass(Player, [{
    key: 'addPiece',
    value: function addPiece(type) {
      var x = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;
      var y = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

      var piece = new Piece(type, x, y, this.state, this);
      this.pieces.push(piece);
    }

    /**
     * Add a card to this player.
     */

  }, {
    key: 'addCard',
    value: function addCard(cardData) {
      var card = new Card(cardData, this.state, this);
      this.cards.push(card);
      return card;
    }
  }]);

  return Player;
}();

var State = function () {

  /**
   * You can initiate a state with a correct ontima string notation. If so it gets validated, else it will be a blank board.
   *
   * First dots and spaces are removed.
   * The characters 1 and 2 from the left are reserved for cards of player 1.
   * The characters 3 and 4 from the left are reserved for cards of player 2.
   * The character 5 from the left are reserved for the spare card.
   * After that the pieces come.
   * They come in blocks of 10 for each player, first player 1 and than player 2.
    * The last number is the player that has the turn.
   */
  function State(board, emitter) {
    var onitamaStringNotation = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'abcde.axbxcXdxex.uxvxwXxxyx.1';

    _classCallCheck(this, State);

    this.emitter = emitter;
    this.board = board;
    this.deserialize(onitamaStringNotation);
  }

  /**
   * Parse an onitama string notation.
   */

  _createClass(State, [{
    key: 'parseNotation',
    value: function parseNotation(onitamaStringNotation) {
      onitamaStringNotation = onitamaStringNotation.replace(/\./g, '').replace(/ /g, '');

      var cardCharacters = onitamaStringNotation.substr(0, 5).split('');
      var selectedCards = [];

      cardCharacters.forEach(function (cardCharacter) {
        var selectedCard = cards.filter(function (card) {
          return card.id === cardCharacter;
        })[0];

        if (selectedCard) {
          selectedCards.push(selectedCard);
        }
      });

      var player1Pieces = onitamaStringNotation.substr(15, 10);
      var player2Pieces = onitamaStringNotation.substr(5, 10);

      var convertPlayerPieces = function convertPlayerPieces(onitamaStringNotationPlayerPart) {
        var piecesMap = new Map();
        var chunks = onitamaStringNotationPlayerPart.match(/.{1,2}/g);

        chunks.forEach(function (chunk) {
          var tileNumber = chunk.charCodeAt(0) - 96;
          var pieceChar = chunk.substr(1);
          var pieceType = pieceChar === pieceChar.toUpperCase() ? 'master' : 'monk';
          piecesMap.set(tileNumber, pieceType);
        });

        return piecesMap;
      };

      var player1PiecesMap = convertPlayerPieces(player1Pieces);
      var player2PiecesMap = convertPlayerPieces(player2Pieces);
      var turnPlayerId = onitamaStringNotation.substr(25, 1);

      return {
        turnPlayer: parseInt(turnPlayerId),
        player1: {
          cards: selectedCards.slice(0, 2),
          pieces: player1PiecesMap
        },
        player2: {
          cards: selectedCards.slice(2, 4),
          pieces: player2PiecesMap
        },
        swapCard: selectedCards.slice(4)[0]
      };
    }

    /**
     * Applies an onitama string notation.
     */

  }, {
    key: 'deserialize',
    value: function deserialize(onitamaStringNotation) {
      var _this = this;

      var stateObject = this.parseNotation(onitamaStringNotation);
      Object.assign(this, stateObject);
      this.cards = [];

      this.player1 = new Player(1, this);
      this.player2 = new Player(2, this);

      var initPlayer = function initPlayer(data, id) {
        data.pieces.forEach(function (pieceType, pieceTile) {
          var tileCoordinates = Helpers.tileNumberToXandY(pieceTile);
          _this['player' + id].addPiece(pieceType, tileCoordinates.x, tileCoordinates.y);
        });

        data.cards.forEach(function (cardData) {
          var card = _this['player' + id].addCard(cardData);
          _this.cards.push(card);
        });
      };

      initPlayer(stateObject.player1, 1);
      initPlayer(stateObject.player2, 2);

      this.turnPlayer = stateObject.turnPlayer;
      this.emitter.emit('turn.set', this.turnPlayer);
      this.swapCard = new Card(stateObject.swapCard, this, false);

      this.cards.push(this.swapCard);
      this.swapCard.swap();
    }
  }, {
    key: 'toggleTurnPlayer',
    value: function toggleTurnPlayer() {
      this.turnPlayer = this.turnPlayer === 1 ? 2 : 1;
      this.emitter.emit('turn.set', this.turnPlayer);
    }

    /**
     * Serializes the game state into an object.
     */

  }, {
    key: 'serialize',
    value: function serialize() {
      var stateObject = {};

      stateObject.turnPlayer = this.turnPlayer;

      this.cards.forEach(function (card) {
        if (card.data.swap) {
          stateObject.swapCard = card.id;
        }
      });

      var convertPlayer = function convertPlayer(player) {
        var pieces = new Map();

        player.pieces.forEach(function (piece) {
          pieces.set(Helpers.xAndYToTileNumber(piece.x, piece.y), piece.type);
        });

        return {
          cards: [player.cards[0].id, player.cards[1].id],
          pieces: pieces
        };
      };

      stateObject.player1 = convertPlayer(this.player1);
      stateObject.player2 = convertPlayer(this.player2);

      var onitamaStringNotation = stateObject.player1.cards[0] + stateObject.player1.cards[1];
      onitamaStringNotation += stateObject.player2.cards[0] + stateObject.player2.cards[1];
      onitamaStringNotation += stateObject.swapCard + '.';

      var createPlayerString = function createPlayerString(player) {
        var playerString = '';

        player.pieces.forEach(function (type, tile) {
          var typeChar = type === 'master' ? 'X' : 'x';
          playerString += String.fromCharCode(96 + tile) + typeChar;
        });

        return playerString;
      };

      onitamaStringNotation += createPlayerString(stateObject.player2) + '.';
      onitamaStringNotation += createPlayerString(stateObject.player1) + '.' + stateObject.turnPlayer;

      return onitamaStringNotation;
    }
  }]);

  return State;
}();

/*!
 *  howler.js v2.0.7
 *  howlerjs.com
 *
 *  (c) 2013-2017, James Simpson of GoldFire Studios
 *  goldfirestudios.com
 *
 *  MIT License
 */

(function () {

  'use strict';

  /** Global Methods **/
  /***************************************************************************/

  /**
   * Create the global controller. All contained methods and properties apply
   * to all sounds that are currently playing or will be in the future.
   */

  var HowlerGlobal = function HowlerGlobal() {
    this.init();
  };
  HowlerGlobal.prototype = {
    /**
     * Initialize the global Howler object.
     * @return {Howler}
     */
    init: function init() {
      var self = this || Howler;

      // Create a global ID counter.
      self._counter = 1000;

      // Internal properties.
      self._codecs = {};
      self._howls = [];
      self._muted = false;
      self._volume = 1;
      self._canPlayEvent = 'canplaythrough';
      self._navigator = typeof window !== 'undefined' && window.navigator ? window.navigator : null;

      // Public properties.
      self.masterGain = null;
      self.noAudio = false;
      self.usingWebAudio = true;
      self.autoSuspend = true;
      self.ctx = null;

      // Set to false to disable the auto iOS enabler.
      self.mobileAutoEnable = true;

      // Setup the various state values for global tracking.
      self._setup();

      return self;
    },

    /**
     * Get/set the global volume for all sounds.
     * @param  {Float} vol Volume from 0.0 to 1.0.
     * @return {Howler/Float}     Returns self or current volume.
     */
    volume: function volume(vol) {
      var self = this || Howler;
      vol = parseFloat(vol);

      // If we don't have an AudioContext created yet, run the setup.
      if (!self.ctx) {
        setupAudioContext();
      }

      if (typeof vol !== 'undefined' && vol >= 0 && vol <= 1) {
        self._volume = vol;

        // Don't update any of the nodes if we are muted.
        if (self._muted) {
          return self;
        }

        // When using Web Audio, we just need to adjust the master gain.
        if (self.usingWebAudio) {
          self.masterGain.gain.setValueAtTime(vol, Howler.ctx.currentTime);
        }

        // Loop through and change volume for all HTML5 audio nodes.
        for (var i = 0; i < self._howls.length; i++) {
          if (!self._howls[i]._webAudio) {
            // Get all of the sounds in this Howl group.
            var ids = self._howls[i]._getSoundIds();

            // Loop through all sounds and change the volumes.
            for (var j = 0; j < ids.length; j++) {
              var sound = self._howls[i]._soundById(ids[j]);

              if (sound && sound._node) {
                sound._node.volume = sound._volume * vol;
              }
            }
          }
        }

        return self;
      }

      return self._volume;
    },

    /**
     * Handle muting and unmuting globally.
     * @param  {Boolean} muted Is muted or not.
     */
    mute: function mute(muted) {
      var self = this || Howler;

      // If we don't have an AudioContext created yet, run the setup.
      if (!self.ctx) {
        setupAudioContext();
      }

      self._muted = muted;

      // With Web Audio, we just need to mute the master gain.
      if (self.usingWebAudio) {
        self.masterGain.gain.setValueAtTime(muted ? 0 : self._volume, Howler.ctx.currentTime);
      }

      // Loop through and mute all HTML5 Audio nodes.
      for (var i = 0; i < self._howls.length; i++) {
        if (!self._howls[i]._webAudio) {
          // Get all of the sounds in this Howl group.
          var ids = self._howls[i]._getSoundIds();

          // Loop through all sounds and mark the audio node as muted.
          for (var j = 0; j < ids.length; j++) {
            var sound = self._howls[i]._soundById(ids[j]);

            if (sound && sound._node) {
              sound._node.muted = muted ? true : sound._muted;
            }
          }
        }
      }

      return self;
    },

    /**
     * Unload and destroy all currently loaded Howl objects.
     * @return {Howler}
     */
    unload: function unload() {
      var self = this || Howler;

      for (var i = self._howls.length - 1; i >= 0; i--) {
        self._howls[i].unload();
      }

      // Create a new AudioContext to make sure it is fully reset.
      if (self.usingWebAudio && self.ctx && typeof self.ctx.close !== 'undefined') {
        self.ctx.close();
        self.ctx = null;
        setupAudioContext();
      }

      return self;
    },

    /**
     * Check for codec support of specific extension.
     * @param  {String} ext Audio file extention.
     * @return {Boolean}
     */
    codecs: function codecs(ext) {
      return (this || Howler)._codecs[ext.replace(/^x-/, '')];
    },

    /**
     * Setup various state values for global tracking.
     * @return {Howler}
     */
    _setup: function _setup() {
      var self = this || Howler;

      // Keeps track of the suspend/resume state of the AudioContext.
      self.state = self.ctx ? self.ctx.state || 'running' : 'running';

      // Automatically begin the 30-second suspend process
      self._autoSuspend();

      // Check if audio is available.
      if (!self.usingWebAudio) {
        // No audio is available on this system if noAudio is set to true.
        if (typeof Audio !== 'undefined') {
          try {
            var test = new Audio();

            // Check if the canplaythrough event is available.
            if (typeof test.oncanplaythrough === 'undefined') {
              self._canPlayEvent = 'canplay';
            }
          } catch (e) {
            self.noAudio = true;
          }
        } else {
          self.noAudio = true;
        }
      }

      // Test to make sure audio isn't disabled in Internet Explorer.
      try {
        var test = new Audio();
        if (test.muted) {
          self.noAudio = true;
        }
      } catch (e) {}

      // Check for supported codecs.
      if (!self.noAudio) {
        self._setupCodecs();
      }

      return self;
    },

    /**
     * Check for browser support for various codecs and cache the results.
     * @return {Howler}
     */
    _setupCodecs: function _setupCodecs() {
      var self = this || Howler;
      var audioTest = null;

      // Must wrap in a try/catch because IE11 in server mode throws an error.
      try {
        audioTest = typeof Audio !== 'undefined' ? new Audio() : null;
      } catch (err) {
        return self;
      }

      if (!audioTest || typeof audioTest.canPlayType !== 'function') {
        return self;
      }

      var mpegTest = audioTest.canPlayType('audio/mpeg;').replace(/^no$/, '');

      // Opera version <33 has mixed MP3 support, so we need to check for and block it.
      var checkOpera = self._navigator && self._navigator.userAgent.match(/OPR\/([0-6].)/g);
      var isOldOpera = checkOpera && parseInt(checkOpera[0].split('/')[1], 10) < 33;

      self._codecs = {
        mp3: !!(!isOldOpera && (mpegTest || audioTest.canPlayType('audio/mp3;').replace(/^no$/, ''))),
        mpeg: !!mpegTest,
        opus: !!audioTest.canPlayType('audio/ogg; codecs="opus"').replace(/^no$/, ''),
        ogg: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ''),
        oga: !!audioTest.canPlayType('audio/ogg; codecs="vorbis"').replace(/^no$/, ''),
        wav: !!audioTest.canPlayType('audio/wav; codecs="1"').replace(/^no$/, ''),
        aac: !!audioTest.canPlayType('audio/aac;').replace(/^no$/, ''),
        caf: !!audioTest.canPlayType('audio/x-caf;').replace(/^no$/, ''),
        m4a: !!(audioTest.canPlayType('audio/x-m4a;') || audioTest.canPlayType('audio/m4a;') || audioTest.canPlayType('audio/aac;')).replace(/^no$/, ''),
        mp4: !!(audioTest.canPlayType('audio/x-mp4;') || audioTest.canPlayType('audio/mp4;') || audioTest.canPlayType('audio/aac;')).replace(/^no$/, ''),
        weba: !!audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, ''),
        webm: !!audioTest.canPlayType('audio/webm; codecs="vorbis"').replace(/^no$/, ''),
        dolby: !!audioTest.canPlayType('audio/mp4; codecs="ec-3"').replace(/^no$/, ''),
        flac: !!(audioTest.canPlayType('audio/x-flac;') || audioTest.canPlayType('audio/flac;')).replace(/^no$/, '')
      };

      return self;
    },

    /**
     * Mobile browsers will only allow audio to be played after a user interaction.
     * Attempt to automatically unlock audio on the first user interaction.
     * Concept from: http://paulbakaus.com/tutorials/html5/web-audio-on-ios/
     * @return {Howler}
     */
    _enableMobileAudio: function _enableMobileAudio() {
      var self = this || Howler;

      // Only run this on mobile devices if audio isn't already eanbled.
      var isMobile = /iPhone|iPad|iPod|Android|BlackBerry|BB10|Silk|Mobi/i.test(self._navigator && self._navigator.userAgent);
      var isTouch = !!('ontouchend' in window || self._navigator && self._navigator.maxTouchPoints > 0 || self._navigator && self._navigator.msMaxTouchPoints > 0);
      if (self._mobileEnabled || !self.ctx || !isMobile && !isTouch) {
        return;
      }

      self._mobileEnabled = false;

      // Some mobile devices/platforms have distortion issues when opening/closing tabs and/or web views.
      // Bugs in the browser (especially Mobile Safari) can cause the sampleRate to change from 44100 to 48000.
      // By calling Howler.unload(), we create a new AudioContext with the correct sampleRate.
      if (!self._mobileUnloaded && self.ctx.sampleRate !== 44100) {
        self._mobileUnloaded = true;
        self.unload();
      }

      // Scratch buffer for enabling iOS to dispose of web audio buffers correctly, as per:
      // http://stackoverflow.com/questions/24119684
      self._scratchBuffer = self.ctx.createBuffer(1, 1, 22050);

      // Call this method on touch start to create and play a buffer,
      // then check if the audio actually played to determine if
      // audio has now been unlocked on iOS, Android, etc.
      var unlock = function unlock() {
        // Fix Android can not play in suspend state.
        Howler._autoResume();

        // Create an empty buffer.
        var source = self.ctx.createBufferSource();
        source.buffer = self._scratchBuffer;
        source.connect(self.ctx.destination);

        // Play the empty buffer.
        if (typeof source.start === 'undefined') {
          source.noteOn(0);
        } else {
          source.start(0);
        }

        // Calling resume() on a stack initiated by user gesture is what actually unlocks the audio on Android Chrome >= 55.
        if (typeof self.ctx.resume === 'function') {
          self.ctx.resume();
        }

        // Setup a timeout to check that we are unlocked on the next event loop.
        source.onended = function () {
          source.disconnect(0);

          // Update the unlocked state and prevent this check from happening again.
          self._mobileEnabled = true;
          self.mobileAutoEnable = false;

          // Remove the touch start listener.
          document.removeEventListener('touchstart', unlock, true);
          document.removeEventListener('touchend', unlock, true);
        };
      };

      // Setup a touch start listener to attempt an unlock in.
      document.addEventListener('touchstart', unlock, true);
      document.addEventListener('touchend', unlock, true);

      return self;
    },

    /**
     * Automatically suspend the Web Audio AudioContext after no sound has played for 30 seconds.
     * This saves processing/energy and fixes various browser-specific bugs with audio getting stuck.
     * @return {Howler}
     */
    _autoSuspend: function _autoSuspend() {
      var self = this;

      if (!self.autoSuspend || !self.ctx || typeof self.ctx.suspend === 'undefined' || !Howler.usingWebAudio) {
        return;
      }

      // Check if any sounds are playing.
      for (var i = 0; i < self._howls.length; i++) {
        if (self._howls[i]._webAudio) {
          for (var j = 0; j < self._howls[i]._sounds.length; j++) {
            if (!self._howls[i]._sounds[j]._paused) {
              return self;
            }
          }
        }
      }

      if (self._suspendTimer) {
        clearTimeout(self._suspendTimer);
      }

      // If no sound has played after 30 seconds, suspend the context.
      self._suspendTimer = setTimeout(function () {
        if (!self.autoSuspend) {
          return;
        }

        self._suspendTimer = null;
        self.state = 'suspending';
        self.ctx.suspend().then(function () {
          self.state = 'suspended';

          if (self._resumeAfterSuspend) {
            delete self._resumeAfterSuspend;
            self._autoResume();
          }
        });
      }, 30000);

      return self;
    },

    /**
     * Automatically resume the Web Audio AudioContext when a new sound is played.
     * @return {Howler}
     */
    _autoResume: function _autoResume() {
      var self = this;

      if (!self.ctx || typeof self.ctx.resume === 'undefined' || !Howler.usingWebAudio) {
        return;
      }

      if (self.state === 'running' && self._suspendTimer) {
        clearTimeout(self._suspendTimer);
        self._suspendTimer = null;
      } else if (self.state === 'suspended') {
        self.ctx.resume().then(function () {
          self.state = 'running';

          // Emit to all Howls that the audio has resumed.
          for (var i = 0; i < self._howls.length; i++) {
            self._howls[i]._emit('resume');
          }
        });

        if (self._suspendTimer) {
          clearTimeout(self._suspendTimer);
          self._suspendTimer = null;
        }
      } else if (self.state === 'suspending') {
        self._resumeAfterSuspend = true;
      }

      return self;
    }
  };

  // Setup the global audio controller.
  var Howler = new HowlerGlobal();

  /** Group Methods **/
  /***************************************************************************/

  /**
   * Create an audio group controller.
   * @param {Object} o Passed in properties for this group.
   */
  var Howl = function Howl(o) {
    var self = this;

    // Throw an error if no source is provided.
    if (!o.src || o.src.length === 0) {
      console.error('An array of source files must be passed with any new Howl.');
      return;
    }

    self.init(o);
  };
  Howl.prototype = {
    /**
     * Initialize a new Howl group object.
     * @param  {Object} o Passed in properties for this group.
     * @return {Howl}
     */
    init: function init(o) {
      var self = this;

      // If we don't have an AudioContext created yet, run the setup.
      if (!Howler.ctx) {
        setupAudioContext();
      }

      // Setup user-defined default properties.
      self._autoplay = o.autoplay || false;
      self._format = typeof o.format !== 'string' ? o.format : [o.format];
      self._html5 = o.html5 || false;
      self._muted = o.mute || false;
      self._loop = o.loop || false;
      self._pool = o.pool || 5;
      self._preload = typeof o.preload === 'boolean' ? o.preload : true;
      self._rate = o.rate || 1;
      self._sprite = o.sprite || {};
      self._src = typeof o.src !== 'string' ? o.src : [o.src];
      self._volume = o.volume !== undefined ? o.volume : 1;
      self._xhrWithCredentials = o.xhrWithCredentials || false;

      // Setup all other default properties.
      self._duration = 0;
      self._state = 'unloaded';
      self._sounds = [];
      self._endTimers = {};
      self._queue = [];
      self._playLock = false;

      // Setup event listeners.
      self._onend = o.onend ? [{ fn: o.onend }] : [];
      self._onfade = o.onfade ? [{ fn: o.onfade }] : [];
      self._onload = o.onload ? [{ fn: o.onload }] : [];
      self._onloaderror = o.onloaderror ? [{ fn: o.onloaderror }] : [];
      self._onplayerror = o.onplayerror ? [{ fn: o.onplayerror }] : [];
      self._onpause = o.onpause ? [{ fn: o.onpause }] : [];
      self._onplay = o.onplay ? [{ fn: o.onplay }] : [];
      self._onstop = o.onstop ? [{ fn: o.onstop }] : [];
      self._onmute = o.onmute ? [{ fn: o.onmute }] : [];
      self._onvolume = o.onvolume ? [{ fn: o.onvolume }] : [];
      self._onrate = o.onrate ? [{ fn: o.onrate }] : [];
      self._onseek = o.onseek ? [{ fn: o.onseek }] : [];
      self._onresume = [];

      // Web Audio or HTML5 Audio?
      self._webAudio = Howler.usingWebAudio && !self._html5;

      // Automatically try to enable audio on iOS.
      if (typeof Howler.ctx !== 'undefined' && Howler.ctx && Howler.mobileAutoEnable) {
        Howler._enableMobileAudio();
      }

      // Keep track of this Howl group in the global controller.
      Howler._howls.push(self);

      // If they selected autoplay, add a play event to the load queue.
      if (self._autoplay) {
        self._queue.push({
          event: 'play',
          action: function action() {
            self.play();
          }
        });
      }

      // Load the source file unless otherwise specified.
      if (self._preload) {
        self.load();
      }

      return self;
    },

    /**
     * Load the audio file.
     * @return {Howler}
     */
    load: function load() {
      var self = this;
      var url = null;

      // If no audio is available, quit immediately.
      if (Howler.noAudio) {
        self._emit('loaderror', null, 'No audio support.');
        return;
      }

      // Make sure our source is in an array.
      if (typeof self._src === 'string') {
        self._src = [self._src];
      }

      // Loop through the sources and pick the first one that is compatible.
      for (var i = 0; i < self._src.length; i++) {
        var ext, str;

        if (self._format && self._format[i]) {
          // If an extension was specified, use that instead.
          ext = self._format[i];
        } else {
          // Make sure the source is a string.
          str = self._src[i];
          if (typeof str !== 'string') {
            self._emit('loaderror', null, 'Non-string found in selected audio sources - ignoring.');
            continue;
          }

          // Extract the file extension from the URL or base64 data URI.
          ext = /^data:audio\/([^;,]+);/i.exec(str);
          if (!ext) {
            ext = /\.([^.]+)$/.exec(str.split('?', 1)[0]);
          }

          if (ext) {
            ext = ext[1].toLowerCase();
          }
        }

        // Log a warning if no extension was found.
        if (!ext) {
          console.warn('No file extension was found. Consider using the "format" property or specify an extension.');
        }

        // Check if this extension is available.
        if (ext && Howler.codecs(ext)) {
          url = self._src[i];
          break;
        }
      }

      if (!url) {
        self._emit('loaderror', null, 'No codec support for selected audio sources.');
        return;
      }

      self._src = url;
      self._state = 'loading';

      // If the hosting page is HTTPS and the source isn't,
      // drop down to HTML5 Audio to avoid Mixed Content errors.
      if (window.location.protocol === 'https:' && url.slice(0, 5) === 'http:') {
        self._html5 = true;
        self._webAudio = false;
      }

      // Create a new sound object and add it to the pool.
      new Sound(self);

      // Load and decode the audio data for playback.
      if (self._webAudio) {
        loadBuffer(self);
      }

      return self;
    },

    /**
     * Play a sound or resume previous playback.
     * @param  {String/Number} sprite   Sprite name for sprite playback or sound id to continue previous.
     * @param  {Boolean} internal Internal Use: true prevents event firing.
     * @return {Number}          Sound ID.
     */
    play: function play(sprite, internal) {
      var self = this;
      var id = null;

      // Determine if a sprite, sound id or nothing was passed
      if (typeof sprite === 'number') {
        id = sprite;
        sprite = null;
      } else if (typeof sprite === 'string' && self._state === 'loaded' && !self._sprite[sprite]) {
        // If the passed sprite doesn't exist, do nothing.
        return null;
      } else if (typeof sprite === 'undefined') {
        // Use the default sound sprite (plays the full audio length).
        sprite = '__default';

        // Check if there is a single paused sound that isn't ended.
        // If there is, play that sound. If not, continue as usual.
        var num = 0;
        for (var i = 0; i < self._sounds.length; i++) {
          if (self._sounds[i]._paused && !self._sounds[i]._ended) {
            num++;
            id = self._sounds[i]._id;
          }
        }

        if (num === 1) {
          sprite = null;
        } else {
          id = null;
        }
      }

      // Get the selected node, or get one from the pool.
      var sound = id ? self._soundById(id) : self._inactiveSound();

      // If the sound doesn't exist, do nothing.
      if (!sound) {
        return null;
      }

      // Select the sprite definition.
      if (id && !sprite) {
        sprite = sound._sprite || '__default';
      }

      // If the sound hasn't loaded, we must wait to get the audio's duration.
      // We also need to wait to make sure we don't run into race conditions with
      // the order of function calls.
      if (self._state !== 'loaded') {
        // Set the sprite value on this sound.
        sound._sprite = sprite;

        // Makr this sounded as not ended in case another sound is played before this one loads.
        sound._ended = false;

        // Add the sound to the queue to be played on load.
        var soundId = sound._id;
        self._queue.push({
          event: 'play',
          action: function action() {
            self.play(soundId);
          }
        });

        return soundId;
      }

      // Don't play the sound if an id was passed and it is already playing.
      if (id && !sound._paused) {
        // Trigger the play event, in order to keep iterating through queue.
        if (!internal) {
          setTimeout(function () {
            self._emit('play', sound._id);
          }, 0);
        }

        return sound._id;
      }

      // Make sure the AudioContext isn't suspended, and resume it if it is.
      if (self._webAudio) {
        Howler._autoResume();
      }

      // Determine how long to play for and where to start playing.
      var seek = Math.max(0, sound._seek > 0 ? sound._seek : self._sprite[sprite][0] / 1000);
      var duration = Math.max(0, (self._sprite[sprite][0] + self._sprite[sprite][1]) / 1000 - seek);
      var timeout = duration * 1000 / Math.abs(sound._rate);

      // Update the parameters of the sound
      sound._paused = false;
      sound._ended = false;
      sound._sprite = sprite;
      sound._seek = seek;
      sound._start = self._sprite[sprite][0] / 1000;
      sound._stop = (self._sprite[sprite][0] + self._sprite[sprite][1]) / 1000;
      sound._loop = !!(sound._loop || self._sprite[sprite][2]);

      // Begin the actual playback.
      var node = sound._node;
      if (self._webAudio) {
        // Fire this when the sound is ready to play to begin Web Audio playback.
        var playWebAudio = function playWebAudio() {
          self._refreshBuffer(sound);

          // Setup the playback params.
          var vol = sound._muted || self._muted ? 0 : sound._volume;
          node.gain.setValueAtTime(vol, Howler.ctx.currentTime);
          sound._playStart = Howler.ctx.currentTime;

          // Play the sound using the supported method.
          if (typeof node.bufferSource.start === 'undefined') {
            sound._loop ? node.bufferSource.noteGrainOn(0, seek, 86400) : node.bufferSource.noteGrainOn(0, seek, duration);
          } else {
            sound._loop ? node.bufferSource.start(0, seek, 86400) : node.bufferSource.start(0, seek, duration);
          }

          // Start a new timer if none is present.
          if (timeout !== Infinity) {
            self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
          }

          if (!internal) {
            setTimeout(function () {
              self._emit('play', sound._id);
            }, 0);
          }
        };

        if (Howler.state === 'running') {
          playWebAudio();
        } else {
          self.once('resume', playWebAudio);

          // Cancel the end timer.
          self._clearTimer(sound._id);
        }
      } else {
        // Fire this when the sound is ready to play to begin HTML5 Audio playback.
        var playHtml5 = function playHtml5() {
          node.currentTime = seek;
          node.muted = sound._muted || self._muted || Howler._muted || node.muted;
          node.volume = sound._volume * Howler.volume();
          node.playbackRate = sound._rate;

          // Mobile browsers will throw an error if this is called without user interaction.
          try {
            var play = node.play();

            // Support older browsers that don't support promises, and thus don't have this issue.
            if (typeof Promise !== 'undefined' && play instanceof Promise) {
              // Implements a lock to prevent DOMException: The play() request was interrupted by a call to pause().
              self._playLock = true;

              // Releases the lock and executes queued actions.
              play.then(function () {
                self._playLock = false;
                self._loadQueue();
              });
            }

            // If the node is still paused, then we can assume there was a playback issue.
            if (node.paused) {
              self._emit('playerror', sound._id, 'Playback was unable to start. This is most commonly an issue ' + 'on mobile devices where playback was not within a user interaction.');
              return;
            }

            // Setup the new end timer.
            if (timeout !== Infinity) {
              self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
            }

            if (!internal) {
              self._emit('play', sound._id);
            }
          } catch (err) {
            self._emit('playerror', sound._id, err);
          }
        };

        // Play immediately if ready, or wait for the 'canplaythrough'e vent.
        var loadedNoReadyState = window && window.ejecta || !node.readyState && Howler._navigator.isCocoonJS;
        if (node.readyState === 4 || loadedNoReadyState) {
          playHtml5();
        } else {
          var listener = function listener() {
            // Begin playback.
            playHtml5();

            // Clear this listener.
            node.removeEventListener(Howler._canPlayEvent, listener, false);
          };
          node.addEventListener(Howler._canPlayEvent, listener, false);

          // Cancel the end timer.
          self._clearTimer(sound._id);
        }
      }

      return sound._id;
    },

    /**
     * Pause playback and save current position.
     * @param  {Number} id The sound ID (empty to pause all in group).
     * @return {Howl}
     */
    pause: function pause(id) {
      var self = this;

      // If the sound hasn't loaded or a play() promise is pending, add it to the load queue to pause when capable.
      if (self._state !== 'loaded' || self._playLock) {
        self._queue.push({
          event: 'pause',
          action: function action() {
            self.pause(id);
          }
        });

        return self;
      }

      // If no id is passed, get all ID's to be paused.
      var ids = self._getSoundIds(id);

      for (var i = 0; i < ids.length; i++) {
        // Clear the end timer.
        self._clearTimer(ids[i]);

        // Get the sound.
        var sound = self._soundById(ids[i]);

        if (sound && !sound._paused) {
          // Reset the seek position.
          sound._seek = self.seek(ids[i]);
          sound._rateSeek = 0;
          sound._paused = true;

          // Stop currently running fades.
          self._stopFade(ids[i]);

          if (sound._node) {
            if (self._webAudio) {
              // Make sure the sound has been created.
              if (!sound._node.bufferSource) {
                continue;
              }

              if (typeof sound._node.bufferSource.stop === 'undefined') {
                sound._node.bufferSource.noteOff(0);
              } else {
                sound._node.bufferSource.stop(0);
              }

              // Clean up the buffer source.
              self._cleanBuffer(sound._node);
            } else if (!isNaN(sound._node.duration) || sound._node.duration === Infinity) {
              sound._node.pause();
            }
          }
        }

        // Fire the pause event, unless `true` is passed as the 2nd argument.
        if (!arguments[1]) {
          self._emit('pause', sound ? sound._id : null);
        }
      }

      return self;
    },

    /**
     * Stop playback and reset to start.
     * @param  {Number} id The sound ID (empty to stop all in group).
     * @param  {Boolean} internal Internal Use: true prevents event firing.
     * @return {Howl}
     */
    stop: function stop(id, internal) {
      var self = this;

      // If the sound hasn't loaded, add it to the load queue to stop when capable.
      if (self._state !== 'loaded') {
        self._queue.push({
          event: 'stop',
          action: function action() {
            self.stop(id);
          }
        });

        return self;
      }

      // If no id is passed, get all ID's to be stopped.
      var ids = self._getSoundIds(id);

      for (var i = 0; i < ids.length; i++) {
        // Clear the end timer.
        self._clearTimer(ids[i]);

        // Get the sound.
        var sound = self._soundById(ids[i]);

        if (sound) {
          // Reset the seek position.
          sound._seek = sound._start || 0;
          sound._rateSeek = 0;
          sound._paused = true;
          sound._ended = true;

          // Stop currently running fades.
          self._stopFade(ids[i]);

          if (sound._node) {
            if (self._webAudio) {
              // Make sure the sound's AudioBufferSourceNode has been created.
              if (sound._node.bufferSource) {
                if (typeof sound._node.bufferSource.stop === 'undefined') {
                  sound._node.bufferSource.noteOff(0);
                } else {
                  sound._node.bufferSource.stop(0);
                }

                // Clean up the buffer source.
                self._cleanBuffer(sound._node);
              }
            } else if (!isNaN(sound._node.duration) || sound._node.duration === Infinity) {
              sound._node.currentTime = sound._start || 0;
              sound._node.pause();
            }
          }

          if (!internal) {
            self._emit('stop', sound._id);
          }
        }
      }

      return self;
    },

    /**
     * Mute/unmute a single sound or all sounds in this Howl group.
     * @param  {Boolean} muted Set to true to mute and false to unmute.
     * @param  {Number} id    The sound ID to update (omit to mute/unmute all).
     * @return {Howl}
     */
    mute: function mute(muted, id) {
      var self = this;

      // If the sound hasn't loaded, add it to the load queue to mute when capable.
      if (self._state !== 'loaded') {
        self._queue.push({
          event: 'mute',
          action: function action() {
            self.mute(muted, id);
          }
        });

        return self;
      }

      // If applying mute/unmute to all sounds, update the group's value.
      if (typeof id === 'undefined') {
        if (typeof muted === 'boolean') {
          self._muted = muted;
        } else {
          return self._muted;
        }
      }

      // If no id is passed, get all ID's to be muted.
      var ids = self._getSoundIds(id);

      for (var i = 0; i < ids.length; i++) {
        // Get the sound.
        var sound = self._soundById(ids[i]);

        if (sound) {
          sound._muted = muted;

          // Cancel active fade and set the volume to the end value.
          if (sound._interval) {
            self._stopFade(sound._id);
          }

          if (self._webAudio && sound._node) {
            sound._node.gain.setValueAtTime(muted ? 0 : sound._volume, Howler.ctx.currentTime);
          } else if (sound._node) {
            sound._node.muted = Howler._muted ? true : muted;
          }

          self._emit('mute', sound._id);
        }
      }

      return self;
    },

    /**
     * Get/set the volume of this sound or of the Howl group. This method can optionally take 0, 1 or 2 arguments.
     *   volume() -> Returns the group's volume value.
     *   volume(id) -> Returns the sound id's current volume.
     *   volume(vol) -> Sets the volume of all sounds in this Howl group.
     *   volume(vol, id) -> Sets the volume of passed sound id.
     * @return {Howl/Number} Returns self or current volume.
     */
    volume: function volume() {
      var self = this;
      var args = arguments;
      var vol, id;

      // Determine the values based on arguments.
      if (args.length === 0) {
        // Return the value of the groups' volume.
        return self._volume;
      } else if (args.length === 1 || args.length === 2 && typeof args[1] === 'undefined') {
        // First check if this is an ID, and if not, assume it is a new volume.
        var ids = self._getSoundIds();
        var index = ids.indexOf(args[0]);
        if (index >= 0) {
          id = parseInt(args[0], 10);
        } else {
          vol = parseFloat(args[0]);
        }
      } else if (args.length >= 2) {
        vol = parseFloat(args[0]);
        id = parseInt(args[1], 10);
      }

      // Update the volume or return the current volume.
      var sound;
      if (typeof vol !== 'undefined' && vol >= 0 && vol <= 1) {
        // If the sound hasn't loaded, add it to the load queue to change volume when capable.
        if (self._state !== 'loaded') {
          self._queue.push({
            event: 'volume',
            action: function action() {
              self.volume.apply(self, args);
            }
          });

          return self;
        }

        // Set the group volume.
        if (typeof id === 'undefined') {
          self._volume = vol;
        }

        // Update one or all volumes.
        id = self._getSoundIds(id);
        for (var i = 0; i < id.length; i++) {
          // Get the sound.
          sound = self._soundById(id[i]);

          if (sound) {
            sound._volume = vol;

            // Stop currently running fades.
            if (!args[2]) {
              self._stopFade(id[i]);
            }

            if (self._webAudio && sound._node && !sound._muted) {
              sound._node.gain.setValueAtTime(vol, Howler.ctx.currentTime);
            } else if (sound._node && !sound._muted) {
              sound._node.volume = vol * Howler.volume();
            }

            self._emit('volume', sound._id);
          }
        }
      } else {
        sound = id ? self._soundById(id) : self._sounds[0];
        return sound ? sound._volume : 0;
      }

      return self;
    },

    /**
     * Fade a currently playing sound between two volumes (if no id is passsed, all sounds will fade).
     * @param  {Number} from The value to fade from (0.0 to 1.0).
     * @param  {Number} to   The volume to fade to (0.0 to 1.0).
     * @param  {Number} len  Time in milliseconds to fade.
     * @param  {Number} id   The sound id (omit to fade all sounds).
     * @return {Howl}
     */
    fade: function fade(from, to, len, id) {
      var self = this;

      // If the sound hasn't loaded, add it to the load queue to fade when capable.
      if (self._state !== 'loaded') {
        self._queue.push({
          event: 'fade',
          action: function action() {
            self.fade(from, to, len, id);
          }
        });

        return self;
      }

      // Set the volume to the start position.
      self.volume(from, id);

      // Fade the volume of one or all sounds.
      var ids = self._getSoundIds(id);
      for (var i = 0; i < ids.length; i++) {
        // Get the sound.
        var sound = self._soundById(ids[i]);

        // Create a linear fade or fall back to timeouts with HTML5 Audio.
        if (sound) {
          // Stop the previous fade if no sprite is being used (otherwise, volume handles this).
          if (!id) {
            self._stopFade(ids[i]);
          }

          // If we are using Web Audio, let the native methods do the actual fade.
          if (self._webAudio && !sound._muted) {
            var currentTime = Howler.ctx.currentTime;
            var end = currentTime + len / 1000;
            sound._volume = from;
            sound._node.gain.setValueAtTime(from, currentTime);
            sound._node.gain.linearRampToValueAtTime(to, end);
          }

          self._startFadeInterval(sound, from, to, len, ids[i], typeof id === 'undefined');
        }
      }

      return self;
    },

    /**
     * Starts the internal interval to fade a sound.
     * @param  {Object} sound Reference to sound to fade.
     * @param  {Number} from The value to fade from (0.0 to 1.0).
     * @param  {Number} to   The volume to fade to (0.0 to 1.0).
     * @param  {Number} len  Time in milliseconds to fade.
     * @param  {Number} id   The sound id to fade.
     * @param  {Boolean} isGroup   If true, set the volume on the group.
     */
    _startFadeInterval: function _startFadeInterval(sound, from, to, len, id, isGroup) {
      var self = this;
      var vol = from;
      var dir = from > to ? 'out' : 'in';
      var diff = Math.abs(from - to);
      var steps = diff / 0.01;
      var stepLen = steps > 0 ? len / steps : len;

      // Since browsers clamp timeouts to 4ms, we need to clamp our steps to that too.
      if (stepLen < 4) {
        steps = Math.ceil(steps / (4 / stepLen));
        stepLen = 4;
      }

      // Store the value being faded to.
      sound._fadeTo = to;

      // Update the volume value on each interval tick.
      sound._interval = setInterval(function () {
        // Update the volume amount, but only if the volume should change.
        if (steps > 0) {
          vol += dir === 'in' ? 0.01 : -0.01;
        }

        // Make sure the volume is in the right bounds.
        vol = Math.max(0, vol);
        vol = Math.min(1, vol);

        // Round to within 2 decimal points.
        vol = Math.round(vol * 100) / 100;

        // Change the volume.
        if (self._webAudio) {
          sound._volume = vol;
        } else {
          self.volume(vol, sound._id, true);
        }

        // Set the group's volume.
        if (isGroup) {
          self._volume = vol;
        }

        // When the fade is complete, stop it and fire event.
        if (to < from && vol <= to || to > from && vol >= to) {
          clearInterval(sound._interval);
          sound._interval = null;
          sound._fadeTo = null;
          self.volume(to, sound._id);
          self._emit('fade', sound._id);
        }
      }, stepLen);
    },

    /**
     * Internal method that stops the currently playing fade when
     * a new fade starts, volume is changed or the sound is stopped.
     * @param  {Number} id The sound id.
     * @return {Howl}
     */
    _stopFade: function _stopFade(id) {
      var self = this;
      var sound = self._soundById(id);

      if (sound && sound._interval) {
        if (self._webAudio) {
          sound._node.gain.cancelScheduledValues(Howler.ctx.currentTime);
        }

        clearInterval(sound._interval);
        sound._interval = null;
        self.volume(sound._fadeTo, id);
        sound._fadeTo = null;
        self._emit('fade', id);
      }

      return self;
    },

    /**
     * Get/set the loop parameter on a sound. This method can optionally take 0, 1 or 2 arguments.
     *   loop() -> Returns the group's loop value.
     *   loop(id) -> Returns the sound id's loop value.
     *   loop(loop) -> Sets the loop value for all sounds in this Howl group.
     *   loop(loop, id) -> Sets the loop value of passed sound id.
     * @return {Howl/Boolean} Returns self or current loop value.
     */
    loop: function loop() {
      var self = this;
      var args = arguments;
      var loop, id, sound;

      // Determine the values for loop and id.
      if (args.length === 0) {
        // Return the grou's loop value.
        return self._loop;
      } else if (args.length === 1) {
        if (typeof args[0] === 'boolean') {
          loop = args[0];
          self._loop = loop;
        } else {
          // Return this sound's loop value.
          sound = self._soundById(parseInt(args[0], 10));
          return sound ? sound._loop : false;
        }
      } else if (args.length === 2) {
        loop = args[0];
        id = parseInt(args[1], 10);
      }

      // If no id is passed, get all ID's to be looped.
      var ids = self._getSoundIds(id);
      for (var i = 0; i < ids.length; i++) {
        sound = self._soundById(ids[i]);

        if (sound) {
          sound._loop = loop;
          if (self._webAudio && sound._node && sound._node.bufferSource) {
            sound._node.bufferSource.loop = loop;
            if (loop) {
              sound._node.bufferSource.loopStart = sound._start || 0;
              sound._node.bufferSource.loopEnd = sound._stop;
            }
          }
        }
      }

      return self;
    },

    /**
     * Get/set the playback rate of a sound. This method can optionally take 0, 1 or 2 arguments.
     *   rate() -> Returns the first sound node's current playback rate.
     *   rate(id) -> Returns the sound id's current playback rate.
     *   rate(rate) -> Sets the playback rate of all sounds in this Howl group.
     *   rate(rate, id) -> Sets the playback rate of passed sound id.
     * @return {Howl/Number} Returns self or the current playback rate.
     */
    rate: function rate() {
      var self = this;
      var args = arguments;
      var rate, id;

      // Determine the values based on arguments.
      if (args.length === 0) {
        // We will simply return the current rate of the first node.
        id = self._sounds[0]._id;
      } else if (args.length === 1) {
        // First check if this is an ID, and if not, assume it is a new rate value.
        var ids = self._getSoundIds();
        var index = ids.indexOf(args[0]);
        if (index >= 0) {
          id = parseInt(args[0], 10);
        } else {
          rate = parseFloat(args[0]);
        }
      } else if (args.length === 2) {
        rate = parseFloat(args[0]);
        id = parseInt(args[1], 10);
      }

      // Update the playback rate or return the current value.
      var sound;
      if (typeof rate === 'number') {
        // If the sound hasn't loaded, add it to the load queue to change playback rate when capable.
        if (self._state !== 'loaded') {
          self._queue.push({
            event: 'rate',
            action: function action() {
              self.rate.apply(self, args);
            }
          });

          return self;
        }

        // Set the group rate.
        if (typeof id === 'undefined') {
          self._rate = rate;
        }

        // Update one or all volumes.
        id = self._getSoundIds(id);
        for (var i = 0; i < id.length; i++) {
          // Get the sound.
          sound = self._soundById(id[i]);

          if (sound) {
            // Keep track of our position when the rate changed and update the playback
            // start position so we can properly adjust the seek position for time elapsed.
            sound._rateSeek = self.seek(id[i]);
            sound._playStart = self._webAudio ? Howler.ctx.currentTime : sound._playStart;
            sound._rate = rate;

            // Change the playback rate.
            if (self._webAudio && sound._node && sound._node.bufferSource) {
              sound._node.bufferSource.playbackRate.value = rate;
            } else if (sound._node) {
              sound._node.playbackRate = rate;
            }

            // Reset the timers.
            var seek = self.seek(id[i]);
            var duration = (self._sprite[sound._sprite][0] + self._sprite[sound._sprite][1]) / 1000 - seek;
            var timeout = duration * 1000 / Math.abs(sound._rate);

            // Start a new end timer if sound is already playing.
            if (self._endTimers[id[i]] || !sound._paused) {
              self._clearTimer(id[i]);
              self._endTimers[id[i]] = setTimeout(self._ended.bind(self, sound), timeout);
            }

            self._emit('rate', sound._id);
          }
        }
      } else {
        sound = self._soundById(id);
        return sound ? sound._rate : self._rate;
      }

      return self;
    },

    /**
     * Get/set the seek position of a sound. This method can optionally take 0, 1 or 2 arguments.
     *   seek() -> Returns the first sound node's current seek position.
     *   seek(id) -> Returns the sound id's current seek position.
     *   seek(seek) -> Sets the seek position of the first sound node.
     *   seek(seek, id) -> Sets the seek position of passed sound id.
     * @return {Howl/Number} Returns self or the current seek position.
     */
    seek: function seek() {
      var self = this;
      var args = arguments;
      var seek, id;

      // Determine the values based on arguments.
      if (args.length === 0) {
        // We will simply return the current position of the first node.
        id = self._sounds[0]._id;
      } else if (args.length === 1) {
        // First check if this is an ID, and if not, assume it is a new seek position.
        var ids = self._getSoundIds();
        var index = ids.indexOf(args[0]);
        if (index >= 0) {
          id = parseInt(args[0], 10);
        } else if (self._sounds.length) {
          id = self._sounds[0]._id;
          seek = parseFloat(args[0]);
        }
      } else if (args.length === 2) {
        seek = parseFloat(args[0]);
        id = parseInt(args[1], 10);
      }

      // If there is no ID, bail out.
      if (typeof id === 'undefined') {
        return self;
      }

      // If the sound hasn't loaded, add it to the load queue to seek when capable.
      if (self._state !== 'loaded') {
        self._queue.push({
          event: 'seek',
          action: function action() {
            self.seek.apply(self, args);
          }
        });

        return self;
      }

      // Get the sound.
      var sound = self._soundById(id);

      if (sound) {
        if (typeof seek === 'number' && seek >= 0) {
          // Pause the sound and update position for restarting playback.
          var playing = self.playing(id);
          if (playing) {
            self.pause(id, true);
          }

          // Move the position of the track and cancel timer.
          sound._seek = seek;
          sound._ended = false;
          self._clearTimer(id);

          // Restart the playback if the sound was playing.
          if (playing) {
            self.play(id, true);
          }

          // Update the seek position for HTML5 Audio.
          if (!self._webAudio && sound._node) {
            sound._node.currentTime = seek;
          }

          self._emit('seek', id);
        } else {
          if (self._webAudio) {
            var realTime = self.playing(id) ? Howler.ctx.currentTime - sound._playStart : 0;
            var rateSeek = sound._rateSeek ? sound._rateSeek - sound._seek : 0;
            return sound._seek + (rateSeek + realTime * Math.abs(sound._rate));
          } else {
            return sound._node.currentTime;
          }
        }
      }

      return self;
    },

    /**
     * Check if a specific sound is currently playing or not (if id is provided), or check if at least one of the sounds in the group is playing or not.
     * @param  {Number}  id The sound id to check. If none is passed, the whole sound group is checked.
     * @return {Boolean} True if playing and false if not.
     */
    playing: function playing(id) {
      var self = this;

      // Check the passed sound ID (if any).
      if (typeof id === 'number') {
        var sound = self._soundById(id);
        return sound ? !sound._paused : false;
      }

      // Otherwise, loop through all sounds and check if any are playing.
      for (var i = 0; i < self._sounds.length; i++) {
        if (!self._sounds[i]._paused) {
          return true;
        }
      }

      return false;
    },

    /**
     * Get the duration of this sound. Passing a sound id will return the sprite duration.
     * @param  {Number} id The sound id to check. If none is passed, return full source duration.
     * @return {Number} Audio duration in seconds.
     */
    duration: function duration(id) {
      var self = this;
      var duration = self._duration;

      // If we pass an ID, get the sound and return the sprite length.
      var sound = self._soundById(id);
      if (sound) {
        duration = self._sprite[sound._sprite][1] / 1000;
      }

      return duration;
    },

    /**
     * Returns the current loaded state of this Howl.
     * @return {String} 'unloaded', 'loading', 'loaded'
     */
    state: function state() {
      return this._state;
    },

    /**
     * Unload and destroy the current Howl object.
     * This will immediately stop all sound instances attached to this group.
     */
    unload: function unload() {
      var self = this;

      // Stop playing any active sounds.
      var sounds = self._sounds;
      for (var i = 0; i < sounds.length; i++) {
        // Stop the sound if it is currently playing.
        if (!sounds[i]._paused) {
          self.stop(sounds[i]._id);
        }

        // Remove the source or disconnect.
        if (!self._webAudio) {
          // Set the source to 0-second silence to stop any downloading (except in IE).
          var checkIE = /MSIE |Trident\//.test(Howler._navigator && Howler._navigator.userAgent);
          if (!checkIE) {
            sounds[i]._node.src = 'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA';
          }

          // Remove any event listeners.
          sounds[i]._node.removeEventListener('error', sounds[i]._errorFn, false);
          sounds[i]._node.removeEventListener(Howler._canPlayEvent, sounds[i]._loadFn, false);
        }

        // Empty out all of the nodes.
        delete sounds[i]._node;

        // Make sure all timers are cleared out.
        self._clearTimer(sounds[i]._id);

        // Remove the references in the global Howler object.
        var index = Howler._howls.indexOf(self);
        if (index >= 0) {
          Howler._howls.splice(index, 1);
        }
      }

      // Delete this sound from the cache (if no other Howl is using it).
      var remCache = true;
      for (i = 0; i < Howler._howls.length; i++) {
        if (Howler._howls[i]._src === self._src) {
          remCache = false;
          break;
        }
      }

      if (cache && remCache) {
        delete cache[self._src];
      }

      // Clear global errors.
      Howler.noAudio = false;

      // Clear out `self`.
      self._state = 'unloaded';
      self._sounds = [];
      self = null;

      return null;
    },

    /**
     * Listen to a custom event.
     * @param  {String}   event Event name.
     * @param  {Function} fn    Listener to call.
     * @param  {Number}   id    (optional) Only listen to events for this sound.
     * @param  {Number}   once  (INTERNAL) Marks event to fire only once.
     * @return {Howl}
     */
    on: function on(event, fn, id, once) {
      var self = this;
      var events = self['_on' + event];

      if (typeof fn === 'function') {
        events.push(once ? { id: id, fn: fn, once: once } : { id: id, fn: fn });
      }

      return self;
    },

    /**
     * Remove a custom event. Call without parameters to remove all events.
     * @param  {String}   event Event name.
     * @param  {Function} fn    Listener to remove. Leave empty to remove all.
     * @param  {Number}   id    (optional) Only remove events for this sound.
     * @return {Howl}
     */
    off: function off(event, fn, id) {
      var self = this;
      var events = self['_on' + event];
      var i = 0;

      // Allow passing just an event and ID.
      if (typeof fn === 'number') {
        id = fn;
        fn = null;
      }

      if (fn || id) {
        // Loop through event store and remove the passed function.
        for (i = 0; i < events.length; i++) {
          var isId = id === events[i].id;
          if (fn === events[i].fn && isId || !fn && isId) {
            events.splice(i, 1);
            break;
          }
        }
      } else if (event) {
        // Clear out all events of this type.
        self['_on' + event] = [];
      } else {
        // Clear out all events of every type.
        var keys = Object.keys(self);
        for (i = 0; i < keys.length; i++) {
          if (keys[i].indexOf('_on') === 0 && Array.isArray(self[keys[i]])) {
            self[keys[i]] = [];
          }
        }
      }

      return self;
    },

    /**
     * Listen to a custom event and remove it once fired.
     * @param  {String}   event Event name.
     * @param  {Function} fn    Listener to call.
     * @param  {Number}   id    (optional) Only listen to events for this sound.
     * @return {Howl}
     */
    once: function once(event, fn, id) {
      var self = this;

      // Setup the event listener.
      self.on(event, fn, id, 1);

      return self;
    },

    /**
     * Emit all events of a specific type and pass the sound id.
     * @param  {String} event Event name.
     * @param  {Number} id    Sound ID.
     * @param  {Number} msg   Message to go with event.
     * @return {Howl}
     */
    _emit: function _emit(event, id, msg) {
      var self = this;
      var events = self['_on' + event];

      // Loop through event store and fire all functions.
      for (var i = events.length - 1; i >= 0; i--) {
        if (!events[i].id || events[i].id === id || event === 'load') {
          setTimeout(function (fn) {
            fn.call(this, id, msg);
          }.bind(self, events[i].fn), 0);

          // If this event was setup with `once`, remove it.
          if (events[i].once) {
            self.off(event, events[i].fn, events[i].id);
          }
        }
      }

      return self;
    },

    /**
     * Queue of actions initiated before the sound has loaded.
     * These will be called in sequence, with the next only firing
     * after the previous has finished executing (even if async like play).
     * @return {Howl}
     */
    _loadQueue: function _loadQueue() {
      var self = this;

      if (self._queue.length > 0) {
        var task = self._queue[0];

        // don't move onto the next task until this one is done
        self.once(task.event, function () {
          self._queue.shift();
          self._loadQueue();
        });

        task.action();
      }

      return self;
    },

    /**
     * Fired when playback ends at the end of the duration.
     * @param  {Sound} sound The sound object to work with.
     * @return {Howl}
     */
    _ended: function _ended(sound) {
      var self = this;
      var sprite = sound._sprite;

      // If we are using IE and there was network latency we may be clipping
      // audio before it completes playing. Lets check the node to make sure it
      // believes it has completed, before ending the playback.
      if (!self._webAudio && sound._node && !sound._node.paused && !sound._node.ended && sound._node.currentTime < sound._stop) {
        setTimeout(self._ended.bind(self, sound), 100);
        return self;
      }

      // Should this sound loop?
      var loop = !!(sound._loop || self._sprite[sprite][2]);

      // Fire the ended event.
      self._emit('end', sound._id);

      // Restart the playback for HTML5 Audio loop.
      if (!self._webAudio && loop) {
        self.stop(sound._id, true).play(sound._id);
      }

      // Restart this timer if on a Web Audio loop.
      if (self._webAudio && loop) {
        self._emit('play', sound._id);
        sound._seek = sound._start || 0;
        sound._rateSeek = 0;
        sound._playStart = Howler.ctx.currentTime;

        var timeout = (sound._stop - sound._start) * 1000 / Math.abs(sound._rate);
        self._endTimers[sound._id] = setTimeout(self._ended.bind(self, sound), timeout);
      }

      // Mark the node as paused.
      if (self._webAudio && !loop) {
        sound._paused = true;
        sound._ended = true;
        sound._seek = sound._start || 0;
        sound._rateSeek = 0;
        self._clearTimer(sound._id);

        // Clean up the buffer source.
        self._cleanBuffer(sound._node);

        // Attempt to auto-suspend AudioContext if no sounds are still playing.
        Howler._autoSuspend();
      }

      // When using a sprite, end the track.
      if (!self._webAudio && !loop) {
        self.stop(sound._id);
      }

      return self;
    },

    /**
     * Clear the end timer for a sound playback.
     * @param  {Number} id The sound ID.
     * @return {Howl}
     */
    _clearTimer: function _clearTimer(id) {
      var self = this;

      if (self._endTimers[id]) {
        clearTimeout(self._endTimers[id]);
        delete self._endTimers[id];
      }

      return self;
    },

    /**
     * Return the sound identified by this ID, or return null.
     * @param  {Number} id Sound ID
     * @return {Object}    Sound object or null.
     */
    _soundById: function _soundById(id) {
      var self = this;

      // Loop through all sounds and find the one with this ID.
      for (var i = 0; i < self._sounds.length; i++) {
        if (id === self._sounds[i]._id) {
          return self._sounds[i];
        }
      }

      return null;
    },

    /**
     * Return an inactive sound from the pool or create a new one.
     * @return {Sound} Sound playback object.
     */
    _inactiveSound: function _inactiveSound() {
      var self = this;

      self._drain();

      // Find the first inactive node to recycle.
      for (var i = 0; i < self._sounds.length; i++) {
        if (self._sounds[i]._ended) {
          return self._sounds[i].reset();
        }
      }

      // If no inactive node was found, create a new one.
      return new Sound(self);
    },

    /**
     * Drain excess inactive sounds from the pool.
     */
    _drain: function _drain() {
      var self = this;
      var limit = self._pool;
      var cnt = 0;
      var i = 0;

      // If there are less sounds than the max pool size, we are done.
      if (self._sounds.length < limit) {
        return;
      }

      // Count the number of inactive sounds.
      for (i = 0; i < self._sounds.length; i++) {
        if (self._sounds[i]._ended) {
          cnt++;
        }
      }

      // Remove excess inactive sounds, going in reverse order.
      for (i = self._sounds.length - 1; i >= 0; i--) {
        if (cnt <= limit) {
          return;
        }

        if (self._sounds[i]._ended) {
          // Disconnect the audio source when using Web Audio.
          if (self._webAudio && self._sounds[i]._node) {
            self._sounds[i]._node.disconnect(0);
          }

          // Remove sounds until we have the pool size.
          self._sounds.splice(i, 1);
          cnt--;
        }
      }
    },

    /**
     * Get all ID's from the sounds pool.
     * @param  {Number} id Only return one ID if one is passed.
     * @return {Array}    Array of IDs.
     */
    _getSoundIds: function _getSoundIds(id) {
      var self = this;

      if (typeof id === 'undefined') {
        var ids = [];
        for (var i = 0; i < self._sounds.length; i++) {
          ids.push(self._sounds[i]._id);
        }

        return ids;
      } else {
        return [id];
      }
    },

    /**
     * Load the sound back into the buffer source.
     * @param  {Sound} sound The sound object to work with.
     * @return {Howl}
     */
    _refreshBuffer: function _refreshBuffer(sound) {
      var self = this;

      // Setup the buffer source for playback.
      sound._node.bufferSource = Howler.ctx.createBufferSource();
      sound._node.bufferSource.buffer = cache[self._src];

      // Connect to the correct node.
      if (sound._panner) {
        sound._node.bufferSource.connect(sound._panner);
      } else {
        sound._node.bufferSource.connect(sound._node);
      }

      // Setup looping and playback rate.
      sound._node.bufferSource.loop = sound._loop;
      if (sound._loop) {
        sound._node.bufferSource.loopStart = sound._start || 0;
        sound._node.bufferSource.loopEnd = sound._stop;
      }
      sound._node.bufferSource.playbackRate.value = sound._rate;

      return self;
    },

    /**
     * Prevent memory leaks by cleaning up the buffer source after playback.
     * @param  {Object} node Sound's audio node containing the buffer source.
     * @return {Howl}
     */
    _cleanBuffer: function _cleanBuffer(node) {
      var self = this;

      if (Howler._scratchBuffer) {
        node.bufferSource.onended = null;
        node.bufferSource.disconnect(0);
        try {
          node.bufferSource.buffer = Howler._scratchBuffer;
        } catch (e) {}
      }
      node.bufferSource = null;

      return self;
    }
  };

  /** Single Sound Methods **/
  /***************************************************************************/

  /**
   * Setup the sound object, which each node attached to a Howl group is contained in.
   * @param {Object} howl The Howl parent group.
   */
  var Sound = function Sound(howl) {
    this._parent = howl;
    this.init();
  };
  Sound.prototype = {
    /**
     * Initialize a new Sound object.
     * @return {Sound}
     */
    init: function init() {
      var self = this;
      var parent = self._parent;

      // Setup the default parameters.
      self._muted = parent._muted;
      self._loop = parent._loop;
      self._volume = parent._volume;
      self._rate = parent._rate;
      self._seek = 0;
      self._paused = true;
      self._ended = true;
      self._sprite = '__default';

      // Generate a unique ID for this sound.
      self._id = ++Howler._counter;

      // Add itself to the parent's pool.
      parent._sounds.push(self);

      // Create the new node.
      self.create();

      return self;
    },

    /**
     * Create and setup a new sound object, whether HTML5 Audio or Web Audio.
     * @return {Sound}
     */
    create: function create() {
      var self = this;
      var parent = self._parent;
      var volume = Howler._muted || self._muted || self._parent._muted ? 0 : self._volume;

      if (parent._webAudio) {
        // Create the gain node for controlling volume (the source will connect to this).
        self._node = typeof Howler.ctx.createGain === 'undefined' ? Howler.ctx.createGainNode() : Howler.ctx.createGain();
        self._node.gain.setValueAtTime(volume, Howler.ctx.currentTime);
        self._node.paused = true;
        self._node.connect(Howler.masterGain);
      } else {
        self._node = new Audio();

        // Listen for errors (http://dev.w3.org/html5/spec-author-view/spec.html#mediaerror).
        self._errorFn = self._errorListener.bind(self);
        self._node.addEventListener('error', self._errorFn, false);

        // Listen for 'canplaythrough' event to let us know the sound is ready.
        self._loadFn = self._loadListener.bind(self);
        self._node.addEventListener(Howler._canPlayEvent, self._loadFn, false);

        // Setup the new audio node.
        self._node.src = parent._src;
        self._node.preload = 'auto';
        self._node.volume = volume * Howler.volume();

        // Begin loading the source.
        self._node.load();
      }

      return self;
    },

    /**
     * Reset the parameters of this sound to the original state (for recycle).
     * @return {Sound}
     */
    reset: function reset() {
      var self = this;
      var parent = self._parent;

      // Reset all of the parameters of this sound.
      self._muted = parent._muted;
      self._loop = parent._loop;
      self._volume = parent._volume;
      self._rate = parent._rate;
      self._seek = 0;
      self._rateSeek = 0;
      self._paused = true;
      self._ended = true;
      self._sprite = '__default';

      // Generate a new ID so that it isn't confused with the previous sound.
      self._id = ++Howler._counter;

      return self;
    },

    /**
     * HTML5 Audio error listener callback.
     */
    _errorListener: function _errorListener() {
      var self = this;

      // Fire an error event and pass back the code.
      self._parent._emit('loaderror', self._id, self._node.error ? self._node.error.code : 0);

      // Clear the event listener.
      self._node.removeEventListener('error', self._errorFn, false);
    },

    /**
     * HTML5 Audio canplaythrough listener callback.
     */
    _loadListener: function _loadListener() {
      var self = this;
      var parent = self._parent;

      // Round up the duration to account for the lower precision in HTML5 Audio.
      parent._duration = Math.ceil(self._node.duration * 10) / 10;

      // Setup a sprite if none is defined.
      if (Object.keys(parent._sprite).length === 0) {
        parent._sprite = { __default: [0, parent._duration * 1000] };
      }

      if (parent._state !== 'loaded') {
        parent._state = 'loaded';
        parent._emit('load');
        parent._loadQueue();
      }

      // Clear the event listener.
      self._node.removeEventListener(Howler._canPlayEvent, self._loadFn, false);
    }
  };

  /** Helper Methods **/
  /***************************************************************************/

  var cache = {};

  /**
   * Buffer a sound from URL, Data URI or cache and decode to audio source (Web Audio API).
   * @param  {Howl} self
   */
  var loadBuffer = function loadBuffer(self) {
    var url = self._src;

    // Check if the buffer has already been cached and use it instead.
    if (cache[url]) {
      // Set the duration from the cache.
      self._duration = cache[url].duration;

      // Load the sound into this Howl.
      loadSound(self);

      return;
    }

    if (/^data:[^;]+;base64,/.test(url)) {
      // Decode the base64 data URI without XHR, since some browsers don't support it.
      var data = atob(url.split(',')[1]);
      var dataView = new Uint8Array(data.length);
      for (var i = 0; i < data.length; ++i) {
        dataView[i] = data.charCodeAt(i);
      }

      decodeAudioData(dataView.buffer, self);
    } else {
      // Load the buffer from the URL.
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url, true);
      xhr.withCredentials = self._xhrWithCredentials;
      xhr.responseType = 'arraybuffer';
      xhr.onload = function () {
        // Make sure we get a successful response back.
        var code = (xhr.status + '')[0];
        if (code !== '0' && code !== '2' && code !== '3') {
          self._emit('loaderror', null, 'Failed loading audio file with status: ' + xhr.status + '.');
          return;
        }

        decodeAudioData(xhr.response, self);
      };
      xhr.onerror = function () {
        // If there is an error, switch to HTML5 Audio.
        if (self._webAudio) {
          self._html5 = true;
          self._webAudio = false;
          self._sounds = [];
          delete cache[url];
          self.load();
        }
      };
      safeXhrSend(xhr);
    }
  };

  /**
   * Send the XHR request wrapped in a try/catch.
   * @param  {Object} xhr XHR to send.
   */
  var safeXhrSend = function safeXhrSend(xhr) {
    try {
      xhr.send();
    } catch (e) {
      xhr.onerror();
    }
  };

  /**
   * Decode audio data from an array buffer.
   * @param  {ArrayBuffer} arraybuffer The audio data.
   * @param  {Howl}        self
   */
  var decodeAudioData = function decodeAudioData(arraybuffer, self) {
    // Decode the buffer into an audio source.
    Howler.ctx.decodeAudioData(arraybuffer, function (buffer) {
      if (buffer && self._sounds.length > 0) {
        cache[self._src] = buffer;
        loadSound(self, buffer);
      }
    }, function () {
      self._emit('loaderror', null, 'Decoding audio data failed.');
    });
  };

  /**
   * Sound is now loaded, so finish setting everything up and fire the loaded event.
   * @param  {Howl} self
   * @param  {Object} buffer The decoded buffer sound source.
   */
  var loadSound = function loadSound(self, buffer) {
    // Set the duration.
    if (buffer && !self._duration) {
      self._duration = buffer.duration;
    }

    // Setup a sprite if none is defined.
    if (Object.keys(self._sprite).length === 0) {
      self._sprite = { __default: [0, self._duration * 1000] };
    }

    // Fire the loaded event.
    if (self._state !== 'loaded') {
      self._state = 'loaded';
      self._emit('load');
      self._loadQueue();
    }
  };

  /**
   * Setup the audio context when available, or switch to HTML5 Audio mode.
   */
  var setupAudioContext = function setupAudioContext() {
    // Check if we are using Web Audio and setup the AudioContext if we are.
    try {
      if (typeof AudioContext !== 'undefined') {
        Howler.ctx = new AudioContext();
      } else if (typeof webkitAudioContext !== 'undefined') {
        Howler.ctx = new webkitAudioContext();
      } else {
        Howler.usingWebAudio = false;
      }
    } catch (e) {
      Howler.usingWebAudio = false;
    }

    // Check if a webview is being used on iOS8 or earlier (rather than the browser).
    // If it is, disable Web Audio as it causes crashing.
    var iOS = /iP(hone|od|ad)/.test(Howler._navigator && Howler._navigator.platform);
    var appVersion = Howler._navigator && Howler._navigator.appVersion.match(/OS (\d+)_(\d+)_?(\d+)?/);
    var version = appVersion ? parseInt(appVersion[1], 10) : null;
    if (iOS && version && version < 9) {
      var safari = /safari/.test(Howler._navigator && Howler._navigator.userAgent.toLowerCase());
      if (Howler._navigator && Howler._navigator.standalone && !safari || Howler._navigator && !Howler._navigator.standalone && !safari) {
        Howler.usingWebAudio = false;
      }
    }

    // Create and expose the master GainNode when using Web Audio (useful for plugins or advanced usage).
    if (Howler.usingWebAudio) {
      Howler.masterGain = typeof Howler.ctx.createGain === 'undefined' ? Howler.ctx.createGainNode() : Howler.ctx.createGain();
      Howler.masterGain.gain.setValueAtTime(Howler._muted ? 0 : 1, Howler.ctx.currentTime);
      Howler.masterGain.connect(Howler.ctx.destination);
    }

    // Re-run the setup on Howler.
    Howler._setup();
  };

  // Add support for AMD (Asynchronous Module Definition) libraries such as require.js.
  if (typeof define === 'function' && define.amd) {
    define([], function () {
      return {
        Howler: Howler,
        Howl: Howl
      };
    });
  }

  // Add support for CommonJS libraries such as browserify.
  if (typeof exports !== 'undefined') {
    exports.Howler = Howler;
    exports.Howl = Howl;
  }

  // Define globally in case AMD is not available or unused.
  if (typeof window !== 'undefined') {
    window.HowlerGlobal = HowlerGlobal;
    window.Howler = Howler;
    window.Howl = Howl;
    window.Sound = Sound;
  } else if (typeof global !== 'undefined') {
    // Add to global in Node.js (for testing, etc).
    global.HowlerGlobal = HowlerGlobal;
    global.Howler = Howler;
    global.Howl = Howl;
    global.Sound = Sound;
  }
})();

/*!
 *  Spatial Plugin - Adds support for stereo and 3D audio where Web Audio is supported.
 *  
 *  howler.js v2.0.7
 *  howlerjs.com
 *
 *  (c) 2013-2017, James Simpson of GoldFire Studios
 *  goldfirestudios.com
 *
 *  MIT License
 */

(function () {

  'use strict';

  // Setup default properties.

  HowlerGlobal.prototype._pos = [0, 0, 0];
  HowlerGlobal.prototype._orientation = [0, 0, -1, 0, 1, 0];

  /** Global Methods **/
  /***************************************************************************/

  /**
   * Helper method to update the stereo panning position of all current Howls.
   * Future Howls will not use this value unless explicitly set.
   * @param  {Number} pan A value of -1.0 is all the way left and 1.0 is all the way right.
   * @return {Howler/Number}     Self or current stereo panning value.
   */
  HowlerGlobal.prototype.stereo = function (pan) {
    var self = this;

    // Stop right here if not using Web Audio.
    if (!self.ctx || !self.ctx.listener) {
      return self;
    }

    // Loop through all Howls and update their stereo panning.
    for (var i = self._howls.length - 1; i >= 0; i--) {
      self._howls[i].stereo(pan);
    }

    return self;
  };

  /**
   * Get/set the position of the listener in 3D cartesian space. Sounds using
   * 3D position will be relative to the listener's position.
   * @param  {Number} x The x-position of the listener.
   * @param  {Number} y The y-position of the listener.
   * @param  {Number} z The z-position of the listener.
   * @return {Howler/Array}   Self or current listener position.
   */
  HowlerGlobal.prototype.pos = function (x, y, z) {
    var self = this;

    // Stop right here if not using Web Audio.
    if (!self.ctx || !self.ctx.listener) {
      return self;
    }

    // Set the defaults for optional 'y' & 'z'.
    y = typeof y !== 'number' ? self._pos[1] : y;
    z = typeof z !== 'number' ? self._pos[2] : z;

    if (typeof x === 'number') {
      self._pos = [x, y, z];
      self.ctx.listener.setPosition(self._pos[0], self._pos[1], self._pos[2]);
    } else {
      return self._pos;
    }

    return self;
  };

  /**
   * Get/set the direction the listener is pointing in the 3D cartesian space.
   * A front and up vector must be provided. The front is the direction the
   * face of the listener is pointing, and up is the direction the top of the
   * listener is pointing. Thus, these values are expected to be at right angles
   * from each other.
   * @param  {Number} x   The x-orientation of the listener.
   * @param  {Number} y   The y-orientation of the listener.
   * @param  {Number} z   The z-orientation of the listener.
   * @param  {Number} xUp The x-orientation of the top of the listener.
   * @param  {Number} yUp The y-orientation of the top of the listener.
   * @param  {Number} zUp The z-orientation of the top of the listener.
   * @return {Howler/Array}     Returns self or the current orientation vectors.
   */
  HowlerGlobal.prototype.orientation = function (x, y, z, xUp, yUp, zUp) {
    var self = this;

    // Stop right here if not using Web Audio.
    if (!self.ctx || !self.ctx.listener) {
      return self;
    }

    // Set the defaults for optional 'y' & 'z'.
    var or = self._orientation;
    y = typeof y !== 'number' ? or[1] : y;
    z = typeof z !== 'number' ? or[2] : z;
    xUp = typeof xUp !== 'number' ? or[3] : xUp;
    yUp = typeof yUp !== 'number' ? or[4] : yUp;
    zUp = typeof zUp !== 'number' ? or[5] : zUp;

    if (typeof x === 'number') {
      self._orientation = [x, y, z, xUp, yUp, zUp];
      self.ctx.listener.setOrientation(x, y, z, xUp, yUp, zUp);
    } else {
      return or;
    }

    return self;
  };

  /** Group Methods **/
  /***************************************************************************/

  /**
   * Add new properties to the core init.
   * @param  {Function} _super Core init method.
   * @return {Howl}
   */
  Howl.prototype.init = function (_super) {
    return function (o) {
      var self = this;

      // Setup user-defined default properties.
      self._orientation = o.orientation || [1, 0, 0];
      self._stereo = o.stereo || null;
      self._pos = o.pos || null;
      self._pannerAttr = {
        coneInnerAngle: typeof o.coneInnerAngle !== 'undefined' ? o.coneInnerAngle : 360,
        coneOuterAngle: typeof o.coneOuterAngle !== 'undefined' ? o.coneOuterAngle : 360,
        coneOuterGain: typeof o.coneOuterGain !== 'undefined' ? o.coneOuterGain : 0,
        distanceModel: typeof o.distanceModel !== 'undefined' ? o.distanceModel : 'inverse',
        maxDistance: typeof o.maxDistance !== 'undefined' ? o.maxDistance : 10000,
        panningModel: typeof o.panningModel !== 'undefined' ? o.panningModel : 'HRTF',
        refDistance: typeof o.refDistance !== 'undefined' ? o.refDistance : 1,
        rolloffFactor: typeof o.rolloffFactor !== 'undefined' ? o.rolloffFactor : 1
      };

      // Setup event listeners.
      self._onstereo = o.onstereo ? [{ fn: o.onstereo }] : [];
      self._onpos = o.onpos ? [{ fn: o.onpos }] : [];
      self._onorientation = o.onorientation ? [{ fn: o.onorientation }] : [];

      // Complete initilization with howler.js core's init function.
      return _super.call(this, o);
    };
  }(Howl.prototype.init);

  /**
   * Get/set the stereo panning of the audio source for this sound or all in the group.
   * @param  {Number} pan  A value of -1.0 is all the way left and 1.0 is all the way right.
   * @param  {Number} id (optional) The sound ID. If none is passed, all in group will be updated.
   * @return {Howl/Number}    Returns self or the current stereo panning value.
   */
  Howl.prototype.stereo = function (pan, id) {
    var self = this;

    // Stop right here if not using Web Audio.
    if (!self._webAudio) {
      return self;
    }

    // If the sound hasn't loaded, add it to the load queue to change stereo pan when capable.
    if (self._state !== 'loaded') {
      self._queue.push({
        event: 'stereo',
        action: function action() {
          self.stereo(pan, id);
        }
      });

      return self;
    }

    // Check for PannerStereoNode support and fallback to PannerNode if it doesn't exist.
    var pannerType = typeof Howler.ctx.createStereoPanner === 'undefined' ? 'spatial' : 'stereo';

    // Setup the group's stereo panning if no ID is passed.
    if (typeof id === 'undefined') {
      // Return the group's stereo panning if no parameters are passed.
      if (typeof pan === 'number') {
        self._stereo = pan;
        self._pos = [pan, 0, 0];
      } else {
        return self._stereo;
      }
    }

    // Change the streo panning of one or all sounds in group.
    var ids = self._getSoundIds(id);
    for (var i = 0; i < ids.length; i++) {
      // Get the sound.
      var sound = self._soundById(ids[i]);

      if (sound) {
        if (typeof pan === 'number') {
          sound._stereo = pan;
          sound._pos = [pan, 0, 0];

          if (sound._node) {
            // If we are falling back, make sure the panningModel is equalpower.
            sound._pannerAttr.panningModel = 'equalpower';

            // Check if there is a panner setup and create a new one if not.
            if (!sound._panner || !sound._panner.pan) {
              setupPanner(sound, pannerType);
            }

            if (pannerType === 'spatial') {
              sound._panner.setPosition(pan, 0, 0);
            } else {
              sound._panner.pan.setValueAtTime(pan, Howler.ctx.currentTime);
            }
          }

          self._emit('stereo', sound._id);
        } else {
          return sound._stereo;
        }
      }
    }

    return self;
  };

  /**
   * Get/set the 3D spatial position of the audio source for this sound or group relative to the global listener.
   * @param  {Number} x  The x-position of the audio source.
   * @param  {Number} y  The y-position of the audio source.
   * @param  {Number} z  The z-position of the audio source.
   * @param  {Number} id (optional) The sound ID. If none is passed, all in group will be updated.
   * @return {Howl/Array}    Returns self or the current 3D spatial position: [x, y, z].
   */
  Howl.prototype.pos = function (x, y, z, id) {
    var self = this;

    // Stop right here if not using Web Audio.
    if (!self._webAudio) {
      return self;
    }

    // If the sound hasn't loaded, add it to the load queue to change position when capable.
    if (self._state !== 'loaded') {
      self._queue.push({
        event: 'pos',
        action: function action() {
          self.pos(x, y, z, id);
        }
      });

      return self;
    }

    // Set the defaults for optional 'y' & 'z'.
    y = typeof y !== 'number' ? 0 : y;
    z = typeof z !== 'number' ? -0.5 : z;

    // Setup the group's spatial position if no ID is passed.
    if (typeof id === 'undefined') {
      // Return the group's spatial position if no parameters are passed.
      if (typeof x === 'number') {
        self._pos = [x, y, z];
      } else {
        return self._pos;
      }
    }

    // Change the spatial position of one or all sounds in group.
    var ids = self._getSoundIds(id);
    for (var i = 0; i < ids.length; i++) {
      // Get the sound.
      var sound = self._soundById(ids[i]);

      if (sound) {
        if (typeof x === 'number') {
          sound._pos = [x, y, z];

          if (sound._node) {
            // Check if there is a panner setup and create a new one if not.
            if (!sound._panner || sound._panner.pan) {
              setupPanner(sound, 'spatial');
            }

            sound._panner.setPosition(x, y, z);
          }

          self._emit('pos', sound._id);
        } else {
          return sound._pos;
        }
      }
    }

    return self;
  };

  /**
   * Get/set the direction the audio source is pointing in the 3D cartesian coordinate
   * space. Depending on how direction the sound is, based on the `cone` attributes,
   * a sound pointing away from the listener can be quiet or silent.
   * @param  {Number} x  The x-orientation of the source.
   * @param  {Number} y  The y-orientation of the source.
   * @param  {Number} z  The z-orientation of the source.
   * @param  {Number} id (optional) The sound ID. If none is passed, all in group will be updated.
   * @return {Howl/Array}    Returns self or the current 3D spatial orientation: [x, y, z].
   */
  Howl.prototype.orientation = function (x, y, z, id) {
    var self = this;

    // Stop right here if not using Web Audio.
    if (!self._webAudio) {
      return self;
    }

    // If the sound hasn't loaded, add it to the load queue to change orientation when capable.
    if (self._state !== 'loaded') {
      self._queue.push({
        event: 'orientation',
        action: function action() {
          self.orientation(x, y, z, id);
        }
      });

      return self;
    }

    // Set the defaults for optional 'y' & 'z'.
    y = typeof y !== 'number' ? self._orientation[1] : y;
    z = typeof z !== 'number' ? self._orientation[2] : z;

    // Setup the group's spatial orientation if no ID is passed.
    if (typeof id === 'undefined') {
      // Return the group's spatial orientation if no parameters are passed.
      if (typeof x === 'number') {
        self._orientation = [x, y, z];
      } else {
        return self._orientation;
      }
    }

    // Change the spatial orientation of one or all sounds in group.
    var ids = self._getSoundIds(id);
    for (var i = 0; i < ids.length; i++) {
      // Get the sound.
      var sound = self._soundById(ids[i]);

      if (sound) {
        if (typeof x === 'number') {
          sound._orientation = [x, y, z];

          if (sound._node) {
            // Check if there is a panner setup and create a new one if not.
            if (!sound._panner) {
              // Make sure we have a position to setup the node with.
              if (!sound._pos) {
                sound._pos = self._pos || [0, 0, -0.5];
              }

              setupPanner(sound, 'spatial');
            }

            sound._panner.setOrientation(x, y, z);
          }

          self._emit('orientation', sound._id);
        } else {
          return sound._orientation;
        }
      }
    }

    return self;
  };

  /**
   * Get/set the panner node's attributes for a sound or group of sounds.
   * This method can optionall take 0, 1 or 2 arguments.
   *   pannerAttr() -> Returns the group's values.
   *   pannerAttr(id) -> Returns the sound id's values.
   *   pannerAttr(o) -> Set's the values of all sounds in this Howl group.
   *   pannerAttr(o, id) -> Set's the values of passed sound id.
   *
   *   Attributes:
   *     coneInnerAngle - (360 by default) A parameter for directional audio sources, this is an angle, in degrees,
   *                      inside of which there will be no volume reduction.
   *     coneOuterAngle - (360 by default) A parameter for directional audio sources, this is an angle, in degrees,
   *                      outside of which the volume will be reduced to a constant value of `coneOuterGain`.
   *     coneOuterGain - (0 by default) A parameter for directional audio sources, this is the gain outside of the
   *                     `coneOuterAngle`. It is a linear value in the range `[0, 1]`.
   *     distanceModel - ('inverse' by default) Determines algorithm used to reduce volume as audio moves away from
   *                     listener. Can be `linear`, `inverse` or `exponential.
   *     maxDistance - (10000 by default) The maximum distance between source and listener, after which the volume
   *                   will not be reduced any further.
   *     refDistance - (1 by default) A reference distance for reducing volume as source moves further from the listener.
   *                   This is simply a variable of the distance model and has a different effect depending on which model
   *                   is used and the scale of your coordinates. Generally, volume will be equal to 1 at this distance.
   *     rolloffFactor - (1 by default) How quickly the volume reduces as source moves from listener. This is simply a
   *                     variable of the distance model and can be in the range of `[0, 1]` with `linear` and `[0, ∞]`
   *                     with `inverse` and `exponential`.
   *     panningModel - ('HRTF' by default) Determines which spatialization algorithm is used to position audio.
   *                     Can be `HRTF` or `equalpower`.
   * 
   * @return {Howl/Object} Returns self or current panner attributes.
   */
  Howl.prototype.pannerAttr = function () {
    var self = this;
    var args = arguments;
    var o, id, sound;

    // Stop right here if not using Web Audio.
    if (!self._webAudio) {
      return self;
    }

    // Determine the values based on arguments.
    if (args.length === 0) {
      // Return the group's panner attribute values.
      return self._pannerAttr;
    } else if (args.length === 1) {
      if (typeof args[0] === 'object') {
        o = args[0];

        // Set the grou's panner attribute values.
        if (typeof id === 'undefined') {
          if (!o.pannerAttr) {
            o.pannerAttr = {
              coneInnerAngle: o.coneInnerAngle,
              coneOuterAngle: o.coneOuterAngle,
              coneOuterGain: o.coneOuterGain,
              distanceModel: o.distanceModel,
              maxDistance: o.maxDistance,
              refDistance: o.refDistance,
              rolloffFactor: o.rolloffFactor,
              panningModel: o.panningModel
            };
          }

          self._pannerAttr = {
            coneInnerAngle: typeof o.pannerAttr.coneInnerAngle !== 'undefined' ? o.pannerAttr.coneInnerAngle : self._coneInnerAngle,
            coneOuterAngle: typeof o.pannerAttr.coneOuterAngle !== 'undefined' ? o.pannerAttr.coneOuterAngle : self._coneOuterAngle,
            coneOuterGain: typeof o.pannerAttr.coneOuterGain !== 'undefined' ? o.pannerAttr.coneOuterGain : self._coneOuterGain,
            distanceModel: typeof o.pannerAttr.distanceModel !== 'undefined' ? o.pannerAttr.distanceModel : self._distanceModel,
            maxDistance: typeof o.pannerAttr.maxDistance !== 'undefined' ? o.pannerAttr.maxDistance : self._maxDistance,
            refDistance: typeof o.pannerAttr.refDistance !== 'undefined' ? o.pannerAttr.refDistance : self._refDistance,
            rolloffFactor: typeof o.pannerAttr.rolloffFactor !== 'undefined' ? o.pannerAttr.rolloffFactor : self._rolloffFactor,
            panningModel: typeof o.pannerAttr.panningModel !== 'undefined' ? o.pannerAttr.panningModel : self._panningModel
          };
        }
      } else {
        // Return this sound's panner attribute values.
        sound = self._soundById(parseInt(args[0], 10));
        return sound ? sound._pannerAttr : self._pannerAttr;
      }
    } else if (args.length === 2) {
      o = args[0];
      id = parseInt(args[1], 10);
    }

    // Update the values of the specified sounds.
    var ids = self._getSoundIds(id);
    for (var i = 0; i < ids.length; i++) {
      sound = self._soundById(ids[i]);

      if (sound) {
        // Merge the new values into the sound.
        var pa = sound._pannerAttr;
        pa = {
          coneInnerAngle: typeof o.coneInnerAngle !== 'undefined' ? o.coneInnerAngle : pa.coneInnerAngle,
          coneOuterAngle: typeof o.coneOuterAngle !== 'undefined' ? o.coneOuterAngle : pa.coneOuterAngle,
          coneOuterGain: typeof o.coneOuterGain !== 'undefined' ? o.coneOuterGain : pa.coneOuterGain,
          distanceModel: typeof o.distanceModel !== 'undefined' ? o.distanceModel : pa.distanceModel,
          maxDistance: typeof o.maxDistance !== 'undefined' ? o.maxDistance : pa.maxDistance,
          refDistance: typeof o.refDistance !== 'undefined' ? o.refDistance : pa.refDistance,
          rolloffFactor: typeof o.rolloffFactor !== 'undefined' ? o.rolloffFactor : pa.rolloffFactor,
          panningModel: typeof o.panningModel !== 'undefined' ? o.panningModel : pa.panningModel
        };

        // Update the panner values or create a new panner if none exists.
        var panner = sound._panner;
        if (panner) {
          panner.coneInnerAngle = pa.coneInnerAngle;
          panner.coneOuterAngle = pa.coneOuterAngle;
          panner.coneOuterGain = pa.coneOuterGain;
          panner.distanceModel = pa.distanceModel;
          panner.maxDistance = pa.maxDistance;
          panner.refDistance = pa.refDistance;
          panner.rolloffFactor = pa.rolloffFactor;
          panner.panningModel = pa.panningModel;
        } else {
          // Make sure we have a position to setup the node with.
          if (!sound._pos) {
            sound._pos = self._pos || [0, 0, -0.5];
          }

          // Create a new panner node.
          setupPanner(sound, 'spatial');
        }
      }
    }

    return self;
  };

  /** Single Sound Methods **/
  /***************************************************************************/

  /**
   * Add new properties to the core Sound init.
   * @param  {Function} _super Core Sound init method.
   * @return {Sound}
   */
  Sound.prototype.init = function (_super) {
    return function () {
      var self = this;
      var parent = self._parent;

      // Setup user-defined default properties.
      self._orientation = parent._orientation;
      self._stereo = parent._stereo;
      self._pos = parent._pos;
      self._pannerAttr = parent._pannerAttr;

      // Complete initilization with howler.js core Sound's init function.
      _super.call(this);

      // If a stereo or position was specified, set it up.
      if (self._stereo) {
        parent.stereo(self._stereo);
      } else if (self._pos) {
        parent.pos(self._pos[0], self._pos[1], self._pos[2], self._id);
      }
    };
  }(Sound.prototype.init);

  /**
   * Override the Sound.reset method to clean up properties from the spatial plugin.
   * @param  {Function} _super Sound reset method.
   * @return {Sound}
   */
  Sound.prototype.reset = function (_super) {
    return function () {
      var self = this;
      var parent = self._parent;

      // Reset all spatial plugin properties on this sound.
      self._orientation = parent._orientation;
      self._pos = parent._pos;
      self._pannerAttr = parent._pannerAttr;

      // Complete resetting of the sound.
      return _super.call(this);
    };
  }(Sound.prototype.reset);

  /** Helper Methods **/
  /***************************************************************************/

  /**
   * Create a new panner node and save it on the sound.
   * @param  {Sound} sound Specific sound to setup panning on.
   * @param {String} type Type of panner to create: 'stereo' or 'spatial'.
   */
  var setupPanner = function setupPanner(sound, type) {
    type = type || 'spatial';

    // Create the new panner node.
    if (type === 'spatial') {
      sound._panner = Howler.ctx.createPanner();
      sound._panner.coneInnerAngle = sound._pannerAttr.coneInnerAngle;
      sound._panner.coneOuterAngle = sound._pannerAttr.coneOuterAngle;
      sound._panner.coneOuterGain = sound._pannerAttr.coneOuterGain;
      sound._panner.distanceModel = sound._pannerAttr.distanceModel;
      sound._panner.maxDistance = sound._pannerAttr.maxDistance;
      sound._panner.refDistance = sound._pannerAttr.refDistance;
      sound._panner.rolloffFactor = sound._pannerAttr.rolloffFactor;
      sound._panner.panningModel = sound._pannerAttr.panningModel;
      sound._panner.setPosition(sound._pos[0], sound._pos[1], sound._pos[2]);
      sound._panner.setOrientation(sound._orientation[0], sound._orientation[1], sound._orientation[2]);
    } else {
      sound._panner = Howler.ctx.createStereoPanner();
      sound._panner.pan.setValueAtTime(sound._stereo, Howler.ctx.currentTime);
    }

    sound._panner.connect(sound._node);

    // Update the connections.
    if (!sound._paused) {
      sound._parent.pause(sound._id, true).play(sound._id);
    }
  };
})();

var Audio$1 = function () {
  function Audio(emitter) {
    var _this = this;

    _classCallCheck(this, Audio);

    this.emitter = emitter;
    var moves = this.loadAudio('move', 9);
    var captures = this.loadAudio('capture', 6);
    var atenttions = this.loadAudio('inactivity', 4);

    this.emitter.on('turn', function () {
      _this.playRandomItem(moves);
    });

    this.emitter.on('player.defeated', function (piece) {
      _this.playRandomItem(captures);
    });

    this.emitter.on('piece.captured', function (piece) {
      _this.playRandomItem(captures);
    });

    this.emitter.on('inactivity.turn', function () {
      if (document.hidden) {
        _this.playRandomItem(atenttions);
      }
    });
  }

  _createClass(Audio, [{
    key: 'playRandomItem',
    value: function playRandomItem(array) {
      var item = array[Math.floor(Math.random() * array.length)];
      item.play();
    }
  }, {
    key: 'loadAudio',
    value: function loadAudio(name, count) {
      var sounds = [];
      for (var i = 1; i < count + 1; i++) {
        var filename = 'sounds/' + name + '-' + i + '.mp3';
        sounds.push(new Howl({ src: [filename] }));
      }
      return sounds;
    }
  }]);

  return Audio;
}();

var TextScreen = function TextScreen(text, duration) {
  var _this = this;

  var effect = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 'textscreen';
  var callback = arguments[3];

  _classCallCheck(this, TextScreen);

  this.element = document.createElement('div');
  this.element.classList.add('textscreen');
  this.element.innerHTML = '<h2 class="word">' + text + '</h2>';
  document.body.appendChild(this.element);

  this.textscreen = {
    options: {
      shapeColors: ['#35c394', '#9985ee', '#f54665', '#4718f5', '#f5aa18']
    },
    hide: {
      lettersAnimationOpts: {
        duration: duration,
        delay: function delay(t, i) {
          return (t.parentNode.children.length - i - 1) * 30;
        },
        easing: 'easeOutExpo',
        opacity: 0,
        translateY: function translateY(t, i) {
          return i % 2 === 0 ? '80%' : '-80%';
        },
        rotate: function rotate(t, i) {
          return i % 2 === 0 ? -25 : 25;
        }
      },
      shapesAnimationOpts: {
        duration: 50,
        easing: 'easeOutExpo',
        translateX: function translateX(t) {
          return t.dataset.tx;
        },
        translateY: function translateY(t) {
          return t.dataset.ty;
        },
        scale: 0,
        rotate: 0,
        opacity: {
          value: 0,
          duration: 50,
          easing: 'linear'
        }
      }
    },
    show: {
      lettersAnimationOpts: {
        duration: duration,
        delay: function delay(t, i) {
          return (t.parentNode.children.length - i - 1) * 80;
        },
        easing: 'easeOutElastic',
        opacity: {
          value: [0, 1],
          duration: 100,
          easing: 'linear'
        },
        translateY: function translateY(t, i) {
          return i % 2 === 0 ? ['-80%', '0%'] : ['80%', '0%'];
        },
        rotate: [90, 0]
      },
      shapesAnimationOpts: {
        duration: function duration() {
          return anime.random(1000, 3000);
        },
        delay: function delay(t, i) {
          return i * 20;
        },
        easing: 'easeOutElastic',
        translateX: function translateX(t) {
          var tx = anime.random(-250, 250);
          t.dataset.tx = tx;
          return [0, tx];
        },
        translateY: function translateY(t) {
          var ty = anime.random(-250, 250);
          t.dataset.ty = ty;
          return [0, ty];
        },
        scale: function scale(t) {
          var s = randomBetween(0.1, 0.6);
          t.dataset.s = s;
          return [s, s];
        },
        rotate: function rotate() {
          return anime.random(-90, 90);
        },
        opacity: {
          value: 0.6,
          duration: duration * 1.4,
          easing: 'linear'
        }
      }
    }
  };

  this.capture = {
    options: {
      shapeColors: ['#0671e6'],
      shapeTypes: ['circle'],
      shapeFill: false,
      shapeStrokeWidth: 3
    },
    hide: {
      lettersAnimationOpts: {
        duration: 300,
        delay: function delay(t, i, total) {
          return i * 25;
        },
        easing: 'easeOutQuad',
        opacity: {
          value: 0,
          duration: 100,
          delay: function delay(t, i, total) {
            return i * 25;
          },
          easing: 'linear'
        },
        translateY: ['0%', '-50%']
      },
      shapesAnimationOpts: {
        duration: 300,
        delay: function delay(t, i) {
          return i * 20;
        },
        easing: 'easeOutExpo',
        translateX: function translateX(t) {
          return anime.random(-10, 10);
        },
        translateY: function translateY(t) {
          return -1 * anime.random(400, 800);
        },
        scale: [0.3, 0.3],
        opacity: [{
          value: 1,
          duration: 1,
          delay: function delay(t, i) {
            return i * 20;
          }
        }, {
          value: 0,
          duration: 300,
          easing: 'linear'
        }]
      }
    },
    show: {
      lettersAnimationOpts: {
        duration: 800,
        delay: function delay(t, i, total) {
          return Math.abs(total / 2 - i) * 60;
        },
        easing: 'easeOutElastic',
        opacity: [0, 1],
        translateY: ['50%', '0%']
      },
      shapesAnimationOpts: {
        duration: 700,
        delay: function delay(t, i) {
          return i * 60;
        },
        easing: 'easeOutExpo',
        translateX: function translateX() {
          var rand = anime.random(-100, 100);
          return [rand, rand];
        },
        translateY: function translateY() {
          var rand = anime.random(-100, 100);
          return [rand, rand];
        },
        scale: function scale() {
          return [randomBetween(0.1, 0.3), randomBetween(0.5, 0.8)];
        },
        opacity: [{ value: 1, duration: 1, delay: function delay(t, i) {
            return i * 80;
          } }, { value: 0, duration: 700, easing: 'easeOutQuad', delay: 100 }]
      }
    }
  };

  var word = new Word(this.element, this[effect].options);

  this.element.classList.add('visible');

  word.show(this[effect].show).then(function () {
    setTimeout(function () {
      word.hide(_this[effect].hide).then(function () {
        _this.element.addEventListener('transitionend', function () {
          word.DOM.svg.remove();
          _this.element.remove();

          if (typeof callback === 'function') {
            callback();
          }
        });

        _this.element.classList.remove('visible');
      });
    }, duration);
  });
};

// From https://davidwalsh.name/javascript-debounce-function.
function debounce(func, wait, immediate) {
  var timeout;
  return function () {
    var context = this,
        args = arguments;
    var later = function later() {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    var callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

// From http://snipplr.com/view/37687/random-number-float-generator/
function randomBetween(minValue, maxValue, precision) {
  if (typeof precision == 'undefined') {
    precision = 2;
  }
  return parseFloat(Math.min(minValue + Math.random() * (maxValue - minValue), maxValue).toFixed(precision));
}

var winsize = { width: window.innerWidth, height: window.innerHeight };

var Shape = function () {
  function Shape(type, letterRect, options) {
    _classCallCheck(this, Shape);

    this.DOM = {};
    this.options = {
      shapeTypes: ['circle', 'rect', 'polygon'],
      shapeColors: ['#e07272', '#0805b5', '#49c6ff', '#8bc34a', '#1e1e21', '#e24e81', '#e0cd24'],
      shapeFill: true,
      shapeStrokeWidth: 1
    };
    Object.assign(this.options, options);
    this.type = type || this.options.shapeTypes[0];
    if (this.type !== 'random' && !this.options.types.includes(this.type)) return;
    if (this.type === 'random') this.type = this.options.shapeTypes[randomBetween(0, this.options.shapeTypes.length - 1, 0)];
    this.letterRect = letterRect;
    this.init();
  }

  _createClass(Shape, [{
    key: 'init',
    value: function init() {
      this.DOM.el = document.createElementNS('http://www.w3.org/2000/svg', this.type);
      this.DOM.el.style.opacity = 0;
      this.configureShapeType();

      if (this.options.shapeFill) {
        this.DOM.el.setAttribute('fill', this.options.shapeColors[randomBetween(0, this.options.shapeColors.length - 1, 0)]);
      } else {
        this.DOM.el.setAttribute('fill', 'none');
        this.DOM.el.setAttribute('stroke-width', this.options.shapeStrokeWidth);
        this.DOM.el.setAttribute('stroke', this.options.shapeColors[randomBetween(0, this.options.shapeColors.length - 1, 0)]);
      }
    }
  }, {
    key: 'configureShapeType',
    value: function configureShapeType() {
      this.DOM.el.style.transformOrigin = this.letterRect.left + this.letterRect.width / 2 + 'px ' + (this.letterRect.top + this.letterRect.height / 2) + 'px';

      if (this.type === 'circle') {
        var r = 0.5 * this.letterRect.width;
        this.DOM.el.setAttribute('r', r);
        this.DOM.el.setAttribute('cx', this.letterRect.left + this.letterRect.width / 2);
        this.DOM.el.setAttribute('cy', this.letterRect.top + this.letterRect.height / 2);
      } else if (this.type === 'rect') {
        var w = randomBetween(0.05, 0.5, 3) * this.letterRect.width;
        var h = randomBetween(0.05, 0.5, 3) * this.letterRect.height;
        this.DOM.el.setAttribute('width', w);
        this.DOM.el.setAttribute('height', h);
        this.DOM.el.setAttribute('x', this.letterRect.left + (this.letterRect.width - w) / 2);
        this.DOM.el.setAttribute('y', this.letterRect.top + (this.letterRect.height - h) / 2);
      } else if (this.type === 'polygon') {
        this.DOM.el.setAttribute('points', this.letterRect.left + ' ' + (this.letterRect.top + this.letterRect.height) + ', ' + (this.letterRect.left + this.letterRect.width / 2) + ' ' + (this.letterRect.bottom - this.letterRect.width) + ', ' + (this.letterRect.left + this.letterRect.width) + ' ' + (this.letterRect.top + this.letterRect.height));
      }
    }
  }, {
    key: 'onResize',
    value: function onResize(letterRect) {
      this.letterRect = letterRect;
      this.configureShapeType();
    }
  }]);

  return Shape;
}();



var Letter = function () {
  function Letter(el, svg, options) {
    _classCallCheck(this, Letter);

    this.DOM = {};
    this.DOM.el = el;
    this.DOM.svg = svg;
    this.options = {
      totalShapes: 10
    };
    Object.assign(this.options, options);
    this.rect = this.DOM.el.getBoundingClientRect();
    this.totalShapes = this.options.totalShapes;
    this.init();
    this.initEvents();
  }

  _createClass(Letter, [{
    key: 'init',
    value: function init() {
      this.shapes = [];
      for (var i = 0; i <= this.totalShapes - 1; ++i) {
        var shape = new Shape('random', this.rect, this.options);
        this.shapes.push(shape);
        this.DOM.svg.appendChild(shape.DOM.el);
      }
    }
  }, {
    key: 'initEvents',
    value: function initEvents() {
      var _this2 = this;

      window.addEventListener('resize', debounce(function () {
        _this2.rect = _this2.DOM.el.getBoundingClientRect();
        for (var i = 0; i <= _this2.totalShapes - 1; ++i) {
          var shape = _this2.shapes[i];
          shape.onResize(_this2.rect);
        }
      }, 20));
    }
  }]);

  return Letter;
}();



var Word = function () {
  function Word(el, options) {
    _classCallCheck(this, Word);

    this.DOM = {};
    this.DOM.el = el;
    this.options = {
      shapesOnTop: false
    };
    Object.assign(this.options, options);
    this.init();
    this.initEvents();
  }

  _createClass(Word, [{
    key: 'init',
    value: function init() {
      var _this3 = this;

      this.createSVG();
      charming(this.DOM.el);
      this.letters = [];
      Array.from(this.DOM.el.querySelectorAll('span')).forEach(function (letter) {
        return _this3.letters.push(new Letter(letter, _this3.DOM.svg, _this3.options));
      });
    }
  }, {
    key: 'initEvents',
    value: function initEvents() {
      var _this4 = this;

      window.addEventListener('resize', debounce(function () {
        winsize = { width: window.innerWidth, height: window.innerHeight };
        _this4.DOM.svg.setAttribute('width', winsize.width + 'px');
        _this4.DOM.svg.setAttribute('height', winsize.width + 'px');
        _this4.DOM.svg.setAttribute('viewbox', '0 0 ' + winsize.width + ' ' + winsize.height);
      }, 20));
    }
  }, {
    key: 'createSVG',
    value: function createSVG() {
      this.DOM.svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      this.DOM.svg.setAttribute('class', 'shapes');
      this.DOM.svg.setAttribute('width', winsize.width + 'px');
      this.DOM.svg.setAttribute('height', winsize.width + 'px');
      this.DOM.svg.setAttribute('viewbox', '0 0 ' + winsize.width + ' ' + winsize.height);
      if (this.options.shapesOnTop) {
        this.DOM.el.parentNode.insertBefore(this.DOM.svg, this.DOM.el.nextSibling);
      } else {
        this.DOM.el.parentNode.insertBefore(this.DOM.svg, this.DOM.el);
      }
    }
  }, {
    key: 'show',
    value: function show(config) {
      return this.toggle('show', config);
    }
  }, {
    key: 'hide',
    value: function hide(config) {
      return this.toggle('hide', config);
    }
  }, {
    key: 'toggle',
    value: function toggle() {
      var _this5 = this;

      var action = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : 'show';
      var config = arguments[1];

      return new Promise(function (resolve, reject) {
        var toggleNow = function toggleNow() {
          for (var i = 0, len = _this5.letters.length; i <= len - 1; ++i) {
            _this5.letters[i].DOM.el.style.opacity = action === 'show' ? 1 : 0;
          }
          resolve();
        };

        if (config && Object.keys(config).length !== 0) {
          if (config.shapesAnimationOpts) {
            for (var i = 0, len = _this5.letters.length; i <= len - 1; ++i) {
              var letter = _this5.letters[i];
              setTimeout(function (letter) {
                return function () {
                  config.shapesAnimationOpts.targets = letter.shapes.map(function (shape) {
                    return shape.DOM.el;
                  });
                  anime.remove(config.shapesAnimationOpts.targets);
                  anime(config.shapesAnimationOpts);
                };
              }(letter), config.lettersAnimationOpts && config.lettersAnimationOpts.delay ? config.lettersAnimationOpts.delay(letter.DOM.el, i) : 0);
            }
          }
          if (config.lettersAnimationOpts) {
            config.lettersAnimationOpts.targets = _this5.letters.map(function (letter) {
              return letter.DOM.el;
            });
            config.lettersAnimationOpts.complete = function () {
              if (action === 'hide') {
                for (var _i = 0, _len = config.lettersAnimationOpts.targets.length; _i <= _len - 1; ++_i) {
                  config.lettersAnimationOpts.targets[_i].style.transform = 'none';
                }
              }
              resolve();
            };
            anime(config.lettersAnimationOpts);
          } else {
            toggleNow();
          }
        } else {
          toggleNow();
        }
      });
    }
  }]);

  return Word;
}();

var Inactivity = function () {
  function Inactivity(emitter) {
    var _this = this;

    _classCallCheck(this, Inactivity);

    this.emitter = emitter;
    this.currentStart = 1;
    this.activeTitle = 'Onitama';
    document.title = this.activeTitle;

    document.addEventListener('visibilitychange', function () {
      if (!document.hidden) {
        document.title = _this.activeTitle;
      }
    });

    Notification.requestPermission();

    this.emitter.on('inactivity.turn', function () {
      if (document.hidden) {
        _this.animateTabTitle('New activity! - - - New activity! - - - New activity! - - - ');

        if (window.Notification && Notification.permission !== 'denied') {
          new Notification('There is Onitama activity!');
        }
      }
    });
  }

  _createClass(Inactivity, [{
    key: 'animateTabTitle',
    value: function animateTabTitle(title) {
      var _this2 = this;

      var doStep = function doStep() {
        _this2.currentStart++;
        if (_this2.currentStart > title.length) {
          _this2.currentStart = 1;
        }

        if (document.hidden) {
          document.title = title.substr(_this2.currentStart) + ' ' + title.substr(0, _this2.currentStart);

          setTimeout(function () {
            doStep();
          }, 100);
        }
      };

      if (document.hidden) {
        doStep();
      }
    }
  }]);

  return Inactivity;
}();

var Game = function () {

  /**
   * Start a new game with a div selector and an outside emitter.
   * This way we can recycle the emitter for all things inside this app.
   */
  function Game(selector, emitter, role) {
    var onitamaStringNotation = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

    _classCallCheck(this, Game);

    this.emitter = emitter;
    this.role = role;
    this.localPlayerId = this.role === 'answerer' ? 2 : 1;
    this.inactivityTurn = false;

    this.element = document.querySelector(selector);
    this.element.innerHTML = '';
    if (!this.element) {
      throw 'No element found for the onitama game';
    }
    this.element.classList.add('onitama');
    this.boardElement = document.createElement('div');
    this.element.appendChild(this.boardElement);
    this.board = new Board(this.boardElement, this.emitter);
    this.audio = new Audio$1(this.emitter);
    this.inactivity = new Inactivity(this.emitter);

    if (onitamaStringNotation) {
      this.state = new State(this.board, this.emitter, onitamaStringNotation);
    } else {
      this.state = new State(this.board, this.emitter);
    }
    this.board.setState(this.state);

    this.attachEvents();
  }

  _createClass(Game, [{
    key: 'externalTurn',
    value: function externalTurn(turnData) {
      var _this = this;

      if (document.hidden) {
        this.inactivityTurn = turnData;
        this.emitter.emit('inactivity.turn');
      } else {
        var usedTile = this.board.tiles.get(turnData.tileX + '-' + turnData.tileY);
        var activePlayer = this.state['player' + this.state.turnPlayer];
        var usedPiece = activePlayer.pieces.find(function (piece) {
          return piece.x === turnData.pieceX && piece.y === turnData.pieceY;
        });
        var usedCard = activePlayer.cards.find(function (card) {
          return card.name === turnData.card;
        });

        if (usedCard && usedPiece && usedTile) {
          usedCard.select();
          usedPiece.select();
          usedTile.highlight();

          setTimeout(function () {
            _this.emitter.emit('tile.click', usedTile, true);
          }, 1700);
        }
      }
    }
  }, {
    key: 'winner',
    value: function winner() {
      setTimeout(function () {
        new TextScreen('Winner!', 1000, 'textscreen', function () {
          window.location.reload(false);
        });
      }, 500);
    }
  }, {
    key: 'loser',
    value: function loser() {
      setTimeout(function () {
        new TextScreen('Loser!', 1000, 'textscreen', function () {
          window.location.reload(false);
        });
      }, 500);
    }

    /**
     * Reacts on the emitter. This is the main game logic.
     */

  }, {
    key: 'attachEvents',
    value: function attachEvents() {
      var _this2 = this;

      document.addEventListener('visibilitychange', function () {
        if (_this2.inactivityTurn && !document.hidden) {
          _this2.externalTurn(_this2.inactivityTurn);
          _this2.inactivityTurn = false;
        }
      });

      // On turn set.
      this.emitter.on('turn.set', function (activePlayerId) {
        _this2.boardElement.dataset.activePlayer = activePlayerId;
      });

      this.emitter.on('turn', function (usedPiece, tile, usedCard, oldX, oldY, isExternal) {

        // TODO bugs.

        if (tile.x === 3 && tile.y === 1 && usedPiece.type === 'master' && usedPiece.player.id === 1) {
          if (usedPiece.player.id === _this2.localPlayerId) {
            _this2.winner();
          } else {
            _this2.loser();
          }
        }

        if (tile.x === 3 && tile.y === 5 && usedPiece.type === 'master' && usedPiece.player.id === 2) {
          if (usedPiece.player.id === _this2.localPlayerId) {
            _this2.loser();
          } else {
            _this2.winner();
          }
        }
      });

      this.emitter.on('player.defeated', function (piece) {
        if (piece.player.id === _this2.localPlayerId) {
          _this2.loser();
        } else {
          _this2.winner();
        }
      });

      this.emitter.on('piece.captured', function (piece) {
        setTimeout(function () {
          if (piece.player.id === _this2.localPlayerId) {
            new TextScreen('Oops!', 300, 'capture');
          } else {
            new TextScreen('Woop woop!', 300, 'capture');
          }
        }, 500);
      });

      // Tiles.
      this.emitter.on('tile.click', function (tile) {
        var isExternal = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

        if (tile.highlighted === true) {
          var activePlayer = _this2.state['player' + _this2.state.turnPlayer];
          var usedCard = void 0;

          if (activePlayer.activeCard) {
            usedCard = activePlayer.activeCard;
            _this2.animateCardSwap(activePlayer.activeCard);
            activePlayer.activeCard.deselect();
            activePlayer.activeCard = false;
          }

          // This reduces the turn clicks from three to two.
          else {
              var overLeapingCards = 0;
              var possibleCard = null;
              activePlayer.cards.forEach(function (card) {
                if (!card.data.swap) {
                  var tilesToHighLight = _this2.getHighlightTilesByPieceAndCard(activePlayer.activePiece, card);

                  tilesToHighLight.forEach(function (tileToHighLight) {
                    if (tileToHighLight === tile) {
                      overLeapingCards++;
                      possibleCard = card;
                    }
                  });
                }
              });

              // The used tiles was possible with both cards.
              if (overLeapingCards > 1) {
                _this2.openChoosePopup(tile);
                return;
              } else {
                usedCard = possibleCard;
                _this2.animateCardSwap(possibleCard);
              }
            }

          // Check if a piece was captured.
          var oppositePlayerId = _this2.state.turnPlayer === 1 ? 2 : 1;
          var oppositePlayer = _this2.state['player' + oppositePlayerId];

          oppositePlayer.pieces.forEach(function (piece) {
            if (piece.x === tile.x && piece.y === tile.y) {
              piece.capture();
            }
          });

          var usedPiece = activePlayer.activePiece;

          var oldX = usedPiece.x;
          var oldY = usedPiece.y;

          activePlayer.activePiece.y = tile.y;
          activePlayer.activePiece.x = tile.x;
          activePlayer.activePiece.deselect();
          activePlayer.activePiece = false;

          _this2.updateHighLights();

          _this2.emitter.emit('turn', usedPiece, tile, usedCard, oldX, oldY, isExternal);

          _this2.state.toggleTurnPlayer();
        }
      });

      // Pieces.
      this.emitter.on('piece.click', function (piece) {
        if (_this2.state.turnPlayer === piece.player.id && piece.player.id === _this2.localPlayerId) {
          piece.player.pieces.forEach(function (innerPiece) {
            if (innerPiece !== piece) {
              innerPiece.deselect();
            }
          });
          piece.data.selected === true ? piece.deselect() : piece.select();
          _this2.updateHighLights();
        }
      });

      this.emitter.on('piece.mouseenter', function (piece) {
        if (_this2.state.turnPlayer === piece.player.id && piece.player.id === _this2.localPlayerId) {
          if (!piece.player.activePiece) {
            piece.player.activePiece = piece;
          }
          _this2.updateHighLights();
        }
      });

      this.emitter.on('piece.mouseleave', function (piece) {
        if (_this2.state.turnPlayer === piece.player.id && piece.player.id === _this2.localPlayerId) {
          if (piece.player.activePiece === piece && !piece.data.selected) {
            piece.player.activePiece = false;
          }
          _this2.updateHighLights();
        }
      });

      // Cards.
      this.emitter.on('card.click', function (card) {
        if (_this2.state.turnPlayer === card.player.id && !card.data.swap && card.player.id === _this2.localPlayerId) {
          _this2.state.cards.forEach(function (innerCard) {
            if (innerCard !== card) {
              innerCard.deselect();
            }
          });
          card.data.selected === true ? card.deselect() : card.select();
          _this2.updateHighLights();
        }
      });

      this.emitter.on('card.mouseenter', function (card) {
        if (_this2.state.turnPlayer === card.player.id && !card.data.swap && card.player.id === _this2.localPlayerId) {
          if (!card.player.activeCard) {
            card.player.activeCard = card;
          }
          _this2.updateHighLights();
        }
      });

      this.emitter.on('card.mouseleave', function (card) {
        if (card.player.activeCard === card && !card.data.selected && card.player.id === _this2.localPlayerId) {
          card.player.activeCard = false;
        }
        _this2.updateHighLights();
      });
    }

    /**
     * When only using a selected piece and a click on a tile to move, it can happen both cards can get the piece there.
     * Than we use this wizard to let the player choose.
     */

  }, {
    key: 'openChoosePopup',
    value: function openChoosePopup(tile) {
      var _this3 = this;

      var activePlayer = this.state['player' + this.state.turnPlayer];
      var wizard = document.createElement('div');
      wizard.classList.add('card-choose-wizard');
      wizard.classList.add('fade-in');

      activePlayer.cards.forEach(function (card) {
        if (!card.data.swap) {
          var cardClone = card.element.cloneNode(true);
          cardClone.style = '\n          width: ' + card.element.offsetWidth + 'px; \n          height: ' + card.element.offsetHeight + 'px;\n        ';

          wizard.appendChild(cardClone);

          cardClone.addEventListener('click', function () {
            activePlayer.activeCard = card;
            wizard.classList.add('fade-in');

            setTimeout(function () {
              _this3.emitter.emit('tile.click', tile);
              wizard.remove();
            }, 300);
          });
        }
      });

      this.board.element.appendChild(wizard);
      setTimeout(function () {
        wizard.classList.remove('fade-in');
      }, 200);
    }

    /**
     * This animates the swapping of a card.
     */

  }, {
    key: 'animateCardSwap',
    value: function animateCardSwap(card) {
      var _this4 = this;

      var transition = 'transition: all .4s ease-in-out';
      var swapDeck = this.board.swapDeck;
      var activePlayer = this.state['player' + this.state.turnPlayer];
      var playerDeck = this.board['player' + this.state.turnPlayer + 'Deck'];

      var swapPosition = 0;

      playerDeck.childNodes.forEach(function (deckCard, delta) {
        if (deckCard === card.element) {
          swapPosition = delta;
        }
      });

      var temporaryPlaceholder1 = document.createElement('div');
      temporaryPlaceholder1.classList.add('card');
      temporaryPlaceholder1.classList.add('invisible');
      temporaryPlaceholder1.classList.add('item-1');
      card.element.parentNode.insertBefore(temporaryPlaceholder1, card.element);

      card.element.classList.add('animating');

      card.element.remove();

      var position1 = temporaryPlaceholder1.getBoundingClientRect();

      card.element.style = '\n      top: ' + position1.top + 'px; \n      left: ' + position1.left + 'px;\n      width: ' + position1.width + 'px; \n      height: ' + position1.height + 'px;\n      ' + transition + ';\n      position: fixed;\n    ' + (this.state.turnPlayer === 1 && this.role === 'initiator' || this.state.turnPlayer === 2 && this.role === 'answerer' ? 'transform: rotate(0deg);' : 'transform: rotate(180deg);');

      this.boardElement.appendChild(card.element);

      var temporaryPlaceholder2 = document.createElement('div');
      temporaryPlaceholder2.classList.add('card');
      temporaryPlaceholder2.classList.add('invisible');
      temporaryPlaceholder2.classList.add('item-2');
      swapDeck.insertBefore(temporaryPlaceholder2, swapDeck.firstChild);

      this.state.swapCard.element.classList.add('animating');
      this.state.swapCard.element.remove();

      var position2 = temporaryPlaceholder2.getBoundingClientRect();

      this.state.swapCard.element.style = '\n      top: ' + position2.top + 'px;\n      left: ' + position2.left + 'px;\n      width: ' + position2.width + 'px;\n      height: ' + position2.height + 'px;\n      ' + transition + ';\n      position: fixed;\n    ' + (this.state.turnPlayer === 1 && this.role === 'initiator' || this.state.turnPlayer === 2 && this.role === 'answerer' ? 'transform: rotate(0deg);' : 'transform: rotate(180deg);');

      this.boardElement.appendChild(this.state.swapCard.element);

      setTimeout(function () {
        var onTransitionEnd = function onTransitionEnd() {
          _this4.state.swapCard.element.removeEventListener('transitionend', onTransitionEnd);
          swapDeck.appendChild(card.element);
          playerDeck.appendChild(_this4.state.swapCard.element);

          temporaryPlaceholder1.remove();
          temporaryPlaceholder2.remove();

          card.element.classList.remove('animating');
          _this4.state.swapCard.element.classList.remove('animating');
          card.element.style = '';
          _this4.state.swapCard.element.style = '';

          _this4.state.swapCard.unswap(activePlayer, swapPosition);
          card.swap();

          card.player = false;
        };

        _this4.state.swapCard.element.addEventListener('transitionend', onTransitionEnd);

        card.element.style = '\n      top: ' + position2.top + 'px; \n      left: ' + position2.left + 'px;\n      width: ' + position2.width + 'px; \n      height: ' + position2.height + 'px;\n      ' + transition + ';\n      position: fixed;\n    ' + (_this4.state.turnPlayer === 1 && _this4.role === 'initiator' || _this4.state.turnPlayer === 2 && _this4.role === 'answerer' ? 'transform: rotate(0deg);' : 'transform: rotate(180deg);');

        _this4.state.swapCard.element.style = '\n      top: ' + position1.top + 'px;\n      left: ' + position1.left + 'px;\n      width: ' + position1.width + 'px;\n      height: ' + position1.height + 'px;\n      ' + transition + ';\n      position: fixed;\n    ' + (_this4.state.turnPlayer === 1 && _this4.role === 'initiator' || _this4.state.turnPlayer === 2 && _this4.role === 'answerer' ? 'transform: rotate(180deg);' : 'transform: rotate(0deg);');
      }, 100);
    }

    /**
     * This gets called a lot after events, it updates the highlighted tiles.
     */

  }, {
    key: 'updateHighLights',
    value: function updateHighLights() {
      var _this5 = this;

      this.board.tiles.forEach(function (tile) {
        if (tile.highlighted === true) {
          tile.dim();
        }
      });

      var activePlayer = this.state['player' + this.state.turnPlayer];

      if (activePlayer.activePiece && activePlayer.activeCard) {
        var tilesToHighLight = this.getHighlightTilesByPieceAndCard(activePlayer.activePiece, activePlayer.activeCard);

        tilesToHighLight.forEach(function (tile) {
          tile.highlight();
        });
      }

      // This reduces the turn clicks from three to two.
      else if (activePlayer.activePiece && !activePlayer.activeCard) {
          activePlayer.cards.forEach(function (card) {
            if (!card.data.swap) {
              var _tilesToHighLight = _this5.getHighlightTilesByPieceAndCard(activePlayer.activePiece, card);

              _tilesToHighLight.forEach(function (tile) {
                tile.highlight();
              });
            }
          });
        }
    }

    /**
     * A card has possible moves. This returns the tiles that need to be highlighted by a card.
     */

  }, {
    key: 'getHighlightTilesByPieceAndCard',
    value: function getHighlightTilesByPieceAndCard(piece, card) {
      var _this6 = this;

      var highlightTiles = [];
      var activePlayer = piece.player;

      card.sets.forEach(function (set) {
        var setX = piece.x + set.x;
        var setY = piece.y + set.y;

        if (activePlayer.id === 2) {
          setY = piece.y - set.y;
          setX = piece.x - set.x;
        }

        // When on the board.
        if (setX > 0 && setY > 0 && setX < 6 && setY < 6) {
          var isValid = true;
          activePlayer.pieces.forEach(function (piece) {
            if (piece.x === setX && piece.y === setY) {
              isValid = false;
            }
          });

          if (isValid) {
            highlightTiles.push(_this6.board.tiles.get(setX + '-' + setY));
          }
        }
      });

      return highlightTiles;
    }
  }]);

  return Game;
}();

var DEFAULT_VALUES = {
  emitDelay: 10,
  strictMode: false
};

/**
 * @typedef {object} EventEmitterListenerFunc
 * @property {boolean} once
 * @property {function} fn
 */

/**
 * @class EventEmitter
 *
 * @private
 * @property {Object.<string, EventEmitterListenerFunc[]>} _listeners
 * @property {string[]} events
 */
var EventEmitter = function () {

  /**
   * @constructor
   * @param {{}}      [opts]
   * @param {number}  [opts.emitDelay = 10] - Number in ms. Specifies whether emit will be sync or async. By default - 10ms. If 0 - fires sync
   * @param {boolean} [opts.strictMode = false] - is true, Emitter throws error on emit error with no listeners
   */
  function EventEmitter() {
    var opts = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : DEFAULT_VALUES;

    _classCallCheck(this, EventEmitter);

    var emitDelay = void 0,
        strictMode = void 0;

    if (opts.hasOwnProperty('emitDelay')) {
      emitDelay = opts.emitDelay;
    } else {
      emitDelay = DEFAULT_VALUES.emitDelay;
    }
    this._emitDelay = emitDelay;

    if (opts.hasOwnProperty('strictMode')) {
      strictMode = opts.strictMode;
    } else {
      strictMode = DEFAULT_VALUES.strictMode;
    }
    this._strictMode = strictMode;

    this._listeners = {};
    this.events = [];
  }

  /**
   * @protected
   * @param {string} type
   * @param {function} listener
   * @param {boolean} [once = false]
   */

  _createClass(EventEmitter, [{
    key: '_addListenner',
    value: function _addListenner(type, listener, once) {
      if (typeof listener !== 'function') {
        throw TypeError('listener must be a function');
      }

      if (this.events.indexOf(type) === -1) {
        this._listeners[type] = [{
          once: once,
          fn: listener
        }];
        this.events.push(type);
      } else {
        this._listeners[type].push({
          once: once,
          fn: listener
        });
      }
    }

    /**
     * Subscribes on event type specified function
     * @param {string} type
     * @param {function} listener
     */

  }, {
    key: 'on',
    value: function on(type, listener) {
      this._addListenner(type, listener, false);
    }

    /**
     * Subscribes on event type specified function to fire only once
     * @param {string} type
     * @param {function} listener
     */

  }, {
    key: 'once',
    value: function once(type, listener) {
      this._addListenner(type, listener, true);
    }

    /**
     * Removes event with specified type. If specified listenerFunc - deletes only one listener of specified type
     * @param {string} eventType
     * @param {function} [listenerFunc]
     */

  }, {
    key: 'off',
    value: function off(eventType, listenerFunc) {
      var typeIndex = this.events.indexOf(eventType);
      var hasType = eventType && typeIndex !== -1;

      if (hasType) {
        if (!listenerFunc) {
          delete this._listeners[eventType];
          this.events.splice(typeIndex, 1);
        } else {
          var removedEvents = [];
          var typeListeners = this._listeners[eventType];

          typeListeners.forEach(
          /**
           * @param {EventEmitterListenerFunc} fn
           * @param {number} idx
           */
          function (fn, idx) {
            if (fn.fn === listenerFunc) {
              removedEvents.unshift(idx);
            }
          });

          removedEvents.forEach(function (idx) {
            typeListeners.splice(idx, 1);
          });

          if (!typeListeners.length) {
            this.events.splice(typeIndex, 1);
            delete this._listeners[eventType];
          }
        }
      }
    }

    /**
     * Applies arguments to specified event type
     * @param {string} eventType
     * @param {*[]} eventArguments
     * @protected
     */

  }, {
    key: '_applyEvents',
    value: function _applyEvents(eventType, eventArguments) {
      var typeListeners = this._listeners[eventType];

      if (!typeListeners || !typeListeners.length) {
        if (this._strictMode) {
          throw 'No listeners specified for event: ' + eventType;
        } else {
          return;
        }
      }

      var removableListeners = [];
      typeListeners.forEach(function (eeListener, idx) {
        eeListener.fn.apply(null, eventArguments);
        if (eeListener.once) {
          removableListeners.unshift(idx);
        }
      });

      removableListeners.forEach(function (idx) {
        typeListeners.splice(idx, 1);
      });
    }

    /**
     * Emits event with specified type and params.
     * @param {string} type
     * @param eventArgs
     */

  }, {
    key: 'emit',
    value: function emit(type) {
      var _this = this;

      for (var _len = arguments.length, eventArgs = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        eventArgs[_key - 1] = arguments[_key];
      }

      if (this._emitDelay) {
        setTimeout(function () {
          _this._applyEvents(type, eventArgs);
        }, this._emitDelay);
      } else {
        this._applyEvents(type, eventArgs);
      }
    }

    /**
     * Emits event with specified type and params synchronously.
     * @param {string} type
     * @param eventArgs
     */

  }, {
    key: 'emitSync',
    value: function emitSync(type) {
      for (var _len2 = arguments.length, eventArgs = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
        eventArgs[_key2 - 1] = arguments[_key2];
      }

      this._applyEvents(type, eventArgs);
    }

    /**
     * Destroys EventEmitter
     */

  }, {
    key: 'destroy',
    value: function destroy() {
      this._listeners = {};
      this.events = [];
    }
  }]);

  return EventEmitter;
}();

var _possibleConstructorReturn = (function (self, call) {
  if (!self) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return call && (typeof call === "object" || typeof call === "function") ? call : self;
});

var _inherits = (function (subClass, superClass) {
  if (typeof superClass !== "function" && superClass !== null) {
    throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
  }

  subClass.prototype = Object.create(superClass && superClass.prototype, {
    constructor: {
      value: subClass,
      enumerable: false,
      writable: true,
      configurable: true
    }
  });
  if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
});

var settings = {
  iceServers: [{
    urls: ['turn:connect.opengroup.io'],
    username: 'lorem',
    credential: 'ipsum'
  }, {
    urls: ['stun:connect.opengroup.io']
  }]
};

/**
 * EasyP2P helps setting up a WebRTC connection.
 *
 * The WebRTC flow is asymmetric.
 *
 * Initiator:
 * - Create offer, send offer, receive answer, accept answer.
 *
 * Answerer:
 * - Receive offer, create answer, send answer.
 */
var EasyP2P = function (_EventEmitter) {
  _inherits(EasyP2P, _EventEmitter);

  /**
   * @param configuration, must hold iceServers so have server to do turn and stun with.
   * @constructor
   */
  function EasyP2P() {
    var configuration = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    _classCallCheck(this, EasyP2P);

    var _this = _possibleConstructorReturn(this, (EasyP2P.__proto__ || Object.getPrototypeOf(EasyP2P)).call(this));

    _this.configuration = {
      role: 'initiator',
      iceServers: []
    };

    // Merge the default configuration with the given configuration.
    _this.configuration = Object.assign(_this.configuration, configuration);
    _this.webRTCOptions = Object.assign({}, _this.configuration.webRTCOptions);

    // Initiate the p2p channel.
    _this.RtcPeerConnection = new RTCPeerConnection(_this.webRTCOptions);

    // Start EasyP2P in the right user role: initiator or answerer.
    if (typeof _this[_this.configuration.role + 'Init'] === 'function') {
      _this[_this.configuration.role + 'Init']();
    } else {
      throw 'The role is wrong and therefor EasyP2P could not initiate.';
    }
    return _this;
  }

  /**
   * Creates the initial offer.
   */

  _createClass(EasyP2P, [{
    key: 'initiatorInit',
    value: function initiatorInit() {
      var _this2 = this;

      // Subscribe to the ICE candidates and when all are finished call our offerReady callback.
      this.RtcPeerConnection.onicecandidate = function (event) {
        if (!event.candidate) {
          _this2.emit('offer-ready', _this2.RtcPeerConnection.localDescription.toJSON().sdp);
        }
      };

      this.dataChannel = this.RtcPeerConnection.createDataChannel('onitama');
      this.attachDataChannel();

      this.RtcPeerConnection.createOffer().then(function (offer) {
        return _this2.RtcPeerConnection.setLocalDescription(offer);
      }).catch(function () {
        return console.log('Error while creating an offer');
      });
    }

    /**
     * Creates the answer.
     */

  }, {
    key: 'answererInit',
    value: function answererInit() {
      var _this3 = this;

      if (!this.configuration.initialOffer) {
        throw 'Connection failed, please let the initiator try again';
      }

      // Subscribe to the ICE candidates and when all are finished call our offerReady callback.
      this.RtcPeerConnection.onicecandidate = function (event) {
        if (!event.candidate) {
          _this3.emit('answer-ready', _this3.RtcPeerConnection.localDescription.toJSON().sdp);
        }
      };

      this.RtcPeerConnection.ondatachannel = function (event) {
        _this3.dataChannel = event.channel;
        _this3.attachDataChannel();
      };

      var offer = new RTCSessionDescription({ type: 'offer', sdp: this.configuration.initialOffer });
      this.RtcPeerConnection.setRemoteDescription(offer);

      this.RtcPeerConnection.createAnswer().then(function (answer) {
        return _this3.RtcPeerConnection.setLocalDescription(answer);
      }).catch(function () {
        return console.log('Error while creating an answer');
      });
    }

    /**
     * Accepts the answer so the connection can be set up.
     * @param sdp
     */

  }, {
    key: 'acceptAnswer',
    value: function acceptAnswer(sdp) {
      var answer = new RTCSessionDescription({ type: 'answer', sdp: sdp });
      this.RtcPeerConnection.setRemoteDescription(answer);
    }

    /**
     * Attach callbacks to the dataChannel, is the same for both the initiator and the answerer.
     */

  }, {
    key: 'attachDataChannel',
    value: function attachDataChannel() {
      var _this4 = this,
          _arguments = arguments;

      this.dataChannel.onopen = function () {
        _this4.emit.apply(_this4, ['started'].concat(Array.prototype.slice.call(_arguments)));
      };

      this.dataChannel.onmessage = function (message) {
        _this4.emit('message', message.data);
      };

      this.dataChannel.onclose = function () {
        _this4.emit.apply(_this4, ['close'].concat(Array.prototype.slice.call(_arguments)));
      };

      this.dataChannel.onerror = function () {
        _this4.emit.apply(_this4, ['error'].concat(Array.prototype.slice.call(_arguments)));
      };
    }
  }, {
    key: 'sendMessage',
    value: function sendMessage(message) {
      this.dataChannel.send(message);
    }
  }]);

  return EasyP2P;
}(EventEmitter);

var Connection = function (_EventEmitter) {
  _inherits(Connection, _EventEmitter);

  function Connection(roomName) {
    _classCallCheck(this, Connection);

    var _this = _possibleConstructorReturn(this, (Connection.__proto__ || Object.getPrototypeOf(Connection)).call(this));

    _this.roomName = roomName;
    _this.myGuid = Helpers.guid();

    // Initiate the connection via an asymmetric process
    // and when done do the things that need to be done for both players.
    _this.websockets(function () {
      _this.role = _this.easyP2P.configuration.role;
      document.body.dataset.webrtcRole = _this.easyP2P.configuration.role;

      // Connection is started.
      _this.easyP2P.on('started', function () {
        _this.ws.close();

        document.body.dataset.webrtc = 'started';
        _this.emit('started');
      });

      _this.easyP2P.on('error', function () {
        _this.emit('close');
      });

      _this.easyP2P.on('close', function () {
        _this.emit('close');
      });

      // Connection is started.
      _this.easyP2P.on('message', function (jsonMessage) {
        var message = JSON.parse(jsonMessage);
        _this.emit('message', message);
      });
    });
    return _this;
  }

  /**
   * Run the websockets and call the callback to continue with the flow.
   * We use the application from https://github.com/opengroup/opengroup-signaler-node-websockets for signaling.
   * @param done
   */

  _createClass(Connection, [{
    key: 'websockets',
    value: function websockets(done) {
      var _this2 = this;

      this.ws = new WebSocket('wss://connect.opengroup.io/' + this.roomName);

      this.ws.onopen = function () {
        _this2.ws.send(JSON.stringify({
          command: 'identify',
          uuid: _this2.myGuid
        }));
      };

      this.ws.onmessage = function (event) {
        var message = JSON.parse(event.data);
        if (message.command === 'create-offer') {
          _this2.easyP2P = new EasyP2P({
            role: 'initiator',
            webRTCOptions: {
              iceServers: settings.iceServers
            }
          });

          _this2.easyP2P.on('offer-ready', function (offerSdp) {
            _this2.ws.send(JSON.stringify({
              command: 'pass-offer',
              uuid: _this2.myGuid,
              toUuid: message.uuid,
              offer: btoa(offerSdp)
            }));
          });

          done();
        }

        if (message.command === 'create-answer') {
          _this2.easyP2P = new EasyP2P({
            role: 'answerer',
            webRTCOptions: {
              iceServers: settings.iceServers
            },
            initialOffer: atob(message.offer)
          });

          _this2.easyP2P.on('answer-ready', function (answerSdp) {
            _this2.ws.send(JSON.stringify({
              command: 'pass-answer',
              uuid: _this2.myGuid,
              toUuid: message.uuid,
              answer: btoa(answerSdp)
            }));
          });

          done();
        }

        if (message.command === 'accept-answer') {
          _this2.easyP2P.acceptAnswer(atob(message.answer));
        }
      };
    }

    /**
     * Proxy the messages to the easyP2P.
     * @param command
     * @param options
     */

  }, {
    key: 'sendMessage',
    value: function sendMessage(command, options) {
      this.easyP2P.sendMessage(JSON.stringify({
        command: command,
        options: options
      }));
    }
  }]);

  return Connection;
}(EventEmitter);

window.es6Loaded = true;

var App = function () {
  function App() {
    _classCallCheck(this, App);

    this.emitter = new EventEmitter();
    location.pathname === '/board-debug' ? this.boardDebug() : this.multiPlayerGame();
  }

  /**
   * This starts the connection logic and the onitama board.
   */

  _createClass(App, [{
    key: 'multiPlayerGame',
    value: function multiPlayerGame() {
      this.game = null;
      location.pathname === '/' ? this.createRoomWizard() : this.createMultiplayerConnection();
    }

    /**
     * Multiplayer when having a room name.
     */

  }, {
    key: 'createMultiplayerConnection',
    value: function createMultiplayerConnection() {
      var _this = this;

      var element = document.querySelector('#game');

      element.innerHTML = '<div class="board-wrapper"><div class="waiting-message">\n        <h2>Welcome to Onitama!</h2>\n        <h4>Please wait till an other player joins.</h4>\n        <h4>You can send the following link:</h4>\n        <a class="copy-link" href="' + location + '" target="_blank">' + location + '</a>\n        </div></div>';

      this.connection = new Connection(location.pathname.substr(1));
      this.connection.on('started', function () {
        return _this.onStarted();
      });
      this.connection.on('close', function () {
        return function () {
          window.location = '' + location.origin;
        };
      });
      this.connection.on('message', function (message) {
        return _this.onMessage(message);
      });
    }

    /**
     * Multiplayer when not having a room name.
     */

  }, {
    key: 'createRoomWizard',
    value: function createRoomWizard() {
      var element = document.querySelector('#game');

      element.innerHTML = '<div class="board-wrapper"><div class="waiting-message">\n        <h2>Welcome to Onitama!</h2>\n        <h4>Please create a room to play:</h4>\n        <input type="text" class="room-name-input"><br><br>\n        <a class="goto-link" href="' + location + '"></a>\n        </div></div>';

      var gotoLink = document.querySelector('.goto-link');
      var roomInput = document.querySelector('.room-name-input');

      roomInput.addEventListener('keydown', function (event) {
        // Enter press.
        if (event.keyCode === 13) {
          window.location = location.origin + '/' + this.value;
        }

        // Other things than a-z.
        if ((event.keyCode < 65 || event.keyCode > 90 || event.shiftKey) && ![8, 9, 32, 46, 173].includes(event.keyCode)) {
          event.preventDefault();
        }

        // Good keys so update the link.
        else {
            gotoLink.innerHTML = location.origin + '/' + this.value;
          }
      });

      // When letting go of the key we update the link.
      roomInput.addEventListener('keyup', function () {
        if (this.value) {
          gotoLink.innerHTML = location.origin + '/' + this.value;
          gotoLink.href = location.origin + '/' + this.value;
        } else {
          gotoLink.innerHTML = '';
        }
      });
    }

    /**
     * A simple board without connection, for debugging css.
     */

  }, {
    key: 'boardDebug',
    value: function boardDebug() {
      this.game = new Game('#game', this.emitter, 'initiator');
    }

    /**
     * If the connection has a message, we try to execute it.
     */

  }, {
    key: 'onMessage',
    value: function onMessage(message) {
      if (message.command && message.options) {
        this.executeCommand(message.command, message.options);
      }
    }

    /**
     * When the game starts.
     */

  }, {
    key: 'onStarted',
    value: function onStarted() {
      var _this2 = this;

      if (this.connection.role === 'initiator') {
        this.game = new Game('#game', this.emitter, this.connection.role);
        var onitamaNotation = this.game.state.serialize();
        this.emitter.on('turn', function (piece, tile, card, oldX, oldY, isExternal) {
          return _this2.onTurn(piece, tile, card, oldX, oldY, isExternal);
        });
        this.connection.sendMessage('startGame', onitamaNotation);
      }
    }

    /**
     * Send the turn to the other peer.
     */

  }, {
    key: 'onTurn',
    value: function onTurn(piece, tile, card, oldX, oldY, isExternal) {
      if (!isExternal) {
        this.connection.sendMessage('turn', {
          pieceX: oldX,
          pieceY: oldY,
          tileX: tile.x,
          tileY: tile.y,
          card: card.name,
          player: piece.player.id
        });
      }
    }

    /**
     * Execute p2p command.
     */

  }, {
    key: 'executeCommand',
    value: function executeCommand(command, options) {
      var _this3 = this;

      var commands = {
        startGame: function startGame(onitamaNotation) {
          _this3.game = new Game('#game', _this3.emitter, _this3.connection.role, onitamaNotation);
          _this3.emitter.on('turn', function (piece, tile, card, oldX, oldY, isExternal) {
            return _this3.onTurn(piece, tile, card, oldX, oldY, isExternal);
          });
        },
        turn: function turn(turnData) {
          _this3.game.externalTurn(turnData);
        }
      };

      if (commands[command]) {
        commands[command](options);
      }
    }
  }]);

  return App;
}();

new App();

Object.defineProperty(exports, '__esModule', { value: true });

})));

//# sourceMappingURL=build.js.map