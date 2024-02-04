const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const PORT = 8000;
app.use(express.json());
app.use(cookieParser());
const docClient = require("./sevices/authentication");
app.use(cors({
    origin: ["http://localhost:8000"],
    credentials: true
}));
// let awsConfig = {
//     "region": "us-east-1",
//     "endpoint": "https://dynamodb.us-east-1.amazonaws.com",
//     "accessKeyId":"AKIAURVQR43JPJVPT6H5",
//     "secretAccessKey":"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"
// }
// AWS.config.update(awsConfig);
// const docClient = new AWS.DynamoDB.DocumentClient();

app.use('/auth', require('./routes/authRouter'));
// app.use('/server', require('./routes/serverRouter'));
app.listen(PORT, () => console.log('Server started on port:'+ PORT));
