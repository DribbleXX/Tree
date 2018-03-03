const index = require("../index.js");
const config = require("../config.json");
const msg = require("../utilities/message.js");
const string = require("../utilities/string.js");
const Embed = require("../structures/embed.js");
module.exports.run = async (message, args) => {
  let prefix;
  if (message.channel.guild) {
    prefix = (await index.tree.getGuildData(message.channel.guild.id, "prefix")).prefix;
  }else{
    prefix = "";
  }
  if (!args[0]) {
    let embedMessage = {
      embed: new Embed("All Commands in Tree", "Type \`" + prefix + "help <command>\` to get more info about a specific command. You don't need to use the prefix when using commands in DMs with the bot!")
    };
    let commands = new Map();
    index.tree.commands.forEach((value, key) => {
      if (!value.help.category) {
        if (!commands.get("no category")) commands.set("no category", []);
        commands.get("no category").push(key);
      }else{
        if (!commands.get(value.help.category)) commands.set(value.help.category, []);
        commands.get(value.help.category).push(key);
      }
    });
    commands.forEach((commands, category) => {
      embedMessage.embed.addField(string.capitalize(category), commands.join(", "));
    });
    msg.dm(message.author.id, embedMessage);
  }else{
    let command = index.tree.commands.find(command => command.help.name.toLowerCase() === args[0].toLowerCase() || command.help.aliases.map(alias => alias.toLowerCase()).indexOf(args[0].toLowerCase()) >= 0);
    if (!command)
      return msg.create("`" + args[0] + "` is not a recognized command! Type `" + prefix + "help` to see a list of every command!", message.channel);
    let embedMessage = {
      embed: new Embed(string.capitalize(command.help.name), command.help.description)
    }
    if (command.help.usage) embedMessage.embed.addField("Command usage", "\`\`\`" + command.help.usage.join("\n") + "\`\`\`");
    if (command.help.aliases || command.help.casesensitive || command.help.deleteresponse || command.help.dm || command.help.permission) {
      let extrainfo = [];
      if (command.help.aliases) extrainfo.push("Aliases: " +  command.help.aliases.map(a => "**" + a + "**").join(", "));
      command.help.channel ? extrainfo.push("Command can be used in: " + command.help.channel.map(channel => "**" + (channel === "server" ? "servers" : "DMs") + "**").join(", ")) : extrainfo.push("Command can't be used in any channel. Haha. Must be some joke?");
      command.help.permission ? extrainfo.push("Required permission: **" + command.help.permission + "**") : extrainfo.push("Required permission: **requires no extra permissions**");
      if (extrainfo[0]) embedMessage.embed.addField("Extra info", extrainfo.join("\n"));
    }
    if (message.channel.guild) embedMessage.embed.addFooter("Help command requested by " + message.author.username);
    msg.create(embedMessage, message.channel);
  }
};

module.exports.help = {
  name: "help",
  description: "DMs you the list of every command or get help on a specific command!",
  usage: ["help {command}"],
  category: "informative",
  aliases: ["hp"],
  casesensitive: false,
  channel: ["server", "dm"],
  permission: "",
  requiredPermissions: ["sendMessages"]
}
