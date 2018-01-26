const Discord = require('discord.js');
const {promisify} = require('util');

const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");

const readdir = promisify(require('fs').readdir);

const client = new Discord.Client();

require("./functions.js")(client);
client.config = require('./config.js');

client.commands = new Enmap();
client.aliases = new Enmap();

const init = async () => {

    const cmdFiles = await readdir('./Commands');
    cmdFiles.forEach(cmd => {

        if (!cmd.endsWith('.js')) return;
        const response = client.loadCommand(cmd);
        if (response) console.log(response);
    });

    const evtFiles = await readdir('./Events/');
    evtFiles.forEach(file => {

        let eventName = file.split('.')[0];
        let event = require(`./Events/${file}`);
        client.on(eventName, event.bind(null, client));
    });

    client.login(client.config.token);
};

init();