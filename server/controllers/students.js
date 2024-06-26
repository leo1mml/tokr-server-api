// External modules
const { ObjectID } = require('mongodb')
const express = require('express')
const  db = require('mongodb')
const _ = require('lodash')
const {mongoose} = require('./../db/mongoose')
const {authenticate} = require('./../middleware/authenticate')

// Created Modules
const {Student} = require('./../model/student')

let getAll = (req, res) => {
    
    Student.find().then((students) => {
        res.send({students})
    }, (error) => {
        console.log(error);
        res.status(400).send(error)
    })
}

let patchMe = async (req, res) => {
    let id = req.student._id
    console.log(id);
    var body = _.pick(req.body, ['name', 'about', 'profilePhotoUrl','cpf','birthDate', 'sex', 'instruments', 'cellPhone', 'address', 'musicStyles'])
    if(!ObjectID.isValid(id)){
        return res.status(404).send()
    }
    if(body.profilePhotoUrl){
        let url = req.student.profilePhotoUrl
        var splitResult = url.split("/");
        var endRes = splitResult[splitResult.length - 1]
        var idCloud = endRes.substring(0, endRes.length -4)
        cloudinary.v2.api.delete_resources([idCloud], function(error, result){console.log(result);});
    }
    try{
        let student = await student.findOneAndUpdate({_id: id},
            {
                $set: body
            },{
                new: true
            })
        if(!student){
            res.status(404).send()
        }
        res.status(200).send({student})
    }catch (error) {
        res.status(400).send({error})
    }
}

let patch = async (req, res) => {
    let id = req.params.id
    let body = req.body
    if(!ObjectID.isValid(id)){
        return res.status(404).send()
    }
    try{
        let student = await Student.findOneAndUpdate({_id: id},
            {
                $set: body
            },{
                new: true
            })
        if(!student){
            res.status(404).send()
        }
        res.status(200).send({student})
    }catch (error) {
        console.log(error);
        res.status(400).send({error})
    }
}

let getById = (req, res) => {
    
    let id = req.params.id

    if(!ObjectID.isValid(id)){
        return res.status(404).send()
    }

    Student.findById(id).then((student) => {
        if(!student){
            return res.status(404).send()
        }
        res.send({student})
    }).catch((error) => {
        res.status(400).send()
    })
}

let addStudent = async (req, res) => {
    try {
        const body = _.pick(req.body, ['email','password', 'name', 'about', 'cpf','birthDate', 'sex', 'instruments', 'cellPhone', 'address', 'musicStyles'])
        const student = new Student(body)
        await student.save()
        const token = await student.generateAuthToken()
        res.header('x-auth', token).send({student})
    } catch (error) {
        console.log(error);
        res.status(400).send({error})
    }
}

let deleteById = (req, res) => {

    Class.findOneAndRemove({
        _id: req.params.id
    }, function(error, student) {
        if(error) {
            console.log("An error has occured")
        } else {
            res.status(200).send()
        }
    })
}

let getMe = (req, res) => {
    let student = req.student
    res.send({student})
}

let createLogin = async (req, res) => {
    try {
        const body = _.pick(req.body, ['email','password'])
        const student = await Student.findByCredentials(body.email, body.password)
        const token = await student.generateAuthToken()
        res.header('x-auth', token).send({student})
    } catch (e) {
        console.log(error);
        res.status(400).send(error)
    }
}

let logout = async (req, res) => {
    try {
        await req.student.removeToken(req.token)
        res.status(200).send()
    } catch (e) {
        res.status(400).send()
    }
}

let changePassword = async (req, res) => {
    const recoverToken = req.params.token
    try{
        let student = await Class.findByRecoverToken(recoverToken)
        student.password = req.body.password
        student.passwordRecoverTokenExpireDate = undefined
        student.passwordRecoverToken = undefined
        await student.save()
        res.sendStatus(200)
    }catch (e) {
        console.log(e);
        res.status(404).send(e)
    }
}

let changePasswordAuth = async(req, res) => {
    let student = req.student
    try {
        const completeStudent = await Class.findByCredentials(student.email, req.body.oldPassword)
        completeStudent.password = req.body.newPassword
        await completeStudent.save()
        res.send({completeStudent})
    }catch (error) {
        res.status(401).send({error})
    }
}

module.exports = {    
    getAll,
    getById,
    deleteById,
    addStudent,
    getMe,
    createLogin,
    logout,
    patchMe,
    changePassword,
    changePasswordAuth,
    patch
}