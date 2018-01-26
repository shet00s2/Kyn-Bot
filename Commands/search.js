exports.run = async (client, message, args, level) => {
    
    if (!args[0]) {

        message.channel.send("Please enter a search term!");
        return;
    }

    const {key, cx} = client.config.google;

    const search = args.join('');
    const options = {
        url: `https://www.googleapis.com/customsearch/v1?key=${key}&cx=${cx}&q=${search}&num=1`,
        json: true
    }

    client.request(options, (error, response, body) => {

        if (error) {

            console.log(options.url);
            console.error(error);
        }
        if (body.error) {

            message.channel.send(`${body.error.code}: ${body.error.message}`);
        }

        else if (body.queries.request[0].totalResults == 0) {

            message.channel.send(`No search results found for ${args}.`);
        }

        else {

            const item = body.items[0];
            message.channel.send({
                "embed": {
                    "title": item.title,
                    "description": item.snippet,
                    "image": {
                        "url": item.pagemap.cse_image[0].src
                    },
                    "url": item.formattedUrl,
                    "author": {
                        "name": 'Kyn-Bot',
                        "url": "",
                        "icon_url": ""
                    },
                    "footer": {
                        "icon_url": `http://www.google.com/s2/favicons?domain=${item.formattedUrl}`,
                        "text": item.formattedUrl
                    }
                }
            });
        }
    });
};

exports.init = (client) => {

    if (!client.request) client.request = require('request');
}

exports.conf = {

    enabled: true,
    aliases: []
};

exports.help = {

    name: "search",
    catergory: "info",
    description: "Searches the web and returns the number one result!",
    usage: "search [term]"
};