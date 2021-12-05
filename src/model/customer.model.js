const mongoose = require('mongoose');
const collectionName = "Customer"

const CustomerSchema = mongoose.Schema
({
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
    Address:
    {
        type: String,
        require : true
    },
    Referer:
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
        type: Number,
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

const Customermodel = mongoose.model('customer', CustomerSchema, collectionName);
module.exports = Customermodel