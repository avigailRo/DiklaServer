const express = require('express')

const router = express.Router()

const { checkAuth, upload } = require('../middlewares')

const {
    getAll,
    getById,
    getByCategoryId,
    create,
    update,
    remove
} = require('../controllers/petipur')

// router.use('/', logUrl)

router.get('/', getAll)
router.get('/:id', getById)
router.get('/GetByCategoryId/:id', checkAuth, getByCategoryId)
//הוספנו אפשרות של העלאת תמונה ע"י הפעלת המידלוואר
//image הגדרנו אפשרות להעלות רק קובץ בודד שיכנס תחת הפרמטר 
router.post('/', checkAuth, create)
//upload.single('image'),
router.patch('/:id', checkAuth, update)
router.delete('/:id', checkAuth, remove)

module.exports = router