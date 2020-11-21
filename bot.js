const helpers = require('./modules/helpers.js');
const messages = require('./modules/messages.js');
const gowApi = require('./modules/gowApi.js');
const discord = require('discord.js');
const bot = new discord.Client();

// Define global variables
var botName;

// Define Bot Behaviours
bot.on('ready', () => {

    botName = bot.user.username;
    console.log(`${botName} is online`);
});

bot.on('message', async message => {

    var discordUser = message.author.username;

    // Don't reply to messages generated by any bot
    //if (message.author.bot) return;
    
    // Don't reply to messages generated by this bot
    if (discordUser === botName) return;

    // Parse the message
    let parsedMessage = await helpers.ParseMessage(message);

    // Define the reply
    var data = null;
    var reply = null;
    var reactions = null;
    var replyToPerson = true;

    switch (parsedMessage.Command) {
        case '!about':
            reply = await messages.AboutThisBot();
            break;

        case '!campaign':
            data = await gowApi.GetLatestCampaignTasks();
            if(data == null) return;
            reply = data.messages;
            replyToPerson = false;
            break;
    
        case '!helpmehawx':
            staticCommands = await messages.ListBotCommands();
            dynamicCommands = await gowApi.AboutHawxCommands();

            reply = staticCommands.replace("[HawxCommands]", dynamicCommands);

            break;

        case '!patchnotes':
            data = await gowApi.GetLatestPatchNote();
            if(data == null) return;
            reply = data.messages;
            replyToPerson = false;
            break;

        case '!patchnotesmajor':
            data = await gowApi.GetLatestMajorPatchNote();
            if(data == null) return;
            reply = data.messages;
            replyToPerson = false;
            break;
        
        default:
            hawxCommands = await gowApi.ListHawxCommands();
            for(var i=0; i < hawxCommands.commands.length; i++){
                let hawxCommand = hawxCommands.commands[i];

                // Try to match a command
                if(hawxCommand.command == parsedMessage.Command){
                    // Check for help argument
                    if(parsedMessage.Arguments.length > 0 && parsedMessage.Arguments[0].toLowerCase() =="help") {
                        reply = hawxCommand.help;
                    } else {
                        // If no arguments are specified then just show the latest data
                        if(parsedMessage.Arguments.length == 0) parsedMessage.Arguments = Array("latest");
                        let hawxApiUrl = hawxCommand.links.href + "/" + parsedMessage.Arguments.join("/");

                        reply = await gowApi.GetHawxCommandItems(hawxApiUrl);
                        replyToPerson = false;
                    }
                }
            }
            break;
    }

    // Post the reply
    if(reply != null){
        var replyMessage;
        if(replyToPerson || message.channel == null){
            replyMessage = await message.reply("\n" + reply);
        } else {
            replies = Array.isArray(reply) ? reply : Array(reply);
            for(var i=0; i < replies.length; i++){
                replyMessage = await message.channel.send(replies[i], { split: true });
            }
        }
        replyMessage = Array.isArray(replyMessage) ? replyMessage[0] : replyMessage;
        await helpers.reactAsync(bot, replyMessage, reactions);
    }
});

// Login to Discord as the Bot
bot.login(process.env.BOT_TOKEN); 