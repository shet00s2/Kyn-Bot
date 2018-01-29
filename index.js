const Discord = require('discord.js');
const {promisify} = require('util');

const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");

const client = new Proxy(new Discord.Client(), require('./handler.js'));

require("./functions.js")(client);

client.config = require('./config.js');
client.commands = new Enmap();
client.aliases = new Enmap();

const init = async () => {

    const cmdFiles = await client.util.readdir('./Commands');
    cmdFiles.forEach((cmd) => {

        if (!cmd.endsWith('.js')) return;
        const response = client.loadCommand(cmd, './Commands', 'main');
        if (response) console.log(`[Main] ${response}`);
    });

    const evtFiles = await client.util.readdir('./Events/');
    evtFiles.forEach(file => {

        let eventName = file.split('.')[0];
        let event = require(`./Events/${file}`);
        client.on(eventName, event.bind(null, client));
    });

    client.login(client.config.token);
};

init();