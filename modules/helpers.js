module.exports = {
    ParseMessage: async function (message){

        const matchAll = require("match-all");

        const regexp = /(![a-zA-Z]+)|(?:![a-zA-Z]+)?(?:\s((?:"[^"]+"|[^\s]+)))/g;
        const parsedString = matchAll(message, regexp).toArray();

        let command = parsedString.length < 1 || parsedString[0].trim().slice(0,1) != "!" ? null : parsedString.shift().trim().toLowerCase();
        let arguments = parsedString
            .map(function(argument){
                return argument.replace(/"/g,"").trim();  
            })
            .filter(argument => argument != null &&  argument.length > 0);

        return {
            "Command": command,
            "Arguments": arguments
        };
    },
    GetChannelIdAsync: async function (guild, channelName){
        
        if(guild == null || channelName == null) return "**#" + channelName + "**";
        
        return await guild.channels.cache.find(channel => channel.name === channelName).toString();
    }
}