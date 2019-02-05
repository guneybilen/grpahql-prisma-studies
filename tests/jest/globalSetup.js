//require("@babel/core");
require("@babel/register");
require("@babel/preset-env");
require("@babel/polyfill/noConflict");
const server = require("../../src/server").default;
// the reason for the .default call is a compatibility issue
// server.js uses import-export but in this file we use
// require-module.exports.

module.exports = async () => {
  global.httpServer = await server.start({ port: 4000 });
};
