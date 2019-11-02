const { createCanvas } = require('canvas');
const util = require('../converter')
const Discord = require('discord.js');
const Matter = require('matter-js')

module.exports = {
    name:"cubes",
    execute(msg){
    // first send loading to chat then do stuff it waits when you don't do this
    msg.channel.send('loading').then(()=>{
        // create a recorder
        const recorder = new util.Record()

        // give up the canvas size
        recorder.makeGifEncoder(320,240)

        // make a canvas
        const canvas = createCanvas(320, 240);
        const context = canvas.getContext('2d');

        // matter.js creation
        var engine = Matter.Engine.create();
        var ground = Matter.Bodies.rectangle(0, 240, 320*2, 10, { isStatic: true });
        Matter.World.add(engine.world, [ground]);

        // how many frames are we going to record
        let Frames = 100
        // main loop for animation
        for (let k = 0; k < Frames; k++) {
            // every frame add a box at random
            let box = Matter.Bodies.rectangle(Math.random() * (canvas.width - 0) + 0, 100, 10, 10,{restitution:1});
            Matter.World.add(engine.world, box);
            
            // update engine form cubes
            Matter.Engine.update(engine, 1000 / 42);
            
            // all bodies in a array
            var bodies = Matter.Composite.allBodies(engine.world);
        
            // clear canvas
            context.fillStyle = '#fff';
            context.fillRect(0, 0, canvas.width, canvas.height);
        
            // draw all bodies
            for (let i = 0; i < bodies.length; i++) {
                context.beginPath()
                context.fillStyle = 'blue';
                context.moveTo(bodies[i].vertices[0].x ,bodies[i].vertices[0].y)
                for (let j = 1; j < bodies[i].vertices.length; j++) {
                    context.lineTo(bodies[i].vertices[j].x,bodies[i].vertices[j].y)
                }
                context.closePath()
                context.fill()
            }

            // add that frame to the recording
            recorder.addFrame(context);
        }

        // out loop no more frames to render lets send it
        recorder.finish((buffer)=>{
            // returns buffer for discord attachment
            const att = new Discord.Attachment(buffer,'name.gif');
            // send it
            msg.channel.send(att)
        })
        
    })}
}