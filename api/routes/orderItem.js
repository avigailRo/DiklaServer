const express = require('express')

const router = express.Router()

const { checkAuth, upload } = require('../middlewares')

const {
    remove,
    create,
    updateCount,
    
} = require('../controllers/orderItem')


router.post('/:userId', checkAuth, create)
router.patch('/updateCount/:userId/:id/:count', checkAuth, updateCount)
router.delete('/:userId/:id', checkAuth, remove)

module.exports = router