const config = require("../config.json");
const index = require("../index.js");
module.exports.run = (message, args) => {
  if (!args[0]) return msg.create("I beg your pardon?", message.channel);
  if (args.length > 1) return msg.create("The prefix can't have spaces in it!", message.channel);
  if (args[0].length > 5) return msg.create("To be nice to the users the prefix can only be 5 characters long.", message.channel);
  index.tree.alterGuildData(message.channel.guild.id, "prefix", args[0]).catch(err => msg.create("Somehow an error occurred! Please report this to Stipendi#7595\n\"" + err + "\"", message.channel));
  msg.create("The prefix on this guild has now successfully been changed to `" + args[0] + "`!", message.channel);
};

module.exports.help = {
  name: "prefix",
  description: "Changes Tree's prefix on the server!",
  usage: ["prefix <new prefix>"],
  category: "control",
  aliases: ["pfx", "pr"],
  casesensitive: false,
  channel: ["server"],
  permission: "administrator",
  requiredPermissions: ["sendMessages"]
}
