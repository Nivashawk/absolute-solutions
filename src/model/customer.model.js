const mongoose = require("mongoose");
const config = require("../config/server.config");
const collectionName = config.customerCollection;

const customerSchema = mongoose.Schema({
  customerId: {
    type: String,
    require: true,
  },
  name: {
    type: String,
    require: true,
  },
  phoneNumber: {
    type: Number,
    require: true,
  },
  address: {
    type: String,
    require: true,
  },
  location: {
    type: Object,
    require: true,
    latitude: {
      type: String,
      require: true,
    },
    longitude: {
      type: String,
      require: true,
    },
  },
  referer: {
    type: String,
    require: true,
  },
  price: {
    type: Number,
    require: true,
  },
  handCash: {
    type: Number,
    require: true,
  },
  productItem: {
    type: String,
    require: true,
  },
  productDescription: {
    type: String,
    require: true,
  },
  serviceList: {
    type: Array,
    require: true,
  },
  profilePic: {
    type: String,
    require: true,
  },
  productPic: {
    type: String,
    require: true,
  },
  signature: {
    type: String,
    require: true,
  },
  date: {
    type: String,
    require: true,
  },
});

const CustomerModel = mongoose.model(
  "customer",
  customerSchema,
  collectionName
);
module.exports = CustomerModel;
