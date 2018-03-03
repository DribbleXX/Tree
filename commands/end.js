const config = require("../config.json");
const index = require("../index.js");
const msg = require("../utilities/message.js");
const user = require("../utilities/user.js");
const Embed = require("../structures/embed.js");
const string = require("../utilities/string.js");
module.exports.run = (message, args, prefix) => {
  if (!Array.isArray(index.tree.games.get(message.channel.id)))
    index.tree.games.set(message.channel.id, []);
  let games = index.tree.games.get(message.channel.id);
  if (args[0])
    games.filter(g => args.join("").toLowerCase() === g.name.replace(/\s+/g, "").toLowerCase());
  if (games.length) {
    if (message.author.id !== games[0].host.id && games[0].maxPlayers > 2 && !message.member.permission.has("manageMessages")) {
      return msg.create(new Embed("Hey!", "Only the host of the game or someone with `manageMessages` can end games with more than two players."), message.channel);
    }else if (games[0].players.map(p => p.id).indexOf(message.author.id) < 0 && !message.member.permission.has("manageMessages")) {
      return msg.create("Hey!", "You can't end games you're not in without `manageMessages`.");
    }
    msg.create("**Successfully ended a game of " + string.capitalize(games[0].name, true) + ".**", message.channel);
    index.tree.games.get(message.channel.id).splice(index.tree.games.get(message.channel.id).indexOf(games[0]), 1);
  }else{
    msg.create(new Embed("Error!", "I didn't find any games."), message.channel);
  }
};

module.exports.help = {
  name: "end",
  description: "Ends the current game. Members with the `manageMessages` permission can end anyone's game. Supply a game name to ensure you end the right one.",
  usage: ["end { game name }"],
  category: "control",
  aliases: ["ed"],
  casesensitive: false,
  channel: ["server"],
  permission: "",
  requiredPermissions: ["sendMessages"],
  noRestrict: true
}
