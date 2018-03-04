const config = require("../config.json");
const index = require("../index.js");
const msg = require("../utilities/message.js");
const Embed = require("../structures/embed.js");
module.exports.run = async (message, args) => {
  let embed = new Embed(null, "Lots of information about Tree");
  embed.addField("Help", "To get help on Tree's commands type `%help`. If there's something else that you want to ask or need help with you can join Tree's official Discord server \"The Jungle\" by clicking [here](https://discord.gg/jGkBJHM).\n(the code is jGkBJHM for those of you who are on mobile)");
  embed.addField("What is Tree?", "Originally Tree was just a parody of a good friend's bot called Tri but it slowly turned into an actual bot that people know and love. Tree is a bot made by me, Stipendi#7595, with passion towards coding and I aim to make him as flexible as possible. Tree does not have any moderation commands because let's face it, there are enough of those types of bots already. Tree is something different. He's an entertainment bot with lots of fun and useful commands. The goal for Tree is to have as many commands as possible and be able to do lots of cool things. We'll see how that goes.");
  embed.addField("Main Developer", "Stipendi#7595", true);
  embed.addField("Servers the bot is in", index.tree.client.guilds.size, true);
  if (!message.channel.type)
    embed.addField("Commands used in " + message.channel.guild.name, (await index.tree.getGuildData(message.channel.guild.id, "commandcount")).commandcount);
  embed.addField("GitHub", "https://bit.ly/TreeGitHub", true);
  embed.addField("Can Tree hang around in my server?", "Absolutely! I'd love Tree to be in as many servers as possible and someone wanting Tree in their server always makes my day. Use the `invite` command to get a link you can use to invite Tree to your server. Trust me, it's really easy. Go ahead and try it! Type `invite`!");
  embed.addField("Special thanks", "ElJay#7711 helped me a lot along the way and he was the one who motivated me to learn javascript! Also thanks to **YOU** for reading this and caring about Tree! I really, really do appreciate it. :heart:", true);
  msg.dm(message.author.id, { embed: embed });
};

module.exports.help = {
  name: "info",
  description: "DMs you info about Tree!",
  usage: ["info"],
  category: "informative",
  aliases: [],
  casesensitive: false,
  channel: ["server", "dm"],
  permission: "",
  requiredPermissions: []
}
