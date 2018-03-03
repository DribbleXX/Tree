const config = require("../config.json");
const index = require("../index.js");
const msg = require("../utilities/message.js");
const user = require("../utilities/user.js");
const Embed = require("../structures/embed.js");
const string = require("../utilities/string.js");
module.exports.run = (message, args, prefix) => {
  if (!Array.isArray(index.tree.games.get(message.channel.id)))
    index.tree.games.set(message.channel.id, []);
  let availableGames = index.tree.games.get(message.channel.id).filter(g => !g.state);
  if (args[0])
    availableGames = availableGames.filter(g => args.join("").toLowerCase() === g.name.replace(/\s+/g, "").toLowerCase());
  if (!availableGames.length) {
    msg.create(new Embed("Game wasn't found", "Make sure you typed the name right."), message.channel);
  }else{
    let game = availableGames[~~(Math.random() * availableGames.length)];
    if (game.players.map(p => p.id).indexOf(message.author.id) >= 0)
      return msg.create(new Embed("Whoops!", "You're already in that game, " + user.discrim(message.author) + "."), message.channel);
    game.players.push(message.author);
    if (game.players.length === game.maxPlayers) {
      game.state = 1;
      game.start();
    }else{
      msg.create(user.discrim(message.author) + " joined " + string.capitalize(game.name, true) + ".", message.channel);
    }
  }
};

module.exports.help = {
  name: "join",
  description: "Allows you to join various multiplayer games! Supply the game name to reliably join a specific game.",
  usage: ["join { game }"],
  category: "",
  aliases: ["jn"],
  casesensitive: false,
  channel: ["server"],
  permission: "",
  requiredPermissions: ["sendMessages"],
  noRestrict: false
}
