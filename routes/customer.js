const router = require('express').Router()
const Controller = require('../controllers/customer')
const { authCust } = require('../middlewares/authentication')
const { authorDelForCust } = require('../middlewares/authorization')

router.post('/pub/register', Controller.register)
router.post('/pub/login', Controller.login)
router.post('/pub/google-sign-in', Controller.loginByGoogle)

router.get('/pub/news', Controller.showNews)
router.get('/pub/news/:newsId', Controller.showNewsById)

router.post('/pub/bookmarks/:newsId', authCust, Controller.addBookmark)
router.get('/pub/bookmarks', authCust, Controller.getAllBookmarks)
router.delete('/pub/bookmarks/:bookmarkId', authCust, authorDelForCust, Controller.deleteBookmark)

module.exports = router