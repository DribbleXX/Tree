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
  tag(user) {
		return user.username + "#" + user.discriminator;
  }
  create(content, channel) {
    if (!content || !channel) return;
    if (!channel.createMessage) return;
    let embedToSend;
    if (content.embed) embedToSend = content.embed;
    if (content.description || content.title) embedToSend = content;
    if (embedToSend) {
      if (channel.type === 1 || channel.permissionsOf(index.tree.client.user.id).has("embedLinks")) {
        channel.createMessage({ embed: embedToSend });
      }else{
        let message = "__**" + embedToSend.title + "**__";
        if (embededToSend.description) message = message + "\n" + embedToSend.description;
        if (embedToSend.fields) {
          for (let i = 0; i < embedToSend.fields.length; i++) {
            message = message + "\n**" + embedToSend.fields[i].name + "**";
            message = message + "\n" + embedToSend.fields[i].value;
          }
        }
        channel.createMessage(message);
      }
    }else{
      channel.createMessage({ embed: new Embed(null, content) });
    }
  }
  delete(message) {
    //this is where I would check if the message object is legit or not but tbh I'm lazy and it's not like I'd input an invalid message object anyway
    if (message.channel.guild && message.channel.permissionsOf(index.tree.client.user.id).has("manageMessages")) {
      message.delete();
    }
  }
}();
