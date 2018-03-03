const config = require("../config.json");
const index = require("../index.js");
const msg = require("../utilities/message.js");
const user = require("../utilities/user.js");
const Tictactoe = require("../structures/tictactoe.js");
const Game = require("../structures/game.js");
module.exports.run = (message, args, prefix) => {
  Game.create(new Tictactoe(message));
};

module.exports.help = {
  name: "tictactoe",
  description: "Starts a game of classic two player tic tac toe!",
  usage: ["tictactoe"],
  category: "games",
  aliases: ["ttt"],
  casesensitive: false,
  channel: ["server"],
  permission: "",
  requiredPermissions: ["sendMessages"],
  noRestrict: false
}
