const errHandler = (err, req, res, next) => {
    let code = 500
    let message = 'Internal Server Error'

    if(err.name === "SequelizeValidationError"){
        code = 400
        message = err.errors[0].message
    } else if(err.name === "RequiredDataEmail"){
        code = 400
        message = "Email is required"
    } else if(err.name === "RequiredDataPassword"){
        code = 400
        message = "Password is required"
    } else if(err.name === "InvalidNewsId"){
        code = 404
        message = "News not found"
    } else if(err.name === "InvalidCategoryId"){
        code = 404
        message = "Category not found"
    } else if(err.name === "InvalidLogin"){
        code = 401
        message = "Invalid email or password"
    } else if(err.name === "InvalidToken" || err.name === 'JsonWebTokenError'){
        code = 401
        message = "Invalid token"
    } else if(err.name === "Forbidden"){
        code = 403
        message = "You are unauthorized"
    } else if(err.name === "InvalidBookmarkId"){
        code = 404
        message = "Bookmark not found"
    } else if(err.name === "DuplicatBookmark"){
        code = 400
        message = "This news have been bookmarked"
    }

    res.status(code).json(message)
}

module.exports = { errHandler }