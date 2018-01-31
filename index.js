const Discord = require('discord.js');
const {promisify} = require('util');

const Enmap = require("enmap");
const EnmapLevel = require("enmap-level");
const storage = require('node-persist');

const client = new Proxy(new Discord.Client(), require('./handler.js'));

require("./functions.js")(client);

client.config = require('./config.js');
client.commands = new Enmap();
client.aliases = new Enmap();

const init = async () => {

    storage.initSync({
        dir: './data',
        stringify: JSON.stringify,
        parse: JSON.parse,
        encoding: 'utf8',
        logging: false,
        continous: true,
        ttl: false,
        expiredInterval: 2 * 60 * 1000
    });

    client.lib = {storage: storage};

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