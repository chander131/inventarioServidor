const aliasPath = require('./aliasPath');

module.exports = (() => ({
  "presets": [
    [
      "@babel/env",
      {
        "targets": {
          "node": "current"
        }
      }
    ]
  ],
  "plugins": [
    "@babel/transform-runtime",
    ["module-resolver", {
      "alias": aliasPath
    }]
  ],
}))();
