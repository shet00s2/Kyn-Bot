exports.run = async (client, message, args, level) => {

    client.audio.dispatcher.end('skip');
};

exports.conf = {

    enabled: true,
    aliases: [],
    permLevel: 1
};

exports.help = {

    name: "skip",
    catergory: "",
    description: "",
    usage: ""
};