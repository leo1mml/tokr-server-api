// External modules
const { ObjectID } = require('mongodb')
const express = require('express')
const  db = require('mongodb')
const _ = require('lodash')
const {mongoose} = require('./../db/mongoose')
const {authenticate} = require('./../middleware/authenticate')

// Created Modules
const {Class} = require('./../model/class')

let getAll = (req, res) => {
    
    Class.find().then((tempClass) => {
        res.send({tempClass})
    }, (error) => {
        res.status(400).send(error)
    })
}

let patchMe = async (req, res) => {
    let id = req.class._id
    console.log(id);
    var body = _.pick(req.body, ['date','teacherGrade','studentGrade','instrument','studentNote','teacherNote','_studentId', '_teacherId'])
    if(!ObjectID.isValid(id)){
        return res.status(404).send()
    }
    if(body.profilePhoto){
        let url = req.class.profilePhoto
        var splitResult = url.split("/");
        var endRes = splitResult[splitResult.length - 1]
        var idCloud = endRes.substring(0, endRes.length -4)
        cloudinary.v2.api.delete_resources([idCloud], function(error, result){console.log(result);});
    }
    try{
        let tempClass = await tempClass.findOneAndUpdate({_id: id},
            {
                $set: body
            },{
                new: true
            })
        if(!tempClass){
            res.status(404).send()
        }
        res.status(200).send({tempClass})
    }catch (error) {
        res.status(400).send({error})
    }
}

let getById = (req, res) => {
    
    let id = req.params.id

    if(!ObjectID.isValid(id)){
        return res.status(404).send()
    }

    Class.findById(id).then((tempClass) => {
        if(!tempClass){
            return res.status(404).send()
        }
        res.send({tempClass})
    }).catch((error) => {
        res.status(400).send()
    })
}

let addClass = async (req, res) => {
    try {
        const body = _.pick(req.body, ['date','teacherGrade','studentGrade','instrument','studentNote','teacherNote','_studentId', '_teacherId'])
        const tempClass = new Class(body)
        await tempClass.save()
        const token = await tempClass.generateAuthToken()
        res.header('x-auth', token).send({tempClass})
    } catch (error) {
        console.log(error);
        res.status(400).send({error})
    }
}

let deleteById = (req, res) => {

    Class.findOneAndRemove({
        _id: req.params.id
    }, function(error, tempClass) {
        if(error) {
            console.log("An error has occured")
        } else {
            res.status(200).send(tempClass)
        }
    })
}

let getMe = (req, res) => {
    let tempClass = req.class
    res.send({tempClass})
}

let createLogin = async (req, res) => {
    try {
        const body = _.pick(req.body, ['email','password'])
        const tempClass = await Class.findByCredentials(body.email, body.password)
        const token = await tempClass.generateAuthToken()
        res.header('x-auth', token).send({tempClass})
    } catch (e) {
        res.status(401).send()
    }
}

let logout = async (req, res) => {
    try {
        await req.class.removeToken(req.token)
        res.status(200).send()
    } catch (e) {
        res.status(400).send()
    }
}

let changePassword = async (req, res) => {
    const recoverToken = req.params.token
    try{
        let tempClass = await Class.findByRecoverToken(recoverToken)
        tempClass.password = req.body.password
        tempClass.passwordRecoverTokenExpireDate = undefined
        tempClass.passwordRecoverToken = undefined
        await tempClass.save()
        res.sendStatus(200)
    }catch (e) {
        console.log(e);
        res.status(404).send(e)
    }
}

let changePasswordAuth = async(req, res) => {
    let tempClass = req.class
    try {
        const completeClass = await Class.findByCredentials(tempClass.email, req.body.oldPassword)
        completeClass.password = req.body.newPassword
        await completeClass.save()
        res.send({completeClass})
    }catch (error) {
        res.status(401).send({error})
    }
}

module.exports = {    
    getAll,
    getById,
    deleteById,
    addClass,
    getMe,
    createLogin,
    logout,
    patchMe,
    changePassword,
    changePasswordAuth
}