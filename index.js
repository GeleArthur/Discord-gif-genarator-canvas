const GIFEncoder = require('gifencoder');
const { createCanvas } = require('canvas');
const fs = require('fs');
var toArray = require('stream-to-array')




const Discord = require('discord.js');
const client = new Discord.Client();

client.on('ready', () => {
  console.log(`Logged in as ${client.user.tag}!`);
});

client.on('message', msg => {
  if (msg.content === 'gif') {

    const encoder = new GIFEncoder(320, 240);
    // stream the results as they are available into myanimated.gif
    const readstream = encoder.createReadStream()
    toArray(readstream).then(function (parts){

        const buffers = parts.map(part => Buffer.isBuffer(part) ? part : Buffer.from(part));
        const buf = Buffer.concat(buffers);

        const att = new Discord.Attachment(buf,'name.gif');
        msg.channel.send(att)
    })


    encoder.start();
    encoder.setRepeat(0);   // 0 for repeat, -1 for no-repeat
    encoder.setDelay(500);  // frame delay in ms
    encoder.setQuality(10); // image quality. 10 is default.

    // use node-canvas
    const canvas = createCanvas(320, 240);
    const ctx = canvas.getContext('2d');

    // red rectangle
    ctx.fillStyle = '#ff0000';
    ctx.fillRect(0, 0, 320, 240);
    encoder.addFrame(ctx);

    // green rectangle
    ctx.fillStyle = '#00ff00';
    ctx.fillRect(0, 0, 320, 240);
    encoder.addFrame(ctx);

    // blue rectangle
    ctx.fillStyle = '#0000ff';
    ctx.fillRect(0, 0, 320, 240);
    encoder.addFrame(ctx);

    encoder.finish();


  }
});

client.login('NjIxNjM5MzI4NzYxOTA1MTYz.XbsbmA.fYMtGhiWVtyCV7C2DZOMAU6dc6w');