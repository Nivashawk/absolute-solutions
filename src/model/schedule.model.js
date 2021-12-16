const mongoose = require("mongoose");
const config = require("../config/server.config");
const collectionName = config.scheduleCollection;

const scheduleSchema = mongoose.Schema({
  title: {
    type: String,
    require: true,
  },
  message: {
    type: String,
    require: true,
  },
  dateAndTime: {
    type: String,
    require: true,
  },
});

const ScheduleModel = mongoose.model(
  "schedule",
  scheduleSchema,
  collectionName
);
module.exports = ScheduleModel;
