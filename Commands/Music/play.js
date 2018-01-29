exports.run = async (client, message, args, level) => {

    if (!args[0]) {

        message.channel.send(`Please enter a URL or search term`);
        return false;
    }

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

    }

    else {

        //Otherwise its a url
        url = args[0];
    }

    if (!client.lib.youtube.validateURL(url)) return false

    const song = await require('util').promisify(client.lib.youtube.getInfo)(url);
    client.audio.playlist.push({
        title: song.title,
        url: url,
        length: client.util.toHHMMSS(song.length_seconds),
        thumbnail: song.thumbnail_url
    });

    if (!client.audio.dispatcher) {

        //If the dispatcher is null, join the room and begin playing
        client.audio.channel.audio.join().then((connection) => {
            
            client.audio.connection = connection;
            client.audio.stream = client.lib.youtube(client.audio.playlist.shift().url, {filter: 'audioonly'});
            client.audio.dispatcher = client.audio.connection.playStream(client.audio.stream);
            
            client.audio.dispatcher.on('end', (reason) => {
    
                switch(reason) {
    
                    case 'skip':
    
                        if (client.audio.playlist[1] === undefined) client.audio.dispatcher.end();
                        else playSong()
                        break;
                    
                    case 'stop': 

                        client.audio.channel.audio.leave();                        
                        break;

                    default:

                        client.audio.channel.audio.leave();
                        break;
                }
            });
        });
    }
};

exports.init = (client) => {

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