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
const cors = require('cors')

let port = process.env.PORT
let app = express()

app.use(cors({
  exposedHeaders: ['Content-Length', 'app-pass', 'x-auth'],
  origin: '*'
}));

app.use(bodyParser.json())

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