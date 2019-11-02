const util = require("../converter");
const nodeCanvas = require("canvas");
const Discord = require("discord.js");
const Matter = require("matter-js");

module.exports = {
  name: "boem",
  execute(msg) {
    msg.channel.send("loading").then(() => {
      const myimg = nodeCanvas.loadImage(msg.author.avatarURL);

      const recoder = new util.Record();
      recoder.makeGifEncoder(320, 240);

      const canvas = nodeCanvas.createCanvas(320, 240);
      const context = canvas.getContext("2d");

      var engine = Matter.Engine.create();
      var ground = Matter.Bodies.rectangle(0, 240, 320 * 2, 10, {
        isStatic: true
      });
      ground.drawpos = {};
      ground.drawpos.x = 1;
      ground.drawpos.y = 3;
      // console.log(ground.drawpos)

      Matter.World.add(engine.world, ground);

      var boxes = [];
      let boxsize = 20

      for (let x = 0; x < 5; x++) {
        boxes[x] = [];
        for (let y = 0; y < 5; y++) {
          let rect = Matter.Bodies.rectangle(
            (canvas.width-5*boxsize)-10 + x * boxsize,
            (canvas.height-5*boxsize)-10 + y * boxsize,
            boxsize,
            boxsize
          );
          rect.drawpos = { x: x, y: y };
          boxes[x][y] = rect;
          Matter.World.add(engine.world, rect);
        }
      }
      Matter.World.add(engine.world,Matter.Bodies.circle(250,0,10,{mass:10}))

      myimg.then((userimage) => {
        for (let f = 0; f < 100; f++) {
          Matter.Engine.update(engine, 1000 / 42);
          context.fillStyle = "#fff";
          context.fillRect(0, 0, canvas.width, canvas.height);
        
          for (let x = 0; x < boxes.length; x++) {
            for (let y = 0; y < boxes[x].length; y++) {
                

              context.drawImage(
                userimage,
                (userimage.width / boxes.length) * x,
                (userimage.height / boxes[x].length) * y,
                userimage.width / boxes.length,
                userimage.height / boxes[x].length,

                boxes[x][y].vertices[0].x,
                boxes[x][y].vertices[0].y,
                Math.abs(boxes[x][y].vertices[0].x - boxes[x][y].vertices[2].x),
                Math.abs(boxes[x][y].vertices[0].y - boxes[x][y].vertices[2].y)
              );
            }
          }
          recoder.addFrame(context);
        }

        recoder.finish(buffer => {
          const att = new Discord.Attachment(buffer, "name.gif");
          msg.channel.send(att);
        });
      });
    });
  }
};
