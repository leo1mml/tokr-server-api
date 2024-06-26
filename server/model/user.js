var mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcrypt = require('bcryptjs')

const baseOptions = {
    discriminatorKey: 'kind',
    collection: 'users'
}

var UserSchema = new mongoose.Schema({
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
    profilePhotoUrl: {
        type: String
    },
    password: {
        type: String,
        minlength: 6,
        required: true
    },
    name: {
        type: String,
        minlength: 2,
        required: true
    },
    about: {
        type: String
    },
    createdAt: {
        type: Date,
        default: new Date()
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
    status: {
        type: String,
        default: "pendente"
    },
    passwordRecoverToken: String,
    passwordRecoverTokenExpireDate: Date
}, baseOptions)

UserSchema.methods.toJSON = function () {
    var user = this
    var userObject = user.toObject()

    return _.pick(userObject, 
        ['_id','email', 'about', 'profilePhotoUrl', 'status'])
}

UserSchema.methods.generateAuthToken = function () {
    var user = this
    var access = 'auth'
    var token = jwt.sign({_id: user._id.toHexString(), access}, process.env.JWT_SECRET).toString()

    user.tokens.push({access, token})

    return user.save().then(() => {
        return token
    })
}

UserSchema.methods.removeToken = function (token) { 
    var user = this
   return user.update({
        $pull: {
            tokens: {token}
        }
    })
}
UserSchema.statics.findByToken = function (token) {
    var User = this
    var decoded;

    try {
        decoded = jwt.verify(token, process.env.JWT_SECRET)
    }catch (e) {
        return Promise.reject()
    }

    return User.findOne({
        _id: decoded._id,
        'tokens.token': token,
        'tokens.access': 'auth'
    })

}

UserSchema.statics.findByRecoverToken = function(token) {
    var User = this
    return User.findOne({
        passwordRecoverToken: token,
        passwordRecoverTokenExpireDate: {
            $gt: Date.now()
        }
    })
}

UserSchema.statics.findByCredentials = function (email, password) {
    var User = this
    return User.findOne({email}).then((user) => {
        if(!user){
            return Promise.reject()
        }

        return new Promise((resolve, reject) => {
            bcrypt.compare(password, user.password, (err, res) => {
                if(res){
                    resolve(user)
                }else{
                    reject()
                }
            })
        })
    })
}

UserSchema.statics.findByEmail = function (email){
    var User = this
    return User.findOne({email}).then((user)=> {
        if(!user){
            return Promise.resolve(null)
        }else {
            return Promise.resolve(user)
        }
    })
}

UserSchema.pre('save', function (next){
    var user = this
    if(user.password){
        if(user.isModified('password')){
            bcrypt.genSalt(10, (err, salt) => {
                bcrypt.hash(user.password, salt, (err, hash) => {
                    user.password = hash
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

var User = mongoose.model('User', UserSchema)

module.exports = {
    User
}