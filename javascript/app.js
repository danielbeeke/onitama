import {settings} from '/settings.js';
import {EasyP2P} from '/javascript/EasyP2P.js';

let url = '';
let webrtcAnswerTextarea = document.querySelector('#webrtc-answer');
let connection = new EasyP2P({
  role: location.hash.substr(0, 4) === '#sdp' ? 'answerer' : 'initiator',
  iceServers: settings.iceServers,
  initialOffer: location.hash.substr(0, 4) === '#sdp' ? decodeURI(location.hash.substr(5)) : null,
  offerReady: (offerSdp) => {
    url = location.href + '#sdp=' + encodeURI(offerSdp);
    console.log(url);

    webrtcAnswerTextarea.addEventListener('change', () => {
      let answer = atob(webrtcAnswerTextarea.value);
      connection.acceptAnswer(answer);
    });
  },
  answerReady: (answerSdp) => {
    location.hash = '';
    webrtcAnswerTextarea.value = btoa(answerSdp);
  }
});