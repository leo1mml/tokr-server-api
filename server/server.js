require('./config/config')
const _ = require('lodash')
const express = require('express')
const bodyParser = require('body-parser')
const path = require('path')
const {ObjectID} = require('mongodb')
var {mongoose} = require('./db/mongoose')
const users = require('./routers/users')
const teachers = require('./routers/teachers')
const students = require('./routers/students')
const classes = require('./routers/classes')

let port = process.env.PORT
let app = express()
 
app.use(bodyParser.json())
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type,app-pass,x-auth');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});

app.use('/users', users)
app.use('/teachers', teachers)
app.use('/students', students)
app.use('/classes', classes)

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})

var http = require('http')
setInterval(() => {
  http.get('tokr-server-api.herokuapp.com/')
  http.get('tokr-webapp.herokuapp.com/')
}, 300000)

module.exports = {app}