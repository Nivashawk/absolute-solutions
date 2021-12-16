const mongoose = require("mongoose");
const config = require("../config/server.config");
const collectionName = config.adminCollection;

const adminSchema = mongoose.Schema({
  userId: {
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
  desigination: {
    type: String,
    require: true,
  },
  notificationToken: {
    type: String,
    require: true,
  },
  userName: {
    type: String,
    require: true,
  },
  password: {
    type: String,
    require: true,
  },
});

const AdminModel = mongoose.model("admin", adminSchema, collectionName);
module.exports = AdminModel;
