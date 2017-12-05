import {EventEmitter} from '/javascript/core/EventEmitter.js';
import {settings} from '/webrtc.js';
import {EasyP2P} from '/javascript/connection/EasyP2P.js';
import {Helpers} from '/javascript/core/Helpers.js';

export class Connection extends EventEmitter {
  constructor () {
    super();
    this.myGuid = Helpers.guid();

    // Initiate the connection via an asymmetric process
    // and when done do the things that need to be done for both players.
    this.websockets(() => {
      this.role = this.easyP2P.configuration.role;
      document.body.dataset.webrtcRole = this.easyP2P.configuration.role;

      // Connection is started.
      this.easyP2P.on('started', () => {
        this.ws.close();

        document.body.dataset.webrtc = 'started';
        this.emit('started');
      });

      // Connection is started.
      this.easyP2P.on('message', (jsonMessage) => {
        let message = JSON.parse(jsonMessage);
        this.emit('message', message);
      });

    });
  }

  /**
   * Run the websockets and call the callback to continue with the flow.
   * We use the application from https://github.com/opengroup/opengroup-signaler-node-websockets for signaling.
   * @param done
   */
  websockets (done) {
    this.ws = new WebSocket('wss://connect.opengroup.io' + location.pathname);

    this.ws.onopen = () => {
      this.ws.send(JSON.stringify({
        command: 'identify',
        uuid: this.myGuid
      }));
    };

    this.ws.onmessage = (event) => {
      let message = JSON.parse(event.data);
      if (message.command === 'create-offer') {
        this.easyP2P = new EasyP2P({
          role: 'initiator',
          webRTCOptions: {
            iceServers: settings.iceServers,
          }
        });

        this.easyP2P.on('offer-ready', (offerSdp) => {
          this.ws.send(JSON.stringify({
            command: 'pass-offer',
            uuid: this.myGuid,
            toUuid: message.uuid,
            offer: btoa(offerSdp)
          }));
        });

        done();
      }

      if (message.command === 'create-answer') {
        this.easyP2P = new EasyP2P({
          role: 'answerer',
          webRTCOptions: {
            iceServers: settings.iceServers,
          },
          initialOffer: atob(message.offer),
        });

        this.easyP2P.on('answer-ready', (answerSdp) => {
          this.ws.send(JSON.stringify({
            command: 'pass-answer',
            uuid: this.myGuid,
            toUuid: message.uuid,
            answer: btoa(answerSdp)
          }));
        });

        done();
      }

      if (message.command === 'accept-answer') {
        this.easyP2P.acceptAnswer(atob(message.answer));
      }
    };
  }

  /**
   * Proxy the messages to the easyP2P.
   * @param command
   * @param options
   */
  sendMessage (command, options) {
    this.easyP2P.sendMessage(JSON.stringify({
      command: command,
      options: options
    }));
  }
}