#News Portal API Documentation

##Endpoints :

List of available endpoints:

1. `POST /register`
2. `POST /login`
3. `POST /google-sign-in`
4. `POST /categories`
5. `GET /categories`
6. `GET /categories/:categoryId`
7. `PUT /categories/:categoryId`
8. `DELETE /categories/:categoryId`
9. `POST /news`
10. `GET /news`
11. `GET /news/:newsId`
12. `PUT /news/:newsId`
13. `DELETE /news/:newsId`
14. `PATCH /news/:newsId`
15. `GET /histories`

16. `POST /pub/register`
17. `POST /pub/login`
18. `POST /pub/google-sign-in`
19. `GET /pub/news`
20. `GET /pub/news/:newsId`
21. `POST /pub/bookmarks/:newsId`
22. `GET /pub/bookmarks`
23. `DELETE /pub/bookmarks/:bookmarkId`

&nbsp;

## 1. POST /register

Request:

- body:

```json
{
  "username": "string",
  "email": "string",
  "password": "string",
  "phoneNumber": "string",
  "address": "string"
}
```

_Response (201 - Created)_

```json
{
  "id": "integer",
  "email": "string"
}
```

Response (400 - Bad Request)

```json
{
  "message": "Name is required"
}
OR
{
  "message": "Email is required"
}
OR
{
  "message": "Email address already in use!"
}
OR
{
  "message": "Invalid email format"
}
OR
{
  "message": "Password is required"
}
OR
{
  "message": "Password must contain at least 5 or more characters"
}
```

&nbsp;

## 2. POST /login

Request:

- body:

```json
{
  "email": "string",
  "password": "string"
}
```
_Response (200 - OK)_

```json
{
  "access_token": "string",
  "name": "string",
  "role": "string"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Email is required"
}
OR
{
  "message": "Password is required"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid email or password"
}
```

&nbsp;

## 3. POST /google-sign-in

Request:

- headers:

```json
{
  "google-oauth-token": "string"
}
```
_Response (200 - OK)_

```json
{
  "access_token": "string",
  "name": "string",
  "role": "string"
}
```

&nbsp;

## 4. POST /categories

Request:

- headers:

```json
{
  "access_token": "string"
}
```

- body:

```json
{
  "name": "string"
}
```

_Response (201 - Created)_

```json
{
  "id": "integer",
  "name": "string"
}
```

_Response (400 - Bad Request)_

```json
{
  "mesage": "Name is required"
}
```

&nbsp;

## 5. GET /categories

Description:

- Get all categories from database

Request:

- headers:

```json
{
  "access_token": "string"
}
```

_Response (200 - OK)_

```json
[
  {
	  "id": "integer",
	  "name": "string",
  },
  ...
]
```

&nbsp;

## 6. GET /categories/:categoryId

Description:

- Get categories by id

Request:

- headers:

```json
{
  "access_token": "string"
}
```

- params:

```json
{
  "id": "integer (required)"
}
```

_Response (200 - OK)_

```json
{
  "id": "integer",
  "name": "string"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Category not found"
}
```

&nbsp;

## 7. PUT /categories/:categoryId

Request:

- headers:

```json
{
  "access_token": "string"
}
```

- body:

```json
{
  "name": "string"
}
```

_Response (200 - OK)_

```json
{
  "message": "Category with id <id> succesfully updated"
}
```

_Response (400 - Bad Request)_

```json
{
  "mesage": "Name is required"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Category not found"
}
```

&nbsp;

## 8. DELETE /categories/:categoryId

Description:

- Delete categories by id

Request:

- headers:

```json
{
  "access_token": "string"
}
```

- params:

```json
{
  "id": "integer (required)"
}
```

_Response (200 - OK)_

```json
{
  "message": "Category with id <id> successfully deleted"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Category not found"
}
```

&nbsp;
 
## 9. POST /news

Request:

- headers:

```json
{
  "access_token": "string"
}
```

- body:

