const util = require("../converter");
const nodeCanvas = require("canvas");
const Discord = require("discord.js");
const Matter = require("matter-js");

module.exports = {
  name: "boem",
  execute(msg,args) {
    msg.channel.send("loading").then(() => {
      
      let myimg
      if(msg.mentions.users.array().length == 0){
        myimg = nodeCanvas.loadImage(msg.author.avatarURL)
      }else{
        myimg = nodeCanvas.loadImage(msg.mentions.users.array()[0].avatarURL)
      }

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
      let boxsize = 20;

      for (let x = 0; x < 5; x++) {
        boxes[x] = [];
        for (let y = 0; y < 5; y++) {
          let rect = Matter.Bodies.rectangle(
            canvas.width-100 - 5 * boxsize - 10 + x * boxsize,
            canvas.height - 5 * boxsize - 10 + y * boxsize,
            boxsize,
            boxsize
          );
          rect.drawpos = { x: x, y: y };
          boxes[x][y] = rect;
          Matter.World.add(engine.world, rect);
        }
      }
      let ball = Matter.Bodies.circle(canvas.width/2, 0, 30, { mass: 3 });
      Matter.World.add(engine.world, ball);

      myimg.then(userimage => {
        for (let f = 0; f < 100; f++) {
          Matter.Engine.update(engine, 1000 / 42);
          context.fillStyle = "#fff";
          context.fillRect(0, 0, canvas.width, canvas.height);

          context.beginPath();
          context.arc(ball.position.x, ball.position.y, 30, 0, 2 * Math.PI);
          context.stroke();

          for (let x = 0; x < boxes.length; x++) {
            for (let y = 0; y < boxes[x].length; y++) {
              context.translate(boxes[x][y].position.x, boxes[x][y].position.y);
              context.rotate(boxes[x][y].angle);

              context.drawImage(
                userimage,
                (userimage.width / boxes.length) * x,
                (userimage.height / boxes[x].length) * y,
                userimage.width / boxes.length,
                userimage.height / boxes[x].length,

                -boxsize / 2,
                -boxsize / 2,
                boxsize,
                boxsize
              );
              context.rotate(-boxes[x][y].angle);
              context.translate(
                -boxes[x][y].position.x,
                -boxes[x][y].position.y
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
