const mongoose = require('mongoose')

const categorySchema = mongoose.Schema({
    // _id: mongoose.Schema.Types.ObjectId,
    title: {
        type: String,
        require: true
    },
    description: {
        type: String,
        require: true
    },
    imageUrl: {
        type: String,
        require: true
    }
})

module.exports = mongoose.model('Category', categorySchema)