# API PLANNING

- /test -> health check (D)

  - setup morgan
  - create responseHandler - errorResponse, successResponse
  - handle http errors
  - test from Postman

- /seed -> seeding some data (D)

  - crate dummy data
  - store in database

- /api/users

  - POST /register -> create the user account (D)
    - get multi-part form data from the request body using multer
    - input validation check -> presence, image size, user exist
    - password hashing with bcrypt
    - create a jwt for storing user data temporarily
    - send email with nodemailer (SMPTP gmail username, password)
  - POST /activate -> activate the user account (D)
    - get the jwt from request
    - check existance of jwt
    - verify the jwt & decode the data
    - create & save the new user
  - GET /profile -> get the user account (D)
    - get the id from request body
    - findById()
    - send response based on user found or not
    - handle the mongoose Cast error
  - DELETE /:id -> delete the user account (D)
    - get the id from request body
    - findById(id)
    - if found delete the image from the server folder
    - findByIdAndDelete(id)
    - clear the cookies
    - send response
  - PUT /:id -> update the user account (D)
    - get the data from request body and params
    - create filter, updates, options
    - check image exist -> image size -> change updates
    - findByIdAndUpdate(filter, updates, options)
    - if user was updated then send response
  - PUT /update-password/:id -> update the password
    - aa
  - POST /forget-password -> forget the password
  - PUT /reset-password -> reset the password
  - PUT /ban/:id -> ban the user
  - PUT /unban/:id -> unban the user
  - GET - Admin - /all-users -> get all users including search & pagination (D)
    - get data from request body
    - search users using regex
    - include pagination
    - send response

- /api/auth (JWT Auth)

  - POST /login -> isLoggedOut -> user login (D)
    - middlewares: validateUserLogin, runValidation using express-validator, isLoggedOut
    - extract request body
    - check user's existance
    - compare the password & return response
    - check user is banned & return response
    - create jwt token with an expiry time
    - create http only cookie with less time
  - POST /logout -> isLoggedIn -> user logout (D)
    - clear the cookie
    - send the response
  - GET /refresh -> get refresh token (D)
    - get old access token from cookie
    - verify old token
    - if verified - clear exisitng cookie, create refresh token (new token), cookie, return refresh token

- Middleware

  - isLoggedIn (D)
  - isLoggedOut
  - isAdmin
  - uploadFile
  - getRefreshToken
  - userValidation

- /api/blogs

  - POST / -> search the blog (Admin/User)
  - POST /search-blogs -> search the blog (Admin/User)
  - GET /:id -> get single blog
  - POST / -> create a blog (Admin)
  - DELETE /:id -> delete a blog (Admin)
  - PUT /:id -> update a blog (Admin)

- package that we will need
  `npm install express cors http-errors multer body-parser bcrypt jsonwebtoken nodemailer cookie-parser`
  `npm install --save-dev morgan nodemon`
