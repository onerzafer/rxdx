module.exports = {
  presets: [
    [
      "@babel/env",
      {
        targets: {
          browsers: ["ie >= 11"]
        },
        exclude: ["transform-async-to-generator", "transform-regenerator"],
        modules: false,
        loose: true
      }
    ]
  ],
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
