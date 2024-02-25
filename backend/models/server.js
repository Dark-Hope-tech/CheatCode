const { v4: uuidv4 } = require('uuid');
const channel = require("./channel");
const userModel = require("./userModel");
const docClient = require("../sevices/authentication");
class ServerModel {
    constructor(serverName,email) {
        this.serverName = serverName;
        this.serverId =uuidv4();
        this.channels = [];
        this.createdBy =  email;
        this.moderators = {};
        this.users = []
    }

    static async createChannel(serverId, channelName, email, isPublic, createdBy) {
        return true;
        // return new Promise((resolve, reject) => {
        //     ServerModel.getServer(serverId).then((data)=>{
        //         const server = data.Item;
        //         if (server.moderators[email]) {
        //             if (!server.channels[channelName]) {
        //                 const newChannelName =  serverId+"#"+channelName;
        //                 channel.createNewChannel(newChannelName, isPublic, [email], email).then((data)=>{
        //                     ServerModel.addNewChannelToServer(serverId,newChannelName);
        //                 });
        //                 resolve(true);
        //             } else {
        //                 reject(false); // Channel already exists
        //             }
        //         } else {
        //             reject(false); // User does not have permission
        //         }
        //     }).catch((err)=>{
        //         console.log("Here is the error "+ err);
        //         reject(err);
        //     });
        // });
    }
    static async addNewChannelToServer(serverId,channelName){
        const params = {
            TableName: "servers",
            Key: {
                serverId: serverId
            },
            UpdateExpression: "SET channels = list_append(channels, :c)",
            ExpressionAttributeValues: {
                ":c": [channelName]
            },
            ReturnValues: "UPDATED_NEW"
        };
        docClient.update(params, (err, data) => {
            if (err) {
                console.error("Unable to update item. Error JSON:", JSON.stringify(err, null, 2));
                return err;
            } else {
                console.log("UpdateItem succeeded:", JSON.stringify(data, null, 2));
                return data;
            }
        });
    }
    static async deleteChannel(channelName, email) {
        return new Promise((resolve, reject) => {
            if (this.moderators[email] || this.admin == email) {
                if (this.channels[channelName]) {
                    delete this.channels[channelName];
                    resolve(true);
                } else {
                    resolve(false); // Channel does not exist
                }
            } else {
                resolve(false); // User does not have permission
            }
        });
    }
    static async addModerator(serverId,existingModerator,moderatorToBeAdded) {
        ServerModel.getServer(serverId).then((data)=>{
            const moderators = data.Item.moderators;
            if(!moderators[existingModerator]){
                return false;
            }
        });
        return new Promise((resolve, reject) => {
            const updateParams = {
                TableName: 'servers',
                Key: {
                    'serverId': serverId // Specify the primary key of the item you want to update
                },
                UpdateExpression: 'SET #moderators = list_append(if_not_exists(#moderators, :emptyList), :email)',
                ExpressionAttributeNames: {
                    '#moderators': 'moderators' // Attribute name to avoid reserved word 'moderators'
                },
                ExpressionAttributeValues: {
                    ':email': [moderatorToBeAdded], // New email to append
                    ':emptyList': [] // Empty list placeholder
                },
                ReturnValues: 'UPDATED_NEW' // Specify which item attributes should be returned after the update operation
            };
            docClient.update(updateParams, (err, data) => {
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
    static async createServer(serverName, emailToBeAdded) {
        const newServer = new ServerModel(serverName, emailToBeAdded);
        return new Promise((resolve, reject) => {
            const params = {
                TableName: "servers",
                Item: {
                    serverName: newServer.serverName,
                    serverId: newServer.serverId,
                    createdBy: newServer.createdBy,
                    channels: [],
                    users :[emailToBeAdded],
                    moderators: [newServer.createdBy],  
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
    async joinChannel(channelName, userEmail) {
        if (this.channels[channelName]) {
            this.channels[channelName].users.push(userEmail);
            return true;
        } else {
            return false; // Channel does not exist
        }
    }

    static async getServer(serverId) {
        return new Promise((resolve, reject) => {
            console.log("Getting server with id: " + serverId);
            const params = {
                TableName: 'servers',
                Key: {
                    'serverId': serverId
                }
            };
            docClient.get(params, (err, data) => {
                if (err) {
                    console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                    reject(err);
                } else {
                    console.log(data);
                    console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
                    resolve(data);
                }
            });
        });
    }
    static async getServerList(email) {
        return new Promise((resolve, reject) => {
            const params = {
                TableName: 'users',
                Key: {
                    'email': email
                }
            };
            docClient.get(params, (err, data) => {
                if (err) {
                    console.error("Unable to read item. Error JSON:", JSON.stringify(err, null, 2));
                    reject(err);
                } else {
                    resolve(data.Items);
                }
            });
        });
    }
    // Getter for channels
    static async joinServer(serverId, email) {
        return new Promise((resolve, reject) => {
            const updateParams = {
                TableName: 'servers',
                Key: {
                    'serverId': serverId // Specify the primary key of the item you want to update
                },
                UpdateExpression: 'SET #users = list_append(if_not_exists(#users, :emptyList), :email)',
                ExpressionAttributeNames: {
                    '#users': 'users' // Attribute name to avoid reserved word 'users'
                },
                ExpressionAttributeValues: {
                    ':email': [email], // New email to append
                    ':emptyList': [] // Empty list placeholder
                },
                ReturnValues: 'UPDATED_NEW' // Specify which item attributes should be returned after the update operation
            };
            docClient.update(updateParams, (err, data) => {
                if (err) {
                    console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                    reject(err);
                } else {
                    console.log("Added item:", JSON.stringify(data, null, 2));
                    const updataeUserServerList = userModel.putServer(email,serverId).then((data)=>{
                        if(data)
                            resolve(data);
                        else
                            reject(data);
                    });
                    resolve(data);
                }
            });
        });
    }
    getChannels() {
        return Object.keys(this.channels);
    }
}
module.exports = ServerModel;
