const express = require('express')

const router = express.Router()
const { checkAuth, upload } = require('../middlewares')

const {
    getAll,
    getById,
    create,
    update,
    remove
} = require('../controllers/category');

const { logUrl } = require('../middlewares');

router.use('/', (req, res, next) => {
    console.log('categories router');
    next()
})

router.get('/', getAll)
router.get('/:id', getById)

// router.use('/', logUrl)

router.post('/:userId', checkAuth,create)
router.patch('/:userId/:id', checkAuth,update)
router.delete('/:userId/:id', checkAuth,remove)

module.exports = router