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
app.use(function(req, res, next) {
  res.header('Access-Control-Allow-Origin', "*");
  res.header('Access-Control-Allow-Methods','GET,PUT,POST,DELETE');
  res.header('Access-Control-Allow-Headers', 'Content-Type,app-pass,x-auth');
  next();
})

app.use('/users', users)
app.use('/teachers', teachers)
app.use('/students', students)
app.use('/classes', classes)

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})

var http = require('http')
setInterval(() => {
  http.get('https://tokr-server-api.herokuapp.com/')
  http.get('https://tokr-webapp.herokuapp.com/')
}, 300000)

module.exports = {app}