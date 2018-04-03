// External modules
const { ObjectID } = require('mongodb')
const express = require('express')
const  db = require('mongodb')
const _ = require('lodash')
const {mongoose} = require('./../db/mongoose')
const {authenticate} = require('./../middleware/authenticate')

// Created Modules
const {Teacher} = require('./../model/teacher')

let getAll = (req, res) => {
    
    Teacher.find().then((teacher) => {
        res.send({teacher})
    }, (error) => {
        res.status(400).send(error)
    })
}

let patchMe = async (req, res) => {
    let id = req.teacher._id
    var body = _.pick(req.body, ['email','about','password', 'profilePhotoUrl', 'name', 'cpf', 'instruments', 'cellPhone', 'address', 'operationalArea'])
    if(!ObjectID.isValid(id)){
        return res.status(404).send()
    }
    if(body.profilePhotoUrl){
        let url = req.teacher.profilePhotoUrl
        var splitResult = url.split("/");
        var endRes = splitResult[splitResult.length - 1]
        var idCloud = endRes.substring(0, endRes.length -4)
        cloudinary.v2.api.delete_resources([idCloud], function(error, result){console.log(result);});
    }
    try{
        let teacher = await Teacher.findOneAndUpdate({_id: id},
            {
                $set: body
            },{
                new: true
            })
        if(!teacher){
            res.status(404).send()
        }
        res.status(200).send({teacher})
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
        let teacher = await Teacher.findOneAndUpdate({_id: id},
            {
                $set: body
            },{
                new: true
            })
        if(!teacher){
            res.status(404).send()
        }
        res.status(200).send({teacher})
    }catch (error) {
        res.status(400).send({error})
    }
}

let getById = (req, res) => {
    
    let id = req.params.id

    if(!ObjectID.isValid(id)){
        return res.status(404).send()
    }

    Teacher.findById(id).then((teacher) => {
        if(!teacher){
            return res.status(404).send()
        }
        res.send({teacher})
    }).catch((error) => {
        res.status(400).send()
    })
}

let addTeacher = async (req, res) => {
    try {
        const body = _.pick(req.body, ['email','password', 'about', 'profilePhotoUrl', 'name', 'cpf', 'instruments', 'cellPhone', 'address', 'operationalArea'])
        const teacher = new Teacher(body)
        await teacher.save()
        const token = await teacher.generateAuthToken()
        res.header('x-auth', token).send({teacher})
    } catch (error) {
        console.log(error);
        res.status(400).send({error})
    }
}

let deleteById = (req, res) => {

    Teacher.findOneAndRemove({
        _id: req.params.id
    }, function(error, teacher) {
        if(error) {
            console.log("An error has occured")
        } else {
            res.status(200).send()
        }
    })
}

let getMe = (req, res) => {
    let teacher = req.teacher
    res.send({teacher})
}

let createLogin = async (req, res) => {
    try {
        const body = _.pick(req.body, ['email','password'])
        const teacher = await Teacher.findByCredentials(body.email, body.password)
        const token = await teacher.generateAuthToken()
        res.header('x-auth', token).send({teacher})
    } catch (e) {
        res.status(401).send()
    }
}

let logout = async (req, res) => {
    try {
        await req.teacher.removeToken(req.token)
        res.status(200).send()
    } catch (e) {
        res.status(400).send()
    }
}

let changePassword = async (req, res) => {
    const recoverToken = req.params.token
    try{
        let teacher = await Teacher.findByRecoverToken(recoverToken)
        teacher.password = req.body.password
        teacher.passwordRecoverTokenExpireDate = undefined
        teacher.passwordRecoverToken = undefined
        await teacher.save()
        res.sendStatus(200)
    }catch (e) {
        console.log(e);
        res.status(404).send(e)
    }
}

let changePasswordAuth = async(req, res) => {
    let teacher = req.teacher
    try {
        const completeTeacher = await Teacher.findByCredentials(teacher.email, req.body.oldPassword)
        completeTeacher.password = req.body.newPassword
        await completeTeacher.save()
        res.send({completeTeacher})
    }catch (error) {
        res.status(401).send({error})
    }
}

module.exports = {    
    getAll,
    getById,
    deleteById,
    addTeacher,
    getMe,
    createLogin,
    logout,
    patchMe,
    changePassword,
    changePasswordAuth,
    patch
}