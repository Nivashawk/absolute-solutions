const validator = require("../helper/validate.helper");



// validation for Login



const login = (req, res, next) => {
  const validationRule = {
    Username: "required|string",
    Password: "required|string",
    Notification_Token: "required|string"
  };
  validator(req.body, validationRule, {}, (err, status) => {
    if (!status) {
      res.status(200).send({
        code: 201,
        status: "failure",
        message: "validation error",
        error : err["errors"]
      });
    } else {
      next();
    }
  });
};



// validation for creating customer



const create_customer = (req, res, next) => {
    const validationRule = {
      Customer_id: "required|string",
      Name: "required|string",
      Phone_Number: "required|integer",
      Address: "required|string",
      Latitude: "required|string",
      Longitude: "required|string",
      Referer: "required|string",
      Price: "required|integer",
      Hand_Cash: "required|integer",
      Product_Item: "required|string",
      Product_Discription: "required|string"
    };
    validator(req.query, validationRule, {}, (err, status) => {
      if (!status) {
        res.status(200).send({
          code: 201,
          status: "failure",
          message: "validation error",
          error : err["errors"]
        });
      } else {
        next();
      }
    });
  };



  // validation for search customer



const search_customer = (req, res, next) => {
    const validationRule = {
      Customer_id: "required|string",
    };
    validator(req.body, validationRule, {}, (err, status) => {
      if (!status) {
        res.status(200).send({
          code: 201,
          status: "failure",
          message: "validation error",
          error : err["errors"]
        });
      } else {
        next();
      }
    });
  };


  // validation for creating service



const create_service = (req, res, next) => {
    const validationRule = {
        Service_id: "required|string",
        Customer_id: "required|string",
        Name: "required|string",
        Phone_Number: "required|integer",
        Work_Done: "required|string",
        Parts: "required|string",
        Price: "required|integer",
        Hand_Cash: "required|integer",
        Raw: "required|integer",
        Aro: "required|integer",
        Rejection_Rate: "required|integer",
        Product_Item: "required|string",
        Product_Discription: "required|string"
    };
    validator(req.query, validationRule, {}, (err, status) => {
      if (!status) {
        res.status(200).send({
          code: 201,
          status: "failure",
          message: "validation error",
          error : err["errors"]
        });
      } else {
        next();
      }
    });
  };



  // validation for search service



const search_service = (req, res, next) => {
    const validationRule = {
      Customer_id: "required|string",
    };
    validator(req.body, validationRule, {}, (err, status) => {
      if (!status) {
        res.status(200).send({
          code: 201,
          status: "failure",
          message: "validation error",
          error : err["errors"]
        });
      } else {
        next();
      }
    });
  };



module.exports = {
  login,
  create_customer,
  search_customer,
  create_service,
  search_service
};
