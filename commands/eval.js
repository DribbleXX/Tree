const config = require("../config.json");
const index = require("../index.js");
const util = require("util");
const words = require("../10kwords.json");
const random = require("../utilities/random.js");
const msg = require("../utilities/message.js");
const user = require("../utilities/user.js");
const Embed = require("../structures/embed.js");
const channel = require("../utilities/channel.js");
const string = require("../utilities/string.js");
module.exports.run = async (message, args, prefix) => {
  if (!config.owners.includes(message.author.id)) return msg.create("You don't have permission to use this command!", message.channel);
  if (!args[0]) return;
  if (args[0].toLowerCase() === "nooutput") {
    args.splice(0, 1).join(" ");
    eval(args.join(" "));
  }else{
    let evalEmbed = new Embed("A javascript evaluation", "By " + message.author.username);
    let toEval = message.content.slice(module.exports.help.name.length + prefix.length).trim();
    let result;
    try {
      result = eval(toEval);
    }
    catch(error) {
      evalEmbed.addField("Input <:greenleaf:405023889651924992>", "\`\`\`" + toEval + "\`\`\`").addField("Error ❌", error.toString());
      return msg.dm(message.author.id, { embed: evalEmbed });
    }
    evalEmbed.addField("Input <:greenleaf:405023889651924992>", "\`\`\`" + toEval + "\`\`\`").addField("Output <:darkleaf:401674124642222091>", "\`\`\`" + result + "\`\`\`");
    if (result && typeof result.then === "function") {
      result = await result.then();
      evalEmbed.addField("Resolves to <:greenleaf:405023889651924992>", "\`\`\`" + result + "\`\`\`");
    }
    msg.create({ embed: evalEmbed }, message.channel);
  }
};

module.exports.help = {
  name: "eval",
  description: "Evaluates code! Can only be used by bot owners. If the second argument is \"NoOutput\", an output message won't be created.",
  usage: ["eval <code>", "eval NoOutput <code>"],
  category: "utility",
  aliases: ["ev", "evil"],
  casesensitive: true,
  channel: ["server", "dm"],
  requiredPermissions: ["sendMessages"]
}
