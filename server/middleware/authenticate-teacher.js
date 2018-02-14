var {Teacher} = require('./../model/teacher')

var authenticate = (req, res, next) => {
    var token = req.header('x-auth')
    
    Admin.findByToken(token).then((teacher) => {
        if(!teacher){
            return Promise.reject()
        }
        req.teacher = teacher
        req.token = token
        next()
    }).catch((e) => {
        res.status(401).send()
    })
}

module.exports = {authenticate}