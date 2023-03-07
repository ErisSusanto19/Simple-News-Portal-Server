const { Customer, News, Bookmark, User, Category } = require('../models')
const { comparePwd } = require('../helpers/bcrypt')
const { encode } = require('../helpers/jwt')
const CLIENT_ID = process.env.CLIENT_ID
const {OAuth2Client, UserRefreshClient} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);
const { Op } = require('sequelize')
const axios = require('axios')
const HAPPIDEV_QRCODE = process.env.HAPPIDEV_QRCODE

class Controller {

    //Customer Handler
    static async register(req, res, next){
        try {
            const {username, email, password} = req.body
            const newCustomer = await Customer.create({username, email, password})

            res.status(201).json({id: newCustomer.id, email: newCustomer.email, name: newCustomer.username})
        } catch (err) {
            next(err)
        }
    }

    static async login(req, res, next){
        try {
            const {email, password} = req.body
            if(!email) throw{ name: "RequiredDataEmail"}
            if(!password) throw{ name: "RequiredDataPassword"}

            const customer = await Customer.findOne({where: {email}})
            if(!customer) throw {name: "InvalidLogin"}

            const validPwd = comparePwd(password, customer.password)
            if(!validPwd) throw {name: "InvalidLogin"}

            res.status(200).json({
                access_token: encode({id: customer.id}),
                name: customer.username
            })
        } catch (err) {
            next(err)
        }
    }

    static async loginByGoogle(req, res, next){
        try {
            const token = req.headers["google-oauth-token"]
           
            const ticket = await client.verifyIdToken({
                idToken: token,
                audience: CLIENT_ID
            });
            const {name, email} = ticket.getPayload();

            const [customer, created] = await Customer.findOrCreate({
                where: {email},
                defaults: {
                    username: name,
                    email,
                    password: "oauth-google"
                },
                hooks: false
            })

            res.status(200).json({
                access_token: encode({id: customer.id}),
                name: customer.username
            })
        } catch (err) {
            next(err)
        }
    }

    //News Handler
    static async showNews(req, res, next){
        try {
            const format = {
                include: [
                    {model: Category, attributes: ['name']},
                    {model: User, attributes: ['username'], as: 'Author'}
                ],
                where: {
                    [Op.or]: [{status: 'Active'}, {status: 'Inactive'}] 
                },
                order: [['createdAt', 'DESC']],
                limit: 9,
                offset: 0
            }

            const {filter, title, page } = req.query

            if(page){
                format.offset = page * 9 - 9
            }

            if(title){
                format.where = {
                    title: {
                        [Op.iLike]: `%${title}%`
                    }
                }
            }

            if (filter !== '' && typeof filter !== 'undefined') {
                const query = filter.category.split(',').map((item) => ({
                  [Op.eq]: item,
                }));
            
                format.where = {
                  categoryId: { [Op.or]: query },
                };
              }

            const news = await News.findAndCountAll(format)

            res.status(200).json(news)
        } catch (err) {
            next(err)
        }
    }

    static async showNewsById(req, res, next){
        try {
            const { newsId } = req.params
            const news = await News.findByPk(newsId, {
                include: [
                    {model: Category, attributes: ['name']},
                    {model: User, attributes: ['username'], as: 'Author'}
                ],
            })
            if(!news) throw {name: 'InvalidNewsId'}

            let url = "dummy"
            if(req.headers.sharepath){
                url = req.headers.sharepath
            }

            const { data } = await axios({
                method: "GET",
                url: "https://api.happi.dev/v1/qrcode",
                headers: {
                    "x-happi-key": HAPPIDEV_QRCODE,
                    "Accept-encoding": "application/json"
                },
                params: {
                    // data: "ok"
                    data: url
                }
            })

            news.dataValues.QRCode = data.qrcode
            
            res.status(200).json(news)
        } catch (err) {
            next(err)
        }
    }

    //Bookmark Handler
    static async addBookmark(req, res, next){
        try {
            const news = await News.findByPk(req.params.newsId)
            if(!news) throw {name: 'InvalidNewsId'}

            if(news.status === 'Archive') throw {name: 'InvalidNewsId'}

            const bookmark = await Bookmark.findAll({
                where: {
                    [Op.and]: [{ CustomerId: req.customer.id }, { NewsId: req.params.newsId }]
                }
            })
            
            if(bookmark.length != 0) throw {name: "DuplicatBookmark"}

            const newBookmark = await Bookmark.create({CustomerId: req.customer.id, NewsId: req.params.newsId})

            res.status(201).json({id: newBookmark.id, CustomerId: newBookmark.CustomerId, NewsId: newBookmark.NewsId})
        } catch (err) {
            next(err)
        }
    }

    static async getAllBookmarks(req, res, next){
        try {
            const bookmark = await Bookmark.findAll({
                where: {CustomerId: req.customer.id},
                attributes: {exclude: ['createdAt', 'updatedAt']},
                include: {
                    model: News, 
                    include: [
                        {model: Category, attributes: ['name']},
                        {model: User, attributes: ['username'], as: 'Author'}
                    ]
                }
            })

            res.status(200).json(bookmark)
        } catch (err) {
            next(err)
        }
    }

    static async deleteBookmark(req, res, next){
        try {
            await Bookmark.destroy({where: {id: req.params.bookmarkId}})

            res.status(200).json({message: `Bookmark successfully deleted`})
        } catch (err) {
            next(err)
        }
    }
}

module.exports = Controller