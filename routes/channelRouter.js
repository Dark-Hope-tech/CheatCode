const channelRouter = require('express').Router();
const User = require("../models/userModel");
const channel = require("../models/channel");
const jwt = require("jsonwebtoken");
channelRouter.get('/getChannels', async (req, res) => {
    // const {}
});
function combineEmail(a,b){
    if(a > b) return a+b;
    return b+a;
}
channelRouter.get('/getPersonalMessages', async (req, res) => {
    const { receiverEmail } = req.body;
    var token = req.headers.authorization;
    if(!token)
        return res.json("madarchod");
    token = token.replace('Bearer ','');
    var decodedUserEmail = jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
        if(err){
            console.log(err);
            return res.json(false);
        }
        return decoded;
    });
    const user = await User.getUser(decodedUserEmail.email);
    if(!user)
        return res.json("madarchod1");
    const receiverUser =  await User.getUser(receiverEmail);
    if(!receiverUser)
        return res.json("madarchod2");
    console.log(decodedUserEmail.email,receiverEmail);
    const existingChannel = await channel.getChannel(combineEmail(decodedUserEmail.email,receiverEmail));
    if(!existingChannel){
        console.log("creating new channel");
        const newChanel = await channel.createNewChannel(combineEmail(decodedUserEmail.email,receiverEmail),false,decodedUserEmail.email,[decodedUserEmail.email,receiverEmail]);
        return res.json({message: "No messages yet"});
    }
    const channelMesaages =  await channel.getMessages(existingChannel.channelName);
    if(channelMesaages.length === 0)
        return res.status(200).json({message: "No messages yet"});
    return res.status(200).json(channel.getMessages(existingChannel.channelName));
});

channelRouter.get("/getServerChannelMessages", async (req, res) => {
    const { channelName,serverId} = req.body;
    var token = req.headers.authorization;
    if(!token)
        return res.json("madarchod");
    token = token.replace('Bearer ','');
    var decodedUserEmail = jwt.verify(token,process.env.JWT_SECRET,(err,decoded)=>{
        if(err){
            console.log(err);
            return res.json(false);
        }
        return decoded;
    });
    const decodedUser = await User.getUser(decodedUserEmail.email);
    if(!decodedUser)
        return res.json("madarchod User");
    const server = await User.getServer(serverId);
    if(!server)
        return res.json("madarchod1");
    const serverChannel = await channel.getChannel(serverId + channelName);
    if(!serverChannel)
        return res.json("madarchod2");
    const channelMesaages =  await channel.getMessages(serverChannel.channelName);
    if(!channelMesaages)
        return res.json("madarchod3");
    if(channelMesaages.length === 0)
        return res.status(200).json({message: "No messages yet"});
    return res.status(200).json(channelMesaages);
});
module.exports = channelRouter;