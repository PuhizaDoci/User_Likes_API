# User Likes API
 
A back-end REST API developed in NodeJS using the ExpressJS framework. The API communicates and stores data in a MongoDB database using the Mongoose framework.
The application offers a registration, login and also offers the possibility that each user can like another or unlike that said user. 
For statistics use, you may also get the number of likes of a user or even all the likes of all the users.

As explained this API contains 8 endpoints: 

/signup - Sign up to the system (username, password)
/login - Logs in an existing user with a password
/me - Get the currently logged in user information
/me/update-password - Update the current users password
/user/:id/ - List username & number of likes of a user
/user/:id/like - Like a user
/user/:id/unlike - Un-Like a user
/most-liked - List users in a most liked to least liked

-Endpoints that provide sensitive informations require authentication.

#### Start the application by executing 'npm run start'.

## Why MongoDB
For the development of this API, MongoDB was chosen for storing data.
That is because MongoDBs documents map naturally to modern, object-oriented programming languages, therefore development is simplified. In comparison queries in SQL can also be much slower because for a single data or object they might require joins to take place, which could be very expensive with large data in DBs. Also MongoDB schemas are fully flexible (they do not require a skeleton structure).
