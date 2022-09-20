# YouTube Clone

## Technology Used :

     MongoDB Database, Express, NodeJS.

## INSTRUCTIONS :

- <h2> To run this API :</h2>

  1. First clone the repository

  2. Install the node modules by the following command : `npm install`

  3. Change the values in the .env file to your preference.

  4. To run in development mode, type the following: `npm run start:dev`

# FEATURES

<h1> Backend API </h1>

<h1> Authentication </h1>

- POST /api/v1/auth/singup

  `Create new user with default role user`

- POST /api/v1/auth/login

  `User sign in with email and password`

- POST /api/v1/auth/logout

  `User sign out`

- POST /api/v1/auth/forgotPassword

  `forgot password`

- POST /api/v1/auth/verifyResetCode

  `verify reset code before reset password`

- PUT /api/v1/auth/resetPassword

  `reset password`

<h1> User </h1>

- GET /api/v1/users/cuurent-user

  `Return cuurent user`

- PATCH /api/v1/users

  `Update cuurent user information`

- DELETE /api/v1/users

  `Delete cuurent user`

- PATCH /api/v1/users/change-password

  `Change password`

<h1> Admin </h1>

- GET /api/v1/users

  `Return all users`

- GET /api/v1/users/:id

  `Return specific user by id`

- DELETE /api/v1/users/:id

  `Delete specific user by id`
