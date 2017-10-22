import {settings} from '/settings.js';
import {EasyP2P} from '/javascript/EasyP2P.js';

let webrtcAnswerTextarea = document.querySelector('#webrtc-answer');

let connection = new EasyP2P({
  // WebRTC signaling is asymmetric, we have to tell what role this person has.
  role: location.hash.substr(0, 4) === '#sdp' ? 'answerer' : 'initiator',

  // WebRTC needs iceServers, stun creates the sdp, turn works around IPv4 nat.
  iceServers: settings.iceServers,

  // If we are the answerer set the initial offer.
  initialOffer: location.hash.substr(0, 4) === '#sdp' ? decodeURI(location.hash.substr(5)) : null,

  // If we are the initiator, create the url to sent and attach to the textarea so we can accept the connection.
  offerReady: (offerSdp) => {
    let url = location.href + '#sdp=' + encodeURI(offerSdp);
    console.log(url);

    webrtcAnswerTextarea.addEventListener('change', () => {
      connection.acceptAnswer(atob(webrtcAnswerTextarea.value));
    });
  },

  // If we are the answerer, put the answer in the textarea so the user can copy it to the other user.
  answerReady: (answerSdp) => {
    location.hash = '';
    webrtcAnswerTextarea.value = btoa(answerSdp);
  },

  // Connection is started.
  started: () => {
    webrtcAnswerTextarea.remove();
  }
});