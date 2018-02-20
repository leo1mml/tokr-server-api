const {User} = require('./user')
var mongoose = require('mongoose')
const cpfValidator = require('../validators/cpfValidator')
const validator = require('validator')
const _ = require('lodash')

const StudentSchema = mongoose.Schema({
    cpf: {
        type: String,
        validate: {
            validator: (value) => {
                return cpfValidator.isCPF(value)
            }
        },
        required: true
    },
    birthDate: {
        type: Date,
        required: true
    },
    sex: {
        type: Number,
        required: true
    },
    address: {
        type: [String],
        required: true
    },
    cellPhone: {
        type: String,
        required: true
    },
    instruments: {
        type: [String]
    },
    musicStyles: {
        type: [String]
    }
})

StudentSchema.methods.toJSON = function () {
    var user = this
    var userObject = user.toObject()

    return _.pick(userObject, 
        ['_id','email','name', 'cpf','birthDate', 'sex', 'instruments', 'cellPhone', 'address', 'musicStyles'])
}



const Student = User.discriminator('Student', StudentSchema)

module.exports = {
    Student
}
