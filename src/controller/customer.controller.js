const CustomerModel = require("../model/customer.model");
const uploadS3 = require("../helper/aws-s3-upload-images.helper");
const config = require("../config/aws-s3.config");
const baseController = require("./base.controller");
const response = require("../response/response");
const messageResponse = require("../response/messages");
const query = require("../model/query");

const create = async (req, res) => {
  const uploadImg = uploadS3(
    config.s3CustomerBucketName,
    req.query.customerId,
    "customer"
  ).fields([
    { name: "profilePic", maxCount: 1 },
    { name: "productPic", maxCount: 1 },
    { name: "signature", maxCount: 1 },
  ]);
  uploadImg(req, res, async (err) => {
    if (err) {
      const responseObject = response.error(messageResponse.uploadImage(err));
      return res.status(200).json(responseObject);
    } else {
      const customer = new CustomerModel({
        customerId: req.query.customerId,
        name: req.query.name,
        phoneNumber: req.query.phoneNumber,
        address: req.query.address,
        location: {
          latitude: req.query.latitude,
          longitude: req.query.longitude,
        },
        referer: req.query.referer,
        price: req.query.price,
        handCash: req.query.handCash,
        productItem: req.query.productItem,
        productDescription: req.query.productDescription,
        serviceList: [],
        profilePic: req.files.profilePic[0].location,
        productPic: req.files.productPic[0].location,
        signature: req.files.signature[0].location,
        date: new Date().toISOString().split("T")[0],
      });
      const baseHandler = async () => {
        const totalNumberOfDocuments =
          await CustomerModel.estimatedDocumentCount();
        if (totalNumberOfDocuments === 0) {
          await customer.save();
          const responseObject = response.success(messageResponse.Insert);
          return res.status(200).json(responseObject);
        } else {
          const findDocumentWithUserId = await CustomerModel.find(
            query.findCustomer(req.query.customerId)
          );
          if (findDocumentWithUserId.length !== 0) {
            const responseObject = response.error(
              messageResponse.alreadyExits("customerId", req.query.customerId)
            );
            res.status(200).json(responseObject);
          } else if (findDocumentWithUserId.length === 0) {
            await customer.save();
            const responseObject = response.success(messageResponse.Insert);
            return res.status(200).json(responseObject);
          }
        }
      };
      baseController.base(baseHandler);
    }
  });
};

// ### list of all Customers in the collection ###

const customersList = async (req, res) => {
  const baseHandler = async () => {
    fields = { customerId: 1, profilePic: 1, name: 1, productItem: 1 };
    const { page = 1, limit = 10, customerId } = req.body;
    if (customerId === null || customerId === "") {
      const result = await CustomerModel
        .find({})
        .select(fields)
        .limit(limit * 1)
        .skip((page - 1) * limit);
      if (result.length !== 0) {
        const responseObject = response.success(
          messageResponse.getAll("customers"),
          result,
          result.length
        );
        return res.status(200).json(responseObject);
      } else {
        const responseObject = response.error(
          messageResponse.noResult("customers")
        );
        res.status(200).json(responseObject);
      }
    } else {
      const result = await CustomerModel
        .find(query.findCustomer(req.body.customerId))
        .select(fields);
      if (result.length !== 0) {
        const responseObject = response.success(
          messageResponse.getOne("customer"),
          result
        );
        return res.status(200).json(responseObject);
      } else {
        const responseObject = response.error(
          messageResponse.noResult("customer")
        );
        res.status(200).json(responseObject);
      }
    }
  };
  baseController.base(baseHandler);
};

// ### search customers using customerId in the collection ###

const customersDetail = async (req, res) => {
  const baseHandler = async () => {
    const result = await CustomerModel.find(
      query.findCustomer(req.body.customerId)
    );
    if (result.length !== 0) {
      const responseObject = response.success(
        messageResponse.getOne("customer"),
        result
      );
      return res.status(200).json(responseObject);
    } else {
      const responseObject = response.error(
        messageResponse.noResult("customers")
      );
      res.status(200).json(responseObject);
    }
  };
  baseController.base(baseHandler);
};

module.exports = {
  create,
  customersList,
  customersDetail,
};
