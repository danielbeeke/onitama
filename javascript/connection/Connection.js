import {EventEmitter} from '/javascript/core/EventEmitter.js';
import {settings} from '/webrtc.js';
import {EasyP2P} from '/javascript/connection/EasyP2P.js';

export class Connection extends EventEmitter {
  constructor (configuration = {}) {
    super();
    this.configuration = {};

    // Merge the default configuration with the given configuration.
    this.configuration = Object.assign(this.configuration, configuration);

    let urlInput = document.querySelector('#webrtc-offer-url');
    let pasteAnswerInput = document.querySelector('#webrtc-paste-answer');
    let copyAnswerInput = document.querySelector('#webrtc-copy-answer');

    // Clean up browser cache.
    pasteAnswerInput.value = '';

    document.body.dataset.webrtcState = 'initial';

    this.easyP2P = new EasyP2P({
      // WebRTC signaling is asymmetric, we have to tell what role this person has.
      role: location.hash.substr(0, 4) === '#sdp' ? 'answerer' : 'initiator',

      // WebRTC needs iceServers, stun creates the sdp, turn works around IPv4 nat.
      iceServers: settings.iceServers,

      // If we are the answerer set the initial offer.
      initialOffer: location.hash.substr(0, 4) === '#sdp' ? atob(location.hash.substr(5)) : null
    });

    this.role = this.easyP2P.configuration.role;

    document.body.dataset.webrtcRole = this.easyP2P.configuration.role;

    document.querySelector('.copy-offer-url').addEventListener('click', () => {
      urlInput.select();
      document.execCommand('copy');
      document.body.dataset.webrtcState = 'offer-copied';
    });

    document.querySelector('.copy-answer').addEventListener('click', () => {
      copyAnswerInput.select();
      document.execCommand('copy');
      document.body.dataset.webrtcState = 'answer-copied';
    });

    // If we are the initiator, create the url to sent and attach to the textarea so we can accept the connection.
    this.easyP2P.on('offer-ready', (offerSdp) => {
      urlInput.value = location.origin + '/#sdp=' + btoa(offerSdp);

      pasteAnswerInput.addEventListener('change', () => {
        this.easyP2P.acceptAnswer(atob(pasteAnswerInput.value));
      });
    });

    // If we are the answerer, put the answer in the textarea so the user can copy it to the other user.
    this.easyP2P.on('answer-ready', (answerSdp) => {
      // Remove the hash from the url. location.hash leaves a #.
      history.pushState('', document.title, window.location.pathname + window.location.search);
      copyAnswerInput.value = btoa(answerSdp);
    });

    // Connection is started.
    this.easyP2P.on('started', () => {
      document.body.dataset.webrtc = 'started';
      this.emit('started');
      Array.from(document.querySelectorAll('.webrtc-signaling')).forEach((signalingPopup) => {
        signalingPopup.remove();
      });
    });

    // Connection is started.
    this.easyP2P.on('message', (jsonMessage) => {
      let message = JSON.parse(jsonMessage);
      this.emit('message', message);
    });
  }

  sendMessage (command, options) {
    this.easyP2P.sendMessage(command, options);
  }
}