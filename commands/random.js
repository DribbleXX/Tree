const config = require("../config.json");
const index = require("../index.js");
const random = require("../utilities/random.js");
const msg = require("../utilities/message.js");
module.exports.run = (message, args) => {
  if (!args[0]) return message.delete();
  let min = Math.round(Number(args[0]));
  let max = Math.round(Number(args[1]));
  if (Number.isInteger(min) && Number.isInteger(max)) {
    let amount = Math.round(Number(args[2]));
    if (!amount) amount = 1;
    if (amount <= 0) return msg.create("Haha very funny.", message.channel);
    let numbers = [];
    for (let i = 0; i < amount; i++) {
      numbers.push(random.int(min, max));
    }
    if (numbers.join("").length > 50) return msg.create("My message would be too long. Try generating less and smaller numbers.", message.channel);
    if (numbers.some(number => !number)) return msg.create("Invalid input. Make sure the bigger number is first and the smaller number comes after.", message.channel);
    if (numbers.length === 1) {
      msg.create("Your number is " + numbers[0] + "!", message.channel);
    }else if (numbers.length > 10) {
      msg.create("10 is the maximum amount of numbers you can generate at once!", message.channel);
    }else if (0 < numbers.length <= 10) {
      msg.create("Your numbers are:\n" + numbers.map(number => "**" + number + "**").join(", "), message.channel);
    }
  }else if (args.join("").split("|")[1]) {
    let options = args.join(" ").split("|").map(option => option.trim());
    let ending = ["Duh!", "Obviously!", "Of course!", "Without a doubt!", "Definitely!", "Absolutely!"];
    msg.create(options[Math.floor(Math.random() * options.length)] + " - " + ending[Math.floor(Math.random() * ending.length)], message.channel);
  }else{
    msg.create("Remember to split the options with a `|` !", message.channel);
  }
};

module.exports.help = {
  name: "random",
  description: "Chooses a set amount (defaults to one, max 10) of random integers from a certain range or chooses one of random options separated by vertical bars (`|`).",
  usage: ["random <number1> <number2> <amount>", "random <text> | <text> {...}"],
  category: "fun",
  aliases: ["rd", "ran"],
  casesensitive: true,
  channel: ["server", "dm"],
  permission: "",
  requiredPermissions: ["sendMessages"]
}
