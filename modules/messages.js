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
    },
    CreateEmbeddedMessage: async function(discord, messageObj){

        const textToImage = require('text-to-image');

        embeddedMessage = new discord.MessageEmbed().setTitle(messageObj.title);
        
        if(messageObj.description != null){
            embeddedMessage.setDescription(messageObj.description);
        }
        
        if(messageObj.sections != null){
            for(var i = 0; i < messageObj.sections.length; i++){
                embeddedMessage.addFields({
                    name: messageObj.sections[i].title,
                    value: messageObj.sections[i].text
                });
            }
        }

        if(messageObj.image != null){
            embeddedMessage.setImage(messageObj.image);
        }

        if(messageObj.image == null && messageObj.table != null){
            
            const PxPerChar = 10;
            const MarginPx = 5;
            let maxCharsPerRow = Math.max(...(messageObj.table.split("\n").map(el => el.length))) + 2;
                
            let image = await textToImage.generate(messageObj.table, {
                "fontFamily": "Courier",
                "fontSize": 16, // 16 = Approx 10px width per character
                "textColor": "#98b1b8", // Discord Light Gray
                "bgColor": "#2f3136", // Discord Dark Gray
                "maxWidth": maxCharsPerRow * PxPerChar + (2 * MarginPx),
                "margin": MarginPx
            });
        
            const imageStream = new Buffer.from(image.split(",")[1], 'base64');

            let imageName = messageObj.title.trim().toLowerCase().replace(/\s/g, "_").replace(/[^a-zA-Z0-9]/ig, "");
            attachments = Array(new discord.MessageAttachment(imageStream, `${imageName}.png`));            
            embeddedMessage.setImage(`attachment://${imageName}.png`);
        }

        let message = { 
            embed: embeddedMessage, 
            files: attachments
        }
        
        return message;
    },
    SendReplies: async function(replies, reactions, replyToPerson, userMessage){
        
        if(replies != null){
            
            var finalReplyMessage;

            for(var i=0; i < replies.length; i++){

                if(replyToPerson || userMessage.channel == null){
                    if(typeof replies[i] === "string") replies[i] = "\n" + replies[i];
                    finalReplyMessage = await userMessage.reply(replies[i]);
                } else {
                    console.log(typeof replies[i]);
                    if(typeof replies[i] === "string") {
                        finalReplyMessage = await userMessage.channel.send(replies[i], { split: true });
                    } else {
                        finalReplyMessage = await userMessage.channel.send(replies[i]);
                    }                
                }
            }

            if(reactions != null){
                await helpers.reactAsync(bot, finalReplyMessage, reactions);
            }
        }

        if(userMessage.channel != null) userMessage.channel.stopTyping();
    }
}