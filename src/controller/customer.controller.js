const Customermodel = require("../model/customer.model");
const uploadS3 = require("../helper/aws-s3-upload-images.helper");
const config = require("../config/aws-s3.config");
const base_controller = require("./base.controller");
const _response = require("../response/response");
const Message_response = require("../response/messages");
const query = require("../model/query");

const create = async (req, res) => {
  const upload_img = uploadS3(
    config.S3_CUSTOMER_BUCKET_NAME,
    req.query.Customer_id,
    (image_name = "customer")
  ).fields([
    { name: "profile_pic", maxCount: 1 },
    { name: "product_pic", maxCount: 1 },
    { name: "signature", maxCount: 1 },
  ]);
  upload_img(req, res, async (err) => {
    if (err) {
      const response = _response.error(Message_response.Upload_image(err));
      return res.status(200).json(response);
    } else {
      const customer = new Customermodel({
        Customer_id: req.query.Customer_id,
        Name: req.query.Name,
        Phone_Number: req.query.Phone_Number,
        Address: req.query.Address,
        Location: {
          Latitude: req.query.Latitude,
          Longitude: req.query.Longitude,
        },
        Referer: req.query.Referer,
        Price: req.query.Price,
        Hand_Cash: req.query.Hand_Cash,
        Product_Item: req.query.Product_Item,
        Product_Description: req.query.Product_Description,
        Service_List: [],
        Profile_pic: req.files.profile_pic[0].location,
        Product_pic: req.files.product_pic[0].location,
        Signature: req.files.signature[0].location,
        Date: new Date().toISOString().split("T")[0],
      });
      const _base = async () => {
        const total_number_of_documents =
          await Customermodel.estimatedDocumentCount();
        if (
          total_number_of_documents === undefined ||
          total_number_of_documents === 0
        ) {
          await customer.save();
          const response = _response.success(Message_response.Insert);
          return res.status(200).json(response);
        } else {
          const find_document_with_user_id = await Customermodel.find(
            query.find_customer(req.query.Customer_id)
          );
          if (find_document_with_user_id.length !== 0) {
            const response = _response.error(
              Message_response.Already_exits(
                "customer_id",
                req.query.Customer_id
              )
            );
            res.status(200).json(response);
          } else if (find_document_with_user_id.length === 0) {
            await customer.save();
            const response = _response.success(Message_response.Insert);
            return res.status(200).json(response);
          }
        }
      };
      base_controller.base(_base);
    }
  });
};

// ### list of all Customers in the collection ###

const customers_list = async (req, res) => {
  const _base = async () => {
    fields = { Customer_id: 1, Profile_pic: 1, Name: 1, Product_Item: 1 };
    const { page = 1, limit = 10, Customer_id } = req.body;
    if (Customer_id === null || Customer_id === "") {
      const result = await Customermodel.find({})
        .select(fields)
        .limit(limit * 1)
        .skip((page - 1) * limit);
      if (result.length !== 0) {
        const response = _response.success(
          Message_response.Get_all("customers"),
          result,
          (document_count = result.length)
        );
        return res.status(200).json(response);
      } else {
        const response = _response.error(
          Message_response.No_result("customers")
        );
        res.status(200).json(response);
      }
    } else {
      const result = await Customermodel.find(
        query.find_customer(req.body.Customer_id)
      ).select(fields);
      if (result.length !== 0) {
        const response = _response.success(
          Message_response.Get_one("customer"),
          result
        );
        return res.status(200).json(response);
      } else {
        const response = _response.error(
          Message_response.No_result("customer")
        );
        res.status(200).json(response);
      }
    }
  };
  base_controller.base(_base);
};

// ### search customers using customer_id in the collection ###

const customers_detail = async (req, res) => {
  const _base = async () => {
    const result = await Customermodel.find(
      query.find_customer(req.body.Customer_id)
    );
    if (result.length !== 0) {
      const response = _response.success(
        Message_response.Get_one("customer"),
        result
      );
      return res.status(200).json(response);
    } else {
      const response = _response.error(Message_response.No_result("customers"));
      res.status(200).json(response);
    }
  };
  base_controller.base(_base);
};

module.exports = {
  create,
  customers_list,
  customers_detail,
};
