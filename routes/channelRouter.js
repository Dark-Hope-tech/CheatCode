const channelRouter = require('express').Router();
const User = require("../models/userModel");
channelRouter.get('/getChannels', async (req, res) => {
    // const {}
});
channelRouter.get('/getMessages', async (req, res) => {
    const { channelName } = req.body;
    var token = req.cookies.token;
    if(!token)
        return res.json("mesa");
    token = token.replace('Bearer','');
    var decoded = jwt.decode(token);
    const user = await User.getUser(decoded.email);
    if(channelName in user.channels){
        return res.json(user.channels[channelName]);
    }

});
