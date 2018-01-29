module.exports = (client) => {

    client.loadCommand = (command, location, lib) => {

        try {

            const props = require(`${location}/${command}`);
            if (props.init) props.init(client);
            if (lib === 'main') client.commands.set(props.help.name, props);
            else if (lib === 'music') client.music.commands.set(props.help.name, props);
            else throw new Error('lib must be defined when calling client.loadCommand');
            props.conf.aliases.forEach(alias => {

                client.aliases.set(alias, props.help.name);
            });
            return `Loaded ${command} successfully!`;
        } catch (error) {

            return `Unable to load command ${command}: ${error}`;
        }
    };

    client.wait = require("util").promisify(setTimeout);
    
    client.util = {

        toHHMMSS: (time) => {

            let sec_num = parseInt(time, 10);
            let hours = Math.floor(sec_num / 3600);
            let minutes = Math.floor((sec_num - (hours * 3600)) / 60);
            let seconds = sec_num - (hours * 3600) - (minutes * 60);

            if (hours < 10) hours = "0"+hours;
            if (minutes < 10) minutes = "0"+minutes;
            if (seconds < 10) seconds = "0"+seconds;

            return `${hours}:${minutes}:${seconds}`;
        },

        blankField: () => {

            return (fields.push({
                "name": `\u200b`,
                "value": `\u200b`
            }));
        },

        readdir: require('util').promisify(require('fs').readdir)
    }
};
