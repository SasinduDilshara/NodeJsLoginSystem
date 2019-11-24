const express = require("express")
const users = express.Router()
const cors = require("cors")
const jwt = require('jsonwebtoken')
const bcrypt = require("bcrypt-nodejs")
var config = require("../config/config.js")

const User = require("../models/User")
users.use(cors())

process.env.SECRETKEY = config.SECRETKEY


users.post("/register", (req, res) => {

    const today = new Date()
    const userdata = {
        first_name: req.body.first_name,
        last_name: req.body.last_name,
        email: req.body.email,
        password: req.body.password,
        created: today,
    }

    User.findOne({
        where: {
            email: req.body.email
        }
        /*
                     bcrypt.genSalt(10, (err, salt) => {
          if (err) { return callback(err); }
        
          // Hash (encrypt) our password using the salt
          return bcrypt.hash(password, salt, null, (err2, hash) => {
           if (err2) { return callback(err2); }
           return callback(null, hash);
          });
         });
         */
    }).then(user => {
        if (!user) {
            bcrypt.hash(req.body.password, null, null, (err, hash) => {
                userdata.password = hash
                console.log(userdata)
                User.create(userdata)
                    .then(user => {
                        res.json({ status: user.email + " has registered" })
                    })
                    .catch(err => {
                        res.send("Error " + err)
                    })
                // }
            })
        }
        else {
            res.json({ error: "Email already exists" })
        }
    })
        .catch(err => {
            res.send("Error " + err)
        })

})

users.post("/login", (req, res) => {
    User.findOne({
        where: {
            email: req.body.email
        }
    })
        .then(user => {
            if (user) {
                
                if (bcrypt.compareSync(req.body.password, user.password)) {
                    let token = jwt.sign(user.dataValues, process.env.SECRETKEY, {
                        expiresIn: 1440
                    })
                    res.send(token)
                }
                else {
                    res.status(400).json({ error: "Password is incorrect" })
                }
            }
            else {
                res.status(400).json({ error: "User doesn't exist" })
            }
        }).catch(err => {
            res.status(400).json({ error: err })
        })
})

module.exports = users