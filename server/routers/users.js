// External modules
const express = require('express');
const router = express.Router();

// Created modules
const {mongoose} = require('./../db/mongoose')
const userController = require('./../controllers/users')

var {authenticate} = require('./../middleware/authenticate')
var {appPass} = require('../middleware/app-pass')

// Routes

// Route for create a user
router.post('/',appPass, (req, res) => userController.addUser(req, res))

// Route for get all users
router.get('/',appPass, (req, res) => userController.getAll(req, res))

// get user authenticated
router.get('/me',appPass, authenticate, (req, res) => userController.getMe(req,res))

// logout
router.delete('/me/token',appPass, authenticate, (req, res) => userController.logout(req, res))

// Route for get a user by id
router.get('/id/:id',appPass, (req, res) => userController.getById(req, res))

// Route to delete a user
router.delete('/deleteById/:id',appPass, (req, res) => userController.deleteById(req, res))

// Login route
router.post('/login', appPass, (req, res) => userController.createLogin(req, res))

// Route to patch an user by id
router.patch('/patchMe',appPass, authenticate, (req, res) => userController.patchMe(req, res))

// Route to change user password if lost password
router.post('/changePassword/:token',appPass, (req, res) => userController.changePassword(req, res))

// Route to change user password if authenticated
router.post('/changePasswordAuth',appPass,authenticate , (req, res) => userController.changePasswordAuth(req, res))

module.exports = router