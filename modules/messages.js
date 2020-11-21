module.exports = {
    AboutThisBot: async function(){

        message =   "This bot and the associated API are maintained by Plip. If you'd like to add some funtionality then you can:\n" +
                    "  - Contact Plip for some help at https://community.gemsofwar.com/u/Plip.\n" +
                    "  - Submit your own code at https://github.com/halfacandan/HawxBot\n" +
                    `  - View the API Documentation at ${process.env.API_ENDPOINT_BASE}swagger/\n\n`

        return message;
    },
    ListBotCommands: async function(){

        message =   "**!about** - Info on how to add new functionality to HawxBot\n" +
                    "[HawxCommands]" +
                    "**!patchnotes** - Gets the latest patch note\n" +
                    "**!patchnotesmajor** - Gets the latest Major patch note and notes for any subsequent Minor patches\n";
        
        return message;
    }
}