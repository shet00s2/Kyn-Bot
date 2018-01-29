exports.run = async (client, message, args, level) => {

    if (!args[0]) {

        message.channel.send(`Please enter a URL or search term`);
        return false;
    }

    const playSong = (song) => {
        

    };

    const queueSong = (url) => {

    };

    if (!client.audio.dispatcher) {

        if (!message.member.voiceChannel) return

        client.audio.channel = {

            text: message.channel,
            audio: message.member.voiceChannel
        }
    }
    
    let url;

    if (args.length > 1) {
        //If args length > 1, then the input is a search with multiple words
        
        url = args[0];
    }

    else {
        //Otherwise its a url

    }

    validateAndRun();

};

exports.init = (client) => {

    client.lib = {
        request: require('request'),
        youtube: require('ytdl-core')
    };
};

exports.conf = {

    enabled: true,
    aliases: [],
    permLevel: 1
};

exports.help = {

    name: "play",
    catergory: "",
    description: "",
    usage: ""
};