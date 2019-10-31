const GIFEncoder = require('gifencoder');
const { createCanvas } = require('canvas');
const { convert } = require('../converter')
const Discord = require('discord.js');
const Matter = require('matter-js')

module.exports = {
    name:"colors",
    execute(msg){
    msg.channel.send('loading').then(()=>{
        const encoder = new GIFEncoder(320, 240);

        const readstream = encoder.createReadStream();

        encoder.start();
        encoder.setRepeat(0);   // 0 for repeat, -1 for no-repeat
        encoder.setDelay(42);  // frame delay in ms
        encoder.setQuality(10); // image quality. 10 is default.

        // use node-canvas
        const canvas = createCanvas(320, 240);
        const context = canvas.getContext('2d');

        var engine = Matter.Engine.create();
        var boxA = Matter.Bodies.rectangle(400, 200, 80, 80);
        var boxB = Matter.Bodies.rectangle(450, 50, 80, 80);
        var ground = Matter.Bodies.rectangle(400, 610, 810, 60, { isStatic: true });

        Matter.World.add(engine.world, [boxA, boxB, ground]);

        for (let k = 0; k < 100; k++) {
            // Matter.Engine.update(engine, 1000 / 60);
            
            var bodies = Matter.Composite.allBodies(engine.world);
        
            // context.fillStyle = '#fff';
            // context.fillRect(0, 0, canvas.width, canvas.height);
        
            context.beginPath();
        
            for (var i = 0; i < bodies.length; i += 1) {
                var vertices = bodies[i].vertices;
        
                context.moveTo(vertices[0].x, vertices[0].y);
        
                for (var j = 1; j < vertices.length; j += 1) {
                    context.lineTo(vertices[j].x, vertices[j].y);
                }
        
                context.lineTo(vertices[0].x, vertices[0].y);
            }
        
            context.lineWidth = 10;
            context.strokeStyle = '#999';
            context.stroke();

            encoder.addFrame(context);
        }

        encoder.finish();

        convert(readstream,(buffer)=>{
            const att = new Discord.Attachment(buffer,'name.gif');
            msg.channel.send(att)
        })
        
        })
    }
}