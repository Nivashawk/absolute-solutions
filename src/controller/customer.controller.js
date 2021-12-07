const Customermodel = require("../model/customer.model");
const customerService = require("../service/customer.service");
const uploadS3 = require("../helper/aws-s3-upload-images.helper");
const { get_customer_profile_image_url } = require("../helper/image.helper");

const create = async (req, res) => {
  const profile_img = uploadS3().fields([
    { name: "profile_pic", maxCount: 1 },
    { name: "product_pic", maxCount: 1 },
    { name: "signature", maxCount: 1 },
  ]);
  profile_img(req, res, async (err) => {
    if (err) {
      return res.status(200).json({
        code: 201,
        status: "failure",
        message: err,
      });
    } else {
    //   console.log("profile_url", req.files.profile_pic[0].location);
      const customer = new Customermodel({
        Customer_id: req.query.Customer_id,
        Name: req.query.Name,
        Phone_Number: req.query.Phone_Number,
        Address: req.query.Address,
        Referer: req.query.Referer,
        Price: req.query.Password,
        Hand_Cash: req.query.Hand_Cash,
        Water_Purifier_Type: req.query.Water_Purifier_Type,
        Extra_Parts: req.query.Extra_Parts,
        Service_List: [],
        Profile_pic: req.files.profile_pic[0].location,
        Product_pic: req.files.product_pic[0].location,
        Signature: req.files.signature[0].location
      });
      try {
        const total_number_of_documents =
          await Customermodel.estimatedDocumentCount();
        // console.log(total_number_of_documents);

        if (
          total_number_of_documents === undefined ||
          total_number_of_documents === 0
        ) {
          await customer.save();
          await get_customer_profile_image_url;
          // console.log("s3uploads",uploadS3);
          res.status(200).json({
            code: 200,
            status: "success",
            message: `document were inserted`,
          });
        } else {
          const find_document_with_user_id = await Customermodel.find({
            Customer_id: req.query.Customer_id,
          });
        //   console.log(find_document_with_user_id.length);
          if (find_document_with_user_id.length !== 0) {
            // console.log("images", req.files);
            res.status(200).json({
              code: 200,
              status: "success",
              message: `document with this Customer_id ${req.body.Customer_id} already exits`,
            });
          } else if (find_document_with_user_id.length === 0) {
            await customer.save();
            // console.log("s3uploads",uploadProductsImages);
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
          message: err,
        });
      }
    }
  });
};

// ### list of all Customers in the collection ###

const customers_list = async (req, res, next) => {
  try {
    fields = { Customer_id: 1, Name: 1, Extra_Parts: 1 };
    const result = await Customermodel.find({}).select(fields);
    // console.log(result);
    res.status(200).json({
      code: 200,
      status: "success",
      message: `list of all customers fetched successfully`,
      result,
    });
  } catch (err) {
    res.json({
      code: 201,
      status: "failure",
      message: err,
    });
  }
};

// ### search customers using customer_id in the collection ###

const customers_search = async (req, res, next) => {
  try {
    fields = { Customer_id: 1, Name: 1, Extra_Parts: 1 };
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
      message: err,
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
      message: err,
    });
  }
};

module.exports = {
  create,
  customers_list,
  customers_search,
  customers_detail,
};
