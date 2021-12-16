const adminModel = require("../model/admin.model");
const baseController = require("./base.controller");
const response = require("../response/response");
const messageResponse = require("../response/messages");
const query = require("../model/query");

// ### create Admin document ###

const create = async (req, res) => {
  const admin = new adminModel({
    userId: req.body.userId,
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    desigination: req.body.desigination,
    userName: req.body.userName,
    password: req.body.password,
    notificationToken: "",
  });
  const baseHandler = async () => {
    const totalNumberOfDocuments = await adminModel.estimatedDocumentCount();
    if (totalNumberOfDocuments === 0) {
      await admin.save();
      const responseObject = response.success(messageResponse.Insert);
      return res.status(200).json(responseObject);
    } else {
      const findDocumentWithUserId = await adminModel.find(
        query.findUser(req.body.userId)
      );
      if (findDocumentWithUserId.length !== 0) {
        const responseObject = response.error(
          messageResponse.alreadyExits("userId", req.body.userId)
        );
        res.status(200).json(responseObject);
      } else if (findDocumentWithUserId.length === 0) {
        await admin.save();
        const responseObject = response.success(messageResponse.Insert);
        return res.status(200).json(responseObject);
      }
    }
  };
  baseController.base(baseHandler);
};

// ### Admin Login ###

const login = async (req, res) => {
  const baseHandler = async () => {
    const totalNumberOfDocuments = await adminModel.estimatedDocumentCount();
    if (totalNumberOfDocuments === 0) {
      const responseObject = response.error(messageResponse.emptyDatabase);
      res.status(200).json(responseObject);
    } else {
      const loginWithUserNameAndPassword = await adminModel.find(
        query.login(req.body.userName, req.body.password)
      );
      if (loginWithUserNameAndPassword.length !== 0) {
        const result = await adminModel.updateOne(
          query.updateNotificationToken(
            loginWithUserNameAndPassword[0].userId,
            req.body.notificationToken
          )
        );
        if (result) {
          const responseObject = response.success(messageResponse.login);
          return res.status(200).json(responseObject);
        } else {
          const responseObject = response.error(
            messageResponse.notUpdated("notification token")
          );
          return res.status(200).json(responseObject);
        }
      } else {
        const responseObject = response.error(
          messageResponse.invalidCredentials(
            req.body.userName,
            req.body.password
          )
        );
        return res.status(200).json(responseObject);
      }
    }
  };
  baseController.base(baseHandler);
};

module.exports = {
  create,
  login,
};
