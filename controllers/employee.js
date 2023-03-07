const { User, Category, News, History } = require('../models')
const { comparePwd } = require('../helpers/bcrypt')
const { encode } = require('../helpers/jwt')
const CLIENT_ID = process.env.CLIENT_ID
const {OAuth2Client} = require('google-auth-library');
const client = new OAuth2Client(CLIENT_ID);

class Controller{

    //User Handler
    static async register(req, res, next){
        try {
            const {username, email, password, phoneNumber, address} = req.body
            const newUser = await User.create({username, email, password, role: 'Admin', phoneNumber, address})

            res.status(201).json({id: newUser.id, email: newUser.email})
        } catch (err) {
            next(err)
        }
    }

    static async login(req, res, next){
        try {
            const {email, password} = req.body
            if(!email) throw{ name: "RequiredDataEmail"}
            if(!password) throw{ name: "RequiredDataPassword"}
            
            const user = await User.findOne({where: {email}})
            if(!user){
                throw {name: "InvalidLogin"}
            }

            const validPwd = comparePwd(password, user.password)
            if(!validPwd){
                throw {name: "InvalidLogin"}
            }

            res.status(200).json({
                access_token: encode({id: user.id, code: 1}),
                name: user.username,
                role: user.role
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

            const [user, created] = await User.findOrCreate({
                where: {email},
                defaults: {
                    username: name,
                    email,
                    password: "oauth-google",
                    role: "Staff",
                    phoneNumber: 9000,
                    address: "News Portal Office"
                },
                hooks: false
            })

            res.status(200).json({
                access_token: encode({id: user.id, code: 1}),
                name: user.username,
                role: user.role
            })
        } catch (err) {
            next(err)
        }
    }

    //Category Handler
    static async addCategory(req, res, next){
        try {
            const {name} = req.body
            const newCategory = await Category.create({name})

            res.status(201).json({id: newCategory.id, name: newCategory.name})
        } catch (err) {
            next(err)
        }
    }

    static async getAllCategories(req, res, next){
        try {
            const categories = await Category.findAll({
                attributes: ['id', 'name'],
                order: [['id', 'ASC']]
            })

            res.status(200).json(categories)
        } catch (err) {
            next(err)
        }
    }

    static async getCategoryById(req, res, next){
        try {
            const {categoryId} = req.params
            const category = await Category.findByPk(categoryId, {
                attributes: ['id', 'name']
            })
            if(!category){
                throw {name: "InvalidCategoryId"}
            }

            res.status(200).json(category)
        } catch (err) {
            next(err)
        }
    }

    static async updateCategory(req, res, next){
        try {
            const {categoryId} = req.params
            const category = await Category.findByPk(categoryId)
            if(!category){
                throw {name: "InvalidCategoryId"}
            }

            const {name} = req.body
            await Category.update({name}, {where: {id: categoryId}})

            res.status(200).json({message: `Category with id ${categoryId} succesfully updated`})
        } catch (err) {
            next(err)
        }
    }

    static async deleteCategory(req, res, next){
        try {
            const {categoryId} = req.params
            const category = await Category.findByPk(categoryId)
            if(!category){
                throw {name: "InvalidCategoryId"}
            }

            await Category.destroy({where: {id: categoryId}})

            res.status(200).json({message: `Category with id ${categoryId} succesfully deleted`})
        } catch (err) {
            next(err)
        }
    }

    //News Handler
    static async addNews(req, res, next){
        try {
            const {title, content, imgUrl, categoryId} = req.body
            const newNews = await News.create({
                title, 
                content, 
                imgUrl, 
                authorId: req.user.id, 
                categoryId
            })

            await History.create({
                name: newNews.title,
                description: `New post with id ${newNews.id} created`,
                updatedBy: req.user.email
            })

            res.status(201).json(newNews)
        } catch (err) {
            next(err)
        }
    }

    static async getAllNews(req, res, next){
        try {
            const news = await News.findAll({
                include: [
                    {model: Category, attributes: ['name']},
                    {model: User, attributes: ['username'], as: 'Author'}
                ],
                order: [['createdAt', 'ASC']]
            })

            res.status(200).json(news)
        } catch (err) {
            next(err)
        }
    }

    static async getNewsById(req, res, next){
        try {
            const {newsId} = req.params
            const news = await News.findByPk(newsId, {
                include: [
                    {model: Category, attributes: ['name']},
                    {model: User, attributes: ['username'], as: 'Author'}
                ]
            })
            if(!news){
                throw {name: 'InvalidNewsId'}
            }

            res.status(200).json(news)
        } catch (err) {
            next(err)
        }
    }

    static async updateNews(req, res, next){
        try {
            const {newsId} = req.params
            const {title, content, imgUrl, categoryId} = req.body
            await News.update({title, content, imgUrl, categoryId}, {where: {id: newsId}})

            const news = await News.findByPk(newsId)

            await History.create({
                name: news.title,
                description: `News with id ${news.id} updated`,
                updatedBy: req.user.email
            })

            res.status(200).json({message: `News with id ${newsId} succesfully updated`})
        } catch (err) {
            next(err)
        }
    }

    static async deleteNews(req, res, next){
        try {
            const {newsId} = req.params

            await News.destroy({where: {id: newsId}})

            res.status(200).json({message: `News with id ${newsId} succesfully deleted`})
        } catch (err) {
            next(err)
        }
    }

    static async updateNewsStatus(req, res, next){
        try {
            const {newsId} = req.params
            const oldNews = await News.findByPk(newsId)

            const {status} = req.body
            await News.update({status}, {where: {id: newsId}})

            const newNews = await News.findByPk(newsId)

            await History.create({
                name: newNews.title,
                description: `News status with id ${newNews.id} has been updated from ${oldNews.status} into ${newNews.status}`,
                updatedBy: req.user.email
            })

            res.status(200).json({message: `News status with id ${newNews.id} succesfully updated`})
        } catch (err) {
            next(err)
        }
    }

    static async getHistories(req, res, next){
        try {
            const dateFormat = (value) => {
                return new Date(value).toLocaleString('id-ID', {
                    dateStyle: 'medium', 
                    timeStyle: 'long', 
                    hour12: false 
                })
            }
            let histories = await History.findAll({
                 order: [['id', 'DESC']]
                })
          
            histories.map(el => {
                el.dataValues.createdAt = dateFormat(el.createdAt)
                return el
            })
            
            res.status(200).json(histories)
        } catch (err) {
            next(err)
        }
    }
}

module.exports = Controller