const ServiceModel = require("../model/service.model");
const CustomerModel = require("../model/customer.model");
const uploadS3 = require("../helper/aws-s3-upload-images.helper");
const config = require("../config/aws-s3.config");
const response = require("../response/response");
const messageResponse = require("../response/messages");
const query = require("../model/query");
const requiredFields = require("../model/fields");

// ### create service document ###

const create = async (req, res) => {
  const insertDocumentToCollection = async ({
    model,
    customerId,
    serviceId,
    name,
    productItem,
  }) => {
    await model.save();
    await CustomerModel.updateOne(
      { customerId },
      query.updateServiceInCustomer(customerId, serviceId, name, productItem)
    );
    const responseObject = response.success(messageResponse.Insert);
    return res.status(200).json(responseObject);
  };

  const uploadImg = uploadS3(
    config.s3CustomerBucketName,
    req.query.customerId,
    "service"
  ).fields([
    { name: "servicePic", maxCount: 1 },
    { name: "signature", maxCount: 1 },
  ]);
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
        signature: req.files.signature[0].location,
        date: new Date().toISOString().split("T")[0],
      });
      try {
        const totalNumberOfDocuments =
          await ServiceModel.estimatedDocumentCount();
        if (totalNumberOfDocuments === 0) {
          insertDocumentToCollection({
            model: service,
            customerId: req.query.customerId,
            serviceId: req.query.serviceId,
            name: req.query.name,
            productItem: req.query.productItem,
          });
        } else {
          const findDocumentWithserviceId = await ServiceModel.find(
            query.findService(req.query.serviceId)
          );
          if (findDocumentWithserviceId.length !== 0) {
            const responseObject = response.error(
              messageResponse.alreadyExits("serviceId", req.query.serviceId)
            );
            res.status(200).json(responseObject);
          } else if (findDocumentWithserviceId.length === 0) {
            insertDocumentToCollection({
              model: service,
              customerId: req.query.customerId,
              serviceId: req.query.serviceId,
              name: req.query.name,
              productItem: req.query.productItem,
            });
          }
        }
      } catch (error) {
        const responseObject = response.error(error.message);
        res.status(200).json(responseObject);
      }
    }
  });
};

// ### list of all services in the collection ###

const serviceList = async (req, res) => {
  try {
    const { page = 1, limit = 10, customerId } = req.body;
    if (customerId === null || customerId === "") {
      const result = await ServiceModel.find({})
        .select(requiredFields.serviceFields)
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
      const result = await ServiceModel.find(
        query.findCustomer(req.body.customerId)
      ).select(requiredFields.serviceFields);
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
  } catch (error) {
    const responseObject = response.error(error.message);
    res.status(200).json(responseObject);
  }
};

// ### get details of services using serviceId in the collection ###

const serviceDetail = async (req, res) => {
  try {
    const result = await ServiceModel.find(
      query.findService(req.body.serviceId)
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
  } catch (error) {
    const responseObject = response.error(error.message);
    res.status(200).json(responseObject);
  }
};

module.exports = {
  create,
  serviceList,
  serviceDetail,
};
