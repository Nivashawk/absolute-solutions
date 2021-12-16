const express = require("express");
const router = express.Router();
const CustomerController = require("../controller/customer.controller");
const validation = require("../middleware/validate.middleware");

router.post("/create", validation.createCustomer, CustomerController.create);
router.post("/list", CustomerController.customersList);
router.post("/details", CustomerController.customersDetail);

module.exports = router;
