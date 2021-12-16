const Schedulemodel = require("../model/schedule.model");
// const schedule_message = require("node-schedule");
// const cron = require("node-cron");
const Agenda = require("agenda");
const config = require("../config/server.config");

// ### check agenda and db connection
var connectionEstablised = false;

// ### connecting agenda to db

const agenda = new Agenda({
  db: { address: config.DB_URL, collection: config.SCHEDULE_COLLECTION },
});

// ### When the connection is established, set the flag

agenda.on("ready", function () {
  connectionEstablised = true;
});

// ### define agenda function

agenda.define("test", function () {
  console.log("");
});

// ### schedule api handled here ###
const schedule = async (req, res) => {
  //   const schedule_doc = new Schedulemodel({
  //     Title: req.body.Title,
  //     Message: req.body.Message,
  //     Date_And_Time: req.body.Date_And_Time,
  //   });
  try {
    if (connectionEstablised) {
      agenda.start();
      agenda.every("*/1 * * * *", { title: req.body.Title });
    }

    res.status(200).json({
      code: 200,
      status: "success",
      message: `scheduled successfully`,
    });
  } catch (err) {
    res.json({
      code: 201,
      status: "failure",
      message: err,
    });
  }
};

module.exports = {
  schedule,
};
