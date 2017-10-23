import {EventEmitter} from '/javascript/core/EventEmitter.js';

/**
 * EasyP2P helps settings up a WebRTC connection.
 */
export class EasyP2P extends EventEmitter {

  /**
   * @param configuration, must hold iceServers so have server to do turn and stun with.
   * @constructor
   */
  constructor (configuration = {}) {
    super();
    this.configuration = {
      role: 'initiator',
      iceServers: []
    };

    // Merge the default configuration with the given configuration.
    this.configuration = Object.assign(this.configuration, configuration);

    // Initiate the p2p channel.
    this.RtcPeerConnection = new RTCPeerConnection(Object.assign({}, this.configuration.iceServers));

    // Start EasyP2P in the right user role: initiator or answerer.
    this[this.configuration.role + 'Init']();
  }

  /**
   * Creates the initial offer.
   */
  initiatorInit () {
    // Subscribe to the ICE candidates and when all are finished call our offerReady callback.
    this.RtcPeerConnection.onicecandidate = (event) => {
      if (!event.candidate) {
        this.emit('offer-ready', this.RtcPeerConnection.localDescription.toJSON().sdp);
      }
    };

    this.dataChannel = this.RtcPeerConnection.createDataChannel('onitama');
    this.attachDataChannel();

    this.RtcPeerConnection.createOffer()
    .then((offer) => this.RtcPeerConnection.setLocalDescription(offer))
    .catch(() => console.log('Error while creating an offer'));
  }

  /**
   * Creates the answer.
   */
  answererInit () {
    if (!this.configuration.initialOffer) { throw 'Connection failed, please let the initiator try again'; }

    // Subscribe to the ICE candidates and when all are finished call our offerReady callback.
    this.RtcPeerConnection.onicecandidate = (event) => {
      if (!event.candidate) {
        this.emit('answer-ready', this.RtcPeerConnection.localDescription.toJSON().sdp);
      }
    };

    this.RtcPeerConnection.ondatachannel = (event) => {
      this.dataChannel = event.channel;
      this.attachDataChannel();
    };

    let offer = new RTCSessionDescription({ type: 'offer', sdp: this.configuration.initialOffer });
    this.RtcPeerConnection.setRemoteDescription(offer);

    this.RtcPeerConnection.createAnswer()
    .then((answer) => this.RtcPeerConnection.setLocalDescription(answer))
    .catch(() => console.log('Error while creating an answer'));
  }

  /**
   * Accepts the answer so the connection can be set up.
   * @param sdp
   */
  acceptAnswer (sdp) {
    let answer = new RTCSessionDescription({ type: 'answer', sdp: sdp });
    this.RtcPeerConnection.setRemoteDescription(answer);
  }

  /**
   * Attach callbacks to the dataChannel, is the same for both the initiator and the answerer.
   */
  attachDataChannel () {
    this.dataChannel.onopen = () => {
      this.emit('started', ...arguments);
    };

    this.dataChannel.onmessage = () => {
      this.emit('message', ...arguments);
    };

    this.dataChannel.onclose = () => {
      this.emit('close', ...arguments);
    };

    this.dataChannel.onerror = () => {
      this.emit('error', ...arguments);
    };
  }
}
