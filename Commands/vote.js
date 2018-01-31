const Enmap = require('enmap');

exports.run = async (client, message, args, level) => {

};

exports.init = async (client) => {
    //This code is run when the command is loaded
    client.vote = {
        commands: new Enmap(),
    }
};

exports.conf = {

    enabled: true,
    aliases: [],
    permLevel: 1
};

exports.help = {

    name: "vote",
    catergory: "",
    description: "",
    usage: ""
};