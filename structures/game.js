const msg = require("../utilities/message.js");
const Embed = require("./embed.js");
const string = require("../utilities/string.js");
const index = require("../index.js");
const user = require("../utilities/user.js");
module.exports = class Game {
  constructor(message, name) {
    this.host = message.author;
    this.startedAt = message.timestamp;
    this.players = [message.author];
    this.state = 0;
    this.channel = message.channel;
    this.lastUpdated = Date.now();
    this.inactive = false;
  }
  static async create(game) {
    if (!index.tree.games.get(game.channel.id))
      index.tree.games.set(game.channel.id, []);
    if (index.tree.games.get(game.channel.id).filter(g => g.name === game.name).length)
      msg.create(new Embed("Game wasn't created", "There is already a game of " + string.capitalize(game.name, true) + " in that channel"), game.channel);
    else{
      index.tree.games.get(game.channel.id).push(game);
      msg.create(new Embed(user.discrim(game.host) + " started a game of **" + string.capitalize(game.name, true) + "**", "Type `" + (await index.tree.getPrefix(game.channel.guild.id)) + "join` to join!"), game.channel);
    }
  }
  static remove(game) {
    index.tree.games.get(game.channel.id).splice(index.tree.games.get(game.channel.id).indexOf(game), 1);
  }
  update() {
    this.lastUpdated = Date.now();
    this.inactive = false;
  }
}
