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

    bot.user.setStatus('online');
    bot.user.setActivity('!helpmehawx', { type: 'LISTENING' });

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
    var replies = Array();
    var reactions = null;
    var replyToPerson = true;

    switch (parsedMessage.Command) {
        case '!about':
            if(message.channel != null) message.channel.startTyping();

            replies.push(await messages.AboutThisBot());
            break;

        /*
        case '!campaign':
            if(message.channel != null) message.channel.startTyping();

            data = await gowApi.GetLatestCampaignTasks();
            if(data == null) return;
            replies = data.messages;
            replyToPerson = false;
            break;
        */

        case '!helpmehawx':
            if(message.channel != null) message.channel.startTyping();

            staticCommands = await messages.ListBotCommands();
            dynamicCommands = await gowApi.AboutHawxCommands();

            replies.push(staticCommands.replace("[HawxCommands]", dynamicCommands));

            break;

        case '!patchnotes':
            if(message.channel != null) message.channel.startTyping();

            data = await gowApi.GetLatestPatchNote();
            replies = data.messages;
            replyToPerson = false;
            break;

        case '!patchnotesmajor':
            if(message.channel != null) message.channel.startTyping();

            data = await gowApi.GetLatestMajorPatchNote();
            replies = data.messages;
            replyToPerson = false;
            break;

        case '!test':
            if(message.channel != null) message.channel.startTyping();

            let messageObj = {
                "messages": [
                    {
                        "type": "Embedded",
                        "title": "Help with !campaign",
                        "description": "Get the latest campaign task.",
                        "sections": [
                            {
                                "title": "Options",
                                "text": "You can return specific data using the options in the table below.\nYou can also combine the various options e.g.\n**!campaign campaign 2 week 1**"
                            }
                        ],
                        "table": "Filters  | Example Command       | Valid Values         \n" +
                                 "---------|-----------------------|----------------------\n" +
                                 "campaign | !campaign campaign 2  | 2                    \n" +
                                 "week     | !campaign week 1      | 1, 2, 3, 4, 5, 6, 7  "
                    }
                ]
            };

            for(var i = 0; i < messageObj.messages.length; i++){
                replies.push(
                    await messages.CreateEmbeddedMessage(discord, messageObj.messages[i])
                );
            }
            //replyToPerson = false;

            break;
        
        default:
            if(message.channel != null) message.channel.startTyping();

            hawxCommands = await gowApi.ListHawxCommands();
            for(var i=0; i < hawxCommands.commands.length; i++){
                let hawxCommand = hawxCommands.commands[i];

                // Try to match a command
                if(hawxCommand.command == parsedMessage.Command){
                    // Check for help argument
                    if(parsedMessage.Arguments.length > 0 && parsedMessage.Arguments[0].toLowerCase() =="help") {
                        replies.push(hawxCommand.help);
                    } else {
                        // If no arguments are specified then just show the latest data
                        if(parsedMessage.Arguments.length == 0) parsedMessage.Arguments = Array("latest");
                        let hawxApiUrl = hawxCommand.links.href + "/" + parsedMessage.Arguments.join("/");
                        
                        let messageObj = await gowApi.GetHawxCommandItems(hawxApiUrl);
                        for(var i = 0; i < messageObj.messages.length; i++){
                            if(typeof messageObj.messages[i] === "string"){
                                replies.push(messageObj.messages[i]);
                            }
                            replies.push(
                                await messages.CreateEmbeddedMessage(discord, messageObj.messages[i])
                            );
                        }

                        replyToPerson = false;
                    }
                }
            }
            break;
    }

    await messages.SendReplies(message, replies, reactions, replyToPerson);
});

// Login to Discord as the Bot
bot.login(process.env.BOT_TOKEN); 