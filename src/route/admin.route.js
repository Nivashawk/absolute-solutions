const express = require('express')
const router = express.Router();
const AdminController = require('../controller/admin.controller')
const validation = require('../middleware/validate.middleware')



router.post('/create', AdminController.create)
router.post('/login', validation.login, AdminController.login)



module.exports = router