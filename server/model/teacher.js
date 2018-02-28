const {User} = require('./user')
var mongoose = require('mongoose')
const cpfValidator = require('../validators/cpfValidator')
const validator = require('validator')
const _ = require('lodash')

const TeacherSchema = new mongoose.Schema({
    cpf: {
        type: String,
        required: true,
        unique: true
    },
    instruments: {
        type: [String],
        minlength: 1,
        required: true 
    },
    cellPhone: {
        type: String,
        required: true
    },
    address: {
        type: [String],
        required: true
    },
    operationalArea:{
        type: [String]
    }
})

TeacherSchema.methods.toJSON = function () {
    var user = this
    var userObject = user.toObject()

    return _.pick(userObject, 
        ['_id','name','email', 'cpf', 'instruments', 'profilePhotourl', 'cellPhone', 'address', 'operationalArea'])
}

TeacherSchema
  .path('cpf')
  .validate(function(cpf) {
    var i = 0; // index de iteracao
    var somatoria = 0;
    var cpf = cpf.toString().split("");
    var dv11 = cpf[cpf.length - 2]; // mais significativo
    var dv12 = cpf[cpf.length - 1]; // menos significativo
    cpf.splice(cpf.length - 2, 2); // remove os digitos verificadores originais
    for(i = 0; i < cpf.length; i++) {
      somatoria += cpf[i] * (10 - i);
    }
    var dv21 = (somatoria % 11 < 2) ? 0 : (11 - (somatoria % 11));
    cpf.push(dv21);
    somatoria = 0;
    for(i = 0; i < cpf.length; i++) {
      somatoria += cpf[i] * (11 - i);
    }
    var dv22 = (somatoria % 11 < 2) ? 0 : (11 - (somatoria % 11));

    if (dv11 == dv21 && dv12 == dv22) {
      return true
    } else {
      return false
    }
  }, '{PATH} falhou na validação.');


const Teacher = User.discriminator('Teacher', TeacherSchema)

module.exports = {
    Teacher
}