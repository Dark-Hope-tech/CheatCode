const authRouter = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const validator = require('validator');
const User = require("../models/userModel");
const docClient = require("../sevices/authentication");
//register
async function checkEmailExists(email) {
    try {
        const params = {
            TableName: 'users',
            Key: {
                'email': email
            }
        };

        const data = await docClient.get(params).promise(); // Using .promise() for clarity

        if (data && data.Item) {
            console.log(data.Item);
            return true; // Email exists
        } else {
            console.log('Email does not exist');
            return false; // Email does not exist
        }
    } catch (err) {
        console.error('Error checking email existence:', err);
        throw err; // Re-throw the error for further handling
    }
}
authRouter.post("/signUp", async (req, res) => {
    try {
        const { email, password, passwordVerify, username, phoneNumber } = req.body;

        if (!email || !password || !passwordVerify || !username || !phoneNumber)
            return res.status(400).json({ errorMessage: "Please enter all details" });
        if (password.length <= 8)
            return res.status(400).json({ errorMessage: "Please enter a password of more than 8 characters" });

        if (password !== passwordVerify)
            return res.status(400).json({ errorMessage: "Please enter the same password twice" });

        if (!validator.isEmail(email))
            return res.status(400).json({ errorMessage: "Please enter a valid email" });

        if (!validator.isMobilePhone(phoneNumber))
            return res.status(400).json({ errorMessage: "Please enter a valid phone number" });

        const emailExists = await checkEmailExists(email);

        if (emailExists) {
            return res.status(400).json({ errorMessage: "Email already exists" });
        }

        //encryption
        const salt = await bcrypt.genSalt();
        const passwordHash = await bcrypt.hash(password, salt);

        const newUser = new User({
            username: username,
            email: email,
            passwordHash: passwordHash,
            phoneNumber: phoneNumber
        });
        try {
            const savedUser = await User.putUser(email, username, phoneNumber, passwordHash);
            const token = jwt.sign({
                User: email
            }, process.env.JWT_SECRET);
            console.log(token);
            res.cookie("token", token, {
                httpOnly: true
            }).send();
        } catch (err) {
            console.error("Error saving user:", err);
            res.status(500).json({ errorMessage: "Error saving user" });
        }
    } catch (err) {
        console.error(err);
        res.status(500).send();
    }
});

authRouter.get("/login", async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password)
        return res.status(400).json({ errorMessage: "Please enter all details" });

    try {
        const user = await User.getUser(email);
        if (!user)
            return res.status(400).json({ errorMessage: "No account with this email" });
        const token = jwt.sign({
            User : user.email
        }, process.env.JWT_SECRET);
        return res.status(200).cookie(token).send("User fetched");
    } catch (error) {
        console.error("Error getting user:", error);
        res.status(500).json({ errorMessage: "Error getting user" });
    }
});


module.exports = authRouter;
