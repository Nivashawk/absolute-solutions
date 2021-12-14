const Schedulemodel = require('../model/schedule.model')
const schedule_message = require('node-schedule');
const moment = require("moment-timezone")



// ### schedule api handled here ###



const schedule = async (req, res) => {
    const schedule_doc = new Schedulemodel({
        Title: req.body.Title,
        Message: req.body.Message,
        Date_And_Time: req.body.Date_And_Time,
    })
    try{
        await schedule_doc.save();
        const date = new Date(req.body.Date_And_Time)
        // console.log(date);
        const result = await Schedulemodel.find({})
        console.log("result",JSON.stringify(result,null,'\t'));
        schedule_message.scheduleJob(req.body.Title ,date, async() => {
            await schedule_doc.save();
            console.log('task scheduled');
            schedule_message.cancelJob(req.body.Title)
          });
            res.status(200).json({
                code: 200,
                status: "success",
                message: `scheduled successfully`,
              });
        }
    catch(err){
        res.json({
            code: 201,
            status: "failure",
            message: err,
          });
    }
}




module.exports = {
    schedule
}