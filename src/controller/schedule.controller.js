const Schedulemodel = require('../model/schedule.model')
const schedule_message = require('node-schedule');



// ### schedule api handled here ###



const schedule = async (req, res) => {
    try{
        const date = new Date(2021, 11, 8, 1, 52, 0);
        console.log(date);
        schedule_message.scheduleJob(date, () => {
            console.log('The world is going to end today.');
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