exports.run = async (client, message, args, level) => {

    if (!args[0]) {

        const commands = client.commands;
        const fields = [];
        
        commands.forEach((command) => {

            fields.push(client.blankField);
            fields.push({
                "name": command.help.name,
                "value": `${command.help.description} \n`
            });
        });

        message.channel.send({
            embed: {
                "title": "List of Commands",
                "fields": fields
            }
        });

    } else {

        let command = args[0];
        if (client.commands.has(command)) {
            command = client.commands.get(command);
            if (level < command.conf.permLevel) return;

            message.channel.send({
                embed: {
                    "title": command.help.name,
                    "footer": {
                        "text": "Catergory: "+ command.help.catergory 
                    },
                    "fields": [
                        {
                            "name": "Description",
                            "value": command.help.description
                        },
                        {
                            "name": "Usage",
                            "value": command.conf.aliases.length > 0 ? "```" + command.conf.aliases.join(", ") + "```" : "```[none]```" + ""
                        }
                    ]
                }
            });
        }
    }
};

exports.conf = {

    enabled: true,
    aliases: [],
    permLevel: 1
};

exports.help = {

    name: "help",
    catergory: "System",
    description: "Returns help on a command",
    usage: "help [command]"
};