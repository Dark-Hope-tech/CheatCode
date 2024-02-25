const docClient = require("../sevices/authentication");
const message = require("./message");

class channel{
    constructor(channelName,isPublic,createdBy){
        this.channelName = channelName;
        this.createdBy = createdBy;
        this.messages = [];
        this.isPublic=isPublic;
        this.privateMembers = [];
    }
    static async putMessage(channelName,message){
        return new Promise((resolve, reject) => {
            const params = {
                TableName: "channels",
                Key: {
                    "channelName": channelName
                },
                UpdateExpression: "SET messages = list_append(messages, :m)",
                ExpressionAttributeValues: {
                    ":m": [{
                        message: message,
                        time: new Date().getTime().toString()
                    }]
                },
                ReturnValues: "UPDATED_NEW"
            };
            docClient.update(params, (err, data) => {
                if (err) {
                    console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                    reject(err);
                } else {
                    console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
                    resolve(data);
                }
            });
        });
    }
    static async getMessages(channelName){
        return new Promise((resolve, reject) => {
            const params = {
                TableName: 'channels',
                Key: {
                    'channelName': channelName
                }
            };
    
            docClient.get(params, (err, data) => {
                if (err) {
                    console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                    reject(err);
                } else {
                    console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
                    resolve(data.Item.messages);
                }
            });
        });
    }

    static async createNewChannel(channelName,isPublic,createdBy,privateMembers=[]){
        return new Promise((resolve, reject) => {
            const params = {
                TableName: "channels",
                Item: {
                    channelName: channelName,
                    isPublic: isPublic,
                    createdBy: createdBy,
                    messages: [],
                    privateMembers : privateMembers
                }
            };
            docClient.put(params, (err, data) => {
                if (err) {
                    console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                    reject(err);
                } else {
                    console.log("Added item:", JSON.stringify(data, null, 2));
                    resolve(data);
                }
            });
        });
    }
    static async getChannel(channelName){
        return new Promise((resolve, reject) => {
            const params = {
                TableName: 'channels',
                Key: {
                    'channelName': channelName
                }
            };
    
            docClient.get(params, (err, data) => {
                if (err) {
                    console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                    reject(err);
                } else {
                    console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
                    resolve(data.Item);
                }
            });
        });
    }
}
module.exports = channel;