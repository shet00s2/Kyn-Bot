const Enmap = require('enmap');

exports.run = async (client, message, args, level) => {

    if (!args[0]) {

        message.channel.send('Please enter a subcommand, for a list of commands run `music help`');
        return false;
    }

    const command = args.shift().toLowerCase();

    const cmd = client.music.commands.get(command);

    if (!cmd) {

        message.channel.send(`\`${command}\` is not a valid subcommand. Try \`${client.config.prefix}music help\` for more info`);
        return false;
    }

    cmd.run(client, message, args, level);
};

exports.init = async (client) => {

    client.audio = {
        channel: {
            text: null,
            voice: null
        },
        connection: null,
        dispatcher: null,
        playlist: null,
        stream: null
    };
    client.music = {
        commands: new Enmap()
    };
    
    const cmdFiles = await client.util.readdir('./Commands/Music');
    cmdFiles.forEach((cmd) => {

        if (!cmd.endsWith('.js')) return;
        const response = client.loadCommand(cmd, './Commands/Music', 'music');
        if (response) console.log(`[Music] ${response}`);
    });

}

exports.conf = {

    enabled: true,
    aliases: [],
    permLevel: 1
};

exports.help = {

    name: "music",
    catergory: "",
    description: "",
    usage: ""
};