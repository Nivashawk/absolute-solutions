const ServiceModel = require("../model/service.model");
const CustomerModel = require("../model/customer.model");
const uploadS3 = require("../helper/aws-s3-upload-images.helper");
const config = require("../config/aws-s3.config");
const baseController = require("./base.controller");
const response = require("../response/response");
const messageResponse = require("../response/messages");
const query = require("../model/query");
// ### create service document ###

const create = async (req, res) => {
  const uploadImg = uploadS3(
    config.s3CustomerBucketName,
    req.query.customerId,
    "service"
  ).fields([{ name: "servicePic", maxCount: 1 }]);
  uploadImg(req, res, async (err) => {
    if (err) {
      const responseObject = response.error(messageResponse.uploadImage(err));
      return res.status(200).json(responseObject);
    } else {
      const service = new ServiceModel({
        serviceId: req.query.serviceId,
        customerId: req.query.customerId,
        name: req.query.name,
        phoneNumber: req.query.phoneNumber,
        workDone: req.query.workDone,
        parts: req.query.parts,
        price: req.query.price,
        handCash: req.query.handCash,
        raw: req.query.raw,
        aro: req.query.aro,
        rejectionRate: req.query.rejectionRate,
        productItem: req.query.productItem,
        productDescription: req.query.productDescription,
        servicePic: req.files.servicePic[0].location,
        date: new Date().toISOString().split("T")[0],
      });
      const baseHandler = async () => {
        const totalNumberOfDocuments =
          await ServiceModel.estimatedDocumentCount();
        if (totalNumberOfDocuments === 0) {
          const result = await service.save();
          if (result) {
            const result2 = await CustomerModel.updateOne(
              query.updateServiceInCustomer(
                req.query.customerId,
                req.query.serviceId,
                req.query.name,
                req.query.productItem
              )
            );
            if (result2) {
              const responseObject = response.success(messageResponse.Insert);
              return res.status(200).json(responseObject);
            } else {
              const responseObject = response.error(
                messageResponse.notUpdated("service list")
              );
              return res.status(200).json(responseObject);
            }
          }
        } else {
          const findDocumentWithUserId = await ServiceModel.find(
            query.findService(req.query.serviceId)
          );
          if (findDocumentWithUserId.length !== 0) {
            const responseObject = response.error(
              messageResponse.alreadyExits("serviceId", req.query.serviceId)
            );
            res.status(200).json(responseObject);
          } else if (findDocumentWithUserId.length === 0) {
            const result = await service.save();
            if (result) {
              const result2 = await CustomerModel.updateOne(
                query.updateServiceInCustomer(
                  req.query.customerId,
                  req.query.serviceId,
                  req.query.name,
                  req.query.productItem
                )
              );
              if (result2) {
                const responseObject = response.success(messageResponse.Insert);
                return res.status(200).json(responseObject);
              } else {
                const responseObject = response.error(
                  messageResponse.notUpdated
                );
                return res.status(200).json(responseObject);
              }
            }
          }
        }
      };
      baseController.base(baseHandler);
    }
  });
};

// ### list of all services in the collection ###

const serviceList = async (req, res) => {
  const baseHandler = async () => {
    fields = {
      customerId: 1,
      serviceId: 1,
      servicePic: 1,
      name: 1,
      productItem: 1,
    };
    const { page = 1, limit = 10, customerId } = req.body;
    if (customerId === null || customerId === "") {
      const result = await ServiceModel
        .find({})
        .select(fields)
        .limit(limit * 1)
        .skip((page - 1) * limit);
      if (result.length !== 0) {
        const responseObject = response.success(
          messageResponse.getAll("services"),
          result,
          result.length
        );
        return res.status(200).json(responseObject);
      } else {
        const responseObject = response.error(
          messageResponse.noResult("services")
        );
        res.status(200).json(responseObject);
      }
    } else {
      const result = await ServiceModel
        .find(query.findCustomer(req.body.customerId))
        .select(fields);
      // console.log(result);
      if (result.length !== 0) {
        const responseObject = response.success(
          messageResponse.getOne("service"),
          result
        );
        return res.status(200).json(responseObject);
      } else {
        const responseObject = response.error(
          messageResponse.noResult("service")
        );
        res.status(200).json(responseObject);
      }
    }
  };
  baseController.base(baseHandler);
};

// ### get details of services using serviceId in the collection ###

const serviceDetail = async (req, res) => {
  const baseHandler = async () => {
    const result = await ServiceModel.find(
      query.findService(req.query.serviceId)
    );
    if (result.length !== 0) {
      const responseObject = response.success(
        messageResponse.getOne("service"),
        result
      );
      return res.status(200).json(responseObject);
    } else {
      const responseObject = response.error(
        messageResponse.noResult("service")
      );
      res.status(200).json(responseObject);
    }
  };
  baseController.base(baseHandler);
};

module.exports = {
  create,
  serviceList,
  serviceDetail,
};