```json
{
  "title": "string",
  "content": "string",
  "imgUrl": "string",
  "categoryId": "integer",
}
```

_Response (201 - Created)_

```json
{
  "title": "string",
  "content": "string",
  "imgUrl": "string",
  "authorId": "integer",
  "categoryId": "integer",
  "updatedAt": "timestampz",
  "createdAt": "timestampz"
}
```

_Response (400 - Bad Request)_

```json
{
  "mesage": "Title is required"
}
OR
{
  "message": "Content is required"
}
OR
{
  "message": "Image URL is required"
}
OR
{
  "message": "categoryId is required"
}
```

&nbsp;

## 10. GET /news

Description:

- Get all news from database

Request:

- headers:

```json
{
  "access_token": "string"
}
```

_Response (200 - OK)_

```json
[
  {
	"title": "string",
	"content": "string",
	"imgUrl": "string",
	"authorId": "integer",
	"categoryId": "integer",
	"createdAt": "timestampz",
	"updatedAt": "timestampz",
	"Category": {
	  "name": "string"
	},
	"Author": {
	  "username": "string"
	}
  },
  ...
]
```

&nbsp;

## 11. GET /news/:newsId

Description:

- Get news by id

Request:

- headers:

```json
{
  "access_token": "string"
}
```

- params:

```json
{
  "id": "integer (required)"
}
```

_Response (200 - OK)_

```json
{
  "id": "integer",
  "title": "string",
  "content": "string",
  "imgUrl": "string",
  "authorId": "integer",
  "categoryId": "integer",
  "createdAt": "timestampz",
  "updatedAt": "timestampz",
  "Category": {
	"name": "string"
  },
  "Author": {
	"username": "string"
  }
}
```

_Response (404 - Not Found)_

```json
{
  "message": "News not found"
}
```

&nbsp;

## 12. PUT /news/:newsId

Request:

- headers:

```json
{
  "access_token": "string"
}
```

- params:

```json
{
  "id": "integer (required)"
}
```

- body:

```json
{
  "title": "string",
  "content": "string",
  "imgUrl": "string",
  "categoryId": "integer",
}
```

_Response (200 - OK)_

```json
{
  "message": "News with id <id> successfully updated"
}
```

_Response (400 - Bad Request)_

```json
{
  "mesage": "Title is required"
}
OR
{
  "message": "Content is required"
}
OR
{
  "message": "Image URL is required"
}
OR
{
  "message": "categoryId is required"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "News not found"
}
```

&nbsp;

## 13. DELETE /news/:newsId

Description:

- Delete news by id

Request:

- headers:

```json
{
  "access_token": "string"
}
```

- params:

```json
{
  "id": "integer (required)"
}
```

_Response (200 - OK)_

```json
{
  "message": "News with id <id> successfully deleted"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "News not found"
}
```

&nbsp;

## 14. PATCH /news/:newsId

Request:

- headers:

```json
{
  "access_token": "string"
}
```

- params:

```json
{
  "id": "integer (required)"
}
```

- body:

```json
{
  "status": "string",
}
```

_Response (200 - OK)_

```json
{
  "message": "News status with id <id> successfully updated"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "News not found"
}
```

&nbsp;

## 15. GET /histories

Description:

- Get all histories from database

Request:

- headers:

```json
{
  "access_token": "string"
}
```

_Response (200 - OK)_

```json
[
  {
    "id": "integer",
    "name": "string",
    "description": "string",
    "updatedBy": "string",
    "createdAt": "timestampz",
    "updatedAt": "timestampz"
  },
  ...
]
```

&nbsp;

## 16. POST /pub/register

Request:

- body:

