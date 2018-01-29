exports.run = async (client, message, args, level) => {

    if (level >= 10) {
        
        client.voiceConnection.forEach((c) => {
        
            c.disconnect();
            c.leave();
        });
    }
};

exports.conf = {

    enabled: true,
    aliases: ['fl'],
    permLevel: 10
};

exports.help = {

    name: "forceleave",
    catergory: "admin",
    description: "Forces the bot to close voice connections and leave",
    usage: ""
};