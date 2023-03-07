const request = require('supertest')
const app = require('../app')
const { User, Category, Customer, News, Bookmark } = require('../models')
const { encode } = require('../helpers/jwt')

let tokenCust;
let tokenEmployee;
let newsId;

beforeAll(async () => {
    const employee = await User.create({ 
        username: "Employee",
        email: "employee@mail.com",
        password: "employee",
        role: "Admin",
        phoneNumber: 888,
        address: "No where"
    })

    tokenEmployee = encode({id: employee.id, code: 1})

    const category = await Category.create({
        name: "Example Category"
    })

    const news = await News.create({
        title: "Example News", 
        content: "Sapien faucibus et molestie ac feugiat sed lectus.", 
        imgUrl: "https://cdn.pixabay.com/photo/2018/09/26/16/24/male-3704996__480.jpg",
        authorId: employee.id,
        categoryId: category.id,
    })

    newsId = news.id

    const customer = await Customer.create({
        username: "Customer",
        email: "customer@mail.com",
        password: "customer"
    })

    tokenCust = encode({id: customer.id})

    await Bookmark.create({
        CustomerId: customer.id,
        NewsId: news.id
    })
})

afterAll(async () => {
    await Bookmark.destroy({ truncate: true, cascade: true, restartIdentity: true })
    await Customer.destroy({ truncate: true, cascade: true, restartIdentity: true })
    await News.destroy({ truncate: true, cascade: true, restartIdentity: true })
    await Category.destroy({ truncate: true, cascade: true, restartIdentity: true })
    await User.destroy({ truncate: true, cascade: true, restartIdentity: true })
})

//Customer Register and Login
describe("API Customer", () => {
    describe("POST /pub/register", () => {
        test.only("Register success", async () => {
            const response = await request(app)
            .post("/pub/register")
            .send({
                username: "cust1",
                email: "cust1@mail.com",
                password: "cust1"
            })

            expect(response.status).toBe(201)
            expect(response.body).toHaveProperty("id", expect.any(Number))
            expect(response.body).toHaveProperty("email", expect.any(String))
            expect(response.body).toHaveProperty("name", expect.any(String))
        })

        test.only("Register failed because no username was included", async () => {
            const response = await request(app)
            .post("/pub/register")
            .send({
                email: "cust1@mail.com",
                password: "cust1"
            })

            expect(response.status).toBe(400)
            expect(response.body).toBe("Name is required")
        })

        test.only("Register failed because no email was included", async () => {
            const response = await request(app)
            .post("/pub/register")
            .send({
                username: "cust1",
                password: "cust1"
            })

            expect(response.status).toBe(400)
            expect(response.body).toBe("Email is required")
        })

        test.only("Register failed because email is empty string", async () => {
            const response = await request(app)
            .post("/pub/register")
            .send({
                username: "cust1",
                email: "",
                password: "cust1"
            })

            expect(response.status).toBe(400)
            expect(response.body).toBe("Email is required")
        })

        test.only("Register failed because invalid format email", async () => {
            const response = await request(app)
            .post("/pub/register")
            .send({
                username: "cust1",
                email: "cust1mailcom",
                password: "cust1"
            })

            expect(response.status).toBe(400)
            expect(response.body).toBe("Invalid format email")
        })

        test.only("Register failed because email already in use", async () => {
            const response = await request(app)
            .post("/pub/register")
            .send({
                username: "cust1",
                email: "cust1@mail.com",
                password: "cust1"
            })

            expect(response.status).toBe(400)
            expect(response.body).toBe("Email already in use!")
        })

        test.only("Register failed because no password was included", async () => {
            const response = await request(app)
            .post("/pub/register")
            .send({
                username: "cust1",
                email: "cust1@mail.com",
            })

            expect(response.status).toBe(400)
            expect(response.body).toBe("Password is required")
        })

        test.only("Register failed because password is empty string or less than 5 characters", async () => {
            const response = await request(app)
            .post("/pub/register")
            .send({
                username: "cust1",
                email: "cust1@mail.com",
                password: ""
            })

            expect(response.status).toBe(400)
            expect(response.body).toBe("Password must contain at least 5 or more characters")
        })
    })

    describe("POST /pub/login", () => {
        test.only("Login success", async () => {
            const response = await request(app)
            .post("/pub/login")
            .send({
                email: "cust1@mail.com",
                password: "cust1"
            })

            expect(response.status).toBe(200)
            expect(response.body).toHaveProperty("access_token", expect.any(String))
            expect(response.body).toHaveProperty("name", expect.any(String))
        })

        test.only("Login failed because email not registered", async () => {
            const response = await request(app)
            .post("/pub/login")
            .send({
                email: "wrong@mail.com",
                password: "cust1"
            })

            expect(response.status).toBe(401)
            expect(response.body).toBe("Invalid email or password")
        })

        test.only("Login failed because password is not match", async () => {
            const response = await request(app)
            .post("/pub/login")
            .send({
                email: "cust1@mail.com",
                password: "wrong"
            })

            expect(response.status).toBe(401)
            expect(response.body).toBe("Invalid email or password")
        })
    })
})

