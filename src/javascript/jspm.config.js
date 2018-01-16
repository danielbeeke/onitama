SystemJS.config({
  paths: {
    "npm:": "src/javascript/lib/npm/",
    "onitama/": "src/javascript/"
  },
  browserConfig: {
    "baseURL": "src"
  },
  devConfig: {
    "map": {
      "plugin-babel": "npm:systemjs-plugin-babel@0.0.25"
    }
  },
  transpiler: "plugin-babel",
  packages: {
    "onitama": {
      "main": "onitama.js",
      "meta": {
        "*.js": {
          "loader": "plugin-babel"
        }
      }
    }
  },
  map: {
    "vuejs": "npm:vuejs@3.0.1"
  }
});

SystemJS.config({
  packageConfigPaths: [
    "npm:@*/*.json",
    "npm:*.json"
  ],
  map: {
    "ion-rangeslider": "npm:ion-rangeslider@2.2.0",
    "process": "npm:jspm-nodelibs-process@0.2.1",
    "vue": "npm:vue@2.5.13",
    "vue-form-generator": "npm:vue-form-generator@2.1.1",
    "vue-router": "npm:vue-router@3.0.1"
  },
  packages: {
    "npm:ion-rangeslider@2.2.0": {
      "map": {
        "jquery": "npm:jquery@3.2.1"
      }
    }
  }
});
