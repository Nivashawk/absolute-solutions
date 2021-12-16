const express = require("express");
const router = express.Router();
const ServiceController = require("../controller/service.controller");
const validation = require("../middleware/validate.middleware");

router.post("/create", validation.createService, ServiceController.create);
router.post("/list", ServiceController.serviceList);
router.post("/details", ServiceController.serviceDetail);

module.exports = router;
