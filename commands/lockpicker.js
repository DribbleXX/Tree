const index = require("../index.js");
const words = require("../10kwords.json");
const msg = require("../utilities/message.js");
const random = require("../utilities/random.js");
const Embed = require("../structures/embed.js");
const modes = ["words", "math"];
const beginnerGuide = "As the game progresses you'll need to pick the lock more than once to open it. The amount of times you need to pick the lock increases by one after every lock.";
const comments = ["Your adventure starts here, huh. Have fun :)", "That \"have fun\" part was just a lie, by the way. Just thought I'd let you know.", "This is going to be your life now. Haha. yeah... I'm not sorry.", "Getting the hang of it? Are the locks bowing down to you?", "You must be a monster among locks. I'd be scared. Who am I anyway? Who are you?", "The real question is WHY. Why are you picking locks? I mean... don't you have anything better to do? Is this some kind of weird hobby?", "Your lock picking skills start becoming scary good as you pick each lock faster than the last... okay well we know that's not true. BUT YOU'RE GOOD!", "All you need to do is ONE more each time. That's not so bad, is it? Just do one more than last time and you're good. No problem.", "DUDE?? The lock you just picked is to a government building!! What are you doing?!", "Don't go any further. The next lock is to some secret conference room. I bet there's confidential information in there. Don't do it. Just run. Run while you can. I'm not involved in this.", "My god... I can already hear the sirens.", "Nevermind, it's not the sirens. It's the sound of you picking the locks. Still though, you know it's possible.", "Haha who am I kidding. That was just to get some thoughts going. You actually thought there would be a storyline? I mean... A storyline wouldn't be so bad.", "Bored yet? I sure am bored of writing these. Yes, these are manually written by some dude with no life. Well hey, at least I'm not the one picking locks all day!", "How far are you into the game now? Like... really far. What are you doing this for? So you can brag that you got really far? Is it really worth it? I mean... not really my business I guess.", "There are rumors going around about something crazy happening on lock 50. I have no idea what it is. Is it even true?", "You're excited about lock 50 now, aren't you? Well, you're never reaching it. And if you do... my god... Well, good luck.", "Hey, you might want to attend some lock picking competition! Do those exist? Just saying, you're incredible!", "I looked it up and there actually ARE professional lock picking competitions. I can't believe it. There's a competition for everything nowadays. If you don't believe me look it up! It's real!", "Remember lock 50? It's not just something I made up. There really is something cool and game-changing in there.", "Hey! Well done! You're one lock closer to lock 50! You can do it! I mean... it's a tough goal. For sure. But you're so far into this already. You can't just give up, can you?", "\"Always remember that you are absolutely unique. Just like everyone else.\" - Margaret Mead\nI thought that was kinda funny.", "So... looks like you're gonna be here for a while. Let's have some casual conversation. How are you? How's the family? Good. Oh yeah sorry about that. It happens. You'll be alright.", "If I was a lock I'd run. Well, if locks could run. Could you imagine? Being stuck where you are, no other option but to get internally touched by some random dude? That's kinda messed up.", "Wait, locks are being \"internally touched\" all the time, right? Since picking a lock isn't very different from just opening with a key. Wow. Now you'll never see opening a lock the same way ever again.", "Harry Soref invented the first padlock. The more you know!", "Isn't it crazy to think about that you started with easy-to-pick locks that only took one or two tries to open but now it takes a decade for you to open one? Just because it increases by one every time? That's the fascinating thing about this game. Keep going. See how far you can go. Push the limits. MAKE HISTORY!", "It's starting to get to the point where I'm seriously asking if picking locks is all you do. Do you hang out with your friends? Do you even have any? You must eat food, right? And sleep? Or are you some kind of robot? A lock picking robot? Wow, that would actually be kinda cool. A robot that could pick locks. Kinda scary, too."];
const operations = ["+", "-", "*"];
console.log(comments.length);
module.exports.run = async (message, args, prefix) => {
  index.tree.getGlobalUserData("");
  let mode;
  if (!args[0]) {
    mode = "words";
  }else if (modes.includes(args[0].toLowerCase())) {
    mode = args[0].toLowerCase();
  }else{
    return msg.dm(message.author.id, "The mode \`" + args[0].toLowerCase() + "\` doesn't exist in lock picker!");
  }
  let modeGuide;
  if (mode === "words") {
    modeGuide = "I will send you a word. Type that word. If you type it incorrectly I'll simply give you a new one. If you type it right, however, you'll pick on the lock! You can type \`stop\` at any time to stop the game and resume using commands in DMs normally.";
  }else if (mode === "math") {
    modeGuide = "Solve simple math problems. These include addition, subtraction and multiplication. Division is coming soon! (tough to code)";
  }else{
    modeGuide = "This message should never appear but if it did, something went wrong.";
  }
  msg.dm(message.author.id, "Lock picker started! Mode: " + mode + "\n" + beginnerGuide + "\n\n" + modeGuide);
  let createChallenge = async (info, message) => {
    let newChallenge;
    let answer;
    if (info.mode === "words") {
      answer = words[~~(Math.random() * words.length)];
      newChallenge = "Type **" + answer + "**!"
    }else if (info.mode === "math") {
      let operation = operations[~~(Math.random() * operations.length)];
      let randomMathResult;
      if (operation === "+" || operation === "-") {
        randomMathResult = random.math(operation, 3, 20);
      }else if (operation === "*") {
        randomMathResult = random.math(operation, 1, 11);
      }
      newChallenge = "Solve " + randomMathResult.expression.join(" ");
      answer = randomMathResult.result.toString();
    }
    info.challenge = answer;
    if (info.message) {
      newChallenge = info.message.addField("Current Challenge", newChallenge);
      info.message = null;
    }
    msg.dm(message.author.id, newChallenge);
    index.tree.waitForMessage(message.author.id, (await message.author.getDMChannel()).id, async (message, info) => {
      if (message.content.toLowerCase() === "stop") {
        return msg.create("Lock picker session ended! Be sure to come back soon to get that next lock!", message.channel);
      }
      if (message.content.toLowerCase() === info.challenge) {
        let picksLeft = await index.tree.pool.query("UPDATE globalusers SET picksleft = picksleft - 1 WHERE id = $1 RETURNING picksleft", [message.author.id]);
        if (!picksLeft.rows[0]) {
          picksLeft = await index.tree.pool.query("INSERT INTO globalusers (id) VALUES ($1) RETURNING picksleft", [message.author.id]);
        }
        if (picksLeft.rows[0].picksleft <= 0) {
          let locks = await index.tree.pool.query("UPDATE globalusers SET locks = locks + 1 WHERE id = $1 RETURNING locks", [message.author.id]);
          if (locks.rows[0].locks >= 27) return msg.create("I couldn't find any more locks to break... (more coming soon!)", message.channel);
          await index.tree.pool.query("UPDATE globalusers SET picksleft = locks + 1 WHERE id = $1", [message.author.id]);
          msg.create(new Embed("Congratulations!", "You cracked the lock right open! Amazing work!").addField("Another one down!", "You've now cracked " + locks.rows[0].locks + " locks!\n" + comments[locks.rows[0].locks-1]), message.channel);
        }
        if (picksLeft.rows[0].picksleft > 0) {
          info.message = new Embed("Nicely done!", "You need **" + picksLeft.rows[0].picksleft + "** picks more to open the next lock.").addFooter("You can stop at any time by typing stop");
        }
        createChallenge(info, message);
      }else{
        info.message = new Embed("Uh-oh!", "You failed the challenge!");
        createChallenge(info, message);
      }
    }, false, info);
  }
  createChallenge({ mode: mode }, message);
};

module.exports.help = {
  name: "lockpicker",
  description: "Starts a game of lock picker where you complete challenges in DMs to pick locks and advance! Supply a game mode in the second parameter. Game mode will be set to \"words\" if it's omitted. Current game modes: " + modes.join(", "),
  usage: ["lockpicker", "lockpicker <mode>"],
  category: "games",
  aliases: ["lp", "picker", "lock"],
  casesensitive: false,
  channel: ["server", "dm"],
  permission: "",
  requiredPermissions: []
}
