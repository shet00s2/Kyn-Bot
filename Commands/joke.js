const request = require('request');

exports.run = async (client, message, args, level) => {
        
    const options = {
        url: 'https://icanhazdadjoke.com',
        json: true
    };

    request(options, (error, response, body) => {
        
        if (error) {

            console.error(error);
        } 

        else {

            message.channel.send(body.joke);
        }
    });
};

exports.conf = {

    enabled: true,
    aliases: [],
    permLevel: 1
};

exports.help = {

    name: "joke",
    catergory: "info",
    description: "Provides a random joke for your pleasure",
    usage: "joke"
};