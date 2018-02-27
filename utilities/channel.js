const index = require("../index.js");
module.exports = new class channel {
  find(channel, guild) {
    channel = channel.trim().toLowerCase();
    let channels;
    if (guild && guild.channels) {
      channels = guild.channels;
    }else{
      return;
    }
    let type;
    if (!channel.replace(/\b\d{10,20}\b/, "").length) {
      type = "id";
    }else if (!channel.replace(/<#\d{10,20}>/, "").length) {
      type = "mention";
    }else{
      type = "name";
    }
    if (type === "id") {
      let foundChannel = channels.find(c => c.id === channel);
      if (foundChannel) return foundChannel;
    }else if (type === "mention") {
      channel = channel.replace(/[^\d]/g, "");
      let foundChannel = channels.get(channel);
      if (foundChannel) return foundChannel;
    }else if (type === "name") {
      let matches = channels.filter(c => c.name.toLowerCase() === channel);
      if (matches.length === 1) {
        return matches[0];
      }
    }
  }
}();
