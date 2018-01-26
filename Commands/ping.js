exports.run = async (client, message, args, level) => {

    const msg = await message.channel.send("Pinging!");
    msg.edit(`Pong! Latency is ${msg.createdTimestamp - message.createdTimestamp}ms. API Latency is ${Math.round(client.ping)}ms`);
};

exports.conf = {

    enabled: true,
    aliases: [],
    permLevel: 1
};

exports.help = {
    
    name: "ping",
    catergory: "Miscellaneous",
    description: "Ping Pong!",
    usage: "ping"
};