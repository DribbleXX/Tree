const index = require("../index.js");
const msg = require("../utilities/message.js");
const user = require("../utilities/user.js");
const channel = require("../utilities/channel.js");
const Embed = require("../structures/embed.js");
module.exports.run = async (message, args, prefix) => {
  if (!args[0]) return msg.create(new Embed("Error!", "No command supplied."), message.channel);
  let command = index.tree.commands.find(command => command.help.name.toLowerCase() === args[0].toLowerCase() || command.help.aliases.map(alias => alias.toLowerCase()).indexOf(args[0].toLowerCase()) >= 0);
  let restrictChannel;
  if (!args[1]) {
    restrictChannel = message.channel;
  }else{
    restrictChannel = channel.find(args[1], message.channel.guild);
  }
  if (restrictChannel) {
    let disabledCommands = (await index.tree.getGuildData(message.channel.guild.id, "disabled_commands")).disabled_commands;
    let cmdIndex = disabledCommands.map(cmd => cmd.split("|")[0]).indexOf(command.help.name);
    if (cmdIndex >= 0) {
      disabledCommands.splice(cmdIndex, 1);
      index.tree.alterGuildData(message.channel.guild.id, "disabled_commands", disabledCommands);
      return msg.create(new Embed("Great success!", "\`" + command.help.name + "\` can now be freely used by anyone on \`" + restrictChannel.name + "\`. Hooray!"), message.channel);
    }else{
      return msg.create(new Embed("Error!", "That command exists but doesn't seem to be restricted on  \`" + restrictChannel.name + "\`."), message.channel);
    }
  }else{
    return msg.create(new Embed("Error!", "The channel wasn't found!"), message.channel);
  }
};

module.exports.help = {
  name: "unrestrict",
  description: "Removes a restriction on a command meaning it can be used on that channel again. If channel is omitted it's assumed to be the channel the message was sent in.",
  usage: ["unrestrict <command>", "unrestrict <command> <channel>"],
  category: "",
  aliases: [],
  casesensitive: false,
  channel: ["server"],
  permission: "kickMembers",
  requiredPermissions: ["sendMessages"],
  noRestrict: true
}
