import './../lib/howler.js';

export class Audio {
  constructor (emitter) {
    this.emitter = emitter;
    let moves = this.loadAudio('move', 9);
    let captures = this.loadAudio('capture', 6);
    let atenttions = this.loadAudio('inactivity', 4);

    this.emitter.on('turn', () => {
      this.playRandomItem(moves);
    });

    this.emitter.on('player.defeated', (piece) => {
      this.playRandomItem(captures);
    });

    this.emitter.on('piece.captured', (piece) => {
      this.playRandomItem(captures);
    });

    this.emitter.on('inactivity.turn', () => {
      if (document.hidden) {
        this.playRandomItem(atenttions);
      }
    });
  }

  playRandomItem (array) {
    let item = array[Math.floor(Math.random() * array.length)];
    item.play();
  }

  loadAudio (name, count) {
    let sounds = [];
    for (let i = 1; i < count + 1; i++) {
      let filename = `sounds/${name}-${i}.mp3`;
      sounds.push(new Howl({ src: [filename] }));
    }
    return sounds;
  }
}