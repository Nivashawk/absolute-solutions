const express = require('express')
const router = express.Router();
const ServiceController = require('../controller/service.controller')
const validation = require("../middleware/validate.middleware")



router.post('/create', validation.create_service, ServiceController.create)
router.post('/list', ServiceController.service_list)
router.post('/details', ServiceController.service_detail)



module.exports = router