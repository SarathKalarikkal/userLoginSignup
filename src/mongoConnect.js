const mongoose = require('mongoose')


mongoose.connect(process.env.CONNECTION_STRING)
.then(()=>{console.log("mongodb connected");})
.catch((err)=>{console.log("Failed to connect", err);})

const loginScheme = new mongoose.Schema({
    name : {
        type : String,
        required : true
    },
    email : {
        type : String,
        required : true
    },
    password : {
        type : String,
        required : true
    }
})

const collection = mongoose.model("collection1", loginScheme) 

module.exports = collection