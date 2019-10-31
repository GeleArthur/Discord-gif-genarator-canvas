const fs = require('fs');

const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();

const commandFiles = fs.readdirSync('./canvas').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./canvas/${file}`);
	client.commands.set(command.name, command);
}

let prefix = '!'

client.on('message', msg => {
    if (!msg.content.startsWith(prefix) || msg.author.bot) return;

    const args = msg.content.slice(prefix.length).split(/ +/);
	const command = args.shift().toLowerCase();
	if (!client.commands.has(command)) return;

    try {
		client.commands.get(command).execute(msg, args);
	} catch (error) {
		console.error(error);
		msg.reply('there was an error trying to execute that command!');
	}
});

client.on('ready', () => {
    console.log(`Logged in as ${client.user.tag}!`);
});

client.login('NjIxNjM5MzI4NzYxOTA1MTYz.XbsbmA.fYMtGhiWVtyCV7C2DZOMAU6dc6w');