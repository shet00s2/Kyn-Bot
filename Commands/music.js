const ytdl = require('ytdl-core');

exports.run = async (client, message, args, level) => {

    // If no args are given
    if (!args[0]) {

        message.channel.send('Please enter a valid URL');
        return;
    }

    if (level < exports.conf.permLevel) return;

    const playSong = (song) => {

        client.audio.stream = ytdl(song, {filter: 'audioonly'});
        client.audio.dispatcher = client.audio.connection.playStream(client.audio.stream);
        ytdl.getInfo(song, (error, info) => {

            if (error) console.error(error);

            const time = client.toHHMMSS(info.length_seconds);
            
            client.audio.stream.name = info.title
            client.audio.stream.lengthText = time;

            client.audio.channel.text.send({
                "embed": {
                    "title": `Now Playing ${info.title}`,
                    "footer": {
                        "text": `Length: ${time}`
                    },
                    "image": {
                        "url": info.thumbnail_url
                    },
                    "url": song
                }
            });
        });
    };

    switch (args[0]) {
        
        case 'play':

            if (message.member.voiceChannel) {

                client.audio.channel = {

                    text: message.channel,
                    voice: message.member.voiceChannel
                }
            }

            const url = args[1];

            if (ytdl.validateURL(url)) {

                if (client.audio.dispatcher == null) {
                    
                    client.audio.channel.voice.join().then((c) => {

                        client.audio.connection = c;
                        playSong(url);
                        client.audio.dispatcher.on('end', (reason) => {

                            if (reason === 'skip') {
                                
                                let next = client.audio.playlist.shift()[1];
                                if (typeof(next) === undefined) client.audio.dispatcher.end();
                                else playSong(next);
                            }

                            else {

                                client.audio.voiceConnections.forEach((c) => {

                                    c.disconnect();
                                    client.audio.dispatcher = undefined;
                                });
                            }
                        });
                    });
                }
                        
                else {

                    ytdl.getInfo(url, (error, info) => {

                        if (error) console.error(error);
                        client.audio.playlist.push([info.title, url]);
                        message.channel.send({
                            "embed": {
                                "title": `Queued ${info.title}`
                            }
                        })
                    });
                }
            }

            break;
        
        case 'pause':

            client.audio.dispatcher.pause();
            break;

        case 'playlist':

            let list = '';
            client.audio.playlist.forEach((data, index) => {
                list += `[${index += 1}]: ${data[0]}\n`;
            });
            message.channel.send({
                "embed": {
                    "title": "Playlist",
                    "description": list,
                    "footer": {
                        "text": `Now playing: ${client.audio.stream.name}`
                    }
                }
            });

        case 'resume':
            
            client.audio.dispatcher.resume();
            break;

        case 'skip':

            client.audio.dispatcher.end('skip');
            break;

        case 'stop':
            
            client.voiceConnections.forEach((c) => {

                c.disconnect();
                client.audio.playlist = [];
                message.channel.send("Music Stopped");
            });
            break;
    }
};

exports.init = (client) => {

    client.audio = {

        channel: {
            text: null,
            voice: null
        },
        connection: null,
        dispatcher: null,
        playlist: [],
        stream: null,
    }
}

exports.conf = {

    enabled: true,
    aliases: [],
    permLevel: 1
};

exports.help = {

    name: "music",
    catergory: "music",
    description: "",
    usage: ""
};