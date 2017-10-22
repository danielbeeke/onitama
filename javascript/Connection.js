import {EventEmitter} from '/javascript/EventEmitter.js';
import {settings} from '/settings.js';
import {EasyP2P} from '/javascript/EasyP2P.js';
import '/node_modules/clipboard/dist/clipboard.js';

export class Connection extends EventEmitter {
  constructor (configuration = {}) {
    super();

    this.configuration = {};

    // Merge the default configuration with the given configuration.
    this.configuration = Object.assign(this.configuration, configuration);

    let urlInput = document.querySelector('#webrtc-offer-url');
    let pasteAnswerInput = document.querySelector('#webrtc-paste-answer');
    let copyAnswerInput = document.querySelector('#webrtc-copy-answer');

    document.body.dataset.webrtcState = 'initial';

    // Initiate the clipboard.
    new Clipboard('.clipboard');

    this.easyP2P = new EasyP2P({
      // WebRTC signaling is asymmetric, we have to tell what role this person has.
      role: location.hash.substr(0, 4) === '#sdp' ? 'answerer' : 'initiator',

      // WebRTC needs iceServers, stun creates the sdp, turn works around IPv4 nat.
      iceServers: settings.iceServers,

      // If we are the answerer set the initial offer.
      initialOffer: location.hash.substr(0, 4) === '#sdp' ? decodeURI(location.hash.substr(5)) : null
    });

    document.body.dataset.webrtcRole = this.easyP2P.configuration.role;

    document.querySelector('.copy-offer-url').addEventListener('click', () => {
      // Work around for the clipboard, it does not copy hidden things.
      setTimeout(() => {
        document.body.dataset.webrtcState = 'offer-copied';
      }, 300);
    });

    // If we are the initiator, create the url to sent and attach to the textarea so we can accept the connection.
    this.easyP2P.on('offer-ready', (offerSdp) => {
      urlInput.value = location.href + '#sdp=' + encodeURI(offerSdp);

      pasteAnswerInput.addEventListener('change', () => {
        this.easyP2P.acceptAnswer(atob(pasteAnswerInput.value));
      });
    });

    // If we are the answerer, put the answer in the textarea so the user can copy it to the other user.
    this.easyP2P.on('answer-ready', (answerSdp) => {
      location.hash = '';
      copyAnswerInput.value = btoa(answerSdp);
    });

    // Connection is started.
    this.easyP2P.on('started', () => {
      document.body.dataset.webrtcRole = 'started';

      this.emit('started');
    });
  }
}