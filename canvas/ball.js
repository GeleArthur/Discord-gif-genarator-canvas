const GIFEncoder = require('gifencoder');
const { createCanvas } = require('canvas');
const { convert } = require('../converter')
const Discord = require('discord.js');

module.exports = {
    name:"ball",
    execute(msg){
    msg.channel.send('loading').then(()=>{
        const encoder = new GIFEncoder(320, 240);

        const readstream = encoder.createReadStream();

        encoder.start();
        encoder.setRepeat(0);   // 0 for repeat, -1 for no-repeat
        encoder.setDelay(42);  // frame delay in ms
        encoder.setQuality(100); // image quality. 10 is default.

        // use node-canvas
        const canvas = createCanvas(320, 240);
        const ctx = canvas.getContext('2d');

        let x = canvas.width/2
        let y = canvas.height/2

        for (let i = 0; i < 100; i++) {
            ctx.fillStyle = "#646464";
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            x += Math.random() * (2 - -2) + -2;
            y += Math.random() * (2 - -2) + -2;

            ctx.beginPath();
            ctx.arc(x, y, 30, 0, Math.PI*2);
            ctx.fillStyle = "#0095DD";
            ctx.fill();
            encoder.addFrame(ctx);
        }

        encoder.finish();

        convert(readstream,(buffer)=>{
            const att = new Discord.Attachment(buffer,'name.gif');
            msg.channel.send(att)
        })
        
        })
    }
}