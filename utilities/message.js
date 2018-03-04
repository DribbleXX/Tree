const index = require("../index.js");
const Embed = require("../structures/embed.js");
module.exports = new class message {
  async dm(user, message) {
    let match = index.tree.client.users.find(clientuser => clientuser.id === user);
    if (match) {
      let channel = await match.getDMChannel(user);
      return this.create(message, channel);
    }
  }
  async create(content, channel) {
    if (!content || !channel) return;
    if (!channel.createMessage) return;
    let embedToSend;
    if (content.embed) embedToSend = content.embed;
    if (content.description || content.title) embedToSend = content;
    if (embedToSend) {
      if (channel.type === 1 || channel.permissionsOf(index.tree.client.user.id).has("embedLinks")) {
        return await channel.createMessage({ embed: embedToSend });
      }else{
        let message = "__**" + embedToSend.title + "**__";
        if (embedToSend.description) message = message + "\n" + embedToSend.description;
        if (embedToSend.fields) {
          for (let i = 0; i < embedToSend.fields.length; i++) {
            message = message + "\n**" + embedToSend.fields[i].name + "**";
            message = message + "\n" + embedToSend.fields[i].value;
          }
        }
        return await channel.createMessage(message);
      }
    }else{
      return await channel.createMessage({ embed: new Embed(null, content) });
    }
  }
  async delete(message) {
    if (message.channel.guild && message.channel.permissionsOf(index.tree.client.user.id).has("manageMessages")) {
      message.delete();
    }
  }
}();
