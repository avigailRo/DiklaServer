const mongoose = require('mongoose');

const orderItemSchema = new mongoose.Schema({

    petipur: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Petipor',
        require: true
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        require: true
    },
    order: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Order',
        require: true
    },
    count:{
        type: Number,
        required: true,
    },
    isPayment: {
        type: Boolean,
        default: false,
      },
});

module.exports = mongoose.model('OrderItem', orderItemSchema);