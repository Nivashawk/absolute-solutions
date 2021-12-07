const Servicemodel = require("../model/service.model");
const Customermodel = require("../model/customer.model");

// ### create service document ###

const create = async (req, res) => {
  const service = new Servicemodel({
    Service_id: req.body.Service_id,
    Customer_id: req.body.Customer_id,
    Name: req.body.Name,
    Phone_Number: req.body.Phone_Number,
    Work_Done: req.body.Work_Done,
    Parts: req.body.Parts,
    Price: req.body.Password,
    Hand_Cash: req.body.Hand_Cash,
    Raw: req.body.Raw,
    Aro: req.body.Aro,
    Rejection_Rate: req.body.Rejection_Rate,
    Description: req.body.Description,
    Water_Purifier_Type: req.body.Water_Purifier_Type,
    Extra_Parts: req.body.Extra_Parts,
    Images: req.body.Images,
  });
  try {
    const total_number_of_documents =
      await Servicemodel.estimatedDocumentCount();
    console.log(total_number_of_documents);
    if (
      total_number_of_documents === undefined ||
      total_number_of_documents === 0
    ) {
      const result = await service.save();
      if (result) {
        await Customermodel.updateOne(
          { Customer_id: req.body.Customer_id },
          {
            $push: {
              Service_List: {
                Customer_id: req.body.Customer_id,
                Name: req.body.Name,
                Extra_Parts: req.body.Extra_Parts,
              },
            },
          }
        );
        res.status(200).json({
          code: 200,
          status: "success",
          message: `document were inserted`,
        });
      }
    } else {
      const find_document_with_user_id = await Servicemodel.find({
        Service_id: req.body.Service_id,
      });
      console.log(find_document_with_user_id.length);
      if (find_document_with_user_id.length !== 0) {
        res.status(200).json({
          code: 200,
          status: "success",
          message: `document with this Service_id ${req.body.Service_id} already exits`,
        });
      } else if (find_document_with_user_id.length === 0) {
        const result = await service.save();
        if (result) {
          const result2 = await Customermodel.updateOne(
            { Customer_id: req.body.Customer_id },
            {
              $push: {
                Service_List: {
                  Customer_id: req.body.Customer_id,
                  Name: req.body.Name,
                  Extra_Parts: req.body.Extra_Parts,
                },
              },
            }
          );
          console.log("result=>", result2);
          res.status(200).json({
            code: 200,
            status: "success",
            message: `document were inserted`,
          });
        }
      }
    }
  } catch (err) {
    res.json({
      code: 201,
      status: "failure",
      message: err,
    });
  }
};

// ### list of all services in the collection ###

const service_list = async (req, res, next) => {
  try {
    fields = { Service_id: 1, Name: 1, Extra_Parts: 1 };
    const result = await Servicemodel.find({}).select(fields);
    // console.log(result);
    res.status(200).json({
      code: 200,
      status: "success",
      message: `list of all services fetched successfully`,
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

// ### search services using service_id in the collection ###

const service_search = async (req, res, next) => {
  try {
    fields = { Service_id: 1, Name: 1, Extra_Parts: 1 };
    query = { Service_id: req.body.Service_id };
    const result = await Servicemodel.find(query).select(fields);
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
        message: `no such service found`,
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
      message: err,
    });
  }
};

module.exports = {
  create,
  service_list,
  service_search,
  service_detail,
};
