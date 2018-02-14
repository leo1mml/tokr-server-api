// External modules
const express = require('express');
const router = express.Router();

// Created modules
const {mongoose} = require('./../db/mongoose')
const studentController = require('./../controllers/students')

var {authenticate} = require('./../middleware/authenticate')
var {appPass} = require('../middleware/app-pass')

// Routes

// Route for create a student
router.post('/',appPass, appPass, (req, res) => studentController.addStudent(req, res))

// Route for get all students
router.get('/', appPass, (req, res) => studentController.getAll(req, res))

// get student authenticated
router.get('/me', appPass,authenticate, (req, res) => studentController.getMe(req,res))

// logout
router.delete('/me/token',appPass, authenticate, (req, res) => studentController.logout(req, res))

// Route for get a student by id
router.get('/id/:id',appPass, (req, res) => studentController.getById(req, res))

// Route to delete a student
router.delete('/deleteById/:id',appPass, (req, res) => studentController.deleteById(req, res))

// Login route
router.post('/login',appPass, (req, res) => studentController.createLogin(req, res))

// Route to patch an student by id
router.patch('/patchMe',appPass, authenticate, (req, res) => studentController.patchMe(req, res))

// Route to change student password if lost password
router.post('/changePassword/:token',appPass, (req, res) => studentController.changePassword(req, res))

// Route to change student password if authenticated
router.post('/changePasswordAuth',authenticate, appPass, (req, res) => studentController.changePasswordAuth(req, res))

module.exports = router