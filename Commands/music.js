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

    const queuePlay = (url) => {

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
                            c.leave();
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

            if (args.length === 2) {

                queuePlay(url);
            }

            else {

                const query = args.slice(1).join('');
                const options = {

                    url: `https://www.googleapis.com/youtube/v3/search?part=snippet&maxResults=1&q=${query}&type=video&videoCategoryId=10&key=${client.config.google.apikey}`,
                    json: true
                }

                //search for music
                client.request(options, (error, response, body) => {

                    if (error) {

                        console.log(options.url);
                        console.error(error);
                    }
                    
                    if (body.error) {

                        message.channel.send(`${body.error.code}: ${body.error.message}`);
                    }

                    else {

                        const item = body.items[0];
                        const url = `https://www.youtube.com/watch?v=${item.id.videoId}`;

                        queuePlay(url);

                    }
                });
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
            break;

        case 'resume':
            
            client.audio.dispatcher.resume();
            break;

        case 'skip':

            client.audio.dispatcher.end('skip');
            break;

        case 'stop':
            
            client.voiceConnections.forEach((c) => {

                c.disconnect();
                c.leave();
                client.audio.playlist = [];
                message.channel.send("Music Stopped");
            });
            break;

        default: {

            break;
        }
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

    if (!client.request) client.request = require('request');
}

exports.conf = {

    enabled: true,
    aliases: [],
    permLevel: 1
};

exports.help = {

    name: "music",
    catergory: "music",
    description: "Musical commands",
    usage: ""
};