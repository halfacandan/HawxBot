module.exports = {
    AboutHawxCommands: async function (botCommandPrefix){
        const endpointPath = `v1/hawx?commandPrefix=${encodeURIComponent(botCommandPrefix)}`;
        let json = await MakeApiGetCallAsync(endpointPath);
        var about = "";
        for(var i=0; i < json.commands.length; i++){
            about += `**${json.commands[i].command}** - ${json.commands[i].description}\n`;
        }
        return about;
    },
    ListHawxCommands: async function (botCommandPrefix){
        const endpointPath = `v1/hawx?commandPrefix=${encodeURIComponent(botCommandPrefix)}`;
        let json = await MakeApiGetCallAsync(endpointPath);
        return json;
    },
    GetHawxCommandItems: async function (endpointPath, botCommandPrefix, maxItemCount = null){

        endpointPath += `?commandPrefix=${encodeURIComponent(botCommandPrefix)}`;
        if(typeof maxItemCount === "number" && maxItemCount > 0){
            endpointPath += `&limit=${maxItemCount}`;
        }

        let json = await MakeApiGetCallAsync(endpointPath);
        return json;
    },
    GetLatestPatchNote: async function (){
        const endpointPath = "v1/game/patchnotes/latest";
        let json = await MakeApiGetCallAsync(endpointPath);
        return json;
    },
    GetLatestMajorPatchNote: async function (){
        const endpointPath = "v1/game/patchnotes";
        let json = await MakeApiGetCallAsync(endpointPath);
        return json;
    }
}

const request = require('request');

function MakeApiGetCallAsync(endpointPath, jwtToken = null) {

    const apiEndpoint = new URL(endpointPath, process.env.API_ENDPOINT_BASE).href;
    console.log("GET:" + apiEndpoint);

    const options = {
        url: apiEndpoint,
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Jwt-Auth': jwtToken
        }
      };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (error) reject(error);
            if (response.statusCode != 200) {
                reject(null);
            }
            resolve(body);
        });
    }).catch((reason) => {
        console.log(`The promise was rejected because (${reason})`);
    });
}

function MakeApiPostCallAsync(endpointPath, jwtToken = null, postData = null) {

    const apiEndpoint = new URL(endpointPath, process.env.API_ENDPOINT_BASE).href;
    console.log("POST:" + apiEndpoint);

    const options = {
        url: apiEndpoint,
        method :"POST",
        followAllRedirects: true,
        body: postData,
        json: true,
        headers: {
            'Content-Type': 'application/json',
            'Jwt-Auth': jwtToken,
            'Content-Length': postData.length
        }
      };

    return new Promise((resolve, reject) => {
        request(options, (error, response, body) => {
            if (error) reject(error);
            if (response.statusCode != 200) {
                reject(null);
            }
            resolve(body);
        });
    }).catch((reason) => {
        console.log(`The promise was rejected because (${reason})`);
    });
}