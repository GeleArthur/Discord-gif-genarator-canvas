const nodeCanvas = require("canvas");
const util = require("../converter");
const Discord = require("discord.js");
const Matter = require("matter-js");

module.exports = {
  name: "love",
  async execute(msg) {
    // first send loading to chat then do stuff
    await msg.channel.send("loading");
    let userimages = [];
    if (msg.mentions.users.array().length < 1) {
      msg.channel.send(
        `please input more then ${msg.mentions.users.array().length} users`
      );
      return;
    } else {
      userimages[0] = nodeCanvas.loadImage(
        msg.mentions.users.array()[0].avatarURL
      );
      userimages[1] = nodeCanvas.loadImage(
        msg.mentions.users.array()[1].avatarURL
      );
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
        let Frames = 100;
        // main loop for animation
        for (let k = 0; k < Frames; k++) {
          // add that frame to the recording
          

          context.fillRect(Frames, 0, canvas.width, canvas.height);
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
