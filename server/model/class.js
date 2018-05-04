var mongoose = require('mongoose')
const validator = require('validator')
const jwt = require('jsonwebtoken')
const _ = require('lodash')
const bcrypt = require('bcryptjs')
const cpfValidator = require('../validators/cpfValidator')

var ClassSchema = new mongoose.Schema({
    date: {
        type: Date,
        required: true
    },
    teacherGrade: {
        type: Number,
        min: 0,
        max: 5
    },
    studentGrade: {
        type: Number,
        min: 0,
        max: 5
    },
    instrument: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    studentNote: {
        type: String
    },
    teacherNote: {
        type: String
    },
    _studentId:{
        type: mongoose.Schema.Types.ObjectId,
        required: true
    },
    _teacherId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true
    }
})

ClassSchema.methods.toJSON = function() {
    var photo = this
    var photoObject = photo.toObject()

    return _.pick(photoObject, ['_id','date','teacherGrade','studentGrade', 'description','instrument','studentNote','teacherNote','_studentId', '_teacherId'])
}

var Class = mongoose.model('Class', ClassSchema)

module.exports = {
    Class
}