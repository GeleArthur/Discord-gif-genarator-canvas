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
        var boxA = Matter.Bodies.rectangle(50, 100, 10, 10);
        var boxB = Matter.Bodies.rectangle(200, 50, 30, 30);
        var ground = Matter.Bodies.rectangle(0, 240, 320*2, 10, { isStatic: true });

        Matter.World.add(engine.world, [boxA, boxB, ground]);

        for (let k = 0; k < 10; k++) {
            Matter.Engine.update(engine, 1000 / 42);
            
            var bodies = Matter.Composite.allBodies(engine.world);
        
            context.fillStyle = '#fff';
            context.fillRect(0, 0, canvas.width, canvas.height);
        
            context.fillStyle = '#FF0000';
        
            for (var i = 0; i < bodies.length; i++) {
                    console.log('e')
                    let box = Matter.Bodies.rectangle(50, 100, 10, 10);
                    Matter.World.add(engine.world, box);
                

                var pos = bodies[i].position;
                let bounds = bodies[i].bounds
                context.beginPath();
                context.rect(pos.x, pos.y, bounds.max.x - bounds.min.x , bounds.max.y - bounds.min.y);
                context.stroke();

            }
        

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