//News
describe("API News", () => {
    describe("GET /pub/news", () => {

        let title = "news" //editable
        let page = 1 //editable

        test.only("Get all news success without filter", async () => {
            const response = await request(app)
            .get("/pub/news")

            expect(response.status).toBe(200)
            expect(response.body).toBeInstanceOf(Object)
            expect(response.body).toHaveProperty("count", expect.any(Number))
            expect(response.body).toHaveProperty("rows", expect.any(Array))
            expect(response.body.rows[0]).toHaveProperty("id", expect.any(Number))
            expect(response.body.rows[0]).toHaveProperty("title", expect.any(String))
            expect(response.body.rows[0]).toHaveProperty("content", expect.any(String))
            expect(response.body.rows[0]).toHaveProperty("imgUrl", expect.any(String))
            expect(response.body.rows[0]).toHaveProperty("authorId", expect.any(Number))
            expect(response.body.rows[0]).toHaveProperty("categoryId", expect.any(Number))
            expect(response.body.rows[0]).toHaveProperty("status", expect.any(String))
            expect(response.body.rows[0]).toHaveProperty("createdAt", expect.any(String))
            expect(response.body.rows[0]).toHaveProperty("updatedAt", expect.any(String))
            expect(response.body.rows[0]).toHaveProperty("Category", expect.any(Object))
            expect(response.body.rows[0]).toHaveProperty("Author", expect.any(Object))
            expect(response.body.rows[0].Category).toHaveProperty("name", expect.any(String))
            expect(response.body.rows[0].Author).toHaveProperty("username", expect.any(String))
        })

        test.only("Get all news success with query 'title' filter", async () => {
            const response = await request(app)
            .get(`/pub/news?title=${title}`)

            expect(response.status).toBe(200)
            expect(response.body).toBeInstanceOf(Object)
            expect(response.body).toHaveProperty("count", expect.any(Number))
            expect(response.body).toHaveProperty("rows", expect.any(Array))
        })

        test.only("Get all news success with pagination", async () => {
            const response = await request(app)
            .get(`/pub/news?page=${page}`)

            expect(response.status).toBe(200)
            expect(response.body).toBeInstanceOf(Object)
            expect(response.body).toHaveProperty("count", expect.any(Number))
            expect(response.body).toHaveProperty("rows", expect.any(Array))
        })
    })

    describe("Get /pub/news/:newsId", () => {
        test.only("Get news by newsId success", async () => {
            const response = await request(app)
            .get(`/pub/news/${newsId}`)

            expect(response.status).toBe(200)
            expect(response.body).toBeInstanceOf(Object)
            expect(response.body).toHaveProperty("id", expect.any(Number))
            expect(response.body).toHaveProperty("title", expect.any(String))
            expect(response.body).toHaveProperty("content", expect.any(String))
            expect(response.body).toHaveProperty("imgUrl", expect.any(String))
            expect(response.body).toHaveProperty("authorId", expect.any(Number))
            expect(response.body).toHaveProperty("categoryId", expect.any(Number))
            expect(response.body).toHaveProperty("status", expect.any(String))
            expect(response.body).toHaveProperty("createdAt", expect.any(String))
            expect(response.body).toHaveProperty("updatedAt", expect.any(String))
            expect(response.body).toHaveProperty("Category", expect.any(Object))
            expect(response.body).toHaveProperty("Author", expect.any(Object))
            expect(response.body).toHaveProperty("QRCode", expect.any(String))
            expect(response.body.Category).toHaveProperty("name", expect.any(String))
            expect(response.body.Author).toHaveProperty("username", expect.any(String))
        })

        test.only("Get news by newsId failed because invalid newsId", async () => {
            let wrongId = 999999
            const response = await request(app)
            .get(`/pub/news/${wrongId}`)

            expect(response.status).toBe(404)
            expect(response.body).toBe("News not found")
        })
    })
})

//Bookmark
describe("API Bookmark", () => {
    describe("GET /pub/bookmarks", () => {
        test.only("Get list bookmark success", async () => {
            const response = await request(app)
            .get("/pub/bookmarks")
            .set("access_token", tokenCust)

            expect(response.status).toBe(200)
            expect(response.body).toBeInstanceOf(Array)
            expect(response.body.length).toBeGreaterThan(0);
        })

        test.only("Get list bookmark failed because no access_token was included", async () => {
            const response = await request(app)
            .get("/pub/bookmarks")
            // .set("access_token", tokenCust)

            expect(response.status).toBe(401)
            expect(response.body).toBe("Invalid token")
        })

        test.only("Get list bookmark failed because access_token was not recognized as 'Customer'", async () => {
            const response = await request(app)
            .get("/pub/bookmarks")
            .set("access_token", tokenEmployee)

            expect(response.status).toBe(403)
            expect(response.body).toBe("You are unauthorized")
        })
    })

    describe("POST /pub/bookmarks/:newsId", () => {
        test.only("Add list bookmark success", async () => {
            const response = await request(app)
            .post(`/pub/bookmarks/${newsId}`)
            .set("access_token", tokenCust)

            expect(response.status).toBe(201)
            expect(response.body).toHaveProperty("id", expect.any(Number))
            expect(response.body).toHaveProperty("CustomerId", expect.any(Number))
            expect(response.body).toHaveProperty("NewsId", expect.any(Number))
        })

        test.only("Add list bookmark failed because invalid newsId", async () => {
            let wrongId = 999999;
            const response = await request(app)
            .post(`/pub/bookmarks/${wrongId}`)
            .set("access_token", tokenCust)

            expect(response.status).toBe(404)
            expect(response.body).toBe("News not found")
        })
    })
})