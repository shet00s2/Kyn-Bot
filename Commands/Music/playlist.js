exports.run = async (client, message, args, level) => {

    let list = '';
    client.audio.playlist.forEach((data, index) => {
        list += `[${index += 1}]: ${data.title}\n`;
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

    name: "playlist",
    catergory: "",
    description: "",
    usage: ""
};