const Category = require('../models/category')
const Petipor = require('../models/petipur')
const mongoose = require('mongoose')

module.exports = {
    getAll: (req, res) => {
        Category.find()
            .then((categories) => {
                res.status(200).send(categories)
            })
            .catch((error) => {
                res.status(404).send({ error: error.message })
            })
    },

    getById: (req, res) => {
        Category.findById(req.params.id)
            .then((category) => {
                res.status(200).send(category)
            })
            .catch((error) => {
                res.status(404).send({ error: error.message })
            })

    },

    create: (req, res) => {
        const {
            title,
            description,
            imageUrl
        } = req.body
        
        const category = new Category({ title, description,imageUrl })
        category.save()
            .then((category) => {
                res.status(200).send(`Create category ${category._id} succeed`)
            })
            .catch((error) => {
                res.status(404).send({ error: error.message })
            })

    },

    update: (req, res) => {
        const _id = req.params.id
        Category.findByIdAndUpdate(_id, req.body, { new: true })
            .then((category) => {
                res.status(200).send(category)
            })
            .catch((error) => {
                res.status(404).send({ error: error.message })
            })
    },

    remove: (req, res) => {
        const validCategoryId = mongoose.Types.ObjectId(req.params.id);

        Category.findById(validCategoryId)
            .then((category) => {
                if (!category) {
                    return res.status(404).send({ message: `Category not found!` })
                }
                console.log(category);
                Category.deleteMany({_id:validCategoryId})
                Petipor.deleteMany({ category:validCategoryId})
            })
            .then(() => {
                return  res.status(200).send(`Delete category ${req.params.id} succeed`)
            })
            .catch((error) => {
                res.status(404).send({ error: error.message })
            })
    }
}
