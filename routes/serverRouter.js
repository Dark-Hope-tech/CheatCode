const serverRouter = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const dotenv = require("dotenv").config();
const validator = require('validator');
const User = require("../models/userModel");
const docClient = require("../sevices/authentication");


module.exports = serverRouter;