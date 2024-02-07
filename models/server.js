const { v4: uuidv4 } = require('uuid');
const channel = require("./channel");
const docClient = require("../sevices/authentication");
class ServerModel {
    constructor(serverName,email) {
        this.serverName = serverName;
        this.serverId =uuidv4();
        this.channels = [];
        this.createdBy =  email;
        this.moderators = [];
        this.users = []
    }

    static async createChannel(serverId, channelName, email, isPublic, createdBy) {
        return new Promise((resolve, reject) => {
            ServerModel.getServer(serverId).then((data)=>{
                const server = data.Item;
                if (server.moderators[email]) {
                    if (!this.channels[channelName]) {
                        const newChannelName =  serverId+"#"+channelName;
                        channel.createNewChannel(newChannelName, isPublic, [email], email).then((data)=>{
                            ServerModel.addNewChannelToServer(serverId,newChannelName);
                        });
                        resolve(true);
                    } else {
                        resolve(false); // Channel already exists
                    }
                } else {
                    resolve(false); // User does not have permission
                }
            });
        });
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
                    ':email': ['new-moderator@example.com'], // New email to append
                    ':emptyList': [] // Empty list placeholder
                },
                ReturnValues: 'UPDATED_NEW' // Specify which item attributes should be returned after the update operation
            };
            docClient.update(params, (err, data) => {
                if (err) {
                    console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                    reject(err);
                } else {
                    console.log("Added item:", JSON.stringify(data, null, 2));
                    resolve(data);
                }
            })
            if (moderators[email] || this.admin == email) {
                if (this.channels[channelName]) {
                    this.channels[channelName].moderators.push(email);
                    resolve(true);
                } else {
                    resolve(false); // Channel does not exist
                }
            } else {
                resolve(false); // User does not have permission
            }
        });
    }
    static async createServer(serverId, emailToBeAdded,existingModerator) {
        return new Promise((resolve, reject) => {
            const params = {
                TableName: "servers",
                Item: {
                    serverName: serverName,
                    serverId: serverId,
                    createdBy: email,
                    channels: [],
                    users :[email],
                    moderators: []  
                }
            };
            docClient.update(params, (err, data) => {
                if (err) {
                    console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                    reject(err);
                } else {
                    console.log("Added item:", JSON.stringify(data, null, 2));
                    resolve(data);
                }
            });
            const newServer = new ServerModel(serverName, email);

            resolve(newServer);
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
                    console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
                    resolve(data);
                }
            });
        });
    }

    // Getter for channels
    getChannels() {
        return Object.keys(this.channels);
    }
}
module.exports = ServerModel;
