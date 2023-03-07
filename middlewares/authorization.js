const { News, Bookmark } = require('../models')

const authorize = async (req, res, next) => {
    try {
        const {newsId} = req.params
        const news = await News.findByPk(newsId)
        if(!news){
            throw {name: 'InvalidNewsId'}
        }

        if(req.user.role === "Staff"){
            if(news.authorId !== req.user.id){
                throw {name: 'Forbidden'}
            }
        }

        next()
    } catch (err) {
        next(err)
    }
}

const authorizeForUpdateStatus = async (req, res, next) => {
    try {
        const {newsId} = req.params
        const news = await News.findByPk(newsId)
        if(!news){
            throw {name: 'InvalidNewsId'}
        }

        if(req.user.role === "Staff"){
            throw {name: 'Forbidden'}
        }

        next()
    } catch (err) {
        next(err)
    }
}

const authorDelForCust = async (req, rest, next) => {
    try {
        const bookmark = await Bookmark.findByPk(req.params.bookmarkId)
        if(!bookmark) throw {name: "InvalidBookmarkId"}

        if(bookmark.CustomerId !== req.customer.id) throw {name: "Forbidden"}

        next()
    } catch (err) {
        next(err)
    }
}

module.exports = { authorize, authorizeForUpdateStatus, authorDelForCust }