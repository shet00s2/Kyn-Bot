exports.run = async (client, message, args, level) => {

    client.voiceConnection.forEach((c) => {
        
        c.disconnect();
    });
};

exports.conf = {

    enabled: true,
    aliases: []
};

exports.help = {

    name: "",
    catergory: "",
    description: "",
    usage: ""
};