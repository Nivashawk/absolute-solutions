const mongoose = require("mongoose");
const config = require("../config/server.config");
const collectionName = config.CUSTOMER_COLLECTION;

const CustomerSchema = mongoose.Schema({
  Customer_id: {
    type: String,
    require: true,
  },
  Name: {
    type: String,
    require: true,
  },
  Phone_Number: {
    type: Number,
    require: true,
  },
  Address: {
    type: String,
    require: true,
  },
  Location: {
    type: Object,
    require:true,
    Latitude:{
        type: String,
        require:true,
    },
    Longitude:{
        type: String,
        require:true,
    }
  },
  Referer: {
    type: String,
    require: true,
  },
  Price: {
    type: Number,
    require: true,
  },
  Hand_Cash: {
    type: Number,
    require: true,
  },
  Product_Item: {
    type: String,
    require: true,
  },
  Product_Discription: {
    type: String,
    require: true,
  },
  Service_List: {
    type: Array,
    require: true,
  },
  Profile_pic: {
    type: String,
    require: true,
  },
  Product_pic: {
    type: String,
    require: true,
  },
  Signature: {
    type: String,
    require: true,
  },
});

const Customermodel = mongoose.model(
  "customer",
  CustomerSchema,
  collectionName
);
module.exports = Customermodel;
