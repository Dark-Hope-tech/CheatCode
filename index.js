const express = require("express");
const app = express();
const dotenv = require("dotenv").config();
const cookieParser = require("cookie-parser");
const cors = require("cors");
const port = 8000;
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: ["http://localhost:8000"],
    credentials: true
}));

app.listen(port, () => console.log('Server started on port:'+ port));
app.get("/sample", (req, res) => {
    res.send("Hello World");
});