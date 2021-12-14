const Servicemodel = require("../model/service.model");
const Customermodel = require("../model/customer.model");
const uploadS3 = require("../helper/aws-s3-upload-images.helper");
const config = require("../config/aws-s3.config");
// ### create service document ###

const create = async (req, res) => {
  const upload_img = uploadS3(
    config.S3_CUSTOMER_BUCKET_NAME,
    req.query.Customer_id,
    (image_name = "service")
  ).fields([{ name: "service_pic", maxCount: 1 }]);
  upload_img(req, res, async (err) => {
    if (err) {
      return res.status(200).json({
        code: 201,
        status: "failure",
        message: err,
      });
    } else {
      const service = new Servicemodel({
        Service_id: req.query.Service_id,
        Customer_id: req.query.Customer_id,
        Name: req.query.Name,
        Phone_Number: req.query.Phone_Number,
        Work_Done: req.query.Work_Done,
        Parts: req.query.Parts,
        Price: req.query.Price,
        Hand_Cash: req.query.Hand_Cash,
        Raw: req.query.Raw,
        Aro: req.query.Aro,
        Rejection_Rate: req.query.Rejection_Rate,
        Product_Item: req.query.Product_Item,
        Product_Discription: req.query.Product_Discription,
        Service_pic: req.files.service_pic[0].location,
        Date: new Date().toISOString().split("T")[0]
      });
      try {
        const total_number_of_documents =
          await Servicemodel.estimatedDocumentCount();
        if (
          total_number_of_documents === undefined ||
          total_number_of_documents === 0
        ) {
          const result = await service.save();
          if (result) {
            const result2 = await Customermodel.updateOne(
              { Customer_id: req.query.Customer_id },
              {
                $push: {
                  Service_List: {
                    Service_id: req.query.Service_id,
                    Customer_id: req.query.Customer_id,
                    Name: req.query.Name,
                    Product_Item: req.query.Product_Item,
                  },
                },
              }
            );
            if (result2) {
              res.status(200).json({
                code: 200,
                status: "success",
                message: `document were inserted`,
              });
            } else {
              res.status(200).json({
                code: 201,
                status: "failure",
                message: `service list not updated in customer document`,
              });
            }
          }
        } else {
          const find_document_with_user_id = await Servicemodel.find({
            Service_id: req.query.Service_id,
          });
          if (find_document_with_user_id.length !== 0) {
            res.status(200).json({
              code: 200,
              status: "success",
              message: `document with this Service_id ${req.query.Service_id} already exits`,
            });
          } else if (find_document_with_user_id.length === 0) {
            const result = await service.save();
            if (result) {
              const result2 = await Customermodel.updateOne(
                { Customer_id: req.query.Customer_id },
                {
                  $push: {
                    Service_List: {
                      Service_id: req.query.Service_id,
                      Customer_id: req.query.Customer_id,
                      Name: req.query.Name,
                      Product_Item: req.query.Product_Item,
                    },
                  },
                }
              );
              if (result2) {
                res.status(200).json({
                  code: 200,
                  status: "success",
                  message: `document were inserted`,
                });
              } else {
                res.status(200).json({
                  code: 201,
                  status: "failure",
                  message: `service list not updated in customer document`,
                });
              }
            }
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

// ### list of all services in the collection ###

const service_list = async (req, res, next) => {
  try {
    fields = { Customer_id: 1, Service_id: 1, service_pic: 1, Name: 1, Product_Item: 1 };
    const { page = 1, limit = 10, Customer_id} = req.body;
    if (Customer_id === null || Customer_id === "") {
      const result = await Servicemodel.find({})
        .select(fields)
        .limit(limit * 1)
        .skip((page - 1) * limit);
      if (result.length !== 0) {
        res.status(200).json({
          code: 200,
          status: "success",
          message: `list of all services fetched successfully`,
          document_count: result.length,
          result,
        });
      } else {
        res.status(200).json({
          code: 201,
          status: "failure",
          message: `no documents`,
        });
      }
    } else {
      const result = await Servicemodel.find({Customer_id: req.body.Customer_id}).select(fields);
      // console.log(result);
      if (result.length !== 0) {
        res.status(200).json({
          code: 200,
          status: "success",
          message: `services fetched successfully`,
          result,
        });
      } else {
        res.status(200).json({
          code: 201,
          status: "failure",
          message: `no such services found`,
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
};

// ### get details of services using service_id in the collection ###

const service_detail = async (req, res, next) => {
  try {
    query = { Service_id: req.body.Service_id };
    const result = await Servicemodel.find(query);
    // console.log(result);
    if (result.length !== 0) {
      res.status(200).json({
        code: 200,
        status: "success",
        message: `service details fetched successfully`,
        result,
      });
    } else {
      res.status(200).json({
        code: 201,
        status: "failure",
        message: `no such service found`,
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
  service_list,
  service_detail,
};
