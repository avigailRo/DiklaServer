const Order = require('../models/order')
const Category = require('../models/category')
const User = require('../models/user')
const OrderItem = require('../models/orderItem')
const Petipur = require('../models/petipur')
const mongoose = require('mongoose')

module.exports = {
    create: async (req, res) => {
        const {
            user,
            petipur,
            count,
        } = req.body
        const validUserId = mongoose.Types.ObjectId(user);
        const userf = await User.findById(validUserId);

        if (!user) {
            return res.status(404).send({ message: `User not found!` });
        }
        console.log(user);
        const validPetipurId = mongoose.Types.ObjectId(petipur);
        const petipurf = await Petipur.findById(validPetipurId)
        if (!petipur) {
            return res.status(404).send({ message: `Petipur not found!` })
        }
        let order = null;
        const orders = await Order.find({ user: validUserId });
        if (orders.length > 0) {
            order = orders[0];
        } else {
            console.log('No orders found for the user.');
        }

        console.log(petipur, user, order, count, "ggg");
        const orderItem = new OrderItem({
            petipur,
            user,
            order,
            count,
            isPayment: false
        })
        return orderItem.save().then(async () => {
            await order.orderItem.push(orderItem);
            await order.save().then(() => {
                res.status(200).send(`Create order succeed`)
            })
        })


            .catch((error) => {
                res.status(500).send({ error: error.message })
            })
    },

    updateCount: async (req, res) => {
        console.log("hhh");
        const orderItemId = req.params.id
        const count = req.params.count
        const updatedOrderItem = await OrderItem.findOneAndUpdate(
            { _id: orderItemId },
            { $set: { count: count } },
            { new: true }
        ).then((orderItem) => {
            if (!orderItem) {
                return res.status(404).send({ message: `orderItem not found!` })
            }
        })
            .then(() => {
                res.status(200).send(`Create order succeed`)
            })

            .catch((error) => {
                res.status(500).send({ error: error.message })
            })
    },

    remove: async (req, res) => {
        const orderItemId = req.params.id
        const validOrderItemId = mongoose.Types.ObjectId(orderItemId);
        const orderItem = await OrderItem.findById(validOrderItemId).then((orderItem) => {
            if (!orderItem) {
                console.log("jhh");
                return res.status(404).send({ message: `orderItem not found!` })
            }
        })
        // Step 2: Find the Order by the orderItem's order field
        const order = await Order.findById(orderItem.order).then((order) => {
            if (!order) {
                return res.status(404).send({ message: `order not found!` })
            }
        })
        console.log(order, "mmm");
        // Step 3: Remove the OrderItem from the orderItems array
        order.orderItems.pull(orderItem);

        // Step 4: Save the updated Order
        await order.save();

        // Step 5: Delete the OrderItem
        await orderItem.remove().then(() => {
            res.status(200).send(`Create order succeed`)
        })

            .catch((error) => {
                res.status(500).send({ error: error.message })
            })
    }
}
