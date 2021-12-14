const mongoose = require('mongoose');
const config = require("../config/server.config")
const collectionName = config.SERVICE_COLLECTION

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
    Product_Item:
    {
        type: String,
        require : true
    },
    Product_Discription:
    {
        type: String,
        require : true
    },
    Service_pic:
    {
        type: String,
        require : true
    },
    Date: 
    {
        type: String,
        require: true
    }
});

const Servicemodel = mongoose.model('service', ServiceSchema, collectionName);
module.exports = Servicemodel