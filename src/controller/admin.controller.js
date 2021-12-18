const AdminModel = require("../model/admin.model");
const response = require("../response/response");
const messageResponse = require("../response/messages");
const query = require("../model/query");

// ### create Admin document ###

const create = async (req, res) => {
  const admin = new AdminModel({
    userId: req.body.userId,
    name: req.body.name,
    phoneNumber: req.body.phoneNumber,
    desigination: req.body.desigination,
    userName: req.body.userName,
    password: req.body.password,
    notificationToken: "",
  });
  try {
    const totalNumberOfDocuments = await AdminModel.estimatedDocumentCount();
    if (totalNumberOfDocuments === 0) {
      await admin.save();
      const responseObject = response.success(messageResponse.Insert);
      return res.status(200).json(responseObject);
    } else {
      const findDocumentWithUserId = await AdminModel.find(
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
  } catch (error) {
    const responseObject = response.error(error.message);
    res.status(200).json(responseObject);
  }
};

// ### Admin Login ###

const login = async (req, res) => {
  try {
    const totalNumberOfDocuments = await AdminModel.estimatedDocumentCount();
    if (totalNumberOfDocuments === 0) {
      const responseObject = response.error(messageResponse.emptyDatabase);
      res.status(200).json(responseObject);
    } else {
      const loginWithUserNameAndPassword = await AdminModel.find(
        query.login(req.body.userName, req.body.password)
      );
      if (loginWithUserNameAndPassword.length !== 0) {
        const result = await AdminModel.updateOne({userId : loginWithUserNameAndPassword[0].userId},
          query.updateNotificationToken(
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
  } catch (error) {
    const responseObject = response.error(error.message);
    res.status(200).json(responseObject);
  }
};

module.exports = {
  create,
  login,
};
