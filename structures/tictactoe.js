const Game = require("./game.js");
const Embed = require("./embed.js");
const msg = require("../utilities/message.js");
const user = require("../utilities/user.js");
module.exports = class Tictactoe extends Game {
  constructor(message) {
    super(message);
    this.maxPlayers = 2;
    this.turn = null;
    this.name = "tic tac toe";
    this.grid = [["_", "_", "_"], ["_", "_", "_"], ["_", "_", "_"]];
    this.lastMessage = null;
  }
  async send() {
    if (!this.turn) {
      let start = this.players[~~(Math.random() * this.players.length)];
      this.turn = start;
      start.side = "x";
      this.players.filter(p => p.id !== start.id)[0].side = "o";
    }else{
      this.turn = this.players.filter(p => p.id !== this.turn.id)[0];
    }
    let embed;
    if (this.state === 1) {
      embed = new Embed("Tic Tac Toe", "**" + this.turn.username + " gets to go first!**\n```\n________________\n|_A1_|_B1_|_C1_|\n|_A2_|_B2_|_C2_|\n|_A3_|_B3_|_C3_|```");
      embed.addField("How To Play", "Every **column** represents a **letter** A-C and every **row** represents a **number** 1-3. To make a play on a box, take the letter of that column and the number of that row and send it in chat. For example if I wanted to play on the first column on the second row I'd type `A2`. You can only play on your turn.");
    }else{
      embed = new Embed("Tic Tac Toe", "It's **" + this.turn.username + "'s turn!**\n```\n_____________\n|_" + this.grid[0][0] + "_|_" + this.grid[0][1] + "_|_" + this.grid[0][2] + "_|\n|_" + this.grid[1][0] + "_|_" + this.grid[1][1] + "_|_" + this.grid[1][2] + "_|\n|_" + this.grid[2][0] + "_|_" + this.grid[2][1] + "_|_" + this.grid[2][2] + "_|```");
    }
    embed.addFooter("X - " + this.players.filter(p => p.side === "x")[0].username + " | O - " + this.players.filter(p => p.side === "o")[0].username);
    if (this.state === 2 && (await this.channel.getMessages(4)).filter(msg => msg.id === this.lastMessage.id).length)
      this.lastMessage.edit({ embed: embed, content: "" });
    else
      this.lastMessage = await msg.create(embed, this.channel);
    this.state = 2;
  }
  start() {
    this.send();
  }
  win(winner) {
    let person = this.players.filter(p => p.side === winner.toLowerCase())[0];
    msg.create(new Embed("Game over!", "```\n_____________\n|_" + this.grid[0][0] + "_|_" + this.grid[0][1] + "_|_" + this.grid[0][2] + "_|\n|_" + this.grid[1][0] + "_|_" + this.grid[1][1] + "_|_" + this.grid[1][2] + "_|\n|_" + this.grid[2][0] + "_|_" + this.grid[2][1] + "_|_" + this.grid[2][2] + "_|```\n**" + user.discrim(person) + "** won the game of tic tac toe! Well played!"), this.channel);
    Game.remove(this);
  }
  draw() {
    msg.create(new Embed("Game over!", "It's a draw! You should settle it with a rematch."), this.channel);
    Game.remove(this);
  }
}
