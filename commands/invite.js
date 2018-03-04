const config = require("../config.json");
const index = require("../index.js");
const msg = require("../utilities/message.js");
const user = require("../utilities/user.js");
const Embed = require("../structures/embed.js");
module.exports.run = (message, args, prefix) => {
  msg.create("Click [here](https://bit.ly/InviteTree) to invite Tree to your server\n(direct link: https://bit.ly/InviteTree)", message.channel);
};

module.exports.help = {
  name: "invite",
  description: "Gives you a link you can use to invite Tree to your server!",
  usage: ["invite"],
  category: "informative",
  aliases: ["inv"],
  casesensitive: false,
  channel: ["server", "dm"],
  permission: "",
  requiredPermissions: ["sendMessages"],
  noRestrict: false
}
