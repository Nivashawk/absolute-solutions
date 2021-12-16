const Adminmodel = require("../model/admin.model");
const BaseController = require("./base.controller");
const Response = require("../response/response");
const Message_response = require("../response/messages");
const Query = require("../model/query");

// ### create Admin document ###

const create = async (req, res) => {
  const admin = new Adminmodel({
    User_id: req.body.User_id,
    Name: req.body.Name,
    Phone_Number: req.body.Phone_Number,
    Desigination: req.body.Desigination,
    Username: req.body.Username,
    Password: req.body.Password,
    Notification_Token: "",
  });
  const _base = async () => {
    const total_number_of_documents = await Adminmodel.estimatedDocumentCount();
    // console.log(total_number_of_documents);
    if (
      total_number_of_documents === undefined ||
      total_number_of_documents === 0
    ) {
      await admin.save();
      const response = Response.success(Message_response.Insert);
      return res.status(200).json(response);
    } else {
      const find_document_with_user_id = await Adminmodel.find(
        Query.find_user(req.body.User_id)
      );
      //   console.log(find_document_with_user_id.length);
      if (find_document_with_user_id.length !== 0) {
        const response = Response.error(
          Message_response.Already_exits("user_id", req.body.User_id)
        );
        res.status(200).json(response);
      } else if (find_document_with_user_id.length === 0) {
        await admin.save();
        const response = Response.success(Message_response.Insert);
        return res.status(200).json(response);
      }
    }
  };
  BaseController.base(_base);
};

// ### Admin Login ###

const login = async (req, res) => {
  const _base = async () => {
    const total_number_of_documents = await Adminmodel.estimatedDocumentCount();
    // console.log(total_number_of_documents);
    if (
      total_number_of_documents === undefined ||
      total_number_of_documents === 0
    ) {
      const response = Response.error(Message_response.Empty_database);
      res.status(200).json(response);
    } else {
      const login_with_username_and_password = await Adminmodel.find(
        Query.login(req.body.Username, req.body.Password)
      );
      //   console.log("login_results",login_with_username_and_password[0].User_id);
      if (login_with_username_and_password.length !== 0) {
        const result = await Adminmodel.updateOne(
          Query.update_notification_token(
            login_with_username_and_password[0].User_id,
            req.body.Notification_Token
          )
        );
        if (result) {
          const response = Response.success(Message_response.Login);
          return res.status(200).json(response);
        } else {
          const response = Response.error(
            Message_response.Not_updated("notification token")
          );
          return res.status(200).json(response);
        }
      } else {
        const response = Response.error(
          Message_response.Invalid_credentials(
            req.body.Username,
            req.body.Password
          )
        );
        return res.status(200).json(response);
      }
    }
  };
  BaseController.base(_base);
};

module.exports = {
  create,
  login,
};
