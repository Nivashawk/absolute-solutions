const Servicemodel = require("../model/service.model");
const Customermodel = require("../model/customer.model");
const uploadS3 = require("../helper/aws-s3-upload-images.helper");
const config = require("../config/aws-s3.config");
const _response = require("../response/response");
const Message_response = require("../response/messages");
const query = require("../model/query");
// ### create service document ###

const create = async (req, res) => {
  const upload_img = uploadS3(
    config.S3_CUSTOMER_BUCKET_NAME,
    req.query.Customer_id,
    (image_name = "service")
  ).fields([{ name: "service_pic", maxCount: 1 }]);
  upload_img(req, res, async (err) => {
    if (err) {
      const response = _response.error(Message_response.Upload_image(err));
      return res.status(200).json(response);
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
        Product_Description: req.query.Product_Description,
        Service_pic: req.files.service_pic[0].location,
        Date: new Date().toISOString().split("T")[0],
      });
      const _base = async () => {
        const total_number_of_documents =
          await Servicemodel.estimatedDocumentCount();
        if (
          total_number_of_documents === undefined ||
          total_number_of_documents === 0
        ) {
          const result = await service.save();
          if (result) {
            const result2 = await Customermodel.updateOne(
              query.update_service_in_customer(
                req.query.Customer_id,
                req.query.Service_id,
                req.query.Name,
                req.query.Product_Item
              )
            );
            if (result2) {
              const response = _response.success(Message_response.Insert);
              return res.status(200).json(response);
            } else {
              const response = _response.error(
                Message_response.Not_updated("service list")
              );
              return res.status(200).json(response);
            }
          }
        } else {
          const find_document_with_user_id = await Servicemodel.find(
            query.find_service(req.query.Service_id)
          );
          if (find_document_with_user_id.length !== 0) {
            const response = _response.error(
              Message_response.Already_exits("service_id", req.query.Service_id)
            );
            res.status(200).json(response);
          } else if (find_document_with_user_id.length === 0) {
            const result = await service.save();
            if (result) {
              const result2 = await Customermodel.updateOne(
                query.update_service_in_customer(
                  req.query.Customer_id,
                  req.query.Service_id,
                  req.query.Name,
                  req.query.Product_Item
                )
              );
              if (result2) {
                const response = _response.success(Message_response.Insert);
                return res.status(200).json(response);
              } else {
                const response = _response.error(Message_response.Not_updated);
                return res.status(200).json(response);
              }
            }
          }
        }
      };
      base_controller.base(_base);
    }
  });
};

// ### list of all services in the collection ###

const service_list = async (req, res) => {
  const _base = async () => {
    fields = {
      Customer_id: 1,
      Service_id: 1,
      Service_pic: 1,
      Name: 1,
      Product_Item: 1,
    };
    const { page = 1, limit = 10, Customer_id } = req.body;
    if (Customer_id === null || Customer_id === "") {
      const result = await Servicemodel.find({})
        .select(fields)
        .limit(limit * 1)
        .skip((page - 1) * limit);
      if (result.length !== 0) {
        const response = _response.success(
          Message_response.Get_all("services"),
          result,
          (document_count = result.length)
        );
        return res.status(200).json(response);
      } else {
        const response = _response.error(
          Message_response.No_result("services")
        );
        res.status(200).json(response);
      }
    } else {
      const result = await Servicemodel.find(
        query.find_customer(req.body.Customer_id)
      ).select(fields);
      // console.log(result);
      if (result.length !== 0) {
        const response = _response.success(
          Message_response.Get_one("service"),
          result
        );
        return res.status(200).json(response);
      } else {
        const response = _response.error(Message_response.No_result("service"));
        res.status(200).json(response);
      }
    }
  };
  base_controller.base(_base);
};

// ### get details of services using service_id in the collection ###

const service_detail = async (req, res) => {
  const _base = async () => {
    const result = await Servicemodel.find(
      query.find_service(req.query.Service_id)
    );
    if (result.length !== 0) {
      const response = _response.success(
        Message_response.Get_one("service"),
        result
      );
      return res.status(200).json(response);
    } else {
      const response = _response.error(Message_response.No_result("service"));
      res.status(200).json(response);
    }
  };
  base_controller.base(_base);
};

module.exports = {
  create,
  service_list,
  service_detail,
};
