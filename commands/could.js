const config = require("../config.json");
const index = require("../index.js");
const msg = require("../utilities/message.js");
const user = require("../utilities/user.js");
const Embed = require("../structures/embed.js");
const string = require("../utilities/string.js");
module.exports.run = (message, args, prefix) => {
  let thing = args[0];
  if (!thing) return msg.create(new Embed("Oopsie!", "Creating deep messages out of something that is almost too deep to handle in the first place is too hard of a task for me.").addField("Wait what?", "In other words you need to specify a parameter."), message.channel);
  if (args[1]) return msg.create("I can only create these things out of single words. It might get a little crazy otherwise.", message.channel);
  if (thing.length > 30) return msg.create("Woah there! That's a lot of characters...", message.channel);
  let article;
  string.startsWithVowel(thing) ? article = "an" : article = "a";
  msg.create("Could " + article + " " + thing + " " + thing + " " + article + " " + thing + " if " + article + " " + thing + " could " + thing + " " +  thing + "s?", message.channel);
};

module.exports.help = {
  name: "could",
  description: "Makes a deep question about whether or not the desired thing or person could do a very complicated but meaningful task.",
  usage: ["could <something>"],
  category: "fun",
  aliases: ["cd"],
  casesensitive: false,
  channel: ["server", "dm"],
  permission: "",
  requiredPermissions: ["sendMessages"]
}
