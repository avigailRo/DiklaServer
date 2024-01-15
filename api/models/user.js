const mongoose = require('mongoose')

const userSchema = new mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    username: {
        type: String,
        required: true,
      },
      userName: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        require: true,
        unique: true,
        match: /^[a-zA-Z0-9.!#$%&’*+/=?^_`{|}~-]+@[a-zA-Z0-9-]+(?:\.[a-zA-Z0-9-]+)*$/
    },
    password: {
        type: String,
        require: true
    },
    
})

module.exports = mongoose.model('User', userSchema)