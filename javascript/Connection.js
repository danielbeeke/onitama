import {EventEmitter} from '/javascript/EventEmitter.js';
import {settings} from '/settings.js';
import {EasyP2P} from '/javascript/EasyP2P.js';

export class Connection extends EventEmitter {
  constructor (configuration = {}) {
    super();
    this.configuration = {};

    // Merge the default configuration with the given configuration.
    this.configuration = Object.assign(this.configuration, configuration);

    let webrtcAnswerTextarea = document.querySelector('#webrtc-answer');

    this.easyP2P = new EasyP2P({
      // WebRTC signaling is asymmetric, we have to tell what role this person has.
      role: location.hash.substr(0, 4) === '#sdp' ? 'answerer' : 'initiator',

      // WebRTC needs iceServers, stun creates the sdp, turn works around IPv4 nat.
      iceServers: settings.iceServers,

      // If we are the answerer set the initial offer.
      initialOffer: location.hash.substr(0, 4) === '#sdp' ? decodeURI(location.hash.substr(5)) : null
    });

    // If we are the initiator, create the url to sent and attach to the textarea so we can accept the connection.
    this.easyP2P.on('offer-ready', (offerSdp) => {
      let url = location.href + '#sdp=' + encodeURI(offerSdp);
      console.log(url);

      webrtcAnswerTextarea.addEventListener('change', () => {
        this.easyP2P.acceptAnswer(atob(webrtcAnswerTextarea.value));
      });
    });

    // If we are the answerer, put the answer in the textarea so the user can copy it to the other user.
    this.easyP2P.on('answer-ready', (answerSdp) => {
      location.hash = '';
      webrtcAnswerTextarea.value = btoa(answerSdp);
    });

    // Connection is started.
    this.easyP2P.on('started', () => {
      webrtcAnswerTextarea.remove();
      this.emit('started');
    });
  }
}