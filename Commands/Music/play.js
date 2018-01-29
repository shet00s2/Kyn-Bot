exports.run = async (client, message, args, level) => {

    const playSong = (connection) => {

        client.audio.connection = connection;
        let playing = client.audio.playlist.shift()
        client.audio.stream = client.lib.youtube(playing.url, {filter: 'audioonly'});
        client.audio.dispatcher = client.audio.connection.playStream(client.audio.stream);

        client.audio.stream.name = playing.title;

        client.audio.channel.text.send({
            "embed": {
                "title": `Now Playing ${playing.title}`,
                "footer": {
                    "text": `Length: ${playing.length}`
                },
                "image": {
                    "url": playing.thumbnail
                },
                "url": playing.url
            }
        });
    }

    const endPlayStream = (reason) => {
        
        client.audio.channel.audio.leave();
        client.audio.dispatcher.end()
        client.audio.playlist = [];

        if (reason) message.channel.send(reason);
    };

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


    //[Bug] Doing !music play !music play {url} breaks the bot
    //      Need a way to make sure bad input is rejected without crashing code
    if (!client.lib.youtube.validateURL(url)) return false

    const song = await require('util').promisify(client.lib.youtube.getInfo)(url);
    client.audio.playlist.push({
        title: song.title,
        url: url,
        length: client.util.toHHMMSS(song.length_seconds),
        thumbnail: song.thumbnail_url
    });

    if (client.audio.playlist.length === 1) {

        //If the dispatcher is null, join the room and begin playing
        client.audio.channel.audio.join().then((connection) => {
            
            playSong(connection);

            client.audio.dispatcher.on('end', (reason) => {
    
                switch(reason) {
    
                    case 'skip':
    
                        if (client.audio.playlist.length === 0) endPlayStream();
                        else playSong(connection)
                        break;
                    
                    case 'stop': 

                        endPlayStream("Music stopped.")
                        break;

                    default:

                        endPlayStream();
                        break;
                }
            });
        });
    }

    else {

        //Client is alreadying playing something post a message saying you've queued it
        message.channel.send({
            "embed": {
                "title": `Queued ${song.title}`
            }
        })
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