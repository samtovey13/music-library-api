# Music Library API

*Artists have Albums, Albums have Songs.*

This was a project to learn how to build a music library API. It stores information about artists, albums and songs, and implements a CRUD REST API to interact with the database.

This is an Express app based on a MySQL database, using Sequelize ORM.


# Routes Available

Artist routes
- POST /artists
- GET /artists
- GET /artists/:id
- PATCH /artists/:id
- DELETE /artists/:id

Album routes
- POST /artists/:artistId/albums
- GET /albums
- GET /albums/:albumId
- PATCH /albums/:albumId
- DELETE /albums/:albumId

Song routes
- POST /albums/:albumId/songs
- GET /songs
- GET /songs/:songId
- PATCH /songs/:songId
- DELETE /songs/:songId


# Setup


### Install Docker

Install docker [here](https://docs.docker.com/get-docker/).

Once you have docker installed, you can pull and run a MySQL image using:

```
docker run -d -p 3307:3306 --name music_library_mysql -e MYSQL_ROOT_PASSWORD=<PASSWORD> mysql
```
(make sure to replace **\<PASSWORD\>** with a password of your choosing.)


### Install MySQL Workbench

Install MySQL workbench [here](https://dev.mysql.com/downloads/workbench/).


### Connect to your MySQL container

Open up mysql-workbench and connect to your MySQL container. The connection parameters should be:
```
host: 127.0.0.1
port: 3307
password: whatever you set it to when you ran the container
```
If you are able to connect and run queries, then you're ready to move on.

### Install Postman

Install Postman [here](https://www.postman.com/downloads/)

### Set up your local repo

Clone this git repo to your machine.
Initialise a new NPM project in the project directory with `npm init`.
Install express as a dependency: `npm i -S express`
Install `dotenv` and `nodemon` as development dependencies
Install Sequelize with `npm i -S sequelize`
Install the mysql2 package with `npm i -S mysql2`
Install mocha, chai, and supertest as dev dependencies `npm i -D mocha chai supertest`


Create a **.env** file with the following variables, and check that .env is listed on your **.gitignore** file:
```
DB_PASSWORD=<YOUR_PASSWORD>
DB_NAME=<YOUR_APP_NAME>
DB_USER=root
DB_HOST=localhost
DB_PORT=3307
```
Add a **.env.test** with the same environment variables as your .env. Make sure to give your test database a different name. Having this file will allow you to run tests in a different database which will be wiped after each test run. Check that this file is also listed on your **.gitignore.**


Test your app. Run `npm start`. You should see that the app is listening to port 4000 in your terminal.

Open Postman and send a GET request to `localhost:400/`. If you get a `Hello World` response, then you know that your app is working!

You should also see your new database in MySQL Workbench.


## Running tests

This app uses **supertest** and **chai**.
Check the test suites are working by running `npm test`.


