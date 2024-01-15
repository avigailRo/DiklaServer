const express = require('express')

const router = express.Router()

const { checkAuth, upload } = require('../middlewares')

const {
    getByUserId,
    create,
    payment,
    getById,
    calculatePaymentAmount    
} = require('../controllers/order')

router.get('/:id', checkAuth, getById)
router.get('/getByUserId/:userId', checkAuth, getByUserId)
router.get('/calculatePaymentAmount/:id/:userId', checkAuth, calculatePaymentAmount)

router.post('/:userId', checkAuth, create)
router.patch('/payment/:userId/:id', checkAuth, payment)
module.exports = router