```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

_Response (201 - Created)_

```json
{
  "id": "integer",
  "email": "string",
  "name": "string"
}
```

Response (400 - Bad Request)

```json
{
  "message": "Name is required"
}
OR
{
  "message": "Email is required"
}
OR
{
  "message": "Email address already in use!"
}
OR
{
  "message": "Invalid email format"
}
OR
{
  "message": "Password is required"
}
OR
{
  "message": "Password must contain at least 5 or more characters"
}
```

&nbsp;

## 17. POST /pub/login

Request:

- body:

```json
{
  "email": "string",
  "password": "string"
}
```
_Response (200 - OK)_

```json
{
  "access_token": "string",
  "name": "string"
}
```

_Response (400 - Bad Request)_

```json
{
  "message": "Email is required"
}
OR
{
  "message": "Password is required"
}
```

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid email or password"
}
```

&nbsp;

## 18. POST /pub/google-sign-in

Request:

- headers:

```json
{
  "google-oauth-token": "string"
}
```
_Response (200 - OK)_

```json
{
  "access_token": "string",
  "name": "string"
}
```

&nbsp;

## 19. GET /pub/news

Description:

- Get all news from database

Request:

- headers:

```json
{
  "access_token": "string"
}
```

_Response (200 - OK)_

```json
{
  "count": "integer",
  "rows": [
    {
        "id": "integer",
        "title": "string",
        "content": "string",
        "imgUrl": "string",
        "authorId": "integer",
        "categoryId": "integer",
        "status": "string",
        "createdAt": "timestampz",
        "updatedAt": "timestampz",
        "Category": {
            "name": "string"
        },
        "Author": {
            "username": "string"
        }
    },
    ...
  ]
}
```

&nbsp;

## 20. GET /pub/news/:newsId

Description:

- Get news by id

Request:

- headers:

```json
{
  "access_token": "string"
}
```

- params:

```json
{
  "id": "integer (required)"
}
```

_Response (200 - OK)_

```json
{
  "id": "integer",
  "title": "strting",
  "content": "strting",
  "imgUrl": "strting",
  "authorId": "integer",
  "categoryId": "integer",
  "status": "strting",
  "createdAt": "timestampz",
  "updatedAt": "timestampz",
  "Category": {
      "name": "strting"
  },
  "Author": {
      "username": "strting"
  },
  "QRCode": "strting"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "News not found"
}
```

&nbsp;

## 21. POST /pub/bookmarks/:newsId

Request:

- headers:

```json
{
  "access_token": "string"
}
```

- params:

```json
{
  "id": "integer (required)"
}
```

_Response (201 - Created)_

```json
{
  "id": "integer",
  "CustomerId": "string",
  "NewsId": "string"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "News not found"
}
```

&nbsp;

## 22. GET /pub/bookmarks

Description:

- Get all bookmarks from database

Request:

- headers:

```json
{
  "access_token": "string"
}
```

_Response (200 - OK)_

```json
[
  {
    "id": "integer",
    "CustomerId": "integer",
    "NewsId": "integer",
    "News": {
        "id": "integer",
        "title": "string",
        "content": "string",
        "imgUrl": "string",
        "authorId": "integer",
        "categoryId": "integer",
        "status": "string",
        "createdAt": "timestampz",
        "updatedAt": "timestampz",
        "Category": {
            "name": "string"
        },
        "Author": {
            "username": "string"
        }
    }
  },
  ...
]
```

&nbsp;

## 23. DELETE /pub/bookmarks/:bookmarkId

Description:

- Delete bookmark by id

Request:

- headers:

```json
{
  "access_token": "string"
}
```

- params:

```json
{
  "id": "integer (required)"
}
```

_Response (200 - OK)_

```json
{
  "message": "Bookmark successfully deleted"
}
```

_Response (404 - Not Found)_

```json
{
  "message": "Bookmark not found"
}
```

&nbsp;

## Global Error

_Response (401 - Unauthorized)_

```json
{
  "message": "Invalid token"
}
OR
{
  "message": "Invalid email or password"
}
```

_Response (403 - Forbidden)_

```json
{
  "message": "You are unauthorized"
}
```

_Response (404 - Data Not Found)_

```json
{
  "message": "News not found"
}
```

_Response (500 - Internal Server Error)_

```json
{
  "message": "Internal Server Error"
}
```