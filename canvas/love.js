const nodeCanvas = require("canvas");
const util = require("../converter");
const Discord = require("discord.js");
const Matter = require("matter-js");

module.exports = {
  name: "love",
  
  /**
   * 
   * @param {import('discord.js').Message} msg 
   */
  async execute(msg) {
    // first send loading to chat then do stuff
    await msg.channel.send("loading");
    let userimages = [];
    if (msg.mentions.users.array().length < 0) {
      msg.channel.send(
        `please input more then ${msg.mentions.users.array().length} users`
      );
      return;
    } else {
      userimages[0] = nodeCanvas.loadImage(
        msg.author.avatarURL
        // msg.mentions.users.array()[0].avatarURL
      );
      // userimages[1] = nodeCanvas.loadImage(
      //   msg.mentions.users.array()[1].avatarURL
      // );
    }

    // create a recorder
    const recorder = new util.Record();

    // give up the canvas size
    recorder.makeGifEncoder(320, 240);

    // make a canvas
    const canvas = nodeCanvas.createCanvas(320, 240);
    const context = canvas.getContext("2d");

    await Promise.all(userimages)
      .then(images => {
        // how many frames are we going to record
        let totalFrames = 100;
        // main loop for animation
        for (let framecount = 0; framecount < totalFrames; framecount++) {
          context.fillStyle = "#A689A1"
          context.fillRect(0, 0, canvas.width, canvas.height);

          if (framecount < 20) {
            context.drawImage(
              images[0],
              util.calulations.map(framecount, 0, 20, -30, 50),
              120,
              50,
              50
            );
          }

          recorder.addFrame(context);
        }

        // out loop no more frames to render lets send it
        recorder.finish(buffer => {
          // returns buffer for discord attachment
          const att = new Discord.Attachment(buffer, "name.gif");
          // send it
          msg.channel.send(att);
        });
      })
      .catch(err => console.log(err));
  }
};
