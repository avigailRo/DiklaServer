const Order = require('../models/order')
const Category = require('../models/category')
const User = require('../models/user')
const OrderItem = require('../models/user')

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
        Order.find({ user:req.params.id }).populate({ path: 'orderItem', select: 'title description content' })
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
        const userId=req.params.userId   
        User.findById(userId)
            .then((user) => {
                if (!user) {
                    return res.status(404).send({ message: `user not found!` })
                }

                const order = new Order({
                    user,
                    orderItem:[],
                    date:new Date(),
                    isPayment:false
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

    payment: (req, res) => {
        // js - json
        // const child = { name: "aaa", age: 5 }
        // const name = child.name \ child['name']
        // const age = child.age
        // const { name, age } = child

        //react
        //const {a, b, c} = props

        const orderId = req.params.id

        Order.findById(_id)
            .then(order => {
                if (order.userId._id != req.params.userId) {
                    return res.status(400).send({ message: 'Connot payment this order!' })
                }



                return Order.findOneAndUpdate(
                    { _id: orderId },
                    { $set: { isPayment: true } },
                    { new: true } // הפרמטר new מחזיר את הרשומה המעודכנת
                );
            })
            .then((order) => {
                res.status(200).send(order)
            })
            .catch((error) => {
                res.status(500).send({ error: error.message })
            })
    }

                
}
