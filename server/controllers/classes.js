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
    
    Class.find().then((tempClasses) => {
        res.send({tempClasses})
    }, (error) => {
        res.status(400).send(error)
    })
}

let getClassesFromStudent = async (req, res) => {
    let id = req.params.id
    try {
        let classes = await Class.find({
            _studentId: id
        })
        res.send({classes})
    }catch (error) {
        res.status(400).send({error})
    } 
}
let getClassesFromTeacher = async (req, res) => {
    let id = req.params.id
    try {
        let classes = await Class.find({
            _teacherId: id
        })
        res.send({classes})
    }catch (error) {
        res.status(400).send({error})
    } 
}

let getClassesFromStudentAndTeacher = async (req, res) => {
    let studentId = req.params.studentId
    let teacherId = req.params.teacherId
    try{
        let classes = await Class.find({
            _teacherId: teacherId,
            _studentId: studentId
        })
        return ({classes})
    }catch(error){
        console.log(error);
        res.status(400).send({error})
    }
}

let patchMe = async (req, res) => {
    let id = req.params.id
    console.log(id);
    var body = _.pick(req.body, ['teacherGrade','studentGrade','studentNote','teacherNote'])
    if(!ObjectID.isValid(id)){
        return res.status(404).send()
    }
    console.log(id);
    try{
        let tempClass = await Class.findOneAndUpdate({_id: id},
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
        res.send({tempClass})
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

let changePasswordAuth = async (req, res) => {
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
    changePasswordAuth,
    getClassesFromStudent,
    getClassesFromTeacher,
    getClassesFromStudentAndTeacher
}