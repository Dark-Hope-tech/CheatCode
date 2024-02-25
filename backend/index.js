const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const PORT = 8000;
app.use(express.json());
app.use(cookieParser());

app.use(cors({
    origin: ["http://localhost:3000"],
    credentials: true
}));

app.use('/auth', require('./routes/authRouter'));
app.use('/channel', require('./routes/channelRouter'));
app.use('/server',require('./routes/serverRouter'));
app.listen(PORT, () => console.log('Server started on port:'+ PORT));
