const serverRouter = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const validator = require('validator');
const ServerModel = require("../models/server");
const docClient = require("../sevices/authentication");
const User =  require("../models/userModel");


serverRouter.post("/createServer", async (req, res) => {
    const { serverName} = req.body;
    if(!serverName)
        return res.status(400).json({ message: "Please enter a valid server name" });
    var token = req.headers.cookie;
    if(!token)
        return res.status(401).json("madarchod token dal");
    token = token.replace('Bearer ','');
    var decodedUserEmail = jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
        if(err){
            console.log(err);
            return res.status(201).json({errMessage :"bsdk token galat deCode ho rha BT.. suiside krle"});
        }
        return decoded;
    });
    ServerModel.createServer(serverName,decodedUserEmail.email).then((data) => {
        if (data) {
            return res.status(200).json({ message: "Server created successfully" });
        }
        return res.status(400).json({ message: "Server could not be created" });
    });
});

serverRouter.post("/createServerChannel", async (req, res) => {
    const { serverId,channelName,isPublic} = req.body;
    if(!serverId || !channelName)
        return res.status(400).json({ message: "Please enter a valid server name" });
    var token = req.headers.cookie;
    if(!token)
        return res.status(401).json("madarchod phir se token dal");
    token = token.replace('Bearer ','');
    var decodedUserEmail = jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
        if(err){
            console.log(err);
            return res.json(false);
        }
        return decoded;
    });
    ServerModel.createChannel(serverId, channelName, decodedUserEmail.email, isPublic, decodedUserEmail).then((data) => {
        if(data)
            return res.status(400).json({message: "Channel could not be created"});
        return res.status(200).json({message: "Channel created successfully 1234"});
    }).catch((err) => {
        return res.status(400).json({message: err}).send();
    });
    return res.status(200).json({message: "Channel created successfully No No"});
});

serverRouter.get("/getServerList", async (req, res) => {
    var token = req.headers.cookie;
    // var token = req.headers.authorization;
    if(!token)
        return res.status(401).json("phir se token dal");
    token = token.replace('Bearer ','');
    token = token.replace('token=','');
    token= token.substring(0, token.indexOf(';'));
    // token =  token.replace('Bearer ','');
    var decodedUserEmail = jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
        if(err){
            console.log(err);
            return res.json('token galat hai');
        }
        return decoded;
    });
    const user = await User.getUser(decodedUserEmail.email);
    if(!user)
        return res.json("user hi nahi hai");
    const serverListname=[];
    console.log(user.serverList);
    for(let i =0;i<user.serverList.length;i++){
        data = await ServerModel.getServer(user.serverList[i]);
        console.log("Server name is");
        console.log(data);
        serverListname.push(data);
    }
    console.log("Bro");
    console.log(serverListname);
    return res.status(200).json(serverListname);
});
serverRouter.post("/joinServer", async (req, res) => {
    const { serverId} = req.body;
    if(!serverId)
        return res.status(400).json({ message: "Please enter a valid server name" });
    console.log("Yo");
    console.log(req.headers.authorization);
    var token = req.headers.authorization;
    if(!token)
        return res.status(401).json("phir se token dal");
    token = token.replace('Bearer ','');
    // token = token.replace('token=','');
    console.log(token);
    var decodedUserEmail = jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
        if(err){
            console.log(err);
            return res.json(false);
        }
        return decoded;
    });
    ServerModel.joinServer(serverId,decodedUserEmail.email).then((data) => {
        if(data)
            return res.status(200).json({message: "Server is joined"});
        return res.status(400).json({message: "Server could not be joined successfully"});
    }).catch((err) => {
        return res.status(400).json({message: err}).send();
    });
});
module.exports = serverRouter;