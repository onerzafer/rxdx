module.exports ={
  "presets": [
    ["@babel/preset-env", {
      "modules": false,
      "targets": {
        "browsers": "ie >= 11"
      }
    }]
  ],
  "env": {
    "test": {
      "presets": [["@babel/preset-env"]]
    },
  },
  plugins: [
    [
      "@babel/plugin-transform-react-jsx",
      {
        throwIfNamespace: false // defaults to true
      }
    ],
    "@babel/plugin-proposal-class-properties",
    ["@babel/proposal-decorators", { legacy: true }],
    "@babel/proposal-object-rest-spread"
  ].filter(Boolean)
};
