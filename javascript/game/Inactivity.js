export class Inactivity {
  constructor (emitter) {
    this.emitter = emitter;
    this.currentStart = 1;
    this.activeTitle = 'Onitama';
    document.title = this.activeTitle;

    document.addEventListener('visibilitychange', () => {
      if (!document.hidden) {
        document.title = this.activeTitle;
      }
    });

    Notification.requestPermission();

    this.emitter.on('inactivity.turn', () => {
      if (document.hidden) {
        this.animateTabTitle('New activity! - - - New activity! - - - New activity! - - - ');

        if (window.Notification && Notification.permission !== 'denied') {
          new Notification('There is Onitama activity!');
        }

      }
    });
  }

  animateTabTitle (title) {
    let doStep = () => {
      this.currentStart++;
      if (this.currentStart > title.length) {
        this.currentStart = 1;
      }

      if (document.hidden) {
        document.title = title.substr(this.currentStart) + ' ' + title.substr(0, this.currentStart);

        setTimeout(() => {
          doStep();
        }, 100);
      }
    };

    if (document.hidden) {
      doStep();
    }
  }
}