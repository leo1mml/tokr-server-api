// External modules
const express = require('express');
const router = express.Router();

// Created modules
const {mongoose} = require('./../db/mongoose')
const teacherController = require('./../controllers/teachers')

var {authenticate} = require('./../middleware/authenticate')
var {appPass} = require('../middleware/app-pass')

// Routes

// Route for create a teacher
router.post('/', appPass, (req, res) => teacherController.addTeacher(req, res))

// Route for get all teachers
router.get('/', appPass, (req, res) => teacherController.getAll(req, res))

// get teacher authenticated
router.get('/me',appPass, authenticate, (req, res) => teacherController.getMe(req,res))

// logout
router.delete('/me/token',appPass, authenticate, (req, res) => teacherController.logout(req, res))

// Route for get a teacher by id
router.get('/id/:id',appPass, (req, res) => teacherController.getById(req, res))

// Route to delete a teacher
router.delete('/deleteById/:id',appPass, (req, res) => teacherController.deleteById(req, res))

// Login route
router.post('/login',appPass, (req, res) => teacherController.createLogin(req, res))

// Route to patch a teacher
router.patch('/patchMe',appPass, authenticate, (req, res) => teacherController.patchMe(req, res))

// Route to patch a teacher by id
router.patch('/patch/:id',appPass, (req, res) => teacherController.patch(req, res))

// Route to change teacher password if lost password
router.post('/changePassword/:token',appPass, (req, res) => teacherController.changePassword(req, res))

// Route to change teacher password if authenticated
router.post('/changePasswordAuth',authenticate,appPass , (req, res) => teacherController.changePasswordAuth(req, res))

module.exports = router