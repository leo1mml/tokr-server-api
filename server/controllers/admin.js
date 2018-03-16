const {Admin} = require('../model/admin')
const { ObjectID } = require('mongodb')
const express = require('express')
const  db = require('mongodb')
const _ = require('lodash')
const {mongoose} = require('./../db/mongoose')
const {authenticate} = require('./../middleware/authenticate')

let addAdmin = async (req, res) => {
    try {
        const body = _.pick(req.body, ['email','password'])
        const admin = new Admin(body)
        await admin.save()
        const token = await admin.generateAuthToken()
        res.header('x-auth', token).send({admin})
    } catch (error) {
        console.log(error);
        res.status(400).send({error})
    }
}
let getMe = (req, res) => {
    let admin = req.student
    res.send({admin})
}
let createLogin = async (req, res) => {
    try {
        const body = _.pick(req.body, ['email','password'])
        const admin = await Admin.findByCredentials(body.email, body.password)
        const token = await admin.generateAuthToken()
        res.header('x-auth', token).send({admin})
    } catch (e) {
        console.log(error);
        res.status(400).send(error)
    }
}

module.exports = {
    addAdmin,
    getMe,
    createLogin
}