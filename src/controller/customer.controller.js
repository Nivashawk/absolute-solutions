const Customermodel = require("../model/customer.model");
const uploadS3 = require("../helper/aws-s3-upload-images.helper");
const config = require("../config/aws-s3.config")

const create = async (req, res) => {
  const upload_img = uploadS3(config.S3_CUSTOMER_BUCKET_NAME, req.query.Customer_id, image_name = "customer").fields([
    { name: "profile_pic", maxCount: 1 },
    { name: "product_pic", maxCount: 1 },
    { name: "signature", maxCount: 1 },
  ]);
  upload_img(req, res, async (err) => {
    if (err) {
      return res.status(200).json({
        code: 201,
        status: "failure",
        message: err,
      });
    } else {
      const customer = new Customermodel({
        Customer_id: req.query.Customer_id,
        Name: req.query.Name,
        Phone_Number: req.query.Phone_Number,
        Address: req.query.Address,
        Location:{
          Latitude: req.query.Latitude,
          Longitude: req.query.Longitude,
        },
        Referer: req.query.Referer,
        Price: req.query.Password,
        Hand_Cash: req.query.Hand_Cash,
        Product_Item: req.query.Product_Item,
        Product_Discription: req.query.Product_Discription,
        Service_List: [],
        Profile_pic: req.files.profile_pic[0].location,
        Product_pic: req.files.product_pic[0].location,
        Signature: req.files.signature[0].location
      });
      try {
        const total_number_of_documents =
          await Customermodel.estimatedDocumentCount();
        if (
          total_number_of_documents === undefined ||
          total_number_of_documents === 0
        ) {
          await customer.save();
          res.status(200).json({
            code: 200,
            status: "success",
            message: `document were inserted`,
          });
        } else {
          const find_document_with_user_id = await Customermodel.find({
            Customer_id: req.query.Customer_id,
          });
          if (find_document_with_user_id.length !== 0) {
            res.status(200).json({
              code: 201,
              status: "failure",
              message: `document with this Customer_id ${req.body.Customer_id} already exits`,
            });
          } else if (find_document_with_user_id.length === 0) {
            await customer.save();
            res.status(200).json({
              code: 200,
              status: "success",
              message: `document were inserted`,
            });
          }
        }
      } catch (err) {
        res.json({
          code: 201,
          status: "failure",
          message: `Unknown Error Found From Server Side`,
        });
      }
    }
  });
};

// ### list of all Customers in the collection ###

const customers_list = async (req, res, next) => {
  try {
    fields = { Customer_id: 1, Profile_pic: 1, Name: 1, Product_Item: 1 };
    const { page = 1, limit = 10 } = req.body
    const result = await Customermodel.find({}).select(fields).limit(limit * 1).skip((page - 1)*limit);
    if(result.length !== 0){
      res.status(200).json({
        code: 200,
        status: "success",
        message: `list of all customers fetched successfully`,
        document_count : result.length,
        result
        
      });
    }
    else{
      res.status(200).json({
        code: 201,
        status: "failure",
        message: `no documents`,
      });
    }
    
  } catch (err) {
    res.json({
      code: 201,
      status: "failure",
      message: `Unknown Error Found From Server Side`,
    });
  }
};

// ### search customers using customer_id in the collection ###

const customers_search = async (req, res, next) => {
  try {
    fields = { Customer_id: 1, Profile_pic: 1, Name: 1, Product_Item: 1 };
    query = { Customer_id: req.body.Customer_id };
    const result = await Customermodel.find(query).select(fields);
    // console.log(result);
    if (result.length !== 0) {
      res.status(200).json({
        code: 200,
        status: "success",
        message: `customers fetched successfully`,
        result,
      });
    } else {
      res.status(200).json({
        code: 201,
        status: "failure",
        message: `no such customer found`,
      });
    }
  } catch (err) {
    res.json({
      code: 201,
      status: "failure",
      message: `Unknown Error Found From Server Side`,
    });
  }
};

// ### search customers using customer_id in the collection ###

const customers_detail = async (req, res, next) => {
  try {
    query = { Customer_id: req.body.Customer_id };
    const result = await Customermodel.find(query);
    // console.log(result);
    if (result.length !== 0) {
      res.status(200).json({
        code: 200,
        status: "success",
        message: `customer details fetched successfully`,
        result,
      });
    } else {
      res.status(200).json({
        code: 201,
        status: "failure",
        message: `no such customer found`,
      });
    }
  } catch (err) {
    res.json({
      code: 201,
      status: "failure",
      message: `Unknown Error Found From Server Side`,
    });
  }
};

module.exports = {
  create,
  customers_list,
  customers_search,
  customers_detail,
};
