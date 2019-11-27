var express = require("express");
var cors = require("cors");
var bodyParser = require("body-parser");
var app = express();
var port = process.env.PORT || 5000
var config = require("./config/config.js")

app.use(bodyParser.json())
app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))

var Users = require('./routes/Users')

app.use('/users', Users)

app.listen(port, () => {
    console.log("Server run on PORT: " + config.port)
})