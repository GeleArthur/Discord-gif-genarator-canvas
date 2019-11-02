const GIFEncoder = require('gifencoder');
const { createCanvas, Image } = require('canvas');
const { convert } = require('../converter')
const Discord = require('discord.js');
const Matter = require('matter-js')

module.exports = {
    name:"boem",
    execute(msg){
    msg.channel.send('loading').then(()=>{

        let userimage = new Image()
        userimage.src = msg.author.avatarURL

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
       
        let boxes = []

        for (let i = 0; i < 5; i++) {
            boxes[i] = []
            for (let j = 0; j < 5; j++) {
                boxes[i][j] = Matter.Bodies.rectangle(250+i*10,180+j*10 ,10,10)
            }
        }

        let ground = Matter.Bodies.rectangle(0, 240, 320*2, 10, { isStatic: true })

        console.log(boxes)
        Matter.World.add(engine.world, boxes);
        Matter.World.add(engine.world, ground);



        userimage.onload = ()=>{
            for (let k = 0; k < 50; k++) {

                var bodies = Matter.Composite.allBodies(engine.world);
                // console.log(bodies[0])

                Matter.Engine.update(engine, 1000 / 42);

                
                
                context.fillStyle = '#fff';
                context.fillRect(0, 0, canvas.width, canvas.height);
            

                for (let x = 0; x < boxes.length; x++) {
                    for (let y = 0; y < boxes[x].length; y++) {
                        
                        context.drawImage(userimage,
                            boxes[x][y].vertices[0].x,
                            boxes[x][y].vertices[0].y,
                            Math.abs(boxes[x][y].vertices[0].x - boxes[x][y].vertices[2].x),
                            Math.abs(boxes[x][y].vertices[0].y - boxes[x][y].vertices[2].y)
    
                        )
                    }

                }

                encoder.addFrame(context);
            }

            encoder.finish();

            convert(readstream,(buffer)=>{
                const att = new Discord.Attachment(buffer,'name.gif');
                msg.channel.send(att)
            })
        }
        
        })
    }
}