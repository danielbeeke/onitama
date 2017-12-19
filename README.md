# How to run locally
- npm install -g harp
- npm install
- harp server
- Create webrtc.js like default.webrtc.js
- browser-sync start --proxy 'localhost:9000' --files '**/*'

# How to deploy
- harp compile
- Copy www folder to production

# Documentation links
- EJS http://ejs.co/
- HarpJS http://harpjs.com/