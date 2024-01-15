const Order = require('../models/order')
const Category = require('../models/category')
const User = require('../models/user')
const OrderItem = require('../models/user')
const Petipur = require('../models/petipur')
const mongoose = require('mongoose')
module.exports = {

    getById: (req, res) => {
        Order.findById(req.params.id)
            .populate('orderItem')
            .then((order) => {
                res.status(200).send(order)
            })
            .catch((error) => {
                res.status(404).send({ error: error.message })
            })
    },
    getByUserId: (req, res) => {
        Order.find({ user: req.params.userId }).populate({
            path: 'orderItem', populate: {
                path: 'petipur',
                model: 'Petipur'
            }, select: 'petipur user order count isPayment'
        })
            .then(user => {
                if (!user) {
                    return res.status(404).json({ message: `User not found!` })
                }
                res.status(200).send(user)
            })
            .catch(() => {
                res.status(404).json({ message: `User not found!` })
            })
    },

    create: (req, res) => {
        const userId = req.params.userId
        User.findById(userId)
            .then((user) => {
                if (!user) {
                    return res.status(404).send({ message: `user not found!` })
                }

                const order = new Order({
                    user,
                    orderItem: [],
                    date: new Date(),
                    isPayment: false
                })

                return order.save()
            })
            .then((order) => {
                User.findByIdAndUpdate({ _id: req.params.userId }, { $push: { orders: order._id } }, { new: true })
                    .then(() => {
                        res.status(200).send(`Create order succeed`)
                    })
            })
            .catch((error) => {
                res.status(500).send({ error: error.message })
            })
    },

    payment: async (req, res) => {
        const orderId = req.params.id;
        try {
            // מציאת ההזמנה וקבלת ה orderItems
            const order = await Order.findById(orderId).populate('orderItem');

            if (!order) {
                return res.status(404).send({ message: `'Order not found!'` })

            }

            // ללולאה על כל orderItem בהזמנה ועדכון ה-petipur המתאים
            for (const orderItem of order.orderItem) {
                const petipurId = orderItem.petipur;
                const count = orderItem.count;

                // מציאת ה-petipur ועדכון ה-amount
                const petipur = await Petipur.findById(petipurId._id);
                if (!petipur) {
                    return res.status(404).send({ message: 'Petipur not found!' })
                }
                if (petipur.amount < count)
                    return res.status(409).send({ message: 'Not enough petit fours !' })

                // עדכון ה-amount על פי ה-count ב-orderItem
                petipur.amount -= count;

                // שמירה שוב למסד הנתונים
                await petipur.save();
            }
            order.orderItem = [];
            await order.save().then(() => {
                res.status(200).send(`Payment completed successfully!`)
            })
        } catch (error) {
            res.status(500).send({ error: error.message })
        }
    },
    calculatePaymentAmount: async (req, res) => {
        const orderId = req.params.id;
        try {
            // מציאת ההזמנה וקבלת ה orderItems
            const order = await Order.findById(orderId).populate('orderItem');

            if (!order) {
                return res.status(404).send({ message: 'Order not found!' })
            }

            let totalPaymentAmount = 0;

            // ללולאה על כל orderItem בהזמנה וחישוב סכום התשלום לפי מחיר ה-petipur והכמות
            for (const orderItem of order.orderItem) {
                const petipurId = orderItem.petipur;
                const count = orderItem.count;

                // מציאת ה-petipur
                const petipur = await Petipur.findById(petipurId._id);
                if (!petipur) {
                    return res.status(404).send({ message: 'petipur not found!' })
                }
                console.log(petipur, "fsa");
                // חישוב סכום התשלום לפי מחיר ה-petipur והכמות
                const itemPaymentAmount = petipur.price * count;

                // חיבור לסכום הכללי
                totalPaymentAmount += itemPaymentAmount;
            }

            console.log('Total Payment Amount:', totalPaymentAmount);

            return res.status(200).send({ "totalPaymentAmount": totalPaymentAmount })

        } catch (error) {
            res.status(500).send({ error: error.message })
        }
    }

}
