const docClient = require("../sevices/authentication");
const bcrypt = require("bcryptjs");
const dotenv = require("dotenv").config();
const jwt = require("jsonwebtoken");
class User {
    constructor(username, email, phoneNumnber,passwordHash) {
        this.username = username;
        this.email = email;
        this.phoneNumnber = phoneNumnber;
        this.passwordHash = passwordHash;
        this.serverList= [],
        this.personalChats = []
    }
    static putUser(email, username, phoneNumnber, passwordHash,callback) {
        const params = {
            TableName: "users",
            Item: {
                email: email,
                username: username,
                phoneNumnber: phoneNumnber,
                passwordHash: passwordHash,
                serverList: [],
                personalChats: []
            }
        };
        docClient.put(params, (err, data) => {
            if (err) {
                console.error("Unable to add item. Error JSON:", JSON.stringify(err, null, 2));
                return err;
            } else {
                console.log("Added item:", JSON.stringify(data, null, 2));
                return data;
            }
        });
    }
    static async getUser(email) {
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
                    console.log("GetItem succeeded:", JSON.stringify(data, null, 2));
                    resolve(data.Item);
                }
            });
        });
    }
    
}

module.exports = User;