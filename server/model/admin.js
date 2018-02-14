var mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcrypt = require('bcryptjs')
const cpfValidator = require('../validators/cpfValidator')

var AdminSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        minlength: 1,
        unique: true,
        validate: {
            validator: (value) => {
                return validator.isEmail(value)
            }, 
            message:'{VALUE} is not a valid email'
        },
        isValid: {
            type: Boolean,
            default: false
        }
    },
    password: {
        type: String,
        minlength: 6
    },
    tokens: [{
        access: {
            type: String,
            required: true
        },
        token: {
            type: String,
            required: true
        }
    }],
    passwordRecoverToken: String,
    passwordRecoverTokenExpireDate: Date
})

AdminSchema.methods.toJSON = function () {
    var admin = this
    var adminObject = admin.toObject()

    return _.pick(adminObject, 
        ['_id','email'])
}

AdminSchema.methods.generateAuthToken = function () {
    var admin = this
    var access = 'auth'
    var token = jwt.sign({_id: admin._id.toHexString(), access}, process.env.JWT_SECRET).toString()

    admin.tokens.push({access, token})

    return admin.save().then(() => {
        return token
    })
}

AdminSchema.methods.removeToken = function (token) { 
    var admin = this
   return admin.update({
        $pull: {
            tokens: {token}
        }
    })
}
AdminSchema.statics.findByToken = function (token) {
    var Admin = this
    var decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    }catch (e) {
        return Promise.reject()
    }

    return Admin.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    })

}

AdminSchema.statics.findByRecoverToken = function(token) {
    var Admin = this
    return Admin.findOne({
        passwordRecoverToken: token,
        passwordRecoverTokenExpireDate: {
            $gt: Date.now()
        }
    })
}

AdminSchema.statics.findByCredentials = function (email, password) {
    var Admin = this
    return Admin.findOne({email}).then((admin) => {
        if(!admin){
            return Promise.reject()
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, admin.password, (err, res) => {
                if(res){
                    resolve(admin)
                }else{
                    reject()
                }
            })
        })
    })
}

AdminSchema.statics.findByEmail = function (email){
    var Admin = this
    return Admin.findOne({email}).then((admin)=> {
        if(!admin){
            return Promise.resolve(null)
        }else {
            return Promise.resolve(admin)
        }
    })
}

AdminSchema.pre('save', function (next){
    var admin = this
    if(admin.password){
        if(admin.isModified('password')){
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(admin.password, salt, (err, hash) => {
                    admin.password = hash
                    next()
                })
            })
        } else {
            next()
        }
    }else {
        next()
    }
})

var Admin = mongoose.model('Admin', AdminSchema)

module.exports = {
    Admin
}