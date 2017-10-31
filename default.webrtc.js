export const settings = {
  iceServers: [{
    urls: "stun:stun.services.mozilla.com",
    username: "louis@mozilla.com",
    credential: "webrtcdemo"
  }, {
    urls: [
      "stun:stun.example.com",
      "stun:stun-1.example.com"
    ]
  }]
};