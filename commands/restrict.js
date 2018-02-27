const index = require("../index.js");
const msg = require("../utilities/message.js");
const user = require("../utilities/user.js");
const channel = require("../utilities/channel.js");
const Embed = require("../structures/embed.js");
module.exports.run = async (message, args, prefix) => {
  if (!args[0]) return msg.create(new Embed("Error!", "No command supplied."), message.channel);
  if (!args[1]) return msg.create(new Embed("Error!", "No channel supplied."), message.channel);
  let command = index.tree.commands.find(command => command.help.name.toLowerCase() === args[0].toLowerCase() || command.help.aliases.map(alias => alias.toLowerCase()).indexOf(args[0].toLowerCase()) >= 0);
  if (!command) {
    return msg.create(new Embed("Error!", "That command wasn't found! Use the `help` command to get a list of commands!"), message.channel);
  }
  if (command.help.noRestrict) {
    return msg.create(new Embed("Error!", "That command can't be restricted!"), message.channel);
  }
  let restrictedChannel = channel.find(args[1], message.channel.guild);
  if (restrictedChannel) {
    let disabledCommands = (await index.tree.getGuildData(message.channel.guild.id, "disabled_commands")).disabled_commands;
    if (disabledCommands.map(command => command.split("|")[0]).indexOf(args[0].toLowerCase()) >= 0) {
      return msg.create(new Embed("Error!", "That command has already been restricted in this channel!"), message.channel);
    }else{
      disabledCommands.push(command.help.name.toLowerCase() + "|" + message.channel.id);
      index.tree.alterGuildData(message.channel.guild.id, "disabled_commands", disabledCommands);
      return msg.create(new Embed("Great success!", "\`" + command.help.name + "\` now can't be used on this channel without the `administrator` permission. Hooray!"), message.channel);
    }
  }else{
    return msg.create(new Embed("Error!", "Invalid channel!"), message.channel);
  }
};

module.exports.help = {
  name: "restrict",
  description: "Disable the use of a certain command in a channel in the current guild!",
  usage: ["restrict <command name> <channelName|channelMention|channelID>"],
  category: "",
  aliases: ["rst", "re"],
  casesensitive: false,
  channel: ["server"],
  permission: "kickMembers",
  requiredPermissions: ["sendMessages"],
  noRestrict: true
}
