const config = require("../config.json");
const index = require("../index.js");
const msg = require("../utilities/message.js");
const user = require("../utilities/user.js");
const Embed = require("../structures/embed.js");
module.exports.run = (message, args, prefix) => {
  let person;
  if (!args[0]) {
    person = message.member;
  }else{
    person = user.find(message.args.slice(1).join(" "), message.channel.guild);
  }
  if (person) {
    let userEmbed = new Embed(user.discrim(person), "Lots of info!");
    userEmbed.addField("Nickname", person.nick ? person.nick : "No nickname", true).addField("Registered", new Date(person.createdAt).toLocaleString("en-US"), true).addField("Last joined", new Date(person.joinedAt).toLocaleString("en-US"), true).addField();
    msg.create(userEmbed, message.channel);
  }else{
    return msg.create(new Embed("Error!", "The person wasn't found."), message.channel);
  }
};

module.exports.help = {
  name: "profile",
  description: "Displays information about YOU! Or... someone else. Whoever you wish!",
  usage: ["profile", "profile <user>"],
  category: "informative",
  aliases: ["me"],
  casesensitive: false,
  channel: ["server"],
  permission: "",
  requiredPermissions: ["sendMessages"],
  noRestrict: false
}
