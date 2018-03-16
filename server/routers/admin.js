const express = require('express');
const router = express.Router();

// Created modules
const {mongoose} = require('./../db/mongoose')
const adminController = require('./../controllers/admin')

var {authenticate} = require('./../middleware/authenticate')
var {appPass} = require('../middleware/app-pass')

// Route for create a user
router.post('/',appPass, (req, res) => adminController.addAdmin(req, res))

// get student authenticated
router.get('/me', appPass,authenticate, (req, res) => adminController.getMe(req,res))

// Login route
router.post('/login',appPass, (req, res) => adminController.createLogin(req, res))

module.exports = router