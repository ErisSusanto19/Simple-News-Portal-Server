const router = require('express').Router()
const Controller = require('../controllers/employee')
const { auth } = require('../middlewares/authentication')
const { authorize, authorizeForUpdateStatus } = require('../middlewares/authorization')

router.post('/register', Controller.register)
router.post('/login', Controller.login)
router.post('/google-sign-in', Controller.loginByGoogle)

router.post('/categories', auth, Controller.addCategory)
router.get('/categories', auth, Controller.getAllCategories)
router.get('/categories/:categoryId', auth, Controller.getCategoryById)
router.put('/categories/:categoryId', auth, Controller.updateCategory)
router.delete('/categories/:categoryId', auth, Controller.deleteCategory)

router.post('/news', auth, Controller.addNews)
router.get('/news', auth, Controller.getAllNews)
router.get('/news/:newsId', auth, authorize, Controller.getNewsById)
router.put('/news/:newsId', auth, authorize, Controller.updateNews)
router.delete('/news/:newsId', auth, authorize, Controller.deleteNews)
router.patch('/news/:newsId', auth, authorizeForUpdateStatus, Controller.updateNewsStatus)

router.get('/histories', auth, Controller.getHistories)

module.exports = router