const express = require('express')
const app = express();
const cors = require('cors')
const Config = require("./src/config/server.config");
const mongoose = require('mongoose')



// Configuration
var port = Config.PORT;
var host = Config.HOST;
const url = Config.DB_URL;



//Connect to the db
mongoose.connect(url,{ useUnifiedTopology: true, useNewUrlParser: true })
const db = mongoose.connection



//checking the db connection
db.on('error', (err) => {
    console.log(err);
  })
  
db.once('open', () => {
    console.log("Db connected......");
  })



//Import Routes
const admin = require('./src/route/admin.route')
const customer = require('./src/route/customer.route')
const service = require('./src/route/service.route')



//MiddleWare
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));



//ROUTES
app.use('/admin', admin)
app.use('/customer', customer)
app.use('/service', service)



//Listening to the server
app.listen(port, host, function() {
    console.log(`Server is running on Host: ${host}:${port}`);
  });