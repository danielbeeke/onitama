import {EventEmitter} from '/javascript/core/EventEmitter.js';

export class Card extends EventEmitter {
	constructor (data) {
		super();

		Object.assign(this, data);
		this.sets = new Set(data.sets);
	}
}