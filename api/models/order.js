const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  orderItem: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'OrderItem',
      required: true,
    },
  ],
  date: {
    type:  Date,
    default: Date.now,
  },
  isPayment: {
    type: Boolean,
    default: false,
  },

});

module.exports =mongoose.model('Order', orderSchema);

