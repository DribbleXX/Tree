const user = require("../utilities/user.js");
const config = require("../config.json");
const index = require("../index.js");
const msg = require("../utilities/message.js");
module.exports.run = async (message, args) => {
  if (!args[0]) return msg.create("I beg your pardon?", message.channel);
  if (args[0].toLowerCase() === "enable" && !args[1]) {
    if ((await index.tree.getGuildUserData(message.author.id, message.channel.guild.id, "summon")).summon)
      return msg.create("You already have summoning enabled, " + message.author.username + "!", message.channel);
    index.tree.alterGuildUserData(message.author.id, message.channel.guild.id, "summon", "TRUE");
    return msg.create("You have successfully enabled your summoning, " + message.author.username + "!", message.channel);
  }else if (args[0].toLowerCase() === "disable" && !args[1]) {
    if (!(await index.tree.getGuildUserData(message.author.id, message.channel.guild.id, "summon")).summon)
      return msg.create("Your summoning is already disabled, " + message.author.username + "!", message.channel);
    index.tree.alterGuildUserData(message.author.id, message.channel.guild.id, "summon", "FALSE");
    return msg.create("You have successfully disabled your summoning, " + message.author.username + "!", message.channel);
  }
  if (!args[1]) return msg.create("You need to specify a reason to summoning them, " + message.author.username + ".", message.channel);
  let summonMessage = "Summon alert! \"**" + args.slice(1).join(" ") + "**\"\nFrom: **" + message.channel.guild.name + "**\nSummoned by: **" + message.author.username + "**";
  let result = await user.find(args[0], message.channel.guild);
  let person;
  if (result.success) {
    person = result.user;
  }else{
    return msg.create("Incorrect user! " + user.errorDescription, message.channel);
  }
  if (person.bot) return msg.create("You can't summon a bot. Why would you? We're always watching. :eyes:", message.channel);
  if (person.id === message.author.id) return msg.create("You can't summon yourself!", message.channel);
  let messages = await message.channel.getMessages(10, message.id);
  if (messages.filter(message => message.author.id === person.id).length) return msg.create("You can't summon " + person.username + " because they have chatted recently.", message.channel);
  let personToSummon = await index.tree.getGuildUserData(person.id, message.channel.guild.id, "summon");
  if (personToSummon.summon) {
    msg.dm(person.id, summonMessage);
    msg.create(person.username + " has been summoned, " + message.author.username + ".", message.channel);
  }else{
    msg.create(person.username + " hasn't enabled their summoning, " + message.author.username + "! You can ask them to enable it.", message.channel);
  }
};

module.exports.help = {
  name: "summon",
  description: "Makes me DM the person asking for them to join the chat if they've enabled it. Use the power wisely. `enable` in the first parameter enables your summoning!",
  usage: ["summon <person{mention|id|username}> <reason>", "summon enable"],
  category: "utility",
  aliases: ["smon", "su"],
  casesensitive: true,
  channel: ["server"],
  permission: "",
  requiredPermissions: ["sendMessages"]
}
