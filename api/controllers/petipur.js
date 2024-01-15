const Petipur = require('../models/petipur');
const Category = require('../models/category')
const User = require('../models/user')

module.exports = {
    getAll: (req, res) => {

        Petipur.find()
        .populate('category', { title: 1 })
            .then((petipurs) => {
                res.status(200).send(petipurs)
            })
            .catch((error) => {
                res.status(404).send({ error: error.message })
            })
    },

    getById: (req, res) => {
        Petipur.findById(req.params.id)
        .populate('category', { title: 1 })
            .then((category) => {
                res.status(200).send(category)
            })
            .catch((error) => {
                res.status(404).send({ error: error.message })
            })
    },

    getByCategoryId: (req, res) => {

        const categoryId = req.params.id

        Category.findById(categoryId)
            .then((category) => {
                if (!category) {
                    return res.status(404).send({ message: `Category not found!` })
                }

                //where 
                //סינון רשומות בהתאם לתנאים
                //find אפשר לקבל את התנאים גם בתוך ה

                //כל המאמרים השייכים לחקטגוריה המסוימת ויש להם תיאור
                // Article.find({ $and: [{ categoryId: { $eq: categoryId } }, { description: $exists }] })

                //$eq = equals
                Petipur.find().where({ category: { $eq: categoryId } })

                    //select
                    //דרכים לשליפה של שדות מסוימים
                    // .select('title description')
                    // .select({ title: 1, description: 1 })
                    //.select({ _id: 0, content: 0, categoryId: 0, __v: 0 })
                    .then((petipurs) => {
                        res.status(200).send(petipurs)
                    })
                    .catch((error) => {
                        res.status(404).send({ error: error.message })
                    })

            })
            .catch((error) => {
                res.status(500).send({ error: error.message })
            })
    },

   
    create: (req, res) => {
console.log("kkk")
        // console.log(req.file);

        //req.file מתוך ה path שליפת המאפיין
        //image שינוי שם המשתנה ל 
        //const { path: image } = req.file

        // const image = req.file.path

        const {
            name,
            price,
            category,
            imageUrl,
            amount
        } = req.body

        Category.findById(category)
            .then((category) => {
                if (!category) {
                    return res.status(404).send({ message: `Category not found!` })
                }
                console.log(name,price,category,imageUrl);
                const petipur = new Petipur({
                    name,
                    price,
                    category,
                    imageUrl,
                    amount
                    //image: image.replace('\\', '/'),
                })
                console.log(petipur,"llljjjjj");
                return petipur.save()
            })
           
                    .then(() => {
                        res.status(200).send(`Create petipur succeed`)
                    })
            
            .catch((error) => {
                res.status(500).send({ error: error.message })
            })
    },

    update: (req, res) => {
        // js - json
        // const child = { name: "aaa", age: 5 }
        // const name = child.name \ child['name']
        // const age = child.age
        // const { name, age } = child

        //react
        //const {a, b, c} = props

        const _id = req.params.id

        
                const { category } = req.body

                

                if (category) {
                    return Category.findById(category)
                        .then((category) => {
                            if (!category) {
                                return res.status(404).send({ message: `Category not found!` })
                            }
                            
                            return Petipur.findByIdAndUpdate(_id, req.body, { new: true })
                        })
                        .then((petipur) => {
                            res.status(200).send(petipur)
                        })
                        .catch((error) => {
                            res.status(500).send({ error: error.message })
                        })
                }

                Petipur.findByIdAndUpdate(_id, req.body, { new: true })
                    .then((petipur) => {
                        res.status(200).send(petipur)
                    })
                    .catch((error) => {
                        res.status(404).send({ error: error.message })
                    })
            
            .catch(error => {
                res.status(404).send({ error: error.message })
            })
    },

    remove: (req, res) => {
        Petipur.findById(req.params.id)
                        return Petipur.deleteOne()

            .then(() => {
                res.status(200).send({ message: `Delete petipur ${req.params.id} succeed` })
            })
            .catch((error) => {
                res.status(404).send({ error: error.message })
            })
    }
}
