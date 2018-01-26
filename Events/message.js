module.exports = (client, message) => {

    if (message.author.bot) return;

    const settings = client.config;

    if (message.content.indexOf(settings.prefix) !== 0) return;

    const args = message.content.slice(settings.prefix.length).trim().split(/ +/g);
    const command = args.shift().toLowerCase();

    const cmd = client.commands.get(command);

    if (!cmd) return false;

    cmd.run(client, message, args, level = 10);
};