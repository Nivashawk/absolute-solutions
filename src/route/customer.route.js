const express = require('express')
const router = express.Router();
const CustomerController = require('../controller/customer.controller')
const validation = require("../middleware/validate.middleware")




router.post('/create', validation.create_customer, CustomerController.create)
router.get('/list', CustomerController.customers_list)
router.get('/details', CustomerController.customers_detail)



module.exports = router