const express = require('express')
const bodyPasrer = require('body-parser')
const dotenv = require('dotenv')
const mongoose = require('mongoose')
const userRouter = require('./api/routes/user')
const categoryRouter = require('./api/routes/category')
const orderRouter = require('./api/routes/order')
const orderItemRouter = require('./api/routes/orderItem')
const petipurRouter = require('./api/routes/petipur')
const cors = require('cors');

const {logUrl,checkAuth } = require('./api/middlewares')

const app = express()

const port = 3000;

app.use(bodyPasrer.json())
dotenv.config()

app.use('/uploads', express.static('uploads'))

const connectionParams = {
    useNewUrlParser: true,
}

mongoose.connect(process.env.DB_CONNECTION, connectionParams)
    .then(() => {
        console.log('connect to mongoDB');
    })
    .catch((error) => {
        console.log(`error: ${error}`);
    })
    app.use(cors());

app.get('/', (req, res) => {
    res.status(200).send('Hello World!👍😃😍')
})

//middleware
//1. use
//2. מקבל פונקציה אנונימית שלשה ארגומנטים
//req, res, next
//next - הרשאה להמשיך בקריאה
app.use('/', (req, res, next) => {
    console.log('middleware')
    next()
})

app.use('/id', (req, res, next) => {
    if (req.body.id.length != 9) {
        res.send({ message: 'invalid id' })
    }
    next()
})

app.get('/id/get', (req, res) => {
    res.status(200).send({ id: req.body.id })
})

app.post('/id/post', (req, res) => {
    res.status(200).send({ id: req.body.id })
})

app.use('/users', userRouter)
app.use('/categories', categoryRouter)
app.use('/orders', orderRouter)
app.use('/orderItems', orderItemRouter)
app.use('/petipurs', petipurRouter)


app.listen(port, () => {
    console.log(`my app is listening on http://localhost:${port}`);
})