export class OpenGroupSignaler {

  /**
   * @param group.
   * @param config.
   * @constructor
   */
  constructor (group, config = {}) {
    this.url = 'wss://connect.opengroup.io/';

    if (this.validWebsocketsUrl(this.config.url)) {
      this.addUrl(this.config.url);
    }
  }

  addUrl (url) {
    let ws = new WebSocket(url);
    this.endpoints.push(ws);
    this.connectedUrls.push(url);

    ws.onopen = (event) => {
      ws.send(JSON.stringify({
        command: 'identify',
        uuid: this.group.lid
      }));
    };

    ws.onmessage = (event) => {
      let message = JSON.parse(event.data);

      if (message.command === 'create-offer') {
        let connectedUuids = this.group.connections.map((connection) => connection.uuid);
        if (!connectedUuids.includes(message.uuid)) {

          this.group.addPeer({
            connectionType: 'og-webrtc',
            signalerType: 'manual',
            uuid: message.uuid,
            signalerInfo: {
              role: 'initiator',
              offerCreated: (offer, returnAnswerCallback) => {
                this.returnAnswerCallbacks[message.uuid] = returnAnswerCallback;
                ws.send(JSON.stringify({
                  command: 'pass-offer',
                  uuid: this.group.lid,
                  toUuid: message.uuid,
                  offer: btoa(JSON.stringify(offer.toJSON()))
                }));
              },
            }
          });
        }
      }

      if (message.command === 'create-answer') {
        let offer = JSON.parse(atob(message.offer));

        this.group.addPeer({
          connectionType: 'og-webrtc',
          uuid: message.uuid,
          signalerType: 'manual',
          signalerInfo: {
            role: 'answerer',
            offer: offer,
            answerCreated: (answer) => {
              ws.send(JSON.stringify({
                command: 'pass-answer',
                uuid: this.group.lid,
                toUuid: message.uuid,
                answer: btoa(JSON.stringify(answer.toJSON()))
              }));
            }
          }
        });
      }

      if (message.command === 'accept-answer') {
        let answer = JSON.parse(atob(message.answer));
        this.returnAnswerCallbacks[message.uuid](answer);
      }

    };
  }

}

export default OgSignaler;
