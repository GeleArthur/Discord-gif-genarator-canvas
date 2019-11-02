const fs = require('fs');
// settings width a token a prefix
const settings = require('./settings')

const Discord = require('discord.js');
const client = new Discord.Client();
client.commands = new Discord.Collection();
// stolen stuff from https://discordjs.guide/command-handling/
const commandFiles = fs.readdirSync('./canvas').filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const command = require(`./canvas/${file}`);
	client.commands.set(command.name, command);
}

client.on('message', msg => {
    if (!msg.content.startsWith(settings.prefix) || msg.author.bot) return;

    const args = msg.content.slice(settings.prefix.length).split(/ +/);
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

client.login(settings.token);