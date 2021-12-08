const express = require('express')
const router = express.Router();
const ScheduleController = require('../controller/schedule.controller')



router.post('/create', ScheduleController.schedule)



module.exports = router