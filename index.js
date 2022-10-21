require('dotenv').config();
var express = require("express");

const authRouter = require("./Router/auth.js");
const leaderRouter = require("./Router/leaderRouter")
var app = express();

app.use("/auth", authRouter);
app.use("/leader", leaderRouter)

app.get("/", function (req, res) {
    res.send("GET route on things !");
});

const PORT = process.env.PORT || 2727;

app.listen(PORT, () => {
    console.log(`server is listening  on ${PORT} \n`);
});