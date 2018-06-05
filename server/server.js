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
const admin = require('./routers/admin')
const publicPath = path.join(__dirname, '../public');

let port = process.env.PORT
let app = express()

 
app.use(bodyParser.json())
app.use(express.static(publicPath));

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin','*')
  res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization, app-pass, x-auth')
  if(req.method === 'OPTIONS'){
    res.header('Access-Control-Allow-Methods', 'PUT, POST, PATCH, GET, DELETE')
    return res.status(200).json({})
  } 
  next()
});


app.use('/users', users)
app.use('/teachers', teachers)
app.use('/students', students)
app.use('/classes', classes)
app.use('/admin', admin)

app.listen(port, () => {
    console.log(`Server is up on port ${port}`);
})

var http = require('http')
setInterval(() => {
  http.get('http://tokr-server-api.herokuapp.com/index.html')
}, 300000)

module.exports = {app}