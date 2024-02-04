const AWS = require('aws-sdk');
let awsConfig = {
    "region": "ap-south-1",
    "endpoint": "https://dynamodb.ap-south-1.amazonaws.com",
    "accessKeyId":"AKIAURVQR43JPJVPT6H5",
    "secretAccessKey":"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"
}
AWS.config.update(awsConfig);
const docClient = new AWS.DynamoDB.DocumentClient();

module.exports = docClient;