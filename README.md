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

- GET /api/v1/users/current-user

  `Return current user`

- PATCH /api/v1/users

  `Update current user information`

- DELETE /api/v1/users

  `Delete current user and deleted all videos and comments related to this user`

- PATCH /api/v1/users/change-password

  `Change password`

- PATCH /api/v1/users/subscribe/:id

  `Subscribe user`

- PATCH /api/v1/users/unsubscribe/:id

  `unSubscribe user`

<h1> Admin </h1>

- GET /api/v1/users

  `Return all users`

- GET /api/v1/users/:id

  `Return specific user by id`

- DELETE /api/v1/users/:id

  `Delete specific user by id`

- POST /api/v1/category

  `Create a new category`

- GET /api/v1/category/:id

  `Get a specific category`

- GET /api/v1/category

  `Get all categories`

- PATCH /api/v1/category/:id

  `Update specific category`

- DELETE /api/v1/category/:id

  `Delete a specific category`

<h1> Video </h1>

- POST /api/v1/video

  `Create a new video`

- GET /api/v1/video/:filename

  `Streaming video`

- GET /api/v1/video

  `Get a specific video with all comments and replies`

- GET /api/v1/video/all

  `Get all videos`

- PATCH /api/v1/video

  `Update specific video`

- DELETE /api/v1/video/:id

  `Delete a specific video`

- PATCH /api/v1/video/like/:id

  `like video`

- PATCH /api/v1/video/dislike/:id

  `dislike video`

- GET /api/v1/video/views/:id

  `Get views by location`

- GET /api/v1/video/random

  `Get random videos`

- GET /api/v1/video/trend

  `Get trend videos`

- GET /api/v1/video/tags

  `Get videos by tags`

- GET /api/v1/video/search

  `Search on videos by name`

<h1> Comment </h1>

- POST /api/v1/comment

  `Create a new comment on a specific video`

- GET /api/v1/comment

  `Get a specific comment`

- GET /api/v1/comment/:videoId

  `Get all comments on specific video`

- PATCH /api/v1/comment/:id

  `Update specific comment on specific video`

- DELETE /api/v1/comment/:id

  `Delete specific comment on specific video`

- PATCH /api/v1/comment/like/:id

  `like comment`

- PATCH /api/v1/comment/dislike/:id

  `dislike comment`

<h1> Reply </h1>

- POST /api/v1/reply

  `Create a new reply on a specific comment`

- GET /api/v1/reply/:commentId

  `Get all replies on specific comment`

- PATCH /api/v1/reply/:id

  `Update specific reply on specific comment`

- DELETE /api/v1/reply/:id

  `Delete specific reply on specific comment`

- PATCH /api/v1/reply/like/:id

  `like reply`

- PATCH /api/v1/reply/dislike/:id

  `dislike reply`

<h1> PlayList </h1>

- POST /api/v1/playlist

  `Create new playlist`

- POST /api/v1/playlist/:videoId

  `Add videos to playlist`

- PATCH /api/v1/playlist/:videoId

  `Remove video from playlist`

- PATCH /api/v1/playlist

  `Update playList name`

- DELETE /api/v1/playlist

  `Delete playList`
