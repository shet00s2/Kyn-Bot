module.exports = async (client) => {

    const {storage} = client.lib;
    
    client.guilds.forEach((guild) => {
        
        if(!storage.keys().includes(guild.id)) {

            storage.setItem(guild.id, {
                'prefix': null,
                'vote': {
                    'inProgress': false,
                    'choices': [],
                    'votes': []
                }
            })
        }
    });

    client.wait(5000);
    console.log("Bot loaded and ready");
};