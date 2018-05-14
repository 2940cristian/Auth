const express = require('express');
const mongoose = require('mongoose');
const User = require("./Users/User");
const bcrypt = require('bcrypt')



mongoose.connect("mongodb://localhost/Auth")
.then(connected => {
    console.log('connected to db')
}).catch(err => {
    console.log('error connecting to db')
})


const server = express();

// function validatePassword(password)  {
//     let passHash;
//     bcrypt.hash(password, 15, (err, hash) => {
//         if(err) {
//             return false;
//         } else {
//             passHash = hash
//             console.log('validatingg', passHash)
//             return passHash;
//         }
//     })
// }



// bcrypt.compare(myPlaintextPassword, hash, function(err, res) {
//     // res == true
// });

function validate(password, passwordDB) {
    bcrypt.compare(password, passwordDB, function(err, res) {
        console.log(res)
    })
}



function seperateObject(info) {
    // let usernameKey = Object.keys(info, [0]);
    let usernameVal = Object.values(info, [0]);
    // usernameKey = usernameKey[0]
    usernameVal = usernameVal[0]
    // console.log(usernameKey, usernameVal);
    let obj = {
        username: usernameVal.toString()
    }
    // console.log('function test', obj)
    return obj;
}

server.use(express.json())

server.get("/", (req, res) => {
    res.send("CONNECTED TO POSTMAN")
})

server.post('/register', (req, res) => {
    const user = new User(req.body);

    user.save().then(user => {
        res.send(user)
    }).catch(err => {
        res.send("There was an error registering as a new user")
    })
})

server.post('/login', (req, res) => {
    const login = req.body;
    // console.log(login)
    
    User.findOne(seperateObject(login)).then(user => {
        // console.log(login.password)
        // console.log(user.password)

        validate(login.password, user.password)
        res.send(user)
    }).catch(err => {
        res.status(400).json({
            error: "Could not find that username"
        })
    })
})

server.listen(5000, () => console.log('API RUNNING ON PORT 5000'));

// { username: 'cookie' }