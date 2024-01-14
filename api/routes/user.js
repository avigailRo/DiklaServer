const express = require('express')
const router = express.Router()

const {
    login,
    register,
    getAll,
} = require('../controllers/user')
const { checkAuth } = require('../middlewares')

router.post('/register', register)
router.get('/login/:email/:password', login)
router.get('/', getAll)
module.exports = router