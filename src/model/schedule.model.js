const mongoose = require('mongoose');
const config = require("../config/server.config")
const collectionName = config.SCHEDULE_COLLECTION

const ScheduleSchema = mongoose.Schema
({
    Message:
    {
        type: String,
        require : true
    },
    Date_And_Time:
    {
        type: Date,
        require : true
    }
});

const Schedulemodel = mongoose.model('schedule', ScheduleSchema, collectionName);
module.exports = Schedulemodel