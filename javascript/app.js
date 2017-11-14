import {Helpers} from '/javascript/core/Helpers.js';
import {Board} from '/javascript/game/Board.js';
import {State} from '/javascript/game/State.js';

let board = new Board('#board');
let emptyState = new State();

console.log(emptyState)

board.setState(emptyState);