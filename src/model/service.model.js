const mongoose = require("mongoose");
const config = require("../config/server.config");
const collectionName = config.serviceCollection;

const serviceSchema = mongoose.Schema({
  serviceId: {
    type: String,
    require: true,
  },
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
  workDone: {
    type: String,
    require: true,
  },
  parts: {
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
  raw: {
    type: Number,
    require: true,
  },
  aro: {
    type: Number,
    require: true,
  },
  rejectionRate: {
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
  servicePic: {
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

const ServiceModel = mongoose.model("service", serviceSchema, collectionName);
module.exports = ServiceModel;
