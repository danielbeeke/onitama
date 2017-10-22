/**
 * EasyP2P helps settings up a WebRTC connection.
 */
export class EasyP2P {

  /**
   * @param configuration, may hold iceServers.
   * @constructor
   */
  constructor (configuration = {}) {
    this.configuration = {
      role: 'initiator',
      iceServers: []
    };

    this.configuration = Object.assign(this.configuration, configuration);
    this.RtcPeerConnection = new RTCPeerConnection(Object.assign({}, this.configuration.iceServers));

    this[this.configuration.role + 'Init']();
  }

  initiatorInit () {
    // Subscribe to the ICE candidates and when all are finished call our offerReady callback.
    this.RtcPeerConnection.onicecandidate = (event) => {
      if (!event.candidate && typeof this.configuration.offerReady === 'function') {
        this.configuration.offerReady(this.RtcPeerConnection.localDescription.toJSON().sdp);
      }
    };

    this.dataChannel = this.RtcPeerConnection.createDataChannel('onitama');
    this.attachDataChannel();

    this.RtcPeerConnection.createOffer()
    .then((offer) => this.RtcPeerConnection.setLocalDescription(offer))
    .catch(() => console.log('Error while creating an offer'));
  }

  answererInit () {
    if (!this.configuration.initialOffer) { throw 'Connection failed, please let the initiator try again'; }

    // Subscribe to the ICE candidates and when all are finished call our offerReady callback.
    this.RtcPeerConnection.onicecandidate = (event) => {
      if (!event.candidate && typeof this.configuration.answerReady === 'function') {
        this.configuration.answerReady(this.RtcPeerConnection.localDescription.toJSON().sdp);
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

  acceptAnswer (sdp) {
    let answer = new RTCSessionDescription({ type: 'answer', sdp: sdp });
    this.RtcPeerConnection.setRemoteDescription(answer);
  }

  attachDataChannel () {
    this.dataChannel.onopen = () => {
      console.log('open')
    };

    this.dataChannel.onmessage = () => {
      console.log('message')
    };

    this.dataChannel.onclose = () => {
      console.log('close')
    };

    this.dataChannel.onerror = () => {
      console.log('error')
    };
  }
}
