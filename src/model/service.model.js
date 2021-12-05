const mongoose = require('mongoose');
const collectionName = "Service"

const ServiceSchema = mongoose.Schema
({
    Service_id:
    {
        type: String,
        require : true
    },
    Customer_id:
    {
        type: String,
        require : true
    },
    Name:
    {
        type: String,
        require : true
    },
    Phone_Number:
    {
        type: Number,
        require : true
    },
    Work_Done:
    {
        type: String,
        require : true
    },
    Parts:
    {
        type: String,
        require : true
    },
    Price:
    {
        type: Number,
        require : true
    },
    Hand_Cash:
    {
        type: String,
        require : true
    },
    Raw:
    {
        type: Number,
        require : true
    },
    Aro:
    {
        type: Number,
        require : true
    },
    Rejection_Rate:
    {
        type: Number,
        require : true
    },
    Description:
    {
        type: String,
        require : true
    },
    Water_Purifier_Type:
    {
        type: String,
        require : true
    },
    Extra_Parts:
    {
        type: String,
        require : true
    },
    Images:
    {
        type: Array,
        require : true
    }
});

const Servicemodel = mongoose.model('service', ServiceSchema, collectionName);
module.exports = Servicemodel