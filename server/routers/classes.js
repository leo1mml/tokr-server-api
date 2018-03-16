// External modules
const express = require('express');
const router = express.Router();

// Created modules
const {mongoose} = require('./../db/mongoose')
const classesController = require('./../controllers/classes')

var {authenticate} = require('./../middleware/authenticate')
var {appPass} = require('../middleware/app-pass')

// Routes

// Route for create a class
router.post('/',appPass, appPass, (req, res) => classesController.addClass(req, res))

// Route for get all classes
router.get('/',appPass, (req, res) => classesController.getAll(req, res))

// get class authenticated
router.get('/me',appPass, authenticate, (req, res) => classesController.getMe(req,res))

// logout
router.delete('/me/token',appPass, authenticate, (req, res) => classesController.logout(req, res))

// Route for get a class by id
router.get('/id/:id',appPass, (req, res) => classesController.getById(req, res))

// Route to delete a class
router.delete('/deleteById/:id',appPass, (req, res) => classesController.deleteById(req, res))

// Login route
router.post('/login',appPass, (req, res) => classesController.createLogin(req, res)) 

// Route to patch an class by id
router.patch('/patchMe',appPass, authenticate, (req, res) => classesController.patchMe(req, res))

// Route to change class password if lost password
router.post('/changePassword/:token',appPass, (req, res) => classesController.changePassword(req, res))

// Route to change class password if authenticated
router.post('/changePasswordAuth',appPass,authenticate , (req, res) => classesController.changePasswordAuth(req, res))

router.get('/classesForTeacher/:id', appPass, (req, res) => classesController.getClassesFromTeacher(req, res))

router.get('/classesForStudent/:id', appPass, (req, res) => classesController.getClassesFromStudent(req, res))

router.get('/classesForStudentAndTeacher/:studentId/:teacherId', appPass, (req, res) => classesController.getClassesFromStudentAndTeacher(req, res))

module.exports = router