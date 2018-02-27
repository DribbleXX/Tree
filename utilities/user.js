const string = require("./string.js");
const index = require("../index.js");
module.exports = new class user {
  discrim(user) {
    if (user.discriminator) {
      return user.username + "#" + user.discriminator;
    }
  }
  find(user, guild) {
    if (!this.userOutput) this.userOutput = class {
      constructor(user, similarity, success, errorDescription = "") {
        this.user = user;
        this.similarity = similarity;
        this.success = success;
        this.errorDescription = errorDescription;
      }
    }
    let users;
    if (!guild || !guild.members) {
      users = index.tree.client.users;
    }else{
      users = guild.members;
    }
    user = user.replace(/\s+/g, "");
    let type;
    if (!user.replace(/\b\d{10,20}\b/, "").length) {
      type = "id"
    }else if (!user.replace(/#\d{4}\b/, "").length) {
      type = "discrim"
    }else if (!user.replace(/<@!?\d{10,20}>/, "").length) {
      type = "mention";
    }else if (!user.replace(/\w{1,32}#\d{4}/, "").length) {
      type = "combined"
    }else if (user.length <= 32) {
      type = "username";
    }else if (user.length > 32) {
      return new this.userOutput(null, 0, false, "Usernames can only be up to 32 characters long.");
    }else{
      return new this.userOutput(null, 0, false, "Unknown error.");
    }
    if (type === "username") {
      let people = [];
      for (let potentialUser of users) {
        let similarity;
        potentialUser[1].nick ? similarity = Math.max(string.similarity(user, potentialUser[1].username.replace(/\s+/g, "")), string.similarity(user, potentialUser[1].nick.replace(/\s+/g, ""))) : similarity = string.similarity(user, potentialUser[1].username.replace(/\s+/g, ""));
        people.push({
          user: potentialUser[1],
          similarity: similarity
        });
      }
      people = people.sort((user1, user2) => {
        return user2.similarity - user1.similarity;
      });
      if (people[0].similarity === 1) {
        return new this.userOutput(people[0].user, people[0].similarity, true);
      }else if (people[0].similarity < 0.25) {
        return new this.userOutput(people[0].user, people[0].similarity, false, "User wasn't found.");
      }
      let similarPeople = people.filter((element, index, array) => element + 1 > array[0].similarity);
      similarPeople.splice(0, 1);
      if (!similarPeople.length) {
        return new this.userOutput(people[0].user, people[0].similarity, true);
      }else if (similarPeople.length > 0) {
        return new this.userOutput(people[0].user, people[0].similarity, false, "Found multiple matches: " + similarPeople.map(person => person.user.username).join(", "));
      }else{
        return new this.userOutput(null, 0, false, "Unknown error.");
      }
    }else if (type === "id") {
      if (users.get(user)) {
        return new this.userOutput(users.get(user), 1, true);
      }else{
        return new this.userOutput(null, 0, false, "User wasn't found.");
      }
    }else if (type === "discrim") {1
      let people = users.filter(person => person.discriminator === user.replace(/#/, ""));
      if (people.length === 1) {
        return new this.userOutput(people[0], 1, true);
      }else if (people.length > 1) {
        return new this.userOutput(people[0], 1, false, "Multiple users found with the same discrim: " + people.map(user => user.username + "#" + user.discriminator).join(", "));
      }else{
        return new this.userOutput(null, 0, false, "Unknown error.");
      }
    }else if (type === "combined") {
      console.log("it's combined no doubt");
      let name = user.split("#");
      let people = users.filter(user => string.similarity(name[1], user.discriminator) >= 0.25);
      if (!people.length) return new this.userOutput(null, 0, false, "User with that discrim wasn't found.");
      people = people.map(person => {
        let similarity;
        person.nick ? similarity = Math.max(string.similarity(user, person.username.replace(/\s+/g, "")), string.similarity(user, person.nick.replace(/\s+/g, ""))) : similarity = string.similarity(user, person.username.replace(/\s+/g, ""));
        return {
          user: person,
          similarity: similarity
        }
      });
      people = people.sort((user1, user2) => {
        return user2.similarity - user1.similarity;
      });
      if (people[0].similarity >= 0.5) {
        return new this.userOutput(people[0].user, people[0].similarity, true);
      }else if (people[0].similarity < 0.5) {
        return new this.userOutput(null, 0, false, "User wasn't found.");
      }else{
        return new this.userOutput(null, 0, false, "Unknown error.");
      }
    }else if (type === "mention") {
      let user = users.get(user.trim().replace(/[^\d]/g, ""));
      if (user) {
        return new this.userOutput(user, 1, true);
      }else{
        return new this.userOutput(null, 0, false, "Invalid mention.");
      }
    }else{
      return new this.userOutput(null, 0, false, "Unknown error.");
    }
  }
}();
