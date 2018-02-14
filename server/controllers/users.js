// External modules
const { ObjectID } = require('mongodb')
const express = require('express')
const  db = require('mongodb')
const _ = require('lodash')
const {mongoose} = require('./../db/mongoose')
const {authenticate} = require('./../middleware/authenticate')

// Created Modules
const {Teacher} = require('./../model/user')

let getAll = (req, res) => {
    
    Teacher.find().then((users) => {
        res.send({users})
    }, (error) => {
        res.status(400).send(error)
    })
}

let patchMe = async (req, res) => {
    let id = req.user._id
    console.log(id);
    var body = _.pick(req.body, ['_id','email'])
    if(!ObjectID.isValid(id)){
        return res.status(404).send()
    }
    if(body.profilePhoto){
        let url = req.user.profilePhoto
        var splitResult = url.split("/");
        var endRes = splitResult[splitResult.length - 1]
        var idCloud = endRes.substring(0, endRes.length -4)
        cloudinary.v2.api.delete_resources([idCloud], function(error, result){console.log(result);});
    }
    try{
        let user = await Teacher.findOneAndUpdate({_id: id},
            {
                $set: body
            },{
                new: true
            })
        if(!user){
            res.status(404).send()
        }
        res.status(200).send({user})
    }catch (error) {
        res.status(400).send({error})
    }
}

let getById = (req, res) => {
    
    let id = req.params.id

    if(!ObjectID.isValid(id)){
        return res.status(404).send()
    }

    Teacher.findById(id).then((user) => {
        if(!user){
            return res.status(404).send()
        }
        res.send({user})
    }).catch((error) => {
        res.status(400).send()
    })
}

let addUser = async (req, res) => {
    try {
        const body = _.pick(req.body, ['_id','email','name'])
        const user = new Teacher(body)
        await user.save()
        const token = await user.generateAuthToken()
        res.header('x-auth', token).send({user})
    } catch (error) {
        console.log(error);
        res.status(400).send({error})
    }
}

let deleteById = (req, res) => {

    Teacher.findOneAndRemove({
        _id: req.params.id
    }, function(error, user) {
        if(error) {
            console.log("An error has occured")
        } else {
            res.status(200).send()
        }
    })
}

let getMe = (req, res) => {
    let user = req.user
    res.send({user})
}

let createLogin = async (req, res) => {
    try {
        const body = _.pick(req.body, ['email','password'])
        const user = await Teacher.findByCredentials(body.email, body.password)
        const token = await user.generateAuthToken()
        res.header('x-auth', token).send({user})
    } catch (e) {
        res.status(401).send()
    }
}

let logout = async (req, res) => {
    try {
        await req.user.removeToken(req.token)
        res.status(200).send()
    } catch (e) {
        res.status(400).send()
    }
}

let changePassword = async (req, res) => {
    const recoverToken = req.params.token
    try{
        let user = await Teacher.findByRecoverToken(recoverToken)
        user.password = req.body.password
        user.passwordRecoverTokenExpireDate = undefined
        user.passwordRecoverToken = undefined
        await user.save()
        res.sendStatus(200)
    }catch (e) {
        console.log(e);
        res.status(404).send(e)
    }
}

let changePasswordAuth = async(req, res) => {
    let user = req.user
    try {
        const completeUser = await Teacher.findByCredentials(user.email, req.body.oldPassword)
        completeUser.password = req.body.newPassword
        await completeUser.save()
        res.send({completeUser})
    }catch (error) {
        res.status(401).send({error})
    }
}

module.exports = {    
    getAll,
    getById,
    deleteById,
    addUser,
    getMe,
    createLogin,
    logout,
    patchMe,
    changePassword,
    changePasswordAuth
}