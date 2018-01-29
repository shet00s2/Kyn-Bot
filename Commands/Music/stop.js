exports.run = async (client, message, args, level) => {

    client.audio.dispatcher.end('stop');
};

exports.init = (client) => {
    //This code is run when the command is loaded
    
};

exports.conf = {

    enabled: true,
    aliases: [],
    permLevel: 1
};

exports.help = {

    name: "stop",
    catergory: "",
    description: "",
    usage: ""